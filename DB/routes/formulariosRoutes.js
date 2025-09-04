
const express = require('express');
const router = express.Router();
const formulariosController = require('../controllers/formulariosController');
const auth = require('../middlewares/auth');

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
router.post('/guardar',auth, formulariosController.guardarFormulario);

module.exports = router;
