import React from "react";
"../../style/App.css";
import exito from "../images/exito.png";

const SuccessMessage = ({ onClose }) => {
  return (
    <div className="modal-overlay d-flex align-items-center justify-content-center">
      <div className="container p-4 border custom-green text-center align-items-center modal-content">
        <h3 className="text-danger mb-4">Datos guardados correctamente</h3>
        <img src={exito} alt="Éxito" style={{ width: "60px", height: "60px", marginBottom: "20px" }}
        />
        <div>
          <button className="btn btn-danger px-4" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
