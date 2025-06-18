import React from "react";
import { useNavigate } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";


const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/eventosUsuarios"); // Redirige al componente de eventos
  };

  const handleCreateAccount = () => {
    navigate("/registro"); // Si necesitas una ruta de registro
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Componente para el encabezado */}
      <Comp_encabezado/>  
      {/* Formulario de login */}
      <div className="login-box bg-white" >
        <h1 className="login-title text-center mb-4">Iniciar sesión</h1>


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
      <Comp_Pie_pagina/>
    </div>
  );
};

export default LoginForm;


