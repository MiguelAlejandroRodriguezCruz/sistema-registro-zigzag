import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleVerificar = (e) => {
    e.preventDefault();

    // Prueba XD
    navigate("/nueva-contrasena", { state: { correo: state?.correo || "" } });

    // Quitar el comentario para activarlo de nuevo
    /*
    try {
      const res = await fetch("http://localhost:3001/visitantes-eventos/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: state.correo, codigo }),
      });
      const data = await res.json();
      if (data.ok) {
        navigate("/nueva-contrasena", { state: { correo: state.correo } });
      }
    } catch (error) {
      console.error("Código inválido:", error);
    }
    */
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Comp_encabezado />
      <div className="login-header" />

      <form onSubmit={handleVerificar} className="login-box bg-white">
        <h1 className="login-title text-center mb-4">Verifica el código</h1>

        <div className="mb-3">
          <label className="login-label">Código recibido:</label>
          <input
            type="text"
            className="form-control"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button btn btn-primary w-100">
          Verificar
        </button>
      </form>

      <Comp_Pie_pagina />
    </div>
  );
}
