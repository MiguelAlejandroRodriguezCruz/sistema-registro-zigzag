import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../images/zig_zag_logo.png";
import "../../style/App.css";

const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/eventosUsuarios"); // Redirige al componente de eventos
  };

  const handleCreateAccount = () => {
    navigate("/registro"); // Si necesitas una ruta de registro
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo Zig Zag" className="login-logo" />
      <div className="login-header">
        <h1 className="login-title">Iniciar sesión</h1>
      </div>
      <div className="login-box">
        <label className="login-label">Correo</label>
        <input type="text" placeholder="correo@ejemplo.com" className="login-input" />
        <label className="login-label">Contraseña</label>
        <input type="password" placeholder="*******" className="login-input" />
        <div className="login-links">
          <a href="#">¿Olvidaste tu contraseña?</a><br />
          <a href="" onClick={handleCreateAccount} style={{ cursor: "pointer" }}>Crear una cuenta?</a>
        </div>
        <button className="login-button" onClick={handleLogin}>Iniciar</button>
      </div>
    </div>
  );
};

export default LoginForm;


