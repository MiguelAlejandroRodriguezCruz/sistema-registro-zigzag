import React from "react";
import { Comp_encabezado } from "./Comp_encabezado";
import { Comp_Pie_pagina } from "./Comp_Pie_pagina";

const EventosDescripcion = () => {
  return (
    <div className="mt-4">
      <Comp_encabezado/>

       <header className="eventos-header azul">
          <h1 className="text-white m-0">Eventos</h1>
        </header>

      <div className="eventos-container">
       
        <div className="evento-card">
          <div className="evento-info">
            <div className="evento-imagenes">
              <p><strong>Metales pesados y su magia</strong></p>
              <p>Banner de evento:</p>
              <div className="imagenes-grid">
                <div className="img-placeholder"></div>
                <div className="img-small-grid">
                  <div className="img-placeholder small"></div>
                  <div className="img-placeholder small"></div>
                </div>
              </div>
            </div>

            <div className="evento-detalles">
              <p><strong>Podrás disfrutar de :</strong></p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec...
              </p>
              <p><strong>Duración del evento:</strong><br />14/05/25 - 28/05/25</p>
              <a href="#" className="eventos-link">Seleccionar evento</a>
            </div>
          </div>

          <form className="formulario">
            <h4>Rellene el cuestionario solicitado:</h4>

            <div className="form-group">
              <label>Fecha del evento:</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Número de Boletos a adquirir:</label>
              <div className="boletos-group">
                <input type="text" placeholder="Adultos" />
                <input type="text" placeholder="Niñ@s" />
              </div>
            </div>

            <div className="form-group double">
              <div>
                <label>Se necesita asistencia médica:</label>
                <input type="text" placeholder="Placeholder" />
              </div>
              <div>
                <label>Se requiere alimento:</label>
                <input type="text" placeholder="sí o no" />
              </div>
            </div>

            <button className="boton">Obtener boletos</button>
          </form>
        </div>
      </div>
      <Comp_Pie_pagina/>
    </div>
   
  );
};

export default EventosDescripcion;
