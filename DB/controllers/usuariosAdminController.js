const UsuariosAdmin = require('../models/usuariosAdminModel');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, EXPIRES_IN } = require('../config/jwt');

exports.loginUsuariosAdmin = (req, res) => {
    const { nombre, contrasena } = req.body;
    if (!nombre || !contrasena) {
        return res.status(400).json({ mensaje: 'usuario y contraseña son obligatorios' });
    }

    UsuariosAdmin.findByNombre(nombre, (err, visitante) => {
        if (err) return res.status(500).send(err.message);

        if (!visitante || visitante.length === 0) {
            return res.status(401).json({ mensaje: 'usario no registrado' });
        }
        const usuario = visitante[0];
        const esCorrecta = contrasena === usuario.contrasena;
        if (!esCorrecta) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        const payload = {
            id: usuario.id,
            nombre: usuario.nombre
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

        res.json({
            mensaje: 'Login exitoso',
            token,
            visitante: {
                id: usuario.id,
                nombre: usuario.nombre,
            }
        });
    });
};

