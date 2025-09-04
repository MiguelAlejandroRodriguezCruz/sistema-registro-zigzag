import React, { useEffect, useState } from "react";
import { ReservaCard } from "./ReservaCard";
import CalendarioFechasOcupadas from "./CalendarioFechasOcupadas";
import Estadistica from "./Estadistica";

/**
 * Props:
 * - reservas: array (proviene del padre)
 * - pestanaActiva: string
 * - actualizarEstadoReserva: function(id, estado) -> puede ser async
 * - onReservaUpdated (opcional): function(updated) -> callback para notificar al padre
 */
export function ReservasLista({ reservas = [], pestanaActiva, actualizarEstadoReserva, onReservaUpdated }) {
  // Mantener una copia local para actualizaciones parciales (sin refetchar toda la lista)
  const [localReservas, setLocalReservas] = useState(reservas);

  // Sincroniza la copia local cuando cambian las props (fuente de verdad)
  useEffect(() => {
    setLocalReservas(reservas ?? []);
  }, [reservas]);

  // Handler que pasa a ReservaCard: cuando un card guarda, nos manda el objeto actualizado
  const handleSaved = (updated) => {
    if (!updated || !updated.id) return;

    setLocalReservas(prev => {
      // Reemplaza elemento si existe, si no existe lo añade al principio
      const found = prev.some(r => r.id === updated.id);
      if (found) return prev.map(r => (r.id === updated.id ? updated : r));
      return [updated, ...prev];
    });

    // Notifica al padre si quiere manejar el cambio (ej. persistir en contexto global)
    if (typeof onReservaUpdated === "function") {
      try { onReservaUpdated(updated); } catch (err) { console.error("onReservaUpdated error:", err); }
    }
  };

  // Envolver actualizarEstadoReserva para que también actualice la copia local (optimista)
  const handleActualizarEstadoReserva = async (id, estado) => {
    try {
      // Si la función original devuelve una promesa, esperar su resolución.
      const result = actualizarEstadoReserva ? await actualizarEstadoReserva(id, estado) : null;

      // Actualiza localmente el estatus (optimista). Si tu función original hace fetch completo, esto no perjudica.
      setLocalReservas(prev => prev.map(r => (r.id === id ? { ...r, estatus: estado } : r)));

      return result;
    } catch (err) {
      console.error("Error en actualizarEstadoReserva:", err);
      // No tocar el estado local si hubo error (podrías revertir aquí si hiciste un cambio optimista)
      throw err;
    }
  };

  // Filtrado basado en la pestaña activa (usa la copia local)
  const reservasFiltradas = pestanaActiva !== "estadistica"
    ? (localReservas || []).filter(reserva => reserva.estatus === pestanaActiva)
    : [];

  // Si la pestaña es estadística, mostrar solo el componente de estadísticas
  if (pestanaActiva === "estadistica") {
    return (
      <div className="mt-4">
        <h4 className="mb-3">Estadísticas generales</h4>
        <Estadistica reservas={localReservas} />
      </div>
    );
  }

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
            actualizarEstadoReserva={handleActualizarEstadoReserva}
            onSaved={handleSaved}         // <-- aquí recibe la fila actualizada desde ReservaCard
          />
        ))
      ) : (
        <p>No hay reservas en esta categoría.</p>
      )}
    </>
  );
}
