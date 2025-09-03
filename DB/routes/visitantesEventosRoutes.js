const express = require('express');
const router = express.Router();
const visitantesEventosController = require('../controllers/visitantesEventosController');
const auth = require('../middlewares/auth');


/**
 * @swagger
 * /visitantes-eventos:
 *   get:
 *     summary: Obtener todos los registros de visitantes-eventos (protegido)
 *     tags: [VisitantesEventos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros
 */
router.get('/', auth, visitantesEventosController.obtenerVisitantesEventos);

/**
 * @swagger
 * /visitantes-eventos/{id}:
 *   put:
 *     summary: Actualizar registro visitante-evento por ID (protegido)
 *     tags: [VisitantesEventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Registro actualizado
 */
router.put('/:id', auth, visitantesEventosController.actualizarVisitanteEvento);

/**
 * @swagger
 * /visitantes-eventos/{id}:
 *   delete:
 *     summary: Eliminar registro visitante-evento por ID (protegido)
 *     tags: [VisitantesEventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro eliminado
 */
router.delete('/:id', auth, visitantesEventosController.eliminarVisitanteEvento);

/**
 * @swagger
 * /visitantes-eventos:
 *   post:
 *     summary: Agregar registro visitante-evento
 *     tags: [VisitantesEventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Registro agregado
 */
router.post('/', visitantesEventosController.agregarVisitanteEvento);

/**
 * @swagger
 * /visitantes-eventos/login:
 *   post:
 *     summary: Login de visitante-evento
 *     tags: [VisitantesEventos]
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
router.post('/login', visitantesEventosController.loginVisitanteEvento);

module.exports = router;
