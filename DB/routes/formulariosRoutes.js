const express = require('express');
const router = express.Router();
const formulariosController = require('../controllers/formulariosController');
const auth = require('../middlewares/auth');
const uploadEventos = require('../middlewares/uploadEventos'); // 🔹 Nuevo middleware

/**
 * @swagger
 * /formulario/guardar:
 *   post:
 *     summary: Guardar formulario con archivos
 *     tags: [Formulario]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id_visitante:
 *                 type: integer
 *               id_evento:
 *                 type: integer
 *               formulario:
 *                 type: string
 *               fecha_evento:
 *                 type: string
 *               num_adultos:
 *                 type: integer
 *               num_ninos:
 *                 type: integer
 *               archivos_*:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Formulario guardado
 */
// 🔹 CAMBIO: Usar el nuevo middleware para eventos
router.post('/guardar', auth, uploadEventos, formulariosController.guardarFormulario);

module.exports = router;