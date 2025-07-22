const express = require('express');
const router = express.Router();
const visitantesEventosController = require('../controllers/visitantesEventosController');

router.get('/', visitantesEventosController.obtenerVisitantesEventos);
router.post('/', visitantesEventosController.agregarVisitanteEvento);
router.put('/:id', visitantesEventosController.actualizarVisitanteEvento);
router.delete('/:id', visitantesEventosController.eliminarVisitanteEvento);
router.post('/login', visitantesEventosController.loginVisitanteEvento);

module.exports = router;
