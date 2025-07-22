const formulariosModel = require('../models/formulariosModel');

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

            const codigoQR = `RES-${idFormulario}-${Date.now()}`;
            await formulariosModel.actualizarCodigoQR(idFormulario, codigoQR);

            return res.status(200).json({
                message: 'Formulario guardado exitosamente',
                id: idFormulario,
                codigo_qr: codigoQR
            });

        } catch (err) {
            console.error('Error al guardar formulario:', err.message);
            return res.status(500).json({ error: 'Error al guardar formulario' });
        }
    }
};

module.exports = formulariosController;
