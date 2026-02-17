import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { API_BASE_URL } from "../../config/api";

const CalendarioVisitas = ({ onFechaFijada }) => {
  function obtenerSiguienteDiaHabil() {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0); // ← clave

    fecha.setDate(fecha.getDate() + 1);

    while (fecha.getDay() === 0 || fecha.getDay() === 1) {
      fecha.setDate(fecha.getDate() + 1);
    }

    return fecha;
  }

  const siguienteDiaHabil = React.useMemo(() => obtenerSiguienteDiaHabil(), []);

  const [fecha, setFecha] = useState(siguienteDiaHabil);
  const [fechaFijada, setFechaFijada] = useState(siguienteDiaHabil);

  const [mapaOcupacion, setMapaOcupacion] = useState({});

  const HORARIOS_TOTALES = ["10:00", "01:00", "03:00"];

  const formatearFechaKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/visitantes/fechasOcupadas`)
      .then((res) => res.json())
      .then((data) => {
        const nuevoMapa = {};
        data.forEach((item) => {
          const fechaObj = new Date(item.fecha);
          const fechaKey = formatearFechaKey(fechaObj);

          if (!nuevoMapa[fechaKey]) {
            nuevoMapa[fechaKey] = [];
          }
          if (item.horario) {
            nuevoMapa[fechaKey].push(item.horario);
          }
        });
        setMapaOcupacion(nuevoMapa);
      })
      .catch((err) => console.error("Error al cargar fechas ocupadas:", err));
  }, []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const fechaMaxima = new Date();
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 6);

  const estaTotalmenteOcupada = (date) => {
    const key = formatearFechaKey(date);
    const horariosOcupados = mapaOcupacion[key] || [];
    return horariosOcupados.length >= HORARIOS_TOTALES.length;
  };

  const esFinDeSemana = (date) => {
    const day = date.getDay();
    return day === 0 || day === 1;
  };

  const manejarCambioFecha = (nuevaFecha) => {
    setFecha(nuevaFecha);
    setFechaFijada(nuevaFecha);

    const key = formatearFechaKey(nuevaFecha);
    const horariosBloqueados = mapaOcupacion[key] || [];

    onFechaFijada(nuevaFecha, horariosBloqueados);
  };

  return (
    <div className="container-fluid my-5 px-4 py-4 rounded ">
      <div className="row align-items-start mb-4">
        <div className="col-md-6">
          <p style={{ fontSize: "24px", maxWidth: "400px" }}>
            ¡Agenda tu próxima visita al museo! <br />
            Selecciona en el calendario la fecha tentativa de tu visita.
          </p>
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          <div style={{ transform: "scale(1.2)" }}>
            <Calendar
              onChange={manejarCambioFecha}
              value={fecha}
              minDate={siguienteDiaHabil}
              maxDate={fechaMaxima}
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  if (estaTotalmenteOcupada(date)) return "ocupada";
                  if (
                    fechaFijada &&
                    date.toDateString() === fechaFijada.toDateString()
                  )
                    return "fijada";
                  if (date.toDateString() === fecha.toDateString())
                    return "seleccionada";
                  if (esFinDeSemana(date)) return "fin-de-semana";
                }
                return null;
              }}
              tileDisabled={({ date }) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);

                return (
                  estaTotalmenteOcupada(d) ||
                  esFinDeSemana(d) ||
                  d < siguienteDiaHabil
                );
              }}
              className="border p-2 rounded"
              locale="es-ES"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioVisitas;
