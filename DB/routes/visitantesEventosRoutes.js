const express = require('express');
const router = express.Router();
const visitantesEventosController = require('../controllers/visitantesEventosController');
const auth = require('../middlewares/auth');

// Rutas protegidas con JWT
router.get('/', auth, visitantesEventosController.obtenerVisitantesEventos);
router.put('/:id', auth, visitantesEventosController.actualizarVisitanteEvento);
router.delete('/:id', auth, visitantesEventosController.eliminarVisitanteEvento);

// Rutas públicas
router.post('/', visitantesEventosController.agregarVisitanteEvento);
router.post('/login', visitantesEventosController.loginVisitanteEvento);

module.exports = router;
