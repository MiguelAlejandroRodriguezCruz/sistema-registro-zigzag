import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";

export default function NuevaContrasena() {
  const [nueva, setNueva] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleCambiar = (e) => {
    e.preventDefault();

    // Pruebas XD
    navigate("/login");

    // Para que funcione 
    /*
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
    */
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Comp_encabezado />
      <div className="login-header" />

      <form onSubmit={handleCambiar} className="login-box bg-white">
        <h1 className="login-title text-center mb-4">Nueva contraseña</h1>

        <div className="mb-3">
          <label className="login-label">Escribe tu nueva contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            minLength="6"
            required
          />
        </div>

        <button type="submit" className="login-button btn btn-primary w-100">
          Guardar nueva contraseña
        </button>
      </form>

      <Comp_Pie_pagina />
    </div>
  );
}
