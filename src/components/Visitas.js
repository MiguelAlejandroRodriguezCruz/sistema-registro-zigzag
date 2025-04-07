import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const FormularioVisitas = () => {
  const [fecha, setFecha] = useState(new Date());

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold">VISITAS</h2>

      {/* Fila para texto + botón + calendario */}
      <div className="row align-items-start mb-4">
        {/* Texto y botón a la izquierda */}
        <div className="col-md-6">
          <p>
            ¡Agenda tu próxima visita al museo! <br />
            Selecciona en el calendario la fecha tentativa de tu visita.
          </p>
          <button className="btn btn-danger w-40 mb-3">FIJAR FECHA</button>
        </div>

        {/* Calendario a la derecha */}
        <div className="col-md-6 d-flex justify-content-center">
          <div style={{ transform: "scale(1.2)" }}>
            <Calendar
              onChange={setFecha}
              value={fecha}
              className="border p-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* Formulario abajo */}
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Nombre del solicitante</label>
          <input type="text" className="form-control mb-2" />
          <label className="form-label">Nombre de la escuela/organización</label>
          <input type="text" className="form-control mb-2" />
          <label className="form-label">No. de visitantes (alumnos)</label>
          <input type="number" className="form-control mb-2" />
          <label className="form-label">No. de visitantes (docentes)</label>
          <input type="number" className="form-control mb-2" />
          <label className="form-label">Teléfono</label>
          <input type="tel" className="form-control mb-2" />
        </div>

        <div className="col-md-6">
          <label className="form-label">Municipio</label>
          <input type="text" className="form-control mb-2" />
          <label className="form-label">Correo Electrónico</label>
          <input type="email" className="form-control mb-2" />
          <label className="form-label">Tipo de recorrido requerido</label>
          <select className="form-select mb-2">
            <option>Seleccionar</option>
          </select>
          <label className="form-label">Horario disponible</label>
          <select className="form-select mb-2">
            <option>Seleccionar</option>
          </select>
          <button className="btn btn-danger w-40 mt-2">ENVIAR</button>
        </div>
      </div>
    </div>
  );
};

export default FormularioVisitas;
