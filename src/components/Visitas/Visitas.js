import React, { useState } from "react";
import { Comp_encabezado } from "../Comp/Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp/Comp_Pie_pagina";
import CalendarioVisitas from "./CalendarioVisitas";
import { API_BASE_URL } from "../../config/api";

const FormularioVisitas = () => {
  const [fechaFijada, setFechaFijada] = useState(null);

  const [formData, setFormData] = useState({
    nombreSoli: "",
    nombreOrg: "",
    noVisitantesA: "",
    noVisitantesD: "",
    telefono: "",
    direccion: "",
    colonia: "",
    municipio: "",
    correo: "",
    tipoRecorrido: "",
    gradoEscolar: "",
    horario: "",
    medioEnterado: "",
    comentarios: "",
    autobus: "",
    autorizaFotos: ""
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const manejarEnvio = async () => {
    const camposObligatorios = [
      "nombreSoli",
      "nombreOrg",
      "noVisitantesA",
      "noVisitantesD",
      "telefono",
      "direccion",
      "colonia",
      "municipio",
      "correo",
      "tipoRecorrido",
      "gradoEscolar",
      "horario",
      "medioEnterado",
      "autobus",
      "autorizaFotos"
    ];

    const camposVacios = camposObligatorios.filter(
      (campo) => formData[campo] === ""
    );

    if (!fechaFijada) {
      alert("Debes fijar una fecha antes de enviar.");
      return;
    }

    if (camposVacios.length > 0) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!regexNombre.test(formData.nombreSoli)) {
      alert("El nombre del solicitante solo debe contener letras y espacios.");
      return;
    }

    if (!regexNombre.test(formData.nombreOrg)) { 
      alert("El nombre de la organización solo debe contener letras y espacios.");
      return;
    }

    if (!regexNombre.test(formData.direccion)) {
      alert("La dirección solo debe contener letras, números, espacios y algunos caracteres especiales.");
      return;
    }

    if (!regexNombre.test(formData.colonia)) {
      alert("La colonia solo debe contener letras y espacios.");
      return;
    }

    if (!regexNombre.test(formData.municipio)) {
      alert("El municipio solo debe contener letras y espacios.");
      return;
    }

    const regexTelefono = /^[0-9]{10}$/;

    if (!regexTelefono.test(formData.telefono)) {
      alert("El teléfono debe contener exactamente 10 dígitos.");
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(formData.correo)) {
      alert("El correo electrónico no es válido.");
      return;
    }

    const regexNumero = /^[0-9]+$/;

    if (!regexNumero.test(formData.noVisitantesA) || !regexNumero.test(formData.noVisitantesD)) {
      alert("El número de visitantes debe ser un valor numérico.");
      return;
    }

    const datosAEnviar = {
      ...formData,
      fecha: fechaFijada.toISOString().split("T")[0],
      precioEntrada: 50,
      estatus: "nuevo"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/visitantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar)
      });

      if (!response.ok) throw new Error("Error al registrar visitante");

      const result = await response.json();
      alert(`Visita registrada correctamente. ID: ${result.idInsertado}`);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar los datos.");
    }
  };

  return (
    <div className="mt-4">
      {/* Comienza el encabezado*/}
      <Comp_encabezado />

      <div className="row">
        <div className="col text-center bg-success py-2">
          <h1 className="text-white m-0">Visitas</h1>
        </div>
      </div>
      {/* Termina el Encabezado*/}

      <div className="container mt-4">
        <div className="p-lg-4">

           <CalendarioVisitas onFechaFijada={setFechaFijada} />

        </div>
        
       

        {/* Formulario */}
        <div className="row">
          <div className="col-md-6">
            {/* Campos de formulario */}
            <label style={{ fontSize: "19px" }} className="form-label">Nombre del solicitante</label>
            <input
              type="text"
              name="nombreSoli"
              className="form-control mb-2"
              title="Solo letras y espacios permitidos"
              value={formData.nombreSoli}
              onChange={(e) => {
                const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                manejarCambio({ target: { name: "nombreSoli", value: soloLetras } });
              }}
              required
            />

            <label style={{ fontSize: "19px" }} className="form-label">Nombre de la escuela/organización</label>
            <input
              type="text"
              name="nombreOrg"
              className="form-control mb-2"
              value={formData.nombreOrg}
              onChange={(e) => {
                const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                manejarCambio({ target: { name: "nombreOrg", value: soloLetras } });
              }}
            />

            <label style={{ fontSize: "19px" }} className="form-label">No. de visitantes (alumnos)</label>
            <input
              type="text"
              name="noVisitantesA"
              className="form-control mb-2"
              value={formData.noVisitantesA}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                manejarCambio({ target: { name: "noVisitantesA", value: soloNumeros } });
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              required
            />

            <label style={{ fontSize: "19px" }} className="form-label">No. de visitantes (docentes)</label>
            <input
              type="text"
              name="noVisitantesD"
              className="form-control mb-2"
              value={formData.noVisitantesD}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                manejarCambio({ target: { name: "noVisitantesD", value: soloNumeros } });
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              required
            />

            <label style={{ fontSize: "19px" }} className="form-label">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              className="form-control mb-2"
              value={formData.telefono}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                manejarCambio({ target: { name: "telefono", value: soloNumeros } });
              }}
            />

            <label style={{ fontSize: "19px" }} className="form-label">Dirección</label>
            <input
              type="text"
              name="direccion"
              className="form-control mb-2"
              value={formData.direccion}
              onChange={(e) => {
                const soloLetras = e.target.value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s,.-]/g, "");
                manejarCambio({ target: { name: "direccion", value: soloLetras } });
              }}
            />

            <label style={{ fontSize: "19px" }} className="form-label">Colonia/Localidad</label>
            <input
              type="text"
              name="colonia"
              className="form-control mb-2"
              value={formData.colonia}
              onChange={(e) => {
                const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                manejarCambio({ target: { name: "colonia", value: soloLetras } });
              }}
            />

            <label style={{ fontSize: "19px" }} className="form-label">¿Requiere de servicio de autobús?</label>
            <div className="mb-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="autobus"
                  value="Si"
                  onChange={manejarCambio}
                />
                <label style={{ fontSize: "16px" }} className="form-check-label">Sí</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="autobus"
                  value="No"
                  onChange={manejarCambio}
                />
                <label style={{ fontSize: "16px" }} className="form-check-label">No</label>
              </div>
            </div>

            <label style={{ fontSize: "19px" }} className="form-label">¿Por cuál medio se enteró?</label>
            <select
              name="medioEnterado"
              className="form-select mb-2"
              value={formData.medioEnterado}
              onChange={manejarCambio}
            >
              <option value="">Seleccionar</option>
              <option>Amigos</option>
              <option>Redes Sociales</option>
            </select>
          </div>

          <div className="col-md-6">
            <label style={{ fontSize: "19px" }} className="form-label">Municipio</label>
            <input
              type="text"
              name="municipio"
              className="form-control mb-2"
              value={formData.municipio}
              onChange={(e) => {
                const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                manejarCambio({ target: { name: "municipio", value: soloLetras } });
              }}
            />

            <label style={{ fontSize: "19px" }} className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              className="form-control mb-2"
              value={formData.correo}
              onChange={(e) => {
                const soloLetras = e.target.value.replace(/[^A-Za-z0-9._%+-@]/g, "");
                manejarCambio({ target: { name: "correo", value: soloLetras } });
              }}
            />

            <label style={{ fontSize: "19px" }} className="form-label">Tipo de recorrido requerido</label>
            <select
              name="tipoRecorrido"
              className="form-select mb-2"
              value={formData.tipoRecorrido}
              onChange={manejarCambio}
            >
              <option value="">Seleccionar</option>
              <option>Virtual</option>
              <option>Presencial</option>
            </select>

            <label style={{ fontSize: "19px" }} className="form-label">Grado Escolar</label>
            <input
              type="text"
              name="gradoEscolar"
              className="form-control mb-2"
              value={formData.gradoEscolar}
              onChange={manejarCambio}
            />

            <label style={{ fontSize: "19px" }} className="form-label">Horario disponible</label>
            <select
              name="horario"
              className="form-select mb-2"
              value={formData.horario}
              onChange={manejarCambio}
            >
              <option value="">Seleccionar</option>
              <option>01:00</option>
              <option>03:00</option>
            </select>

            <label style={{ fontSize: "19px" }} className="form-label">¿Autoriza fotos y videos?</label>
            <div className="mb-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="autorizaFotos"
                  value="Si"
                  onChange={manejarCambio}
                />
                <label style={{ fontSize: "16px" }} className="form-check-label">Sí</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="autorizaFotos"
                  value="No"
                  onChange={manejarCambio}
                />
                <label style={{ fontSize: "16px" }} className="form-check-label">No</label>
              </div>
            </div>

            <label style={{ fontSize: "19px" }} className="form-label">Comentarios</label>
            <textarea
              name="comentarios"
              className="form-control mb-2"
              rows="3"
              value={formData.comentarios}
              onChange={manejarCambio}
            ></textarea>

            <button className="btn btn-danger w-40 mt-2" onClick={manejarEnvio}>
              ENVIAR
            </button>
          </div>
        </div>
        {/* Pie de pagina */}
        <Comp_Pie_pagina />
      </div>
    </div>

  );
};

export default FormularioVisitas;
