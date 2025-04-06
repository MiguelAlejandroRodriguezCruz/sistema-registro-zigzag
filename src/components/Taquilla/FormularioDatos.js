import React from "react";
import "../../style/App.css";

const GroupAgeForm = ({ onClose, onShowDatosGuardados }) => {
  const handleGuardar = () => {
    // Cerrar el modal actual
    if (onClose) onClose();

    // Abrir el modal de confirmación
    if (onShowDatosGuardados) onShowDatosGuardados();
  };

  return (
    <div className="container mt-4 border p-3 rounded">
      <div className="d-flex justify-content-between mb-4">
        <span><strong>Niños:</strong> 20</span>
        <span><strong>Niñas:</strong> 20</span>
        <span><strong>Adultos:</strong> 4</span>
      </div>

      {/* Sección general para generar bloques */}
      {[
        { title: "Niños", ranges: ["Entre 5 y 10", "Entre 10 y 15", "Entre 15 y 18"] },
        { title: "Niñas", ranges: ["Entre 5 y 10", "Entre 10 y 15", "Entre 15 y 18"] },
        { title: "Adultos hombres", ranges: ["Entre 20 y 30", "Entre 30 y 40", "Entre 40 o más"] },
        { title: "Adultos mujeres", ranges: ["Entre 20 y 30", "Entre 30 y 40", "Entre 40 o más"] },
        { title: "Maestros", ranges: ["Entre 20 y 30", "Entre 30 y 40", "Entre 40 o más"] },
      ].map((group, i) => (
        <div className="mb-4 border p-3" key={i}>
          <h5 className="mb-3">{group.title}</h5>
          <div className="row">
            {group.ranges.map((range, j) => (
              <div className="col-md-4 mb-2" key={j}>
                <label>{range}</label>
                <input className="form-control" type="number" />
              </div>
            ))}
          </div>
        </div>
      ))}

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

