
const express = require('express');
const router = express.Router();
const formulariosController = require('../controllers/formulariosController');

/**
 * @swagger
 * /formulario/guardar:
 *   post:
 *     summary: Guardar formulario
 *     tags: [Formulario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Formulario guardado
 */
router.post('/guardar', formulariosController.guardarFormulario);

module.exports = router;
