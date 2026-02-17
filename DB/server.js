const fs = require('fs');
const path = require('path');
// Detectar entorno: preferir .env.production cuando NODE_ENV=production
// o cuando se ejecuta bajo PM2 y existe el archivo .env.production
const useProductionEnv = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
    || (process.env.PM2_HOME && fs.existsSync(path.join(__dirname, '.env.production')));
require('dotenv').config({
    path: useProductionEnv ? '.env.production' : '.env'
});
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

const whitelist = [
    'http://localhost:3000', 
    'http://192.168.1.140', 
    'http://reservaciones.zigzag.gob.mx', 
    'https://reservaciones.zigzag.gob.mx',
    'http://reservaciones.zigzag.gob.mx:3001' 
];

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Sistema Registro Zigzag',
        version: '1.0.0',
        description: 'Documentación de la API para el sistema de registro Zigzag',
    },
    servers: [
        {
            url: 'http://localhost:3001',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: [
        path.join(__dirname, './routes/*.js'),
    ],
};

const swaggerSpec = swaggerJSDoc(options);
const visitantesRoutes = require('./routes/visitantesRoutes');
const registroRoutes = require('./routes/registroRoutes');
const eventosRoutes = require('./routes/eventosRoutes');
const formulariosRoutes = require('./routes/formulariosRoutes');
const recuperarRoutes = require('./routes/recuperarRoutes');
const visitantesEventosRoutes = require('./routes/visitantesEventosRoutes');
const usuariosAdminRoutes = require('./routes/usuariosAdminRoutes')
const upload = require('./middlewares/upload');

require('./config/db'); // solo para que se conecte

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ruta de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  }
}));

// Hacer accesible la carpeta /uploads de forma pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Servir archivos estáticos de docs_eventos
app.use('/docs_eventos', express.static(path.join(__dirname, 'docs_eventos')));

// Rutas
app.use('/visitantes', visitantesRoutes);
app.use('/registro', registroRoutes);
app.use('/eventos', eventosRoutes);
app.use('/formulario', formulariosRoutes);
app.use('/recuperar', recuperarRoutes);
app.use('/visitantes-eventos', visitantesEventosRoutes);
app.use('/usuarios-admin', usuariosAdminRoutes);

// Ruta raíz para redirigir a la documentación
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});



// Iniciar server
app.listen(port, () => {
    const environment = process.env.NODE_ENV || 'desarrollo';
    const host = process.env.HOST || 'localhost';
    console.log(`✓ API corriendo en ${environment.toUpperCase()} - http://${host}:${port}`);
});
