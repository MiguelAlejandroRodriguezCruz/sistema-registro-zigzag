import logo from "../../images/zig_zag_logo.png";

export function Comp_Pie_pagina() {
  return (
    <footer className="pie-pagina">
      <div className="pie-contenido">
        <div className="pie-logo-texto">
          <img src={logo} alt="Logo Zig Zag" className="pie-logo" />
          <span className="pie-derechos">&copy; 2025 Zig Zag. Todos los derechos reservados.</span>
        </div>
        {/* Nombres del equipo */}
        <div className="pie-equipo">
          <h4>Equipo del proyecto:</h4>
          <a href="https://www.linkedin.com/in/miguel-alejandro-rodriguez-cruz-810a04260/" target="_blank" rel="noopener noreferrer">Miguel A. Rodríguez Cruz</a>
          <a href="https://www.linkedin.com/in/axelgiovanniojedahernandez" target="_blank" rel="noopener noreferrer">Axel G. Ojeda Hernández</a>
          <a href="https://www.linkedin.com/in/desiree-casta%C3%B1eda-b42b1a272/" target="_blank" rel="noopener noreferrer">Desireé Castañeda García</a>
          <a href="https://www.linkedin.com/in/omar-fern%C3%A1ndez-casillas-a16786386/" target="_blank" rel="noopener noreferrer">Carlos O. Fernández Casillas</a>
          
        </div>
        <div className="pie-enlaces">
          <a href="#">Aviso legal</a>
          <a href="#">Contacto</a>
        </div>
      </div>  
    </footer>
  );
}
