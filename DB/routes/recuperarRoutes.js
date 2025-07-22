const express = require('express');
const router = express.Router();
const recuperarController = require('../controllers/recuperarController');

router.post('/enviar-codigo', recuperarController.enviarCodigo);
router.post('/verificar-codigo', recuperarController.verificarCodigo);
router.post('/cambiar-contrasena', recuperarController.cambiarContrasena);

module.exports = router;
