import { Navigate } from "react-router-dom";

const RutaPublica = ({ children }) => {
  const tokenUsuario = localStorage.getItem("tokenUsuario");
  const tokenAdmin = localStorage.getItem("tokenAdmin");

  const haySesion = tokenUsuario || tokenAdmin;

  if (haySesion) {
    return (
      <Navigate
        to={tokenAdmin ? "/ReservasGenerales" : "/eventos-visitantes"}
        replace
      />
    );
  }

  return children;
};

export default RutaPublica;
