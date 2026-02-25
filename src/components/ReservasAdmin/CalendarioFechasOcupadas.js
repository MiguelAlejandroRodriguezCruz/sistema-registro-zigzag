import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../../style/CalendarioOcupado.css";
import { API_BASE_URL } from "../../config/api";

const CalendarioOcupado = ({ reservas = [], setMesActual, setAnioActual }) => {
  const fechasOcupadas = reservas
    .filter((r) => r.estatus === "aprobadas")
    .map((r) => {
      const f = new Date(r.fecha);
      f.setHours(0, 0, 0, 0);
      return f;
    });

  const estaOcupada = (date) =>
    fechasOcupadas.some(
      (f) =>
        f.getFullYear() === date.getFullYear() &&
        f.getMonth() === date.getMonth() &&
        f.getDate() === date.getDate(),
    );

  const fechaMaxima = new Date();
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 6);

  const handleMonthChange = ({ activeStartDate }) => {
    const mes = activeStartDate.getMonth() + 1;
    const anio = activeStartDate.getFullYear();

    setMesActual(mes);
    setAnioActual(anio);
  };

  return (
    <div className="calendario-admin w-100 mt-4 px-5">
      <Calendar
        maxDate={fechaMaxima}
        tileClassName={({ date, view }) => {
          if (view === "month" && estaOcupada(date)) {
            return "ocupada-roja";
          }
          // Domingo = 0, Lunes = 1
          const dia = date.getDay();
          if (dia === 0 || dia === 1) {
            return "fin-de-semana";
          }
          return null;
        }}
        tileDisabled={({ date }) => {
          const dia = date.getDay();
          return estaOcupada(date) || dia === 0 || dia === 1;
        }}
        className="border p-2 rounded"
        locale="es-ES"
        onActiveStartDateChange={handleMonthChange}
      />
    </div>
  );
};

export default CalendarioOcupado;
