const formulariosModel = require('../models/formulariosModel');
const VisitanteEvento = require('../models/visitanteEventoModel');
const transporter = require('../config/mailer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

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
                    
                    // Guardar solo la ruta HTTP
                    const rutaHTTP = `http://localhost:3001/docs_eventos/${evento.id}_${nombreCarpeta}/${nuevoNombre}`;
                    
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
    }
};

module.exports = formulariosController;