// SolicitarCodigo.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SolicitarCodigo() {
  const [correo, setCorreo] = useState("");
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/visitantes-eventos/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });
      navigate("/verificar-codigo", { state: { correo } });
    } catch (error) {
      console.error("Error al enviar código:", error);
    }
  };

  return (
    <form onSubmit={handleEnviarCodigo} className="login-box bg-white">
      <h1 className="login-title">Recuperar contraseña</h1>
      <label className="login-label">Ingresa tu correo</label>
      <input
        type="email"
        className="login-input"
        placeholder="correo@ejemplo.com"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <button type="submit" className="login-button">Enviar código</button>
    </form>
  );
}
