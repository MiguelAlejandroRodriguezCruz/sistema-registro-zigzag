import { useState } from "react";

export function ReservaCard({ reserva, actualizarEstadoReserva }) {
    const [botonActivo, setBotonActivo] = useState(null);

    const manejarClick = (estado) => {
        setBotonActivo(estado);
        actualizarEstadoReserva(reserva.id, estado);
    };

    return (
        <div className="card p-3 my-3" style={{ backgroundColor: "#f0f0f0" }}>
            <h5><b>{reserva.institucion}</b> - Solicitante: {reserva.solicitante}</h5>

            <div className="row">
                <div className="col">
                    <p>👥 {reserva.alumnos} alumnos</p>
                    <p>📅 Fecha: {reserva.fecha}</p>
                    <p>⏰ Horario: {reserva.horario}</p>
                </div>
                <div className="col">
                    <p><b>Dirección:</b> {reserva.direccion}</p>
                    <p><b>Edad de los alumnos:</b> {reserva.edad}</p>
                    <p>🚍 {reserva.transporte ? "Requiere transporte" : "No requiere transporte"}</p>
                </div>

                <div className="col d-flex flex-column align-items-end">
                    {(botonActivo === null || botonActivo === "aprobadas") && (
                        <button
                            className="btn btn-lg mb-2"
                            style={{
                                backgroundColor: "#198754",
                                borderColor: "#0f5e3c",
                                color: "white"
                            }}
                            onClick={() => manejarClick("aprobadas")}
                        >
                            ✔
                        </button>
                    )}
                    {(botonActivo === null || botonActivo === "rechazadas") && (
                        <button
                            className="btn btn-lg mb-2"
                            style={{
                                backgroundColor: "#dc3545",
                                borderColor: "#a71d2a",
                                color: "white"
                            }}
                            onClick={() => manejarClick("rechazadas")}
                        >
                            ✖
                        </button>
                    )}
                    {(botonActivo === null || botonActivo === "pendientes") && (
                        <button
                            className="btn btn-lg mb-2"
                            style={{
                                backgroundColor: "#FFE551",
                                borderColor: "#e0c300",
                                color: "black"
                            }}
                            onClick={() => manejarClick("pendientes")}
                        >
                            ⚠
                        </button>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between">
                <p>📞 {reserva.contacto}</p>
                <p>✉️ {reserva.email}</p>
                <button type="button" className="btn btn-outline-primary">
                    Modificar Reserva
                </button>
            </div>
        </div>
    );
}
