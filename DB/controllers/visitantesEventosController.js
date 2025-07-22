const VisitanteEvento = require('../models/visitanteEventoModel');

exports.obtenerVisitantesEventos = (req, res) => {
    VisitanteEvento.getAll((err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
};

exports.agregarVisitanteEvento = (req, res) => {
    VisitanteEvento.create(req.body, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.status(201).json({ idInsertado: result.insertId });
    });
};

exports.actualizarVisitanteEvento = (req, res) => {
    VisitanteEvento.update(req.params.id, req.body, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json({ mensaje: "Visitante de evento actualizado correctamente" });
    });
};

exports.eliminarVisitanteEvento = (req, res) => {
    VisitanteEvento.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json({ mensaje: "Visitante de evento eliminado correctamente" });
    });
};

exports.loginVisitanteEvento = (req, res) => {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    VisitanteEvento.findByCorreo(correo, (err, results) => {
        if (err) return res.status(500).send(err.message);

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Correo no registrado' });
        }

        const visitante = results[0];
        if (visitante.contrasena !== contrasena) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        res.json({
            mensaje: 'Login exitoso',
            visitante: {
                id: visitante.id,
                nombre: visitante.nombre,
                correo: visitante.correo,
                edad: visitante.edad
            }
        });
    });
};
