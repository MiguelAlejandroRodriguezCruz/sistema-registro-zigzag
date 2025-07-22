const mysql = require('mysql2');
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3001;
const nodemailer = require('nodemailer');

// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Multer para almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');

        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Usuario por defecto en XAMPP
    password: '',      // Contraseña 
    database: 'zigzag', // Nombre de la base de datos
    port: 3306
});

// Verificar la conexión
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos zigzag');
});

// Middleware para habilitar CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Ruta para obtener los visitantes de institución
app.get('/visitantes', (req, res) => {
    const query = 'SELECT * FROM visitantesinstitucion';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json(results);
    });
});

// Ruta para agregar los visitantes de institución
app.post('/visitantes', (req, res) => {
    const datos = req.body;
    const query = `
        INSERT INTO visitantesinstitucion (
            nombreSoli, nombreOrg, noVisitantesA, noVisitantesD,
            telefono, direccion, colonia, municipio, autobus,
            correo, tipoRecorrido, gradoEscolar, autorizaFotos,
            fecha, horario, medioEnterado, comentarios, precioEntrada, estatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        datos.nombreSoli, datos.nombreOrg, datos.noVisitantesA, datos.noVisitantesD,
        datos.telefono, datos.direccion, datos.colonia, datos.municipio, datos.autobus,
        datos.correo, datos.tipoRecorrido, datos.gradoEscolar, datos.autorizaFotos,
        datos.fecha, datos.horario, datos.medioEnterado, datos.comentarios, datos.precioEntrada,
        datos.estatus
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar visitante:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({ idInsertado: result.insertId });
    });
});
// Ruta para actualizar los visitantes de institución
app.put('/visitantes/:id', (req, res) => {
    const id = req.params.id;
    const datos = req.body;

    let query = 'UPDATE visitantesinstitucion SET ';
    let values = [];
    let fields = [];

    // Agregar solo los campos que no sean vacíos o undefined
    Object.keys(datos).forEach((key) => {
        if (datos[key] !== "" && datos[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(datos[key]);
        }
    });

    // Si no hay campos para actualizar, salir con error
    if (fields.length === 0) {
        return res.status(400).json({ mensaje: "No se enviaron datos válidos para actualizar" });
    }

    // Construcción final del query
    query += fields.join(", ") + " WHERE id = ?";
    values.push(id);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar visitante:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: "Visitante actualizado correctamente" });
    });
});

// Provicional xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Ruta para actualizar el estatus de todas las reservas
app.put('/visitantes', (req, res) => {
    const { estatus } = req.body;

    // Asegúrate de que el campo "estatus" se haya enviado
    if (!estatus) {
        return res.status(400).json({ mensaje: "El estatus es requerido" });
    }

    // Consulta para actualizar todas las reservas
    const query = 'UPDATE visitantesinstitucion SET estatus = ?';
    const values = [estatus];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el estatus de todas las reservas:', err.message);
            return res.status(500).send(err.message);
        }
        res.json({ mensaje: "Estatus de todas las reservas actualizado correctamente" });
    });
});


// Ruta para eliminar los visitantes de institución
app.delete('/visitantes/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM visitantesinstitucion WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar visitante:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: 'Visitante eliminado correctamente' });
    });
});

app.get('/visitantes-independientes', (req, res) => {
    const query = 'SELECT * FROM visitantesidependientes';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json(results);
    });
});

app.post('/visitantes-independientes', (req, res) => {
    const datos = req.body;
    const query = `
        INSERT INTO visitantesidependientes (
            nombre, fecha, hora, telefono, correo, medioEnterado, monto, codigo, estatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        datos.nombre, datos.fecha, datos.hora, datos.telefono,
        datos.correo, datos.medioEnterado, datos.monto, datos.codigo, datos.estatus
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar visitante independiente:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({ idInsertado: result.insertId });
    });
});

