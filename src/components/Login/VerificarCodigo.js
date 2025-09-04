import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Comp_encabezado } from "../Comp/Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp/Comp_Pie_pagina";
import { API_BASE_URL } from "../../config/api";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleVerificar = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/recuperar/verificar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: state?.correo, codigo }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje);

      localStorage.setItem("resetToken", data.resetToken);

      alert('Código correcto');
      navigate('/nueva-contrasena', { state: { correo: state?.correo } });

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
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
            className="uniforme"
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
