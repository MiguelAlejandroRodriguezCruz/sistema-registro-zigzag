import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const PrivateRouteAdmin = ({ children }) => {
  const tokenAdmin = localStorage.getItem('tokenAdmin');

  if (!tokenAdmin) return <Navigate to="/login-admin" replace />;

  try {
    const decoded = jwtDecode(tokenAdmin);
    const ahora = Date.now() / 1000; // en segundos

    if (decoded.exp < ahora) {
      // tokenAdmin expiró
      localStorage.removeItem('tokenAdmin');
      localStorage.removeItem('admin');
      return <Navigate to="/login-admin" replace />;
    }

    // tokenAdmin válido
    return children;

  } catch (err) {
    // tokenAdmin inválido o corrupto
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('admin');
    return <Navigate to="/login-admin" replace />;
  }
};

export default PrivateRouteAdmin;
