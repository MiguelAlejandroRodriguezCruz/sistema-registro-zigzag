const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;

// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());

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
app.post('/eventos', (req, res) => {
    const datos = req.body;
    const query = `
        INSERT INTO evento (
            nombre, fechaInicio, fechaFinal, lugar, descripcion, formulario, baner
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        datos.nombre, datos.fechaInicio, datos.fechaFinal, datos.lugar,
        datos.descripcion, datos.formulario, datos.baner
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar evento:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({ idInsertado: result.insertId });
    });
});
// Ruta para actualizar eventos
app.put('/eventos/:id', (req, res) => {
    const id = req.params.id;
    const datos = req.body;

    let query = 'UPDATE evento SET ';
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
            console.error('Error al actualizar evento:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: "Evento actualizado correctamente" });
    });
});
// Ruta para eliminar eventos
app.delete('/eventos/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM evento WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar evento:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ mensaje: 'Evento eliminado correctamente' });
    });
});

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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
