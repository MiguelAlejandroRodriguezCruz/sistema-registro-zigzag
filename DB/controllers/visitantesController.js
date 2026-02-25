// /controllers/visitantesController.js
const Visitantes = require("../models/visitantesModel");

exports.getVisitantes = (req, res) => {
  const { mes, anio } = req.query;

  if (!mes || !anio) {
    return res.status(400).json({
      error: "Debes enviar mes y anio",
    });
  }

  Visitantes.getByMes(mes, anio, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getVisitantesFechasOcupadas = (req, res) => {
  Visitantes.getAllFechasOcupadas((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createVisitante = (req, res) => {
  Visitantes.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ idInsertado: result.insertId });
  });
};

exports.updateVisitante = (req, res) => {
  const id = req.params.id;
  Visitantes.update(id, req.body, (err, result) => {
    if (err) {
      if (err.message.includes("No se enviaron")) {
        return res.status(400).json({ mensaje: err.message });
      }
      return res.status(500).json({ error: err.message });
    }

    // Trae la fila actualizada y la devuelve
    Visitantes.getById(id, (err2, updatedRow) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({
        mensaje: "Visitante actualizado correctamente",
        updated: updatedRow,
      });
    });
  });
};

exports.updateAllStatus = (req, res) => {
  const { estatus } = req.body;
  if (!estatus) {
    return res.status(400).json({ mensaje: "El estatus es requerido" });
  }
  Visitantes.updateAllStatus(estatus, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: "Estatus actualizado correctamente" });
  });
};

exports.deleteVisitante = (req, res) => {
  const id = req.params.id;
  Visitantes.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: "Visitante eliminado correctamente" });
  });
};