app.put('/visitantes-independientes/:id', (req, res) => {
    const id = req.params.id;
    const datos = req.body;

    let query = 'UPDATE visitantesidependientes SET ';
    let values = [];
    let fields = [];

    // Agregar solo los campos que no sean vacíos o undefined
    Object.keys(datos).forEach((key) => {
        if (datos[key] !== "" && datos[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(datos[key]);
        }
    });

    // Si no hay campos para actualizar, salir con error
    if (fields.length === 0) {
        return res.status(400).json({ mensaje: "No se enviaron datos válidos para actualizar" });
    }

    // Construcción final del query
    query += fields.join(", ") + " WHERE id = ?";
    values.push(id);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar visitante independiente:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: "Visitante independiente actualizado correctamente" });
    });
});

app.delete('/visitantes-independientes/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM visitantesidependientes WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar visitante independiente:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: 'Visitante independiente eliminado correctamente' });
    });
});

//Ruta para visualizar registro de visitantes
app.get('/registro', (req, res) => {
    const query = 'SELECT * FROM registrovisitas';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json(results);
    });
});

// Ruta para agregar registro de visitantes
app.post('/registro-visitantes', (req, res) => {
    const { idRegistro, visitantes } = req.body;

    if (!visitantes || visitantes.length === 0) {
        return res.status(400).json({ error: "No hay datos de visitantes" });
    }

    // Obtener fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];

    // Iniciar transacción
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: "Error al iniciar transacción" });
        }

        // Insertar visitantes con fecha
        const promises = visitantes.map(visitante => {
            return new Promise((resolve, reject) => {
                const query = `
          INSERT INTO registrovisitas 
            (id_institucion, tipo, rango, cantidad, fecha_registro) 
          VALUES (?, ?, ?, ?, ?)
        `;

                const values = [
                    idRegistro,
                    visitante.tipo,
                    visitante.rango,
                    visitante.cantidad,
                    hoy  // Agregar fecha actual
                ];

                db.query(query, values, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        });

        Promise.all(promises)
            .then(() => {
                // Actualizar estado de la reserva principal
                const updateQuery = `
          UPDATE visitantesinstitucion 
          SET estatus = 'registradas'
          WHERE id = ?
        `;

                db.query(updateQuery, [idRegistro], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error al actualizar estado" });
                        });
                    }

                    // Confirmar transacción
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: "Error al confirmar transacción" });
                            });
                        }

                        res.json({
                            mensaje: "Registros guardados y estado actualizado",
                            idActualizado: idRegistro
                        });
                    });
                });
            })
            .catch(error => {
                db.rollback(() => {
                    console.error(error);
                    res.status(500).json({ error: "Error en el servidor" });
                });
            });
    });
});

// ---------- Rutas para Visitantes por Eventos ----------
// Ruta para visualizar visitantes por eventos
app.get('/visitantes-eventos', (req, res) => {
    const query = 'SELECT * FROM visitanteseventos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json(results);
    });
});
// Ruta para agregar visitantes por eventos
app.post('/visitantes-eventos', (req, res) => {
    const datos = req.body;
    const query = `
        INSERT INTO visitanteseventos (
            nombre, correo, edad, contrasena
        ) VALUES (?, ?, ?, ?)
    `;
    const values = [
        datos.nombre, datos.correo, datos.edad, datos.contrasena
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar visitante de evento:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({ idInsertado: result.insertId });
    });
});
// Ruta para actualizar visitantes por eventos
app.put('/visitantes-eventos/:id', (req, res) => {
    const id = req.params.id;
    const datos = req.body;

    let query = 'UPDATE visitanteseventos SET ';
    let values = [];
    let fields = [];

    Object.keys(datos).forEach((key) => {
        if (datos[key] !== "" && datos[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(datos[key]);
        }
    });

    if (fields.length === 0) {
        return res.status(400).json({ mensaje: "No se enviaron datos válidos para actualizar" });
    }

    query += fields.join(", ") + " WHERE id = ?";
    values.push(id);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar visitante de evento:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: "Visitante de evento actualizado correctamente" });
    });
});
// Ruta para eliminar visitantes por eventos
app.delete('/visitantes-eventos/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM visitanteseventos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar visitante de evento:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: 'Visitante de evento eliminado correctamente' });
    });
});
// Ruta para verificar en login los visitantes por eventos
app.post('/visitantes-eventos/login', (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const query = 'SELECT * FROM visitanteseventos WHERE correo = ? LIMIT 1';

    db.query(query, [correo], (err, results) => {
        if (err) {
            console.error('Error al buscar visitante de evento:', err.message);
            return res.status(500).send(err.message);
        }

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Correo no registrado' });
        }

        const visitante = results[0];

        if (visitante.contrasena !== contrasena) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        res.json({
            mensaje: 'Login exitoso',
            visitante: {
                id: visitante.id,
                nombre: visitante.nombre,
                correo: visitante.correo,
                edad: visitante.edad
            }
        });
    });
});

