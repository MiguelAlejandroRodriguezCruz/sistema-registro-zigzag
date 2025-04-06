import React from 'react';
import { useNavigate } from "react-router-dom";


function ReservasEncabezado() {
    const recargarPagina = () => {
        window.location.reload();
    };

    return (
        <div className="p-1 shadow">
            <div className="container-fluid">
                <div className="row bg-white p-2 ">
                    <div className="col d-flex align-items-center">
                        <img
                            src="/logo512.png"
                            alt="Logo de la aplicación"
                            className="me-3"
                            style={{ height: "50px", cursor: "pointer" }}
                            onClick={recargarPagina}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center bg-danger py-2 ">
                        <h1 className="text-white m-0">Solicitud de Reservas</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReservasEncabezado;

