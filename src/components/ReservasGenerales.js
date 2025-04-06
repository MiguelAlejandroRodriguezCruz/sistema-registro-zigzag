import { useEffect, useState } from 'react';
import ReservasEncabezado from './ReservasEncabezado';
import { ReservasTabs } from './ReservasTabs';
import { ReservasLista } from './ReservasLista';

// Simulación de datos base
const reservasOriginales = [
    {
        id: 1,
        institucion: "Colegio A",
        solicitante: "Juan Pérez",
        alumnos: 25,
        fecha: "2025-04-15",
        horario: "10:00 - 12:00",
        direccion: "Calle Falsa 123",
        edad: "8-10",
        transporte: true,
        contacto: "123456789",
        email: "juan@colegioa.com",
        estado: "nuevas"
    },
    {
        id: 2,
        institucion: "Escuela B",
        solicitante: "Ana López",
        alumnos: 30,
        fecha: "2025-04-20",
        horario: "13:00 - 15:00",
        direccion: "Av. Siempre Viva 742",
        edad: "10-12",
        transporte: false,
        contacto: "987654321",
        email: "ana@escuelab.com",
        estado: "nuevas"
    },
    {
        id: 4,
        institucion: "Colegio Es",
        solicitante: "Juan Pérez",
        alumnos: 25,
        fecha: "2025-04-15",
        horario: "10:00 - 12:00",
        direccion: "Calle Falsa 123",
        edad: "8-10",
        transporte: true,
        contacto: "123456789",
        email: "juan@colegioa.com",
        estado: "nuevas"
    },
    {
        id: 5,
        institucion: "Colegio D",
        solicitante: "Juan Pérez",
        alumnos: 25,
        fecha: "2025-04-15",
        horario: "10:00 - 12:00",
        direccion: "Calle Falsa 123",
        edad: "8-10",
        transporte: true,
        contacto: "123456789",
        email: "juan@colegioa.com",
        estado: "nuevas"
    }
];



function ReservasGenerales() {
    const [reservas, setReservas] = useState([]);
    const [pestanaActiva, setPestanaActiva] = useState("pendientes");

    // Cargar desde localStorage o usar las originales
    useEffect(() => {
        const reservasCargadas = reservasOriginales.map(r => {
            const guardada = localStorage.getItem(`reserva-${r.id}`);
            return guardada ? JSON.parse(guardada) : r;
        });
        setReservas(reservasCargadas);
    }, []);

    const actualizarEstadoReserva = (id, nuevoEstado) => {
        const nuevasReservas = reservas.map(reserva =>
            reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
        );

        // Guardar en localStorage
        const actualizada = nuevasReservas.find(r => r.id === id);
        localStorage.setItem(`reserva-${id}`, JSON.stringify(actualizada));

        setReservas(nuevasReservas);
    };

    const resetearReservas = () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("reserva-")) {
                localStorage.removeItem(key);
            }
        });
        setReservas(reservasOriginales);
    };

    const reservasFiltradas = reservas.filter(r => r.estado === pestanaActiva);


    return (
        <div>
            <ReservasEncabezado />
            <div className="p-2">
                <ReservasTabs pestanaActiva={pestanaActiva} setPestanaActiva={setPestanaActiva} />
                <ReservasLista
                    reservas={reservas}
                    pestanaActiva={pestanaActiva}
                    actualizarEstadoReserva={actualizarEstadoReserva}
                />
            </div>
            <button
                className="btn btn-danger my-3"
                onClick={resetearReservas}
            >
                🗑 Resetear todas las reservas
            </button>
        </div>
    );
}

export default ReservasGenerales;
