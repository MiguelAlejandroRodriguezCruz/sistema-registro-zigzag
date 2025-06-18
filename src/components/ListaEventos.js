import React from 'react';
import { Comp_encabezado } from './Comp_encabezado';
import { Comp_Pie_pagina } from './Comp_Pie_pagina';

const Eventos = () => {
  return (
    <div>
      <Comp_encabezado/>
      <div className="row">
        <div className="eventos-header text-center py-2 m-1">
          <h1 className="eventos-header m-0">Eventos</h1>
          <a href="#" className="reservas-link mx-3">Reservas</a>
        </div>
      </div>
        <div className="eventos-container">

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

      <Comp_Pie_pagina/>
    </div>
    
  );
};

export default Eventos;