
const express = require('express');
const router = express.Router();
const recuperarController = require('../controllers/recuperarController');
const authReset = require('../middlewares/authReset');

/**
 * @swagger
 * /recuperar/enviar-codigo:
 *   post:
 *     summary: Enviar código de recuperación
 *     tags: [Recuperar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Código enviado
 */
router.post('/enviar-codigo', recuperarController.enviarCodigo);

/**
 * @swagger
 * /recuperar/verificar-codigo:
 *   post:
 *     summary: Verificar código de recuperación
 *     tags: [Recuperar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Código verificado
 */
router.post('/verificar-codigo', recuperarController.verificarCodigo);

/**
 * @swagger
 * /recuperar/cambiar-contrasena:
 *   post:
 *     summary: Cambiar contraseña
 *     tags: [Recuperar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contraseña cambiada
 */
router.post('/cambiar-contrasena', authReset, recuperarController.cambiarContrasena);

module.exports = router;
