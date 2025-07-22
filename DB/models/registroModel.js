const db = require('../config/db');

const registroVisitasModel = {
    // Obtener todos los registros de la tabla
    getAll: (callback) => {
        db.query('SELECT * FROM registrovisitas', callback);
    },

    // Insertar múltiples registros de visitantes
    insertarVisitas: (idRegistro, visitantes, fecha) => {
        return Promise.all(
            visitantes.map(visitante => {
                const query = `
                    INSERT INTO registrovisitas 
                    (id_institucion, tipo, rango, cantidad, fecha_registro) 
                    VALUES (?, ?, ?, ?, ?)
                `;
                const values = [
                    idRegistro,
                    visitante.tipo,
                    visitante.rango,
                    visitante.cantidad,
                    fecha
                ];
                return new Promise((resolve, reject) => {
                    db.query(query, values, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            })
        );
    },

    // Actualizar el estatus de la institución
    actualizarEstatusReserva: (idRegistro) => {
        const query = `
            UPDATE visitantesinstitucion 
            SET estatus = 'registradas'
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [idRegistro], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};

module.exports = registroVisitasModel;
