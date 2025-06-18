import { useEffect, useState } from 'react';
import ReservasEncabezado from './ReservasAdmin/ReservasEncabezado';
import { ReservasTabs } from './ReservasAdmin/ReservasTabs';
import { ReservasLista } from './ReservasAdmin/ReservasLista';
import { Comp_encabezado } from './Comp_encabezado';
import { Comp_Pie_pagina } from './Comp_Pie_pagina';





function ReservasGenerales() {
    const [reservas, setReservas] = useState([]);
    const [pestanaActiva, setPestanaActiva] = useState("nuevo");

    // Cargar reservas desde el backend
    useEffect(() => {
        fetch('http://localhost:3001/visitantes')
            .then(response => response.json())
            .then(data => {
                setReservas(data);
            })
            .catch(error => {
                console.error("Error al cargar reservas:", error);
            });
    }, []);

    const actualizarEstadoReserva = (id, nuevoEstado) => {
        fetch(`http://localhost:3001/visitantes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estatus: nuevoEstado }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el estatus");
                }
                // Actualizamos el estado local solo si el backend responde correctamente
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
        // Enviar petición PUT para actualizar el estatus de todas las reservas a "nuevo"
        fetch('http://localhost:3001/visitantes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estatus: "nuevo" }),  // Establecer el estatus de todas las reservas como "nuevo"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el estatus de todas las reservas");
                }
                // Si la actualización es exitosa, actualizamos el estado local
                setReservas(prev => prev.map(reserva => ({ ...reserva, estatus: "nuevo" })));
            })
            .catch(error => {
                console.error("Error en resetearReservas:", error);
            });
    };



    const reservasFiltradas = reservas.filter(r => r.estatus === pestanaActiva);


    return (
        <div className='flex-column min-vh-100 bg-light mt-4'>
            <Comp_encabezado/>
            <div className="row">
                    <div className="col text-center bg-danger py-2">
                        <h1 className="text-white m-0">Solicitud de Reservas</h1>
                    </div>
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
