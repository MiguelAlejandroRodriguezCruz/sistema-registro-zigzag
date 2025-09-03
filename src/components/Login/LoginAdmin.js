import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";
import { API_BASE_URL } from "../../config/api";

const LoginFormAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/visitantes-eventos/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error en el login');
      }

      localStorage.setItem('admin', JSON.stringify(data.admin));
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.admin.rol);

      navigate("/lista-eventos"); 
      
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Ocurrió un error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Comp_encabezado/>  
      <div className='loginAdmin-header'/>
      
      <form onSubmit={handleLogin} className="login-box bg-white">
        <h1 className="login-title text-center mb-4">Login Administrador</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="loginAdmin-label">Correo</label>
          <input 
            type="email" 
            name="correo"
            placeholder="correo@ejemplo.com" 
            className="uniforme" 
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="loginAdmin-label">Contraseña</label>
          <input 
            type="password" 
            name="contrasena"
            placeholder="*******" 
            className="uniforme" 
            value={formData.contrasena}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <button 
          type="submit" 
          className="login-button btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <Comp_Pie_pagina/>
    </div>
  );
};

export default LoginFormAdmin;
