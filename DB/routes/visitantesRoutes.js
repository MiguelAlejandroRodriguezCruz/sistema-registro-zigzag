// /routes/visitantesRoutes.js
const express = require('express');
const router = express.Router();
const visitantesController = require('../controllers/visitantesController');

router.get('/', visitantesController.getVisitantes);
router.post('/', visitantesController.createVisitante);
router.put('/:id', visitantesController.updateVisitante);
router.put('/', visitantesController.updateAllStatus);
router.delete('/:id', visitantesController.deleteVisitante);

module.exports = router;
