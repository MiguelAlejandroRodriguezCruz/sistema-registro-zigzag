import { ReservaCard } from "./ReservaCard";
import CalendarioFechasOcupadas from "../CalendarioFechasOcupadas"; // o el nombre de tu componente de calendario
import Estadistica from "./Estadistica"


export function ReservasLista({ reservas, pestanaActiva, actualizarEstadoReserva }) {

    const reservasFiltradas = pestanaActiva !== "estadistica"
        ? reservas.filter(reserva => reserva.estatus === pestanaActiva)
        : [];

         // Si está activa la pestaña de estadísticas, mostrar solo ese componente
            if (pestanaActiva === "estadistica") {
                return (
                    <div className="mt-4">
                        <h4 className="mb-3">Estadísticas generales</h4>
                        <Estadistica reservas={reservas} />
                    </div>
                );
            }


    return (
        <>
            {/* Mostrar calendario solo si estamos en las aprobadas */}
            {pestanaActiva === "aprobadas" && (
                <div className=" mt-4 ">
                    <h4>Fechas ocupadas del calendario</h4>
                    <div className="calendario-admin">
                        <CalendarioFechasOcupadas/>
                    </div>
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
