const db = require('../config/db');

const VisitanteEvento = {

    getAll: (callback) => {
        db.query('SELECT * FROM visitanteseventos', callback);
    },

    create: (datos, callback) => {
        const query = `INSERT INTO visitanteseventos (nombre, correo, edad, contrasena) VALUES (?, ?, ?, ?)`;
        const values = [datos.nombre, datos.correo, datos.edad, datos.contrasena];
        db.query(query, values, callback);
    },

    update: (id, datos, callback) => {
        let query = 'UPDATE visitanteseventos SET ';
        let fields = [];
        let values = [];

        Object.keys(datos).forEach((key) => {
            if (datos[key] !== "" && datos[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(datos[key]);
            }
        });

        if (fields.length === 0) return callback(new Error('No hay datos para actualizar'));

        query += fields.join(', ') + ' WHERE id = ?';
        values.push(id);

        db.query(query, values, callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM visitanteseventos WHERE id = ?', [id], callback);
    },

    findByCorreo: (correo, callback) => {
        db.query('SELECT * FROM visitanteseventos WHERE correo = ? LIMIT 1', [correo], callback);
    }

};

module.exports = VisitanteEvento;
