// NuevaContrasena.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NuevaContrasena() {
  const [nueva, setNueva] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleCambiar = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/visitantes-eventos/restablecer-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: state.correo, nueva }),
      });
      navigate("/login");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
    }
  };

  return (
    <form onSubmit={handleCambiar} className="login-box bg-white">
      <h1 className="login-title">Nueva contraseña</h1>
      <label className="login-label">Escribe tu nueva contraseña:</label>
      <input
        type="password"
        className="login-input"
        value={nueva}
        onChange={(e) => setNueva(e.target.value)}
        minLength="6"
        required
      />
      <button type="submit" className="login-button">Guardar nueva contraseña</button>
    </form>
  );
}

