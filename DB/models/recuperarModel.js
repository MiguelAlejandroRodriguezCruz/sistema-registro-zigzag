const db = require('../config/db');
const bcrypt = require('bcryptjs');

const recuperarModel = {
    buscarCorreo: async (correo) => {
        const [results] = await db.promise().query(
            'SELECT * FROM visitanteseventos WHERE correo = ?',
            [correo]
        );
        return results;
    },

    guardarCodigo: async (correo, codigo, expiracion) => {
        await db.promise().query(
            'INSERT INTO codigos_recuperacion (correo, codigo, expiracion) VALUES (?, ?, ?)',
            [correo, codigo, expiracion]
        );
    },

    obtenerUltimoCodigo: async (correo) => {
        const [results] = await db.promise().query(
            'SELECT * FROM codigos_recuperacion WHERE correo = ? ORDER BY id DESC LIMIT 1',
            [correo]
        );
        return results[0];
    },

    cambiarContrasena: async (correo, nuevaContrasena) => {
    // Encriptar la nueva contraseña antes de guardarla
    const hash = bcrypt.hashSync(nuevaContrasena, 10);

    await db.promise().query(
        'UPDATE visitanteseventos SET contrasena = ? WHERE correo = ?',
        [hash, correo]
    );
}
};

module.exports = recuperarModel;
