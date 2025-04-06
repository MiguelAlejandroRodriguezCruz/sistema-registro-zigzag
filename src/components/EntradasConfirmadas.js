import React from "react";
import "../style/App.css";

const EntradasConfirmadas = ({ onClose, onProcesar }) => {

    return (
        <div className="container p-4 border custom-green text-center">
          <h3 className="text-danger">Entradas confirmadas</h3>
          <p><strong>Niños:</strong> 10</p>
          <p><strong>Adultos:</strong> 4</p>
          <p><strong>Adultos mayores:</strong> 10</p>
          <div className="d-flex justify-content-between">
            <p><strong>Fecha:</strong> 12-05-2025</p>
            <p><strong>Hora:</strong> 12:00 PM</p>
          </div>
          <button className="btn btn-danger mt-2" onClick={onProcesar}>Procesar entradas</button>
          <button className="btn btn-secondary mt-2" onClick={onClose}>Cerrar</button>
        </div>
      );
  };
  
export default EntradasConfirmadas;