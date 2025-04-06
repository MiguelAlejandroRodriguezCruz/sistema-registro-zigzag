import React, { useState } from "react";
import "../style/App.css";
import logo from "../images/zig_zag_logo.png";
import EntradasConfirmadas from "./EntradasConfirmadas";
import FormularioDatos from "./FormularioDatos";

const Taquilla = () => {
  const [showEntradasConfirmadas, setEntradasConfirmadas] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [showDatosGuardados, setShowDatosGuardados] = useState(false);

  const records = [
    { fecha: "2022-01-23", hora: "11:00 AM", institucion: "ejemplo", encargado: "Enrique", ninos: 1, adultos: 2, descuento: "10%", precio: "$" },
    { fecha: "2022-01-09", hora: "02:00 PM", institucion: "ejemplo", encargado: "Jose", ninos: 3, adultos: 4, descuento: "15%", precio: "$" },
    { fecha: "2022-02-11", hora: "05:00 PM", institucion: "ejemplo", encargado: "Manuel", ninos: 5, adultos: 6, descuento: "20%", precio: "$" },
  ];

  const handleProcesarEntradas = () => {
    setEntradasConfirmadas(false);
    setShowFormulario(true);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex align-items-center justify-content-between p-2 mb-5 custom-yellow w-100">
        <img src={logo} alt="Logo" className="me-6" style={{ width: "150px", height: "40px" }} />
        <h2 className="fw-bold text-center flex-grow-1 m-0">Registros de visita</h2>
      </div>
      <div className="container">
        <table className="table table-striped table-bordered table-hover text-center mb-5">
          <thead>
            <tr>
              <th className="custom-green">Fecha</th>
              <th className="custom-green">Hora</th>
              <th className="custom-green">Institución</th>
              <th className="custom-green">Encargado</th>
              <th className="custom-green">Niños</th>
              <th className="custom-green">Adultos</th>
              <th className="custom-green">Descuento</th>
              <th className="custom-green">Precio</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.fecha}</td>
                <td>{record.hora}</td>
                <td>{record.institucion}</td>
                <td>{record.encargado}</td>
                <td>{record.ninos}</td>
                <td>{record.adultos}</td>
                <td>{record.descuento}</td>
                <td>{record.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 text-center">
          <button className="btn custom-green" onClick={() => setEntradasConfirmadas(true)}>Validar Entradas</button>
        </div>
      </div>

      {/* Modal: EntradasConfirmadas */}
      {showEntradasConfirmadas && (
        <div className="modal-overlay d-flex justify-content-center align-items-center">
          <div className="modal-content-custom p-4 bg-white rounded shadow">
            <EntradasConfirmadas onClose={() => setEntradasConfirmadas(false)} onProcesar={handleProcesarEntradas} />
          </div>
        </div>
      )}

      {/* Modal: FormularioDatos */}
      {showFormulario && (
        <div className="modal-overlay d-flex justify-content-center align-items-center">
          <div className="modal-content-custom">
            <FormularioDatos onClose={() => setShowFormulario(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Taquilla;
