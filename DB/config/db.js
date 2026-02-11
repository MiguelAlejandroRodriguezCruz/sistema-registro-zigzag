// /config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'zigzag',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        console.error('Detalles de conexión:');
        console.error(`Host: ${process.env.DB_HOST || 'localhost'}`);
        console.error(`Usuario: ${process.env.DB_USER || 'appuser'}`);
        console.error(`Base de datos: ${process.env.DB_NAME || 'zigzag'}`);
        console.error(`Puerto: ${process.env.DB_PORT || 3306}`);
        return;
    }
    console.log('✓ Conectado a la base de datos zigzag');
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = db;
