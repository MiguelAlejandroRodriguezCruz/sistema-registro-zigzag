// /models/visitantesModel.js
const db = require("../config/db");

const Visitantes = {
  getReservasAprovadas: (callback) => {
    db.query(
      'SELECT * FROM visitantesinstitucion WHERE estatus = "aprobadas"',
      callback,
    );
  },

  getByMes: (mes, anio, callback) => {
    const sql = `
        SELECT * 
        FROM visitantesinstitucion
        WHERE MONTH(fecha) = ? 
        AND YEAR(fecha) = ?
    `;
    db.query(sql, [mes, anio], callback);
  },

  getAllFechasOcupadas: (callback) => {
    db.query(
      'SELECT fecha, horario FROM visitantesinstitucion WHERE estatus = "aprobadas"',
      callback,
    );
  },

  getById: (id, callback) => {
    db.query(
      "SELECT * FROM visitantesinstitucion WHERE id = ?",
      [id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
      },
    );
  },

  create: (data, callback) => {
    const query = `INSERT INTO visitantesinstitucion (
            nombreSoli, nombreOrg, noVisitantesA, noVisitantesD,
            telefono, direccion, colonia, municipio, autobus,
            correo, tipoRecorrido, gradoEscolar, autorizaFotos,
            fecha, horario, medioEnterado, comentarios, precioEntrada, descuento, estatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.nombreSoli,
      data.nombreOrg,
      data.noVisitantesA,
      data.noVisitantesD,
      data.telefono,
      data.direccion,
      data.colonia,
      data.municipio,
      data.autobus,
      data.correo,
      data.tipoRecorrido,
      data.gradoEscolar,
      data.autorizaFotos,
      data.fecha,
      data.horario,
      data.medioEnterado,
      data.comentarios,
      data.precioEntrada,
      data.descuento,
      data.estatus,
    ];

    db.query(query, values, callback);
  },

  update: (id, data, callback) => {
    let query = "UPDATE visitantesinstitucion SET ";
    let values = [];
    let fields = [];

    Object.keys(data).forEach((key) => {
      if (data[key] !== "" && data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) {
      return callback(
        new Error("No se enviaron datos válidos para actualizar"),
      );
    }

    query += fields.join(", ") + " WHERE id = ?";
    values.push(id);

    db.query(query, values, callback);
  },

  updateAllStatus: (estatus, callback) => {
    db.query(
      "UPDATE visitantesinstitucion SET estatus = ?",
      [estatus],
      callback,
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM visitantesinstitucion WHERE id = ?", [id], callback);
  },
};

module.exports = Visitantes;
