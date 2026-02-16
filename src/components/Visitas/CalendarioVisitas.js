import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { API_BASE_URL } from "../../config/api";

const CalendarioVisitas = ({ onFechaFijada }) => {
    const [fecha, setFecha] = useState(new Date());
    const [fechaFijada, setFechaFijada] = useState(null);
    
    // Almacenará un objeto: { "2024-02-16": ["10:00", "01:00"], ... }
    const [mapaOcupacion, setMapaOcupacion] = useState({}); 

    // Definimos los horarios totales disponibles para saber cuándo un día está "Lleno"
    const HORARIOS_TOTALES = ["10:00", "01:00", "03:00"];

    // Función auxiliar para formatear fecha local a string YYYY-MM-DD
    // Esto evita problemas de zona horaria al comparar
    const formatearFechaKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/visitantes/fechasOcupadas`)
            .then(res => res.json())
            .then(data => {
                const nuevoMapa = {};

                data.forEach(item => {
                    // Crear fecha ajustando la zona horaria o tomando la parte de fecha
                    // Asumimos que la BD devuelve fecha en formato ISO o string compatible
                    const fechaObj = new Date(item.fecha); 
                    // Ajuste para evitar desfases de horario si vienen en UTC
                    // Una técnica segura es usar getUTCDate si la BD guarda en UTC
                    // O simplemente sumar el offset. Para simplificar, usaremos el string local:
                    
                    // IMPORTANTE: Asegúrate de que item.fecha se interprete correctamente.
                    // A veces es mejor hacer: new Date(item.fecha.substring(0, 10) + 'T00:00:00')
                    
                    const fechaKey = formatearFechaKey(fechaObj);
                    
                    if (!nuevoMapa[fechaKey]) {
                        nuevoMapa[fechaKey] = [];
                    }
                    // Agregamos el horario a ese día
                    if(item.horario) {
                        nuevoMapa[fechaKey].push(item.horario); 
                    }
                });

                setMapaOcupacion(nuevoMapa);
            })
            .catch(err => {
                console.error("Error al cargar fechas ocupadas:", err);
            });
    }, []);

    const fechaMaxima = new Date();
    fechaMaxima.setMonth(fechaMaxima.getMonth() + 6);

    // Un día está TOTALMENTE ocupado si tiene registrados los 3 horarios
    const estaTotalmenteOcupada = (date) => {
        const key = formatearFechaKey(date);
        const horariosOcupados = mapaOcupacion[key] || [];
        // Verificamos si tiene 3 o más horarios ocupados (o si contiene todos los posibles)
        return horariosOcupados.length >= HORARIOS_TOTALES.length;
    };

    const esFinDeSemana = (date) => {
        const day = date.getDay();
        return day === 0 || day === 1; // Domingo o Lunes (ajusta según tu lógica)
    };

    const manejarFijarFecha = () => {
        setFechaFijada(fecha);
        
        // Obtenemos los horarios ocupados de la fecha seleccionada
        const key = formatearFechaKey(fecha);
        const horariosBloqueados = mapaOcupacion[key] || [];

        // Enviamos al padre la FECHA y los HORARIOS OCUPADOS de esa fecha
        onFechaFijada(fecha, horariosBloqueados);
    };

    return (
        <div className="container-fluid my-5 px-4 py-4 rounded ">
             <div className="row align-items-start mb-4">
                <div className="col-md-6">
                    <p style={{ fontSize: "24px" }}>
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
                                    if (estaTotalmenteOcupada(date)) return "ocupada"; // CSS clase para rojo
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
                                estaTotalmenteOcupada(date) || esFinDeSemana(date)
                            }
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