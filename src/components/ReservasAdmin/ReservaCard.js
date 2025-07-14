import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


export function ReservaCard({ reserva, actualizarEstadoReserva }) {

    /* Modificar reserva */
    const [mostrarModal, setMostrarModal] = useState(false);
    const [formData, setFormData] = useState({ ...reserva });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const guardarCambios = async () => {
        try {
            const response = await fetch(`http://localhost:3001/visitantes/${reserva.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la reserva');
            }

            const data = await response.json();
            console.log("Reserva actualizada:", data);
            setMostrarModal(false);
            // Puedes llamar aquí a una función para actualizar la lista principal si es necesario

        } catch (error) {
            console.error('Error al guardar cambios:', error);
        }
    };



    /* Para activar el boton */
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
                    <p>👥 {reserva.noVisitantesA} alumnos</p>
                    <p>📅 Fecha: {new Date(reserva.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p>⏰ Horario: {reserva.horario}</p>
                </div>
                <div className="col">
                    <p><b>Dirección:</b> {reserva.direccion}</p>
                    <p><b>Edad de los alumnos:</b> {reserva.edad}</p>
                    <p>🚍 {reserva.autobus ? "Requiere transporte" : "No requiere transporte"}</p>
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
                <p>📞 {reserva.telefono}</p>
                <p>✉️ {reserva.correo}</p>
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setMostrarModal(true)}
                >

                    Modificar Reserva
                </button>
            </div>
            {/* Modal */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-2">
                        <label>Institución:</label>
                        <input type="text" name="institucion" className="uniforme-reservas" value={formData.nombreOrg} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Solicitante:</label>
                        <input type="text" name="solicitante" className="uniforme-reservas" value={formData.nombreSoli} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Teléfono:</label>
                        <input type="tel" name="telefono" className="uniforme-reservas" value={formData.telefono} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Fecha: </label>
                        <input type="date" name="fecha" className="uniforme-reservas" value={formData.fecha} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Horario: </label>
                        <select
                            name="horario" className="uniforme-reservas" value={formData.horario} onChange={handleChange}
                        >
                            <option>01:00</option>
                            <option>03:00</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label>Correo Electronico: </label>
                        <input type="email" name="correo" className="uniforme-reservas" value={formData.correo} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Transporte:</label>
                        <select
                            name="autobus" className="uniforme-reservas" value={formData.autobus} onChange={handleChange}
                        >
                            <option>Si</option>
                            <option>No</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={guardarCambios}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
