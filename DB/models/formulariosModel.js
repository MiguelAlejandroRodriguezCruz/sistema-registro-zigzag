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
    },

    async obtenerEventoPorId(idEvento) {
        const sql = `SELECT id, nombre FROM evento WHERE id = ?`;
        const [result] = await db.promise().execute(sql, [idEvento]);
        return result[0] || null;
    },

    async guardarArchivosFormulario(idFormulario, archivos) {
        const sql = `
            INSERT INTO archivos_formulario 
            (id_formulario, campo_id, ruta_archivo)
            VALUES (?, ?, ?)
        `;
        
        for (const archivo of archivos) {
            await db.promise().execute(sql, [
                idFormulario,
                archivo.campo_id,
                archivo.ruta_archivo
            ]);
        }
    },

    // 🔹 CAMBIO: Obtener archivos de un formulario (solo rutas HTTP)
    async obtenerArchivosPorFormulario(idFormulario) {
        const sql = `SELECT id, campo_id, ruta_archivo, created_at FROM archivos_formulario WHERE id_formulario = ?`;
        const [result] = await db.promise().execute(sql, [idFormulario]);
        return result;
    }
};

module.exports = formulariosModel;