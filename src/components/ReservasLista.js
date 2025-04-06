import { ReservaCard } from "./ReservaCard";

export function ReservasLista({ reservas, pestanaActiva, actualizarEstadoReserva }) {
    const reservasFiltradas = reservas.filter(reserva => reserva.estado === pestanaActiva);

    return (
        <>
            {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map(reserva => (
                    <ReservaCard
                        key={reserva.id}
                        reserva={reserva}
                        actualizarEstadoReserva={actualizarEstadoReserva}
                    />
                ))
            ) : (
                <p>No hay reservas en esta categoría.</p>
            )}
        </>
    );
}
