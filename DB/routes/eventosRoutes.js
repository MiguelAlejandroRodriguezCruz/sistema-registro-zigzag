const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const upload = require('../middlewares/upload');


/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/', eventosController.getTodos);

/**
 * @swagger
 * /eventos/disponibles/{idVisitante}:
 *   get:
 *     summary: Obtener eventos no registrados por un visitante
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: idVisitante
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de eventos disponibles
 */
router.get('/disponibles/:idVisitante', eventosController.getNoRegistrados);

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Obtener evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 */
router.get('/:id', eventosController.getPorId);

/**
 * @swagger
 * /eventos:
 *   post:
 *     summary: Crear un evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Evento creado
 */
router.post('/', upload.single('baner'), eventosController.crear);

/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     summary: Actualizar un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento actualizado
 */
router.put('/:id', upload.single('baner'), eventosController.actualizar);

/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     summary: Eliminar un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminado
 */
router.delete('/:id', eventosController.eliminar);

/**
 * @swagger
 * /eventos/{idEvento}/imagenes:
 *   post:
 *     summary: Subir imágenes a un evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Imágenes subidas
 */
router.post('/:idEvento/imagenes', upload.array('imagenes', 10), eventosController.subirImagenesEvento);

/**
 * @swagger
 * /eventos/{idEvento}/imagenes:
 *   get:
 *     summary: Obtener imágenes de un evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de imágenes
 */
router.get('/:idEvento/imagenes', eventosController.obtenerImagenesEvento);

/**
 * @swagger
 * /eventos/imagenes/{idImagen}:
 *   delete:
 *     summary: Eliminar una imagen de un evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: idImagen
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen eliminada
 */
router.delete('/imagenes/:idImagen', eventosController.eliminarImagen);

module.exports = router;
