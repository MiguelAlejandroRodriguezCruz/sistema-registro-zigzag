import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../style/CalendarioOcupado.css"


const CalendarioOcupado = () => {
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
                        f.setHours(0, 0, 0, 0);
                        return f;
                    });

                setFechasOcupadas(ocupadas);
            })
            .catch(err => console.error("Error al cargar fechas ocupadas:", err));
    }, []);

    const estaOcupada = (date) =>
        fechasOcupadas.some(
            (f) =>
                f.getFullYear() === date.getFullYear() &&
                f.getMonth() === date.getMonth() &&
                f.getDate() === date.getDate()
        );

    const fechaMaxima = new Date();
    fechaMaxima.setMonth(fechaMaxima.getMonth() + 6);

    return (
        <div className="calendario-admin w-100 mt-4 px-5">
            <Calendar
                minDate={new Date()}
                maxDate={fechaMaxima}
                tileClassName={({ date, view }) => {
                    if (view === "month" && estaOcupada(date)) {
                        return "ocupada-verde";
                    }

                    // Sábado = 6, Domingo = 0
                    const dia = date.getDay();
                    if (dia === 0 || dia === 6) {
                        return "fin-de-semana";
                    }
                    return null;
                }}


                className="border p-2 rounded"
                locale="es-ES"

                
            
            />
        </div>
    );
};

export default CalendarioOcupado;
