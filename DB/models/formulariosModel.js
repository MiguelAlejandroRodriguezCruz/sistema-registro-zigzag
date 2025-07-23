const db = require('../config/db');

const formulariosModel = {
    async insertarFormulario({ id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos }) {
        const sql = `
            INSERT INTO formularios 
            (id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().execute(sql, [
            id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos
        ]);
        return result.insertId;
    },

    async actualizarCodigoQR(idFormulario, qrRelativePath) {
        const sql = `UPDATE formularios SET codigo_qr = ? WHERE id = ?`;
        await db.promise().execute(sql, [qrRelativePath, idFormulario]);
    }
};

module.exports = formulariosModel;
