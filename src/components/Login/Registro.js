import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../images/zig_zag_logo.png";
import "../../style/App.css";

const RegistroForm = ({ onVolver }) => {
  const navigate = useNavigate();
  
    const handleAccountCreated = () => {
      navigate("/login"); // Redirige al componente de eventos
    };
  

  return (
    <div className="login-container">
      <img src={logo} alt="Logo Zig Zag" className="login-logo" />
      <div className="login-header">
        <h1 className="login-title">Crear cuenta</h1>
      </div>
      <div className="login-box">
        <label className="login-label">Ingresa tu nombre</label>
        <input type="text" placeholder="Juan Pérez" className="login-input" />
        <label className="login-label">Ingresa tu correo</label>
        <input type="email" placeholder="correo@ejemplo.com" className="login-input" />
        <label className="login-label">Ingresa tu edad</label>
        <input type="number" placeholder="25" className="login-input" />
        <label className="login-label">Ingresa una contraseña</label>
        <input type="password" placeholder="********" className="login-input" />
        <div className="text-center mt-3">
          <button className="login-button" onClick={handleAccountCreated} >Crear</button>
          <button className="login-button-gray mt-2" onClick={handleAccountCreated}>Volver</button>
        </div>
      </div>
    </div>
  );
};

export default RegistroForm;
