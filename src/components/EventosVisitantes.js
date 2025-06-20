import React from 'react';
import { Comp_encabezado } from './Comp_encabezado';
import { Comp_Pie_pagina } from './Comp_Pie_pagina';

const EventosSeleccionar = () => {
  return (
    <div className='mt-4'>
      <Comp_encabezado/>
      <header className="eventos-header azul">
            <h1 className="text-white m-0">Eventos</h1>
      </header>
      <div className="eventos-container">
          
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
              <div className="seleccionar-evento">
                <a href="#">Seleccionar evento</a>
              </div>
            </div>
          ))}
        </div>  
        <Comp_Pie_pagina/>
    </div>
    
  );
};

export default EventosSeleccionar;