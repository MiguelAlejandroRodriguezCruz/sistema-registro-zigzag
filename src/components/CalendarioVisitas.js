import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarioVisitas = ({ onFechaFijada }) => {
    const [fecha, setFecha] = useState(new Date());
    const [fechaFijada, setFechaFijada] = useState(null);
    const [fechasOcupadas, setFechasOcupadas] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/visitantes")
            .then(res => res.json())
            .then(data => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                const ocupadas = data
                    .filter(r => r.estatus === "aprobadas" && new Date(r.fecha) >= hoy)
                    .map(r => {
                        const f = new Date(r.fecha);
                        f.setHours(0, 0, 0, 0); // Normalizar
                        return f;
                    });

                setFechasOcupadas(ocupadas);
            })
            .catch(err => {
                console.error("Error al cargar fechas ocupadas:", err);
            });
    }, []);

    const fechaMaxima = new Date();
    fechaMaxima.setMonth(fechaMaxima.getMonth() + 6);

    const estaOcupada = (date) =>
        fechasOcupadas.some(
            (f) =>
                f.getFullYear() === date.getFullYear() &&
                f.getMonth() === date.getMonth() &&
                f.getDate() === date.getDate()
        );

    const esFinDeSemana = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const manejarFijarFecha = () => {
        setFechaFijada(fecha);
        onFechaFijada(fecha);
    };

    return (
        <div className="row align-items-start mb-4">
            <div className="col-md-6">
                <p style={{ fontSize: "28px" }}>
                    ¡Agenda tu próxima visita al museo! <br />
                    Selecciona en el calendario la fecha tentativa de tu visita.
                </p>
                <button
                    className="btn btn-danger w-40 mb-3"
                    onClick={manejarFijarFecha}
                >
                    FIJAR FECHA
                </button>
            </div>

            <div className="col-md-6 d-flex justify-content-center">
                <div style={{ transform: "scale(1.2)" }}>
                    <Calendar
                        onChange={setFecha}
                        value={fecha}
                        minDate={new Date()}
                        maxDate={fechaMaxima}
                        tileClassName={({ date, view }) => {
                            if (view === "month") {
                                if (estaOcupada(date)) return "ocupada";
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
                        tileDisabled={({ date }) =>
                            estaOcupada(date) || esFinDeSemana(date)
                        }
                        className="border p-2 rounded"
                        locale="es-ES"
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarioVisitas;
