const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000, http://192.168.1.140');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

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
    console.log(`API corriendo en http://localhost:${port}`);
});
