const formulariosModel = require('../models/formulariosModel');
const VisitanteEvento = require('../models/visitanteEventoModel');
const transporter = require('../config/mailer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const formulariosController = {
    guardarFormulario: async (req, res) => {
        try {
            const { id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos } = req.body;

            if (!id_visitante) {
                return res.status(400).json({ error: 'ID de visitante es requerido' });
            }

            // Obtener información del evento
            const evento = await formulariosModel.obtenerEventoPorId(id_evento);
            if (!evento) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            // Crear carpeta del evento
            const nombreCarpeta = evento.nombre.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
            const carpetaEvento = path.join(__dirname, '../docs_eventos', `${evento.id}_${nombreCarpeta}`);
            
            if (!fs.existsSync(carpetaEvento)) {
                fs.mkdirSync(carpetaEvento, { recursive: true });
            }

            // 🔹 Mover archivos de temp a la carpeta del evento y guardar rutas
            const archivosGuardados = [];
            if (req.files && req.files.length > 0) {
                for (const archivo of req.files) {
                    const nuevoNombre = `doc_${Date.now()}_${Math.round(Math.random() * 1E9)}_${archivo.originalname}`;
                    const nuevaRuta = path.join(carpetaEvento, nuevoNombre);
                    
                    // Mover el archivo
                    fs.renameSync(archivo.path, nuevaRuta);
                    
                    // Extraer el campo_id
                    const campoId = archivo.fieldname.replace('archivos_', '');
                    
                    // Guardar ruta relativa (usar mismo esquema/protocolo que el front)
                    const rutaHTTP = `/docs_eventos/${evento.id}_${nombreCarpeta}/${nuevoNombre}`;
                    
                    const archivoInfo = {
                        campo_id: campoId,
                        ruta_archivo: rutaHTTP
                    };
                    archivosGuardados.push(archivoInfo);
                }
            }

            // Insertar formulario en la base de datos
            const idFormulario = await formulariosModel.insertarFormulario({
                id_visitante,
                id_evento,
                formulario,
                fecha_evento,
                num_adultos,
                num_ninos
            });

            // CAMBIO: Guardar archivos en BD (solo rutas)
            if (archivosGuardados.length > 0) {
                await formulariosModel.guardarArchivosFormulario(idFormulario, archivosGuardados);
            }

            // Generar código QR
            const qrData = JSON.stringify({
                ID: idFormulario,
                Type: "Reservation",
                Evento: evento.nombre
            });

            const qrFileName = `qrcode-${idFormulario}-${Date.now()}.png`;
            const qrRelativePath = path.join('uploads', qrFileName);
            const qrAbsolutePath = path.join(__dirname, '../', qrRelativePath);

            const uploadDir = path.dirname(qrAbsolutePath);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await QRCode.toFile(qrAbsolutePath, qrData, {
                errorCorrectionLevel: 'H',
                type: 'png',
                quality: 0.9
            });

            await formulariosModel.actualizarCodigoQR(idFormulario, qrRelativePath);

            // 🔹 Enviar correo
            const usuario = await new Promise((resolve, reject) => {
                VisitanteEvento.findByCorreoById(id_visitante, (err, results) => {
                    if (err) reject(err);
                    resolve(results[0]);
                });
            });

            if (usuario && usuario.correo) {
                const mailOptions = {
                    from: 'yomiguel250@gmail.com',
                    to: usuario.correo,
                    subject: `Tu código QR de reserva - ${evento.nombre}`,
                    html: `
                        <h2>¡Gracias por tu reserva!</h2>
                        <p>Has reservado para el evento: <strong>${evento.nombre}</strong></p>
                        <p>Fecha: ${fecha_evento}</p>
                        <p>Boletos adultos: ${num_adultos || 0}</p>
                        <p>Boletos niños: ${num_ninos || 0}</p>
                        <p>Adjunto encontrarás tu código QR para el evento.</p>
                        ${archivosGuardados.length > 0 ? 
                            `<p><strong>Archivos adjuntos guardados:</strong> ${archivosGuardados.length}</p>` : 
                            ''
                        }
                    `,
                    attachments: [
                        {
                            filename: `reserva-${idFormulario}.png`,
                            path: qrAbsolutePath
                        }
                    ]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error enviando correo:', error);
                    }
                });
            }

            return res.status(200).json({
                message: 'Formulario guardado exitosamente. Se ha enviado un correo con tu código QR.',
                id: idFormulario,
                codigo_qr: qrRelativePath,
                archivos_guardados: archivosGuardados.length,
                carpeta_evento: `docs_eventos/${evento.id}_${nombreCarpeta}`,
                archivos: archivosGuardados // 🔹 Incluir las rutas HTTP en la respuesta
            });

        } catch (err) {
            console.error('Error al guardar formulario:', err.message);
            
            // 🔹 Limpiar archivos subidos en caso de error
            if (req.files && req.files.length > 0) {
                req.files.forEach(archivo => {
                    if (fs.existsSync(archivo.path)) {
                        fs.unlinkSync(archivo.path);
                    }
                });
            }
            
            return res.status(500).json({ error: 'Error al guardar formulario' });
        }
    },

    obtenerFormulario: async (req, res) => {
        try {
    const { idEvento } = req.params; // se espera /api/formularios/excel/:idEvento

    // 1️⃣ Obtener los datos desde tu modelo
    const datos = await formulariosModel.obtenerFormularioConArchivos(idEvento);

    if (!datos.length) {
      return res.status(404).json({ error: 'No se encontraron registros.' });
    }
    // 2️⃣ Agrupar por id_visitante (para evitar duplicados)
    const agrupados = {};
    for (const fila of datos) {
      const idVisitante = fila.id_visitante;

      if (!agrupados[idVisitante]) {
        agrupados[idVisitante] = {
          id_visitante: fila.id_visitante,
          id_evento: fila.id_evento,
          formulario: JSON.parse(fila.formulario),
          formulario_even: JSON.parse(fila.formulario_even),
          archivos: [],
        };
      }

      // Guardar rutas de archivos (para los type: file)
      agrupados[idVisitante].archivos.push({
        campo_id: fila.campo_id,
        ruta_archivo: fila.ruta_archivo,
      });
    }

    // 3️⃣ Determinar columnas dinámicas (basadas en los labels del primer registro)
    const primerRegistro = Object.values(agrupados)[0];
    const labels = primerRegistro.formulario_even.map(item => item.label);

    // 4️⃣ Crear el archivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Formularios');

    // Encabezados dinámicos
    worksheet.columns = [
      { header: 'id_visitante', key: 'id_visitante', width: 15 },
      { header: 'id_evento', key: 'id_evento', width: 15 },
      ...labels.map(label => ({
        header: label,
        key: label,
        width: 25
      })),
    ];

    // 5️⃣ Llenar el Excel fila por fila
    for (const visitante of Object.values(agrupados)) {
      const fila = {
        id_visitante: visitante.id_visitante,
        id_evento: visitante.id_evento,
      };

      for (const campo of visitante.formulario_even) {
        const valorCampo = visitante.formulario[campo.id];
        if (campo.type === 'file') {
            // Buscar la ruta del archivo correspondiente (forzando tipo string para comparar)
            const archivo = visitante.archivos.find(a => String(a.campo_id) === String(campo.id));
            fila[campo.label] = archivo ? archivo.ruta_archivo : '';
        } else {
            fila[campo.label] = valorCampo ?? '';
        }

      }

      worksheet.addRow(fila);
    }

    // 6️⃣ Configurar cabeceras HTTP para descarga automática
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="formularios_evento.xlsx"'
    );

    // 7️⃣ Enviar el archivo directamente como descarga
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('❌ Error al generar el Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
        }

        ,
        // Comprueba si existen registros para un evento (usado por frontend para mostrar el botón de descarga)
        checkExistenciaFormulario: async (req, res) => {
                try {
                        const { idEvento } = req.params;
                        const datos = await formulariosModel.obtenerFormularioConArchivos(idEvento);
                        const exists = Array.isArray(datos) && datos.length > 0;
                        return res.status(200).json({ exists });
                } catch (error) {
                        console.error('Error comprobando existencia de formulario:', error);
                        return res.status(500).json({ error: 'Error comprobando existencia' });
                }
        }
};

module.exports = formulariosController;