const db = require('../config/db');

const eventosModel = {
    obtenerTodos: async () => {
        const [rows] = await db.promise().query('SELECT * FROM evento');
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.promise().query('SELECT * FROM evento WHERE id = ?', [id]);
        return rows[0];
    },

    obtenerNoRegistradosPorVisitante: async (idVisitante) => {
        const query = `
            SELECT e.* 
            FROM evento e
            WHERE e.id NOT IN (
                SELECT f.id_evento 
                FROM formularios f 
                WHERE f.id_visitante = ?
            )
        `;
        const [rows] = await db.promise().query(query, [idVisitante]);
        return rows;
    },

    insertar: async (evento) => {
        const query = `
            INSERT INTO evento (
                nombre, fechaInicio, fechaFinal, lugar, descripcion, formulario, baner
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().query(query, [
            evento.nombre,
            evento.fechaInicio,
            evento.fechaFinal,
            evento.lugar,
            evento.descripcion,
            evento.formulario,
            evento.baner
        ]);
        return result.insertId;
    },

    actualizar: async (id, evento) => {
        const query = `
            UPDATE evento 
            SET nombre = ?, fechaInicio = ?, fechaFinal = ?, lugar = ?, descripcion = ?, formulario = ?, baner = ?
            WHERE id = ?
        `;
        await db.promise().query(query, [
            evento.nombre,
            evento.fechaInicio,
            evento.fechaFinal,
            evento.lugar,
            evento.descripcion,
            evento.formulario,
            evento.baner,
            id
        ]);
    },

    eliminar: async (id) => {
        await db.promise().query('DELETE FROM evento WHERE id = ?', [id]);
    },

    obtenerBanner: async (id) => {
        const [rows] = await db.promise().query('SELECT baner FROM evento WHERE id = ?', [id]);
        return rows;
    },

    insertarImagen: async (idEvento, ruta) => {
        await db.promise().query(
            'INSERT INTO imagenes (evento_id, ruta_imagen) VALUES (?, ?)',
            [idEvento, ruta]
        );
    },

    obtenerImagenesPorEvento: async (idEvento) => {
        const [rows] = await db.promise().query(
            'SELECT id, ruta_imagen FROM imagenes WHERE evento_id = ?',
            [idEvento]
        );
        return rows;
    },

    obtenerImagenPorId: async (idImagen) => {
        const [rows] = await db.promise().query(
            'SELECT ruta_imagen FROM imagenes WHERE id = ?',
            [idImagen]
        );
        return rows;
    },

    eliminarImagen: async (idImagen) => {
        await db.promise().query('DELETE FROM imagenes WHERE id = ?', [idImagen]);
    }
};

module.exports = eventosModel;
