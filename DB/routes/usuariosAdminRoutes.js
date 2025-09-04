const express = require('express');
const router = express.Router();
const usuariosAdminController = require('../controllers/usuariosAdminController');

/**
 * @swagger
 * /usuarios-admin/login:
 *   post:
 *     summary: Login de usuarios administadores
 *     tags: [UsuariosAdmin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/login', usuariosAdminController.loginUsuariosAdmin);

module.exports = router;
