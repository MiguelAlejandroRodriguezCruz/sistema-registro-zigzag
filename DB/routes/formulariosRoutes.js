const express = require('express');
const router = express.Router();
const formulariosController = require('../controllers/formulariosController');

router.post('/guardar', formulariosController.guardarFormulario);

module.exports = router;
