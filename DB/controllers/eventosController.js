const eventosModel = require('../models/eventosModel');
const fs = require('fs');
const path = require('path');

const eventosController = {
    getTodos: async (req, res) => {
        try {
            const eventos = await eventosModel.obtenerTodos();
            res.json(eventos);
        } catch (err) {
            console.error('Error al obtener eventos:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    getPorId: async (req, res) => {
        try {
            const evento = await eventosModel.obtenerPorId(req.params.id);
            if (!evento) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }
            res.json(evento);
        } catch (err) {
            console.error('Error al obtener evento:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    getNoRegistrados: async (req, res) => {
        try {
            const eventos = await eventosModel.obtenerNoRegistradosPorVisitante(req.params.idVisitante);
            res.json(eventos);
        } catch (err) {
            console.error('Error al obtener eventos no registrados:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    crear: async (req, res) => {
        try {
            const datos = req.body;
            if (!datos.nombre || !datos.fechaInicio || !datos.fechaFinal || !datos.lugar || !datos.descripcion || !datos.formulario) {
                return res.status(400).json({ message: 'Faltan campos obligatorios' });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'Debe subir un banner para el evento' });
            }

            const urlBaner = `/uploads/${req.file.filename}`;
            const formulario = datos.formulario || '[]';

            const idInsertado = await eventosModel.insertar({
                nombre: datos.nombre,
                fechaInicio: datos.fechaInicio,
                fechaFinal: datos.fechaFinal,
                lugar: datos.lugar,
                descripcion: datos.descripcion,
                formulario,
                baner: urlBaner,
                maxPersonas: datos.maxPersonas
            });

            res.status(201).json({ idInsertado, banerUrl: urlBaner });

        } catch (err) {
            console.error('Error al insertar evento:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    actualizar: async (req, res) => {
        try {
            const eventoId = req.params.id;
            const datos = req.body;

            // Validación básica de campos obligatorios
            if (!datos.nombre || !datos.fechaInicio || !datos.fechaFinal || !datos.lugar || !datos.descripcion, !datos.formulario) {
                return res.status(400).json({ message: 'Faltan campos obligatorios' });
            }

            // Obtener el banner actual del evento
            const rows = await eventosModel.obtenerBanner(eventoId);
            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            // Determinar el banner a usar: el nuevo (si viene archivo), o el actual
            let bannerFinal = rows[0].baner;
            if (req.file) {
                bannerFinal = `/uploads/${req.file.filename}`;
            }

            // Usar formulario si viene; si no, por defecto un arreglo vacío
            const formulario = datos.formulario || '[]';

            // Actualizar evento en BD
            await eventosModel.actualizar(eventoId, {
                nombre: datos.nombre,
                fechaInicio: datos.fechaInicio,
                fechaFinal: datos.fechaFinal,
                lugar: datos.lugar,
                descripcion: datos.descripcion,
                formulario,
                baner: bannerFinal,
                maxPersonas: datos.maxPersonas
            });

            res.json({ message: 'Evento actualizado correctamente', banerUrl: bannerFinal });

        } catch (err) {
            console.error('Error al actualizar evento:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },


    eliminar: async (req, res) => {
        const eventoId = req.params.id;
        try {
            const evento = await eventosModel.obtenerBanner(eventoId);
            if (!evento || evento.length === 0) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            // Obtener imágenes desde el modelo
            const imagenes = await eventosModel.obtenerImagenesPorEvento(eventoId);

            // Eliminar archivos físicos
            const files = [
                ...imagenes.map(img => img.ruta_imagen.split('/').pop()),
                evento[0].baner ? evento[0].baner.split('/').pop() : null
            ].filter(Boolean);

            files.forEach(nombre => {
                const filePath = path.join(__dirname, '../uploads', nombre);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            // Eliminar imágenes y evento
            for (const img of imagenes) {
                await eventosModel.eliminarImagen(img.id);
            }

            await eventosModel.eliminar(eventoId);

            res.json({ message: 'Evento y dependencias eliminados correctamente' });

        } catch (err) {
            console.error('Error al eliminar evento:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    subirImagenesEvento: async (req, res) => {
        const idEvento = req.params.idEvento;
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No se subieron imágenes' });
            }

            const imagenes = [];
            for (const file of req.files) {
                const ruta = `/uploads/${file.filename}`;
                await eventosModel.insertarImagen(idEvento, ruta);
                imagenes.push({ ruta });
            }

            res.status(201).json({ message: 'Imágenes subidas correctamente', imagenes });

        } catch (err) {
            console.error('Error al subir imágenes:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    obtenerImagenesEvento: async (req, res) => {
        const idEvento = req.params.idEvento;
        try {
            const imagenes = await eventosModel.obtenerImagenesPorEvento(idEvento);
            res.json(imagenes);
        } catch (err) {
            console.error('Error al obtener imágenes:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    eliminarImagen: async (req, res) => {
        const idImagen = req.params.idImagen;
        try {
            const rows = await eventosModel.obtenerImagenPorId(idImagen);
            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'Imagen no encontrada' });
            }

            const nombreArchivo = rows[0].ruta_imagen.split('/').pop();

            const filePath = path.join(__dirname, '../uploads', nombreArchivo);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await eventosModel.eliminarImagen(idImagen);
            res.json({ message: 'Imagen eliminada correctamente' });

        } catch (err) {
            console.error('Error al eliminar imagen:', err.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

module.exports = eventosController;
