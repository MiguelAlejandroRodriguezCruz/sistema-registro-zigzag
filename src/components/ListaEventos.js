import React from 'react';

const Eventos = () => {
  return (
    <div className="eventos-container">
      <header className="eventos-header">
        <img src="/ruta-al-logo.png" alt="Logo Zig-Zag" className="logo" />
        <h1><strong>Eventos</strong></h1>
        <a href="#" className="reservas-link">Reservas</a>
      </header>

      <div className="agregar-evento">
        <a href="#">+ Agregar evento</a>
      </div>

      {[1, 2].map((item) => (
        <div className="evento-card" key={item}>
          <div className="evento-banner">
            <h4><b>Metales pesados y su magia</b></h4>
            <p>Banner de evento:</p>
            <div className="imagenes-banner">
              <img src="/placeholder.png" alt="img" />
              <img src="/placeholder.png" alt="img" />
              <img src="/placeholder.png" alt="img" />
            </div>
          </div>
          <div className="evento-descripcion">
            <p className="disfrutar"><b>Podrás disfrutar de :</b></p>
            <p className="descripcion">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit...
            </p>
            <p className="duracion"><b>Duración del evento:</b><br />14/05/25 - 28/05/25</p>
          </div>
          <div className="editar-evento">
            <a href="#">Editar evento</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Eventos;