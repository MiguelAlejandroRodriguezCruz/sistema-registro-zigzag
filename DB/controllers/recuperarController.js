const recuperarModel = require('../models/recuperarModel');
const transporter = require('../config/mailer');

const recuperarController = {
    enviarCodigo: async (req, res) => {
        try {
            const { correo } = req.body;
            if (!correo) {
                return res.status(400).json({ mensaje: 'Correo es requerido' });
            }

            const usuario = await recuperarModel.buscarCorreo(correo);
            if (usuario.length === 0) {
                return res.status(404).json({ mensaje: 'Correo no encontrado' });
            }

            const codigo = Math.floor(100000 + Math.random() * 900000);
            const expiracion = new Date(Date.now() + 10 * 60000);

            await recuperarModel.guardarCodigo(correo, codigo, expiracion);

            const mailOptions = {
                from: 'tucorreo@gmail.com',
                to: correo,
                subject: 'Código de recuperación',
                text: `Tu código de recuperación es: ${codigo}. Este código expirará en 10 minutos.`
            };

            await transporter.sendMail(mailOptions);

            return res.json({ mensaje: 'Código enviado al correo' });
        } catch (err) {
            console.error('Error:', err.message);
            return res.status(500).json({ mensaje: 'Error al enviar código' });
        }
    },

    verificarCodigo: async (req, res) => {
        try {
            const { correo, codigo } = req.body;
            const registro = await recuperarModel.obtenerUltimoCodigo(correo);

            if (!registro) {
                return res.status(400).json({ mensaje: 'No se encontró código para este correo' });
            }

            if (registro.codigo.toString() !== codigo.toString()) {
                return res.status(401).json({ mensaje: 'Código incorrecto' });
            }

            if (new Date(registro.expiracion) < new Date()) {
                return res.status(401).json({ mensaje: 'Código expirado' });
            }

            return res.json({ mensaje: 'Código válido' });

        } catch (err) {
            console.error('Error:', err.message);
            return res.status(500).json({ mensaje: 'Error al verificar código' });
        }
    },

    cambiarContrasena: async (req, res) => {
        try {
            const { correo, nuevaContrasena } = req.body;
            await recuperarModel.cambiarContrasena(correo, nuevaContrasena);
            return res.json({ mensaje: 'Contraseña actualizada correctamente' });
        } catch (err) {
            console.error('Error:', err.message);
            return res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
        }
    }
};

module.exports = recuperarController;
