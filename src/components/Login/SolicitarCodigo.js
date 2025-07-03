import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";

export default function SolicitarCodigo() {
  const [correo, setCorreo] = useState("");
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/recuperar/enviar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje);

      alert('Código enviado a tu correo ');
      navigate('/verificar-codigo', { state: { correo } });

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };


  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Comp_encabezado />
      <div className="login-header" />

      <form onSubmit={handleEnviarCodigo} className="login-box bg-white">
        <h1 className="login-title text-center mb-4">Recuperar contraseña</h1>

        <div className="mb-3">
          <label className="login-label">Ingresa tu correo</label>
          <input
            type="email"
            className="form-control"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button btn btn-primary w-100">
          Enviar código
        </button>
      </form>

      <Comp_Pie_pagina />
    </div>
  );
}
