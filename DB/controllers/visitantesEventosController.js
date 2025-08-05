const VisitanteEvento = require('../models/visitanteEventoModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY, EXPIRES_IN } = require('../config/jwt');

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

    VisitanteEvento.findByCorreo(correo, (err, visitante) => {
        if (err) return res.status(500).send(err.message);

        if (!visitante || visitante.length === 0) {
            return res.status(401).json({ mensaje: 'Correo no registrado' });
        }
        const usuario = visitante[0];
        const esCorrecta = bcrypt.compareSync(contrasena, usuario.contrasena);
        if (!esCorrecta) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        const payload = {
            id: usuario.id,
            correo: usuario.correo
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

        res.json({
            mensaje: 'Login exitoso',
            token,
            visitante: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                edad: usuario.edad
            }
        });
    });
};

