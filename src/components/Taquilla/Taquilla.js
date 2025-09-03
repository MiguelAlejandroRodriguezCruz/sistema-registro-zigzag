import React, { useState, useEffect } from "react";
import "../../style/App.css";
import EntradasConfirmadas from "./EntradasConfirmadas";
import FormularioDatos from "./FormularioDatos";
import DatosGuardados from "./DatosGuardados";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";
import { API_BASE_URL } from "../../config/api";

const Taquilla = () => {
  const [showEntradasConfirmadas, setEntradasConfirmadas] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [showDatosGuardados, setShowDatosGuardados] = useState(false);
  const [records, setRecords] = useState([]); // State para almacenar las reservas filtradas
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    // Hacer la solicitud GET para obtener los registros de la API
    fetch(`${API_BASE_URL}/visitantes`) // Ajusta la URL de la API si es necesario
      .then((response) => response.json())
      .then((data) => {
        // Filtrar los registros donde el estatus es "aprobadas"
        const aprobadas = data.filter((registro) => registro.estatus === "aprobadas");
        setRecords(aprobadas); // Actualizar el estado con los registros filtrados
      })
      .catch((error) => {
        console.error("Error al cargar los registros:", error);
      });
  }, [reloadCounter]);

  const handleRowClick = (record) => {
  setRegistroSeleccionado(record.id);
  setShowFormulario(true);
};

  const handleProcesarEntradas = () => {
    setEntradasConfirmadas(false);
    setShowFormulario(true);
  };

  const handleGuardarFormulario = () => {
    setShowFormulario(false);
    setShowDatosGuardados(true);
  };

  // Función para recargar los datos cuando se cierra el modal
  const handleCerrarDatosGuardados = () => {
    setShowDatosGuardados(false);
    setReloadCounter(prev => prev + 1); // Incrementa el contador para forzar recarga
  };

  return (
    <div className="mt-4">
      <Comp_encabezado/>
      
      <div className="row">
          <div className="col text-center bg-danger py-2">
              <h1 className="text-white m-0">Registros de visita</h1>
          </div>
      </div>

      <div className="container p-4">
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
              <tr key={index} style={{ cursor: "pointer" }} onClick={() => handleRowClick(record)}>
                <td>{new Date(record.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                <td>{record.horario}</td>
                <td>{record.nombreOrg}</td>
                <td>{record.nombreSoli}</td>
                <td>{record.noVisitantesA}</td>
                <td>{record.noVisitantesD}</td>
                <td>{record.descuento}</td>
                <td>{record.precioEntrada}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/*<div className="mt-5 text-center">
          <button className="btn custom-green" onClick={() => setEntradasConfirmadas(true)}>Validar Entradas</button>
        </div>*/}
      </div>

      {/* Modal: EntradasConfirmadas */}
      {/*showEntradasConfirmadas && (
        <div className="modal-overlay d-flex justify-content-center align-items-center">
          <div className="modal-content-custom p-4 bg-white rounded shadow">
            <EntradasConfirmadas onClose={() => setEntradasConfirmadas(false)} onProcesar={handleProcesarEntradas} />
          </div>
        </div>
      )*/}

      {/* Modal: FormularioDatos */}
      {showFormulario && (
      <div className="modal-overlay d-flex justify-content-center align-items-center">
        <div className="modal-content-custom">
          <FormularioDatos
            idRegistro={registroSeleccionado} // Solo el ID numérico
            onClose={() => setShowFormulario(false)}
            onShowDatosGuardados={handleGuardarFormulario}
          />
        </div>
      </div>
      )}

      {/* Modal: DatosGuardados*/}
      {showDatosGuardados && (
        <div className="modal-overlay">
          <div className="modal-content-custom">
            <DatosGuardados onClose={(handleCerrarDatosGuardados)} />
          </div>
        </div>
      )}

      <Comp_Pie_pagina/>
    </div>
  );
};

export default Taquilla;