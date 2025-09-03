// ReservaCard.jsx
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { API_BASE_URL } from "../../config/api";

export function ReservaCard({ reserva, actualizarEstadoReserva, onReservaActualizada }) {
  /* Modal y formData */
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (reserva) {
      setFormData({
        ...reserva,
        fecha: formatDateForInput(reserva.fecha),
      });
    }
  }, [reserva]);

  const formatDateForInput = (fecha) => {
    if (!fecha) return "";
    if (typeof fecha === "string") {
      if (fecha.includes("T")) return fecha.split("T")[0];
      return fecha;
    }
    try {
      return new Date(fecha).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* Guardar cambios en la base */
  const guardarCambios = async () => {
    try {
      const payload = { ...formData };

      const response = await fetch(`${API_BASE_URL}/visitantes/${reserva.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(`Error al actualizar la reserva: ${response.status} ${text || ""}`);
      }

      const data = await response.json();
      console.log("Reserva actualizada:", data);

      setMostrarModal(false);

      if (typeof onReservaActualizada === "function") {
        onReservaActualizada(data);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar cambios. Revisa la consola.");
    }
  };

  /* Para activar el boton */
  const [botonActivo, setBotonActivo] = useState(null);

  const manejarClick = (estado) => {
    setBotonActivo(estado);
    actualizarEstadoReserva(reserva.id, estado);
  };

  // Helper para que los inputs controlados no reciban undefined
  const val = (k) => (formData && formData[k] !== undefined && formData[k] !== null ? formData[k] : "");

  return (
    <div className="card p-3 my-3" style={{ backgroundColor: "#f0f0f0" }}>
      <h5><b>{reserva.nombreOrg || reserva.institucion}</b> - Solicitante: {reserva.nombreSoli || reserva.solicitante}</h5>

      <div className="row">
        <div className="col">
          <p>👥 {reserva.noVisitantesA} alumnos</p>
          <p>📅 Fecha: {val("fecha") ? new Date(val("fecha")).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : "-"}</p>
          <p>⏰ Horario: {reserva.horario}</p>
        </div>
        <div className="col">
          <p><b>Dirección:</b> {reserva.direccion}</p>
          <p><b>Edad de los alumnos:</b> {reserva.edad}</p>
          <p>🚍 {reserva.autobus ? "Requiere transporte" : "No requiere transporte"}</p>
        </div>

        <div className="col d-flex flex-column align-items-end">
          {(botonActivo === null || botonActivo === "aprobadas") && (
            <button className="btn btn-lg mb-2" style={{ backgroundColor: "#198754", borderColor: "#0f5e3c", color: "white" }} onClick={() => manejarClick("aprobadas")}>✔</button>
          )}
          {(botonActivo === null || botonActivo === "rechazadas") && (
            <button className="btn btn-lg mb-2" style={{ backgroundColor: "#dc3545", borderColor: "#a71d2a", color: "white" }} onClick={() => manejarClick("rechazadas")}>✖</button>
          )}
          {(botonActivo === null || botonActivo === "pendientes") && (
            <button className="btn btn-lg mb-2" style={{ backgroundColor: "#FFE551", borderColor: "#e0c300", color: "black" }} onClick={() => manejarClick("pendientes")}>⚠</button>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <p>📞 {reserva.telefono}</p>
        <p>✉️ {reserva.correo}</p>
        <button type="button" className="btn btn-outline-primary" onClick={() => setMostrarModal(true)}>
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
            <input
              type="text"
              name="nombreOrg"                       
              className="uniforme-reservas"
              value={val("nombreOrg")}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Solicitante:</label>
            <input
              type="text"
              name="nombreSoli"                     
              className="uniforme-reservas"
              value={val("nombreSoli")}
              onChange={(e) => {
                const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                // simulamos evento para handleChange
                handleChange({ target: { name: "nombreSoli", value: soloLetras } });
              }}
            />
          </div>

          <div className="mb-2">
            <label>Teléfono:</label>
            <input
              type="tel"
              name="telefono"
              className="uniforme-reservas"
              value={val("telefono")}
              maxLength="10"
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                handleChange({ target: { name: "telefono", value: soloNumeros } });
              }}
            />
          </div>

          <div className="mb-2">
            <label>Fecha: </label>
            <input type="date" name="fecha" className="uniforme-reservas" value={val("fecha")} onChange={handleChange} />
          </div>

          <div className="mb-2">
            <label>Horario: </label>
            <select name="horario" className="uniforme-reservas" value={val("horario")} onChange={handleChange}>
              <option value="">--Seleccione--</option>
              <option>01:00</option>
              <option>03:00</option>
              <option>10:00 AM</option>
              <option>03:00 PM</option>
            </select>
          </div>

          <div className="mb-2">
            <label>Descuento:</label>
            <input type="number" name="descuento" className="uniforme-reservas" value={val("descuento")} onChange={handleChange} />
          </div>

          <div className="mb-2">
            <label>Correo Electronico: </label>
            <input type="email" name="correo" className="uniforme-reservas" value={val("correo")} onChange={handleChange} />
          </div>

          <div className="mb-2">
            <label>Transporte:</label>
            <select name="autobus" className="uniforme-reservas" value={val("autobus")} onChange={handleChange}>
              <option value="">--Seleccione--</option>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarCambios}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
