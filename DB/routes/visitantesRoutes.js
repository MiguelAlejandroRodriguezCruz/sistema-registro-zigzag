// /routes/visitantesRoutes.js

const express = require('express');
const router = express.Router();
const visitantesController = require('../controllers/visitantesController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /visitantes:
 *   get:
 *     summary: Obtener todos los visitantes
 *     tags: [Visitantes]
 *     responses:
 *       200:
 *         description: Lista de visitantes
 */
router.get('/',auth, visitantesController.getVisitantes);

/**
 * @swagger
 * /visitantes:
 *   get:
 *     summary: Obtener todas las fechas ocupadas
 *     tags: [Visitantes]
 *     responses:
 *       200:
 *         description: Lista de fechas ocupadas
 */
router.get('/fechasOcupadas', visitantesController.getVisitantesFechasOcupadas);

/**
 * @swagger
 * /visitantes:
 *   post:
 *     summary: Crear un visitante
 *     tags: [Visitantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Visitante creado
 */
router.post('/', visitantesController.createVisitante);

/**
 * @swagger
 * /visitantes/{id}:
 *   put:
 *     summary: Actualizar un visitante por ID
 *     tags: [Visitantes]
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
 *         description: Visitante actualizado
 */
router.put('/:id',auth, visitantesController.updateVisitante);

/**
 * @swagger
 * /visitantes:
 *   put:
 *     summary: Actualizar el estado de todos los visitantes
 *     tags: [Visitantes]
 *     responses:
 *       200:
 *         description: Estados actualizados
 */
router.put('/',auth, visitantesController.updateAllStatus);

/**
 * @swagger
 * /visitantes/{id}:
 *   delete:
 *     summary: Eliminar un visitante por ID
 *     tags: [Visitantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitante eliminado
 */
router.delete('/:id',auth, visitantesController.deleteVisitante);

module.exports = router;
