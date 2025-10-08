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

    async obtenerArchivosPorFormulario(idFormulario) {
        const sql = `SELECT id, campo_id, ruta_archivo, created_at FROM archivos_formulario WHERE id_formulario = ?`;
        const [result] = await db.promise().execute(sql, [idFormulario]);
        return result;
    },

    async obtenerFormularioConArchivos(idFormulario) {
        const sql = `
            SELECT f.*,e.formulario AS formulario_even, a.id AS id_archivo, a.campo_id, a.ruta_archivo, a.created_at AS archivo_creado
            FROM formularios AS f
            INNER JOIN archivos_formulario AS a
                ON f.id = a.id_formulario
            INNER JOIN evento AS e
            	ON e.id = f.id_evento
            WHERE f.id_evento = ?
        `;
        const [result] = await db.promise().execute(sql, [idFormulario]);
        return result;
    }
};

module.exports = formulariosModel;