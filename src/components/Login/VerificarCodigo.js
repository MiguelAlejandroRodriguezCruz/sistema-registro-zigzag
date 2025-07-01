// VerificarCodigo.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleVerificar = async (e) => {
    e.preventDefault();
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
  };

  return (
    <form onSubmit={handleVerificar} className="login-box bg-white">
      <h1 className="login-title">Verifica el código</h1>
      <label className="login-label">Código recibido:</label>
      <input
        type="text"
        className="login-input"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
      />
      <button type="submit" className="login-button">Verificar</button>
    </form>
  );
}
