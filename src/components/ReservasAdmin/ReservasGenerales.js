import { useEffect, useState } from 'react';
import { ReservasTabs } from './ReservasTabs';
import { ReservasLista } from './ReservasLista';
import { Comp_encabezado } from '../Comp/Comp_encabezado';
import { Comp_Pie_pagina } from '../Comp/Comp_Pie_pagina';
import { API_BASE_URL } from "../../config/api";

function ReservasGenerales() {
    const [reservas, setReservas] = useState([]);
    const [pestanaActiva, setPestanaActiva] = useState("nuevo");

    // Cargar reservas desde el backend
    useEffect(() => {
        const token = localStorage.getItem("tokenAdmin");

        fetch(`${API_BASE_URL}/visitantes`, {
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
            setReservas(data);
            })
            .catch(error => {
            console.error("Error al cargar reservas:", error);
            });
        }, []);


        const actualizarEstadoReserva = (id, nuevoEstado) => {
        const token = localStorage.getItem("tokenAdmin");

        fetch(`${API_BASE_URL}/visitantes/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ estatus: nuevoEstado })
        })
            .then(response => {
            if (!response.ok) {
                throw new Error("Error al actualizar el estatus");
            }
            setReservas(prev =>
                prev.map(reserva =>
                reserva.id === id ? { ...reserva, estatus: nuevoEstado } : reserva
                )
            );
            })
            .catch(error => {
            console.error("Error en actualizarEstadoReserva:", error);
            });
        };


        const resetearReservas = () => {
        const token = localStorage.getItem("tokenAdmin");

        fetch(`${API_BASE_URL}/visitantes`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ estatus: "nuevo" })
        })
            .then(response => {
            if (!response.ok) {
                throw new Error("Error al actualizar el estatus de todas las reservas");
            }
            setReservas(prev =>
                prev.map(reserva => ({ ...reserva, estatus: "nuevo" }))
            );
            })
            .catch(error => {
            console.error("Error en resetearReservas:", error);
            });
        };


    const reservasFiltradas = reservas.filter(r => r.estatus === pestanaActiva);


    return (
        <div className='flex-column min-vh-100 bg-light mt-4'>
            <Comp_encabezado/>
            <div className="mt-4">
                    <header className="eventos-header bg-danger">
                        <h1 className="text-white m-0">Solicitud de Reservas</h1>
                        <a href="/lista-eventos" className="reservas-link">Eventos</a>
                    </header>
            </div>
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
            <Comp_Pie_pagina/>
        </div>
    );
}

export default ReservasGenerales;
