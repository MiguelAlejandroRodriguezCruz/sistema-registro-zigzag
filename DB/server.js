const mysql = require('mysql2');
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3001;

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
  const datos = req.body;
  const query = `
        INSERT INTO registrovisitas (
            id_institucion, niños5a10, niños10a15, niños15a18, niñas5a10,
            niñas10a15, niñas15a18, hombres20a30, hombres30a40, hombres40omas,
            mujeres20a30, mujeres30a40, mujeres40omas, maestros20a30,
            maestros30a40, maestros40omas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const values = [
    datos.idRegistro, datos.niños5a10, datos.niños10a15, datos.niños15a18, datos.niñas5a10,
    datos.niñas10a15, datos.niñas15a18, datos.hombres20a30, datos.hombres30a40, datos.hombres40omas,
    datos.mujeres20a30, datos.mujeres30a40, datos.mujeres40omas, datos.maestros20a30,
    datos.maestros30a40, datos.maestros40omas
  ];

  console.log(datos.idRegistro)

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al guardar el registro:', err.message);
      res.status(500).send(err.message);
      return;
    }
    res.status(201).json({ idInsertado: result.insertId });
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
  const { id_evento, formulario, fecha_evento, num_adultos, num_ninos } = req.body;
  const id_visitante = 1;

  const query = `
      INSERT INTO formularios 
      (id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(query,
    [id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos],
    (err, result) => {
      if (err) {
        console.error('Error al guardar formulario:', err.message);
        return res.status(500).json({ error: 'Error al guardar formulario' });
      }

      const idFormulario = result.insertId;
      const codigoQR = `RES-${idFormulario}-${Date.now()}`;  // ejemplo de código QR

      // Ahora actualizamos el registro con el codigo_qr
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

// Ruta para eliminar un evento y todas sus dependencias
app.delete('/eventos/:id', async (req, res) => {
  const eventoId = req.params.id;

  try {
    // Paso 1: Eliminar formularios relacionados
    const deleteFormulariosQuery = 'DELETE FROM formularios WHERE id_evento = ?';
    await db.promise().query(deleteFormulariosQuery, [eventoId]);

    // Paso 2: Obtener rutas de imágenes para eliminarlas físicamente
    const [imagenes] = await db.promise().query('SELECT id, ruta_imagen FROM imagenes WHERE evento_id = ?', [eventoId]);
    
    // Paso 3: Eliminar imágenes de la base de datos
    const deleteImagenesQuery = 'DELETE FROM imagenes WHERE evento_id = ?';
    await db.promise().query(deleteImagenesQuery, [eventoId]);

    // Paso 4: Eliminar imágenes físicamente
    for (const imagen of imagenes) {
      const nombreArchivo = imagen.ruta_imagen.split('/').pop();
      const filePath = path.join(__dirname, 'uploads', nombreArchivo);
      
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Error al eliminar archivo ${filePath}:`, err);
      }
    }

    // Paso 5: Eliminar el evento
    const deleteEventoQuery = 'DELETE FROM evento WHERE id = ?';
    const [result] = await db.promise().query(deleteEventoQuery, [eventoId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    res.json({ mensaje: 'Evento y todas sus dependencias eliminadas correctamente' });
  } catch (err) {
    console.error('Error al eliminar evento:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});
