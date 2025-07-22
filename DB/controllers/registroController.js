const db = require('../config/db');
const registroVisitasModel = require('../models/registroModel');

// Obtener todos los registros de visitas
exports.getAllRegistros = (req, res) => {
    registroVisitasModel.getAll((err, results) => {
        if (err) {
            console.error('Error al obtener visitas:', err);
            return res.status(500).json({ error: 'Error al obtener visitas' });
        }
        res.json(results);
    });
};

// Agregar un conjunto de visitantes (usando transacción)
exports.createRegistro = (req, res) => {
    const { idRegistro, visitantes } = req.body;

    if (!visitantes || visitantes.length === 0) {
        return res.status(400).json({ error: "No hay datos de visitantes" });
    }

    const hoy = new Date().toISOString().split('T')[0];

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: "Error al iniciar transacción" });
        }

        registroVisitasModel.insertarVisitas(idRegistro, visitantes, hoy)
            .then(() => {
                return registroVisitasModel.actualizarEstatusReserva(idRegistro);
            })
            .then(() => {
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error al confirmar transacción" });
                        });
                    }
                    res.json({
                        mensaje: "Registros guardados y estado actualizado",
                        idActualizado: idRegistro
                    });
                });
            })
            .catch(error => {
                db.rollback(() => {
                    console.error('Error en transacción:', error);
                    res.status(500).json({ error: "Error en el servidor" });
                });
            });
    });
};
