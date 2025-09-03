
const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

/**
 * @swagger
 * /registro:
 *   get:
 *     summary: Obtener todos los registros
 *     tags: [Registro]
 *     responses:
 *       200:
 *         description: Lista de registros
 */
router.get('/', registroController.getAllRegistros);

/**
 * @swagger
 * /registro:
 *   post:
 *     summary: Crear un registro
 *     tags: [Registro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Registro creado
 */
router.post('/', registroController.createRegistro);

module.exports = router;
