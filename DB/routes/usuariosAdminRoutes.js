const express = require('express');
const router = express.Router();
const usuariosAdminController = require('../controllers/usuariosAdminController');

// Rutas públicas
router.post('/login', usuariosAdminController.loginUsuariosAdmin);

module.exports = router;
