// RegistroForm.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";

const RegistroForm = () => {
  const navigate = useNavigate();

  const handleAccountCreated = () => navigate("/login");
  const handleVolver = () => navigate(-1);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Comp_encabezado />
      <div className='login-header'/>
      <div className="login-box bg-white">
            <h1 className="login-title card-title text-center mb-4">Crear cuenta</h1>

            <div className="mb-3">
              <label className="login-label">Nombre completo</label>
              <input type="text" className="form-control" placeholder="Juan Pérez" />
            </div>

            <div className="mb-3">
              <label className="login-label">Correo</label>
              <input type="email" className="form-control" placeholder="correo@ejemplo.com" />
            </div>

            <div className="mb-3">
              <label className="login-label">Edad</label>
              <input type="number" className="form-control" placeholder="25" />
            </div>

            <div className="mb-4">
              <label className="login-label">Contraseña</label>
              <input type="password" className="form-control" placeholder="********" />
            </div>

            <div className="d-grid gap-2">
              <button className="login-button btn-success" onClick={handleAccountCreated}>
                Crear cuenta
              </button>
              <button className="login-button-gray btn-secondary" onClick={handleVolver}>
                Volver
              </button>
            </div> 
      </div>

      <Comp_Pie_pagina />
    </div>
  );
};

export default RegistroForm;
