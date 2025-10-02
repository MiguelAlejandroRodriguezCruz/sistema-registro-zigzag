// /middlewares/uploadEventos.js - VERSIÓN SIMPLIFICADA
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración básica que funciona con cualquier evento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Crear una carpeta temporal primero
        const tempPath = path.join(__dirname, '../uploads/temp');
        
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath, { recursive: true });
        }
        cb(null, tempPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nombreLimpio = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_').substring(0, 100);
        cb(null, `temp_${uniqueSuffix}_${nombreLimpio}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload.any();