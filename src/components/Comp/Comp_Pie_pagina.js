import { Link } from "react-router-dom";
import logo_labsol from "../../images/Logos_Labsol_2023_02.png";
import logo_GPL from "../../images/GPLv3_Logo.svg.png";

export function Comp_Pie_pagina() {
  return (
    <footer className="pie-pagina">
      <div className="pie-contenido">

        {/* Logo Labsol + derechos */}
        <div className="pie-logo-texto">
          <a
            href="https://labsol.cozcyt.gob.mx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logo_labsol}
              alt="Logo Labsol Network"
              className="pie-logo"
            />
          </a>

          <span className="pie-derechos">
            © 2025 Zig Zag. Todos los derechos reservados.
          </span>
        </div>

        {/* Enlaces */}
        <div className="pie-enlaces">
          <Link to="/acerca-de">Acerca de</Link>
          <Link to="/aviso-legal">Aviso legal</Link>
        </div>

        {/* GPL */}
        <div className="pie-gpl">
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logo_GPL}
              alt="Logo GPL3 Free Software"
              className="pie-logo-gpl"
            />
          </a>
        </div>

      </div>
    </footer>
  );
}
