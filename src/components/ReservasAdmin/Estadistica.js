import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";

export default function Estadistica({ reservas }) {
    const [fecha, setFecha] = useState(new Date());
    const [agrupacion, setAgrupacion] = useState("mes");

    const [datos, setDatos] = useState({
        niñas: "",
        niños: "",
        hombres: "",
        mujeres: "",
        maestros: ""
    });

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatos((prev) => ({
        ...prev,
        [name]: value
        }));
    };

    const manejarExportar = () => {
        // Puedes generar un archivo CSV, PDF o usar una API
        alert("Datos exportados correctamente ✅");
    };

    return (
        <div className="container mt-4 p-4 estadistica-box rounded">
        <div className="row mb-3">
            <div className="col-md-6">
            <label className="form-label fw-bold">Agrupar por:</label>
            <select
                className="form-select mb-3"
                value={agrupacion}
                onChange={(e) => setAgrupacion(e.target.value)}
            >
                <option value="mes">Mes</option>
                <option value="dia">Día</option>
            </select>
            <Calendar
                onChange={setFecha}
                value={fecha}
                locale="es-ES"
                className="border rounded p-2"
            />
            </div>

            <div className="col-md-6">
            {["niñas", "niños", "hombres", "mujeres", "maestros"].map((campo) => (
                <div className="mb-3 d-flex justify-content-between align-items-center" key={campo}>
                <label className="form-label m-0 text-capitalize">{campo}:</label>
                <input
                    type="number"
                    className="form-control w-50"
                    name={campo}
                    value={datos[campo]}
                    onChange={manejarCambio}
                />
                </div>
            ))}

            <div className="text-end">
                <button className="btn btn-success mt-2" onClick={manejarExportar}>
                Exportar
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    }