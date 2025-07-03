import React, { useState } from "react";
import "../../style/App.css";

const GroupAgeForm = ({ idRegistro, onClose, onShowDatosGuardados }) => {
  const [formData, setFormData] = useState({
    niños5a10: 0,
    niños10a15: 0,
    niños15a18: 0,
    niñas5a10: 0,
    niñas10a15: 0,
    niñas15a18: 0,
    hombres20a30: 0,
    hombres30a40: 0,
    hombres40omas: 0,
    mujeres20a30: 0,
    mujeres30a40: 0,
    mujeres40omas: 0,
    maestros20a30: 0,
    maestros30a40: 0,
    maestros40omas: 0,
  });

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: parseInt(e.target.value || 0),
    });
  };

  const handleGuardar = async () => {
    try {
      const response = await fetch("http://localhost:3001/registro-visitantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idRegistro,  // ← Asegura que se envía este valor
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Error al registrar visitante");

      const result = await response.json();
      console.log("Visita registrada correctamente. ID:", result.idInsertado);
      alert(`Visita registrada correctamente. ID: ${result.idInsertado}`);

      if (onClose) onClose();
      if (onShowDatosGuardados) onShowDatosGuardados();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar los datos.");
    }
  };

  return (
    <div className="container mt-4 border p-3 rounded">
      <div className="d-flex justify-content-between mb-4">
        <span><strong>Niños:</strong> 20</span>
        <span><strong>Niñas:</strong> 20</span>
        <span><strong>Adultos:</strong> 4</span>
      </div>

      <div className="mb-4 border p-3">
        <h5 className="mb-3">Niños</h5>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label>Entre 5 y 10</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("niños5a10")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>Entre 10 y 15</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("niños10a15")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>Entre 15 y 18</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("niños15a18")} />
          </div>
        </div>

        <h5 className="mb-3">Niñas</h5>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label>Entre 5 y 10</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("niñas5a10")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>Entre 10 y 15</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("niñas10a15")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>Entre 15 y 18</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("niñas15a18")} />
          </div>
        </div>

        <h5 className="mb-3">Hombres</h5>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label>Entre 20 y 30</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("hombres20a30")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>Entre 30 y 40</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("hombres30a40")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>40 o mas</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("hombres40omas")} />
          </div>
        </div>

        <h5 className="mb-3">Mujeres</h5>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label>Entre 20 y 30</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("mujeres20a30")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>Entre 30 y 40</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("mujeres30a40")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>40 o mas</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("mujeres40omas")} />
          </div>
        </div>

        <h5 className="mb-3">Maestros</h5>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label>Entre 20 y 30</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("maestros20a30")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>Entre 30 y 40</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("maestros30a40")} />
          </div>
          <div className="col-md-4 mb-2">
            <label>40 o mas</label>
            <input className="form-control" type="number" min="0" step="1" onChange={handleChange("maestros40omas")} />
          </div>
        </div>
      </div>

      {/* Totales y botón */}
      <div className="d-flex justify-content-between mt-4">
        <span><strong>Niños:</strong> $30</span>
        <span><strong>Adultos:</strong> $40</span>
        <span><strong>Maestros:</strong> gratis</span>
      </div>

      <div className="text-end mt-3">
        <button className="btn btn-secondary" onClick={handleGuardar}>Guardar</button>
      </div>
    </div>
  );
};

export default GroupAgeForm;

