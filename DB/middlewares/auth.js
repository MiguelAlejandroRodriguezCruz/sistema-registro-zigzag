const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/jwt');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ mensaje: 'Token inválido' });
        req.usuario = user;
        next();
    });
};
