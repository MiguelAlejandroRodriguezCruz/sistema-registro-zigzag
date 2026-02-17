import logo from "../../images/zig_zag_logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export function Comp_encabezado() {
  const navigate = useNavigate();
  const location = useLocation();

  const tokenUsuario = localStorage.getItem("tokenUsuario");
  const tokenAdmin = localStorage.getItem("tokenAdmin");

  const haySesion = tokenUsuario || tokenAdmin;

  // rutas donde NO debe mostrarse el botón
  const rutasLogin = [
    "/login",
    "/login-admin",
    "/registro",
    "/solicitar-codigo",
  ];
  const mostrarLogout = haySesion && !rutasLogin.includes(location.pathname);

  const cerrarSesion = () => {
    const esAdmin = localStorage.getItem("tokenAdmin"); // ← primero comprobar

    localStorage.removeItem("tokenUsuario");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenAdmin");
    localStorage.removeItem("admin");

    navigate(esAdmin ? "/login-admin" : "/login");
  };

  return (
    <header className="comp_encabezado d-flex justify-content-between align-items-center px-3">
      <a
        href="https://zigzag.gob.mx/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={logo}
          alt="Logo Zig Zag"
          className="encabezado__logo logo-left"
        />
      </a>

      {mostrarLogout && (
        <button onClick={cerrarSesion} className="btn btn-outline-danger">
          Cerrar sesión
        </button>
      )}
    </header>
  );
}
