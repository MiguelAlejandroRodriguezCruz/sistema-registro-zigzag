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
          <ul>
            <li>Miguel A. Rodríguez Cruz</li>
            <li>Axel G. Ojeda Hernández</li>
            <li>Desireé Castañeda García</li>
            <li>Carlos O. Fernández Casillas</li>
          </ul>
        </div>
        <div className="pie-enlaces">
          <a href="#">Aviso legal</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
