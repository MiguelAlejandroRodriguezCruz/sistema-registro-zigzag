const formulariosModel = require('../models/formulariosModel');
const VisitanteEvento = require('../models/visitanteEventoModel');
const transporter = require('../config/mailer');
const QRCode = require('qrcode'); //npm install qrcode
const path = require('path');
const fs = require('fs');

const formulariosController = {
    guardarFormulario: async (req, res) => {
        try {
            const { id_visitante, id_evento, formulario, fecha_evento, num_adultos, num_ninos } = req.body;

            if (!id_visitante) {
                return res.status(400).json({ error: 'ID de visitante es requerido' });
            }

            const idFormulario = await formulariosModel.insertarFormulario({
                id_visitante,
                id_evento,
                formulario,
                fecha_evento,
                num_adultos,
                num_ninos
            });

            // Crear objeto QR 
            const qrData = JSON.stringify({
                ID: idFormulario,
                Type: "Reservation"
            });

            // Generar nombre único para el archivo QR
            const qrFileName = `qrcode-${idFormulario}-${Date.now()}.png`;
            const qrRelativePath = path.join('uploads', qrFileName);
            const qrAbsolutePath = path.join(__dirname, '../', qrRelativePath);

            // Crear directorio si no existe
            const uploadDir = path.dirname(qrAbsolutePath);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generar y guardar código QR
            await QRCode.toFile(qrAbsolutePath, qrData, {
                errorCorrectionLevel: 'H',
                type: 'png',
                quality: 0.9
            });

            // Actualizar base de datos con la ruta del QR
            await formulariosModel.actualizarCodigoQR(idFormulario, qrRelativePath);

            // Obtener información del usuario para enviar el correo
            const usuario = await new Promise((resolve, reject) => {
                VisitanteEvento.findByCorreoById(id_visitante, (err, results) => {
                    if (err) reject(err);
                    resolve(results[0]);
                });
            });

            // Enviar correo con el código QR adjunto
            if (usuario && usuario.correo) {
                const mailOptions = {
                    from: 'yomiguel250@gmail.com',
                    to: usuario.correo,
                    subject: 'Tu código QR de reserva',
                    text: `¡Gracias por tu reserva! Adjunto encontrarás tu código QR para el evento.`,
                    attachments: [
                        {
                            filename: `reserva-${idFormulario}.png`,
                            path: qrAbsolutePath
                        }
                    ]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error enviando correo:', error);
                    } else {
                        console.log('Correo enviado:', info.response);
                    }
                });
            }

            return res.status(200).json({
                message: 'Formulario guardado exitosamente. Se ha enviado un correo con tu código QR.',
                id: idFormulario,
                codigo_qr: qrRelativePath
            });

        } catch (err) {
            console.error('Error al guardar formulario:', err.message);
            return res.status(500).json({ error: 'Error al guardar formulario' });
        }
    }
};

module.exports = formulariosController;
