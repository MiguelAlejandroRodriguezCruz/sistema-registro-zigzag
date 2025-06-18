import React from 'react';
import logo from "../images/zig_zag_logo.png";

export function Comp_Pie_pagina() {
  return (
    <footer className="bg-white text-black py-3 w-100 mt-auto">
      <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center px-4">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <img src={logo} alt="Logo Zig Zag" style={{ height: "40px" }} />
          <span className="ms-2 small">&copy; 2025 Zig Zag. Todos los derechos reservados.</span>
        </div>
        <div>
          <a href="#" className="text-white text-decoration-none me-3">Aviso legal</a>
          <a href="#" className="text-white text-decoration-none">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
