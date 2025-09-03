import React, { useState } from "react";
import "../../style/App.css";
import { API_BASE_URL } from "../../config/api";

const GroupAgeForm = ({ idRegistro, onClose, onShowDatosGuardados }) => {
  const [rows, setRows] = useState([
    { tipo: "Niño", rango: "5-10", cantidad: 0 },
    { tipo: "Niño", rango: "10-15", cantidad: 0 },
    { tipo: "Niño", rango: "15-18", cantidad: 0 },
    { tipo: "Niña", rango: "5-10", cantidad: 0 },
    { tipo: "Niña", rango: "10-15", cantidad: 0 },
    { tipo: "Niña", rango: "15-18", cantidad: 0 },
    { tipo: "Hombre", rango: "20-30", cantidad: 0 },
    { tipo: "Hombre", rango: "30-40", cantidad: 0 },
    { tipo: "Hombre", rango: "40+", cantidad: 0 },
    { tipo: "Mujer", rango: "20-30", cantidad: 0 },
    { tipo: "Mujer", rango: "30-40", cantidad: 0 },
    { tipo: "Mujer", rango: "40+", cantidad: 0 },
    { tipo: "Maestro", rango: "20-30", cantidad: 0 },
    { tipo: "Maestro", rango: "30-40", cantidad: 0 },
    { tipo: "Maestro", rango: "40+", cantidad: 0 },
  ]);

  const handleChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].cantidad = parseInt(value) || 0;
    setRows(newRows);
  };

  const handleGuardar = async () => {
    try {
      // Filtrar solo las filas con cantidad > 0
      const datosEnviar = rows.filter(row => row.cantidad > 0);
      
      const response = await fetch(`${API_BASE_URL}/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idRegistro,
          visitantes: datosEnviar
        }),
      });

      if (!response.ok) throw new Error("Error al registrar visitante");

      const result = await response.json();
      console.log('Visita registrada correctamente');

      if (onClose) onClose();
      if (onShowDatosGuardados) onShowDatosGuardados();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar los datos.");
    }
  };

  // Agrupar por tipo para mostrar en secciones
  const grupos = rows.reduce((acc, row) => {
    if (!acc[row.tipo]) acc[row.tipo] = [];
    acc[row.tipo].push(row);
    return acc;
  }, {});

  return (
    <div className="container mt-4 border p-3 rounded">
      <div className="mb-4 border p-3">
        {Object.entries(grupos).map(([tipo, filas], tipoIndex) => (
          <div key={tipoIndex}>
            <h5 className="mb-3">{tipo}</h5>
            <div className="row">
              {filas.map((fila, filaIndex) => {
                const indexGlobal = rows.indexOf(fila);
                return (
                  <div className="col-md-4 mb-2" key={filaIndex}>
                    <label>{fila.rango}</label>
                    <input 
                      className="form-control" 
                      type="number" 
                      min="0" 
                      step="1" 
                      value={fila.cantidad}
                      onChange={(e) => handleChange(indexGlobal, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-4">
        <span><strong>Niños:</strong> $30</span>
        <span><strong>Adultos:</strong> $40</span>
        <span><strong>Maestros:</strong> gratis</span>
      </div>
<div className="d-flex justify-content-between mt-3">
  <button className="btn btn-danger" onClick={onClose}>Cancelar</button>
  <button className="btn btn-secondary" onClick={handleGuardar}>Guardar</button>
</div>

    </div>
  );
};

export default GroupAgeForm;