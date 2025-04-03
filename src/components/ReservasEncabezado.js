export function ReservasEncabezado() {
    const recargarPagina = () => {
        window.location.reload();
    };

    return (
        <div className="bg-primary p-3 shadow">
            <div className="d-flex justify-content-start">
                
                <img
                    src="/logo512.png" // Si la imagen está en public/
                    alt="Logo de la aplicación"
                    className="me-3"
                    style={{ height: "50px", cursor: "pointer" }}
                    onClick={recargarPagina}
                />
            </div>

            <div className="d-flex justify-content-between">
                <h1 className="text-white">Solicitud de Reservas</h1>
            </div>
        </div>
    );
}
