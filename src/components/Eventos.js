import React, { useState } from "react";
import { Comp_encabezado } from "./Comp_encabezado";
import { Comp_Pie_pagina } from "./Comp_Pie_pagina";

export default function CrearEvento() {
  return (
    <div className="mt-4">
      {/* Encabezado */}
      <Comp_encabezado/>
      <div style={{ backgroundColor: "#22a31f", color: "#fff", padding: "10px" }}>
          <h2 style={{ margin: -4, backgroundColor: "#22a31f", }}>Eventos</h2>
          <a href="#" style={{ color: "#fff", textDecoration: "underline", fontSize: "14px" }}>← Regresar</a>
      </div>
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
        
        {/* Texto de instrucciones */}
        <p style={{ marginTop: "20px", fontSize: "22px" }}>
          <strong>NOTA: Creación de un evento, favor de llenar todos los campos disponibles y revisar correctamente el contenido de los mismos.</strong>
        </p>

        {/* Formulario */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Columna izquierda */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <label>Nombre del evento:</label>
            <input type="text" className="form-control" placeholder="Escriba un nombre" />

            <label style={{ marginTop: "10px" }}>Fecha del evento:</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="date" className="form-control" />
              <input type="date" className="form-control" />
            </div>

            <label style={{ marginTop: "10px" }}>Lugar del evento:</label>
            <input type="text" className="form-control" placeholder="Ingrese una dirección" />

            <label style={{ marginTop: "10px" }}>Descripción del evento:</label>
            <textarea className="form-control" rows="5" placeholder="Escriba aquí" />
          </div>

          {/* Columna derecha */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <label>Ingrese el Banner (opcional):</label>
            <button className="btn btn-secondary w-100 mb-2">+ Agregar Banner</button>
            <div className="image-placeholder mb-3" style={placeholderStyle}></div>

            <label>Imágenes cargadas:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
              {[1, 2, 3, 4].map((img, i) => (
                <div key={i} className="image-placeholder" style={placeholderStyle}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-4" style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-warning">Crear formulario de evento</button>
          <button className="btn btn-danger">Cancelar</button>
          <button className="btn btn-success">Guardar</button>
        </div>
      </div>
      
      <Comp_Pie_pagina/>
    </div>
    
  );
}

// Estilo para los cuadros de imagen
const placeholderStyle = {
  width: "100%",
  height: "100px",
  backgroundColor: "#e6e6e6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #ccc",
  borderRadius: "4px",
};