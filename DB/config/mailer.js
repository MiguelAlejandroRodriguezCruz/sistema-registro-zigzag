const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yomiguel250@gmail.com',
        pass: 'ehkr vhjy lxsl lppc'
    }
});

module.exports = transporter;
