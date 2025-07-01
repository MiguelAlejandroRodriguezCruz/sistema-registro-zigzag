import { ReservaCard } from "./ReservaCard";
import CalendarioFechasOcupadas from "../CalendarioFechasOcupadas"; // o el nombre de tu componente de calendario

export function ReservasLista({ reservas, pestanaActiva, actualizarEstadoReserva }) {
    const reservasFiltradas = reservas.filter(reserva => reserva.estatus === pestanaActiva);

    return (
        <>
            {/* Mostrar calendario solo si estamos en las aprobadas */}
            {pestanaActiva === "aprobadas" && (
                <div className="mt-4">
                    <h4>Fechas ocupadas del calendario</h4>
                    <CalendarioFechasOcupadas />
                </div>
            )}
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
