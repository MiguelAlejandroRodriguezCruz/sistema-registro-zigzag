export function ReservasTabs({ pestanaActiva, setPestanaActiva }) {
    return (
        <div>
            <div className="btn-group mb-3">
                <button
                    className={`btn ${pestanaActiva === "nuevo" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setPestanaActiva("nuevo")}
                >
                    Reservas Nuevas
                </button>
                <button
                    className={`btn ${pestanaActiva === "pendientes" ? "btn-warning" : "btn-outline-warning"}`}
                    onClick={() => setPestanaActiva("pendientes")}
                >
                    Reservas Pendientes
                </button>
                <button
                    className={`btn ${pestanaActiva === "aprobadas" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setPestanaActiva("aprobadas")}
                >
                    Reservas Aceptadas
                </button>
                <button
                    className={`btn ${pestanaActiva === "rechazadas" ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => setPestanaActiva("rechazadas")}
                >
                    Reservas Rechazadas
                </button>
                <button
                    className={`btn ${pestanaActiva === "estadistica" ? "btn-secondary" : " btn-outline-secondary"}`}
                    onClick={() => setPestanaActiva("estadistica")}
                >
                    Estadisticas
                </button>
            </div>
        </div>
    );
}
