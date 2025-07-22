const express = require('express');
const path = require('path');
const app = express();
const port = 3001;
const visitantesRoutes = require('./routes/visitantesRoutes');
const registroRoutes = require('./routes/registroRoutes');
const eventosRoutes = require('./routes/eventosRoutes');
const formulariosRoutes = require('./routes/formulariosRoutes');
const recuperarRoutes = require('./routes/recuperarRoutes');
const visitantesEventosRoutes = require('./routes/visitantesEventosRoutes');
const upload = require('./middlewares/upload');

require('./config/db'); // solo para que se conecte

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Hacer accesible la carpeta /uploads de forma pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/visitantes', visitantesRoutes);
app.use('/registro', registroRoutes);
app.use('/eventos', eventosRoutes);
app.use('/formulario', formulariosRoutes);
app.use('/recuperar', recuperarRoutes);
app.use('/visitantes-eventos', visitantesEventosRoutes);



// Iniciar server
app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
