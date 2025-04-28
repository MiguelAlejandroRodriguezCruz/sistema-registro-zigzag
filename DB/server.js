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
    password: '1234',      // Contraseña 
    database: 'zigzag', // Nombre de la base de datos
    port: 3307
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


// Iniciar el servidor
app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