// ---------- Rutas para Eventos ----------
// Ruta para visualizar eventos
app.get('/eventos', (req, res) => {
    const query = 'SELECT * FROM evento';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener eventos:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json(results);
    });
});

// Nuevo endpoint para obtener eventos no registrados por un usuario
app.get('/eventos-disponibles/:idVisitante', (req, res) => {
    const idVisitante = req.params.idVisitante;

    const query = `
    SELECT e.* 
    FROM evento e
    WHERE e.id NOT IN (
      SELECT f.id_evento 
      FROM formularios f 
      WHERE f.id_visitante = ?
    )
  `;

    db.query(query, [idVisitante], (err, results) => {
        if (err) {
            console.error('Error al obtener eventos disponibles:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json(results);
    });
});

// Ruta para agregar eventos
app.post('/eventos', upload.single('baner'), (req, res) => {
    try {
        const datos = req.body;

        // Validación de campos obligatorios
        if (!datos.nombre || !datos.fechaInicio || !datos.fechaFinal || !datos.lugar || !datos.descripcion) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        // Verificar si se subió un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'Debe subir un banner para el evento' });
        }

        // Construir URL del banner
        const urlBaner = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Asegurar que el formulario tenga un valor por defecto si es undefined
        const formulario = datos.formulario || '[]';

        const query = `
      INSERT INTO evento (
        nombre, fechaInicio, fechaFinal, lugar, descripcion, formulario, baner
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            datos.nombre,
            datos.fechaInicio,
            datos.fechaFinal,
            datos.lugar,
            datos.descripcion,
            formulario, // Usar el valor asegurado
            urlBaner
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error al insertar evento:', err.message);
                console.error('Query:', query);
                console.error('Values:', values);
                return res.status(500).json({
                    message: 'Error en la base de datos',
                    error: err.message
                });
            }

            res.status(201).json({
                idInsertado: result.insertId,
                banerUrl: urlBaner
            });
        });

    } catch (error) {
        console.error('Error general:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Ruta para actualizar eventos
app.put('/eventos/:id', upload.single('baner'), (req, res) => {
    try {
        const eventoId = req.params.id;
        const datos = req.body;

        // Validación de campos obligatorios
        if (!datos.nombre || !datos.fechaInicio || !datos.fechaFinal || !datos.lugar || !datos.descripcion) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const getCurrentBanner = `SELECT baner FROM evento WHERE id = ?`;

        db.query(getCurrentBanner, [eventoId], (err, result) => {
            if (err) {
                console.error('Error al obtener banner actual:', err.message);
                return res.status(500).json({
                    message: 'Error en la base de datos',
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            // Manejo del banner
            let bannerFinal = result[0].baner;
            if (req.file) {
                bannerFinal = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            // Asegurar que el formulario tenga un valor
            const formulario = datos.formulario || '[]';

            const query = `
        UPDATE evento 
        SET nombre = ?, 
            fechaInicio = ?, 
            fechaFinal = ?, 
            lugar = ?, 
            descripcion = ?, 
            formulario = ?, 
            baner = ?
        WHERE id = ?
      `;

            const values = [
                datos.nombre,
                datos.fechaInicio,
                datos.fechaFinal,
                datos.lugar,
                datos.descripcion,
                formulario, // Usar el valor asegurado
                bannerFinal,
                eventoId
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error al actualizar evento:', err.message);
                    return res.status(500).json({
                        message: 'Error en la base de datos',
                        error: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Evento no encontrado' });
                }

                res.status(200).json({
                    message: 'Evento actualizado',
                    banerUrl: bannerFinal
                });
            });
        });

    } catch (error) {
        console.error('Error general:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta para obtener un solo evento por ID
app.get('/eventos/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM evento WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener evento:', err.message);
            return;
        }

        if (results.length === 0) {
            return res.status(404).json({ mensaje: "Evento no encontrado" });
        }

        res.json(results[0]);
    });
});

// Endpoint para guardar formularios
app.post('/guardar-formulario', (req, res) => {
    const { id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos } = req.body;

    // Validar que se recibe el ID del visitante
    if (!id_visitante) {
        return res.status(400).json({ error: 'ID de visitante es requerido' });
    }

    const query = `
    INSERT INTO formularios 
    (id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(
        query,
        [id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos],
        (err, result) => {
            if (err) {
                console.error('Error al guardar formulario:', err.message);
                return res.status(500).json({ error: 'Error al guardar formulario' });
            }

            const idFormulario = result.insertId;
            const codigoQR = `RES-${idFormulario}-${Date.now()}`;

            const updateQuery = `UPDATE formularios SET codigo_qr = ? WHERE id = ?`;
            db.query(updateQuery, [codigoQR, idFormulario], (err2) => {
                if (err2) {
                    console.error('Error al guardar codigo QR:', err2.message);
                    return res.status(500).json({ error: 'Error al guardar codigo QR' });
                }

                return res.status(200).json({
                    message: 'Formulario guardado exitosamente',
                    id: idFormulario,
                    codigo_qr: codigoQR
                });
            });
        }
    );
});

// Ruta para subir imágenes adicionales
app.post('/eventos/:idEvento/imagenes', upload.array('imagenes', 10), (req, res) => {
    const idEvento = req.params.idEvento;

    // Validar que hay archivos
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Debe subir al menos una imagen' });
    }

    // Construir rutas de las imágenes
    const imagenes = req.files.map(file => ({
        ruta: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        nombre: file.filename
    }));

    // Insertar en base de datos
    const query = 'INSERT INTO imagenes (evento_id, ruta_imagen) VALUES ?';
    const values = imagenes.map(imagen => [idEvento, imagen.ruta]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error al insertar imágenes:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }

        res.status(201).json({
            message: 'Imágenes guardadas correctamente',
            imagenes: imagenes
        });
    });
});

