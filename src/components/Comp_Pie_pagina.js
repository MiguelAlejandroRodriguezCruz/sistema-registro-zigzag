import React from 'react';
import logo from "../images/zig_zag_logo.png";

export function Comp_Pie_pagina() {
  return (
    <footer className="pie-pagina">
      <div className="pie-contenido">
        <div className="pie-logo-texto">
          <img src={logo} alt="Logo Zig Zag" className="pie-logo" />
          <span className="pie-derechos">&copy; 2025 Zig Zag. Todos los derechos reservados.</span>
        </div>
        <div className="pie-enlaces">
          <a href="#">Aviso legal</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
