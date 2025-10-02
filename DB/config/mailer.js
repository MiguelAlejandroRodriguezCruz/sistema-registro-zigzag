const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'yomiguel250@gmail.com',
        pass: process.env.EMAIL_PASS || 'ehkr vhjy lxsl lppc' // Contraseña de aplicación
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;