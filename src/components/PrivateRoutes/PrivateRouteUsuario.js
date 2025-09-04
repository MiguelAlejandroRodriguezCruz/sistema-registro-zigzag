import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const PrivateRouteUsuario = ({ children }) => {
  const tokenUsuario = localStorage.getItem('tokenUsuario');

  if (!tokenUsuario) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(tokenUsuario);
    const ahora = Date.now() / 1000; // en segundos

    if (decoded.exp < ahora) {
      // tokenUsuario expiró
      localStorage.removeItem('tokenUsuario');
      localStorage.removeItem('admin');
      return <Navigate to="/login" replace />;
    }

    // tokenUsuario válido
    return children;

  } catch (err) {
    // tokenUsuario inválido o corrupto
    localStorage.removeItem('tokenUsuario');
    localStorage.removeItem('admin');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRouteUsuario;
