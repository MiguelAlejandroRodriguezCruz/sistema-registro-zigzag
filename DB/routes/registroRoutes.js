const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

router.get('/', registroController.getAllRegistros);
router.post('/', registroController.createRegistro);

module.exports = router;
