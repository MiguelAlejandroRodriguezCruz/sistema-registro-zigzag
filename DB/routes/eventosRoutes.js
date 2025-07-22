const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const upload = require('../middlewares/upload');

// Rutas eventos
router.get('/', eventosController.getTodos);
router.get('/disponibles/:idVisitante', eventosController.getNoRegistrados);
router.get('/:id', eventosController.getPorId);
router.post('/', upload.single('baner'), eventosController.crear);
router.put('/:id', upload.single('baner'), eventosController.actualizar);
router.delete('/:id', eventosController.eliminar);

// Rutas imágenes adicionales
router.post('/:idEvento/imagenes', upload.array('imagenes', 10), eventosController.subirImagenesEvento);
router.get('/:idEvento/imagenes', eventosController.obtenerImagenesEvento);
router.delete('/imagenes/:idImagen', eventosController.eliminarImagen);

module.exports = router;
