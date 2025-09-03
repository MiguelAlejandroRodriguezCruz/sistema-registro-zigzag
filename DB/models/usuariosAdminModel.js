const db = require('../config/db');

const usuariosAdminModel = {
    findByNombre: (nombre, callback) => {
        db.query('SELECT * FROM usuariosadmin WHERE nombre = ? LIMIT 1', [nombre], callback);
    }
};

module.exports = usuariosAdminModel;