// Ruta para obtener imágenes de un evento
app.get('/eventos/:idEvento/imagenes', (req, res) => {
    const idEvento = req.params.idEvento;
    const query = 'SELECT * FROM imagenes WHERE evento_id = ?';

    db.query(query, [idEvento], (err, results) => {
        if (err) {
            console.error('Error al obtener imágenes:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }
        res.json(results);
    });
});

// Ruta para eliminar una imagen
app.delete('/imagenes/:idImagen', (req, res) => {
    const idImagen = req.params.idImagen;

    // Primero obtener la ruta de la imagen
    const selectQuery = 'SELECT ruta_imagen FROM imagenes WHERE id = ?';
    db.query(selectQuery, [idImagen], (err, results) => {
        if (err) {
            console.error('Error al obtener la imagen:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }

        const rutaImagen = results[0].ruta_imagen;
        const nombreArchivo = rutaImagen.split('/').pop();

        // Eliminar de la base de datos
        const deleteQuery = 'DELETE FROM imagenes WHERE id = ?';
        db.query(deleteQuery, [idImagen], (err, result) => {
            if (err) {
                console.error('Error al eliminar la imagen de la base de datos:', err);
                return res.status(500).json({ message: 'Error en la base de datos' });
            }

            // Eliminar el archivo del sistema
            const filePath = path.join(__dirname, 'uploads', nombreArchivo);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
                res.json({ message: 'Imagen eliminada correctamente' });
            });
        });
    });
});

// Ruta para eliminar un evento y todas sus dependencias (incluyendo banner)
app.delete('/eventos/:id', async (req, res) => {
    const eventoId = req.params.id;

    try {
        // 1. Obtener información del evento (para el banner)
        const [evento] = await db.promise().query('SELECT baner FROM evento WHERE id = ?', [eventoId]);

        if (evento.length === 0) {
            return res.status(404).json({ mensaje: 'Evento no encontrado' });
        }

        // 2. Eliminar formularios relacionados
        await db.promise().query('DELETE FROM formularios WHERE id_evento = ?', [eventoId]);

        // 3. Obtener y eliminar imágenes adicionales
        const [imagenes] = await db.promise().query('SELECT id, ruta_imagen FROM imagenes WHERE evento_id = ?', [eventoId]);
        await db.promise().query('DELETE FROM imagenes WHERE evento_id = ?', [eventoId]);

        // 4. Eliminar archivos físicos (banner e imágenes)
        const filesToDelete = [];

        // Agregar banner a la lista de archivos a eliminar
        if (evento[0].baner) {
            const bannerUrl = evento[0].baner;
            const bannerName = bannerUrl.split('/').pop();
            filesToDelete.push(bannerName);
        }

        // Agregar imágenes adicionales
        imagenes.forEach(imagen => {
            const imgName = imagen.ruta_imagen.split('/').pop();
            filesToDelete.push(imgName);
        });

        // Eliminar archivos físicamente
        filesToDelete.forEach(fileName => {
            const filePath = path.join(__dirname, 'uploads', fileName);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error(`Error al eliminar archivo ${filePath}:`, err);
            }
        });

        // 5. Eliminar el evento
        await db.promise().query('DELETE FROM evento WHERE id = ?', [eventoId]);

        res.json({ mensaje: 'Evento, formularios, imágenes y banner eliminados correctamente' });
    } catch (err) {
        console.error('Error al eliminar evento:', err.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// ---------- Rutas para Mandar correos ----------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yomiguel250@gmail.com',
        pass: 'ehkr vhjy lxsl lppc' // NO tu password normal, sino contraseña de aplicación
    }
});
app.post('/recuperar/enviar-codigo', (req, res) => {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ mensaje: 'Correo es requerido' });
    }

    // Verifica que exista el correo en la tabla de usuarios
    db.query('SELECT * FROM visitanteseventos WHERE correo = ?', [correo], (err, results) => {
        if (err) return res.status(500).json({ mensaje: err.message });

        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Correo no encontrado' });
        }

        // Genera el código y fecha de expiración
        const codigo = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
        const expiracion = new Date(Date.now() + 10 * 60000);       // +10 min

        // Guarda en la tabla codigos_recuperacion
        db.query(
            'INSERT INTO codigos_recuperacion (correo, codigo, expiracion) VALUES (?, ?, ?)',
            [correo, codigo, expiracion],
            (err) => {
                if (err) return res.status(500).json({ mensaje: err.message });

                // Prepara el correo
                const mailOptions = {
                    from: 'tucorreo@gmail.com',
                    to: correo,
                    subject: 'Código de recuperación',
                    text: `Tu código de recuperación es: ${codigo}. Este código expirará en 10 minutos.`
                };

                // Envía el correo
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error al enviar correo:', error);
                        return res.status(500).json({ mensaje: 'Error al enviar el correo' });
                    }

                    console.log('Correo enviado:', info.response);
                    return res.json({ mensaje: 'Código enviado al correo' });
                });
            }
        );
    });
});
app.post('/recuperar/verificar-codigo', (req, res) => {
    const { correo, codigo } = req.body;

    db.query(
        'SELECT * FROM codigos_recuperacion WHERE correo = ? ORDER BY id DESC LIMIT 1',
        [correo],
        (err, results) => {
            if (err) return res.status(500).json({ mensaje: err.message });

            if (results.length === 0) {
                return res.status(400).json({ mensaje: 'No se encontró código para este correo' });
            }

            const registro = results[0];

            console.log(`DB: ${registro.codigo} (${typeof registro.codigo}), Cliente: ${codigo} (${typeof codigo})`);

            if (registro.codigo.toString() !== codigo.toString()) {
                return res.status(401).json({ mensaje: 'Código incorrecto' });
            }

            if (new Date(registro.expiracion) < new Date()) {
                return res.status(401).json({ mensaje: 'Código expirado' });
            }

            return res.json({ mensaje: 'Código válido' });
        }
    );
});

app.post('/recuperar/cambiar-contrasena', (req, res) => {
    const { correo, nuevaContrasena } = req.body;

    db.query(
        'UPDATE visitanteseventos SET contrasena = ? WHERE correo = ?',
        [nuevaContrasena, correo],
        (err, result) => {
            if (err) return res.status(500).json({ mensaje: err.message });

            return res.json({ mensaje: 'Contraseña actualizada correctamente' });
        }
    );
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
