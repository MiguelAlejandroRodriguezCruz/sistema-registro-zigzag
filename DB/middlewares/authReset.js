const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ mensaje: "Token requerido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token inválido" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userReset = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: "Token no válido o expirado" });
  }
};
