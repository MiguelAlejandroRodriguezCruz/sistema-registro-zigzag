import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import React from 'react';

export default function Estadistica({ reservas }) {
    const [fecha, setFecha] = useState(new Date());
    const [agrupacion, setAgrupacion] = useState('dia');
    const [registros, setRegistros] = useState([]);
    const [estadisticas, setEstadisticas] = useState([]);
    const [detalles, setDetalles] = useState(null);
    const [totalGeneral, setTotalGeneral] = useState(0);

    // Obtener registros de la API
    useEffect(() => {
        const obtenerRegistros = async () => {
        try {
            const response = await fetch('http://localhost:3001/registro');
            const data = await response.json();
            setRegistros(data);
        } catch (error) {
            console.error('Error al obtener registros:', error);
        }
        };
        obtenerRegistros();
    }, []);

    // Calcular estadísticas cuando cambian los registros, fecha o agrupación
    useEffect(() => {
        if (registros.length === 0) return;

        // Filtrar registros según la fecha seleccionada
        const registrosFiltrados = registros.filter(reg => {
        const regDate = new Date(reg.fecha_registro);
        const selectedDate = new Date(fecha);
        
        if (agrupacion === 'dia') {
            return regDate.toDateString() === selectedDate.toDateString();
        } else if (agrupacion === 'mes') {
            return regDate.getMonth() === selectedDate.getMonth() && 
                regDate.getFullYear() === selectedDate.getFullYear();
        } else if (agrupacion === 'ano') {
            return regDate.getFullYear() === selectedDate.getFullYear();
        }
        return false;
        });

        // Calcular total general
        const total = registrosFiltrados.reduce((sum, reg) => sum + parseInt(reg.cantidad), 0);
        setTotalGeneral(total);

        // Agrupar por tipo de asistente
        const tipos = ['Niño', 'Niña', 'Hombre', 'Mujer', 'Maestro'];
        const stats = tipos.map(tipo => {
        const registrosTipo = registrosFiltrados.filter(reg => reg.tipo === tipo);
        const totalTipo = registrosTipo.reduce((sum, reg) => sum + parseInt(reg.cantidad), 0);
        
        // Calcular porcentaje
        const porcentaje = total > 0 ? ((totalTipo / total) * 100).toFixed(2) : 0;
        
        return {
            tipo,
            total: totalTipo,
            porcentaje,
            registros: registrosTipo
        };
        });

        setEstadisticas(stats);
    }, [registros, fecha, agrupacion]);

   // Formatear fecha según la agrupación
    const formatoFecha = () => {
        if (agrupacion === 'dia') {
        return fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (agrupacion === 'mes') {
        return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
        } else if (agrupacion === 'ano') {
        return fecha.getFullYear().toString();
        }
        return '';
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
            <option value="dia">Día</option>
            <option value="mes">Mes</option>
            <option value="ano">Año</option>
          </select>
          <Calendar
            onChange={setFecha}
            value={fecha}
            locale="es-ES"
            className="border rounded p-2"
          />
        </div>

        <div className="col-md-6">
          <h4 className="mb-4">Estadísticas para {formatoFecha()}</h4>
          
          {estadisticas.length > 0 ? (
            <>
              <div className="alert alert-info">
                <strong>Total de asistentes:</strong> {totalGeneral}
              </div>
              
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Porcentaje</th>
                      <th>Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estadisticas.map((est, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td>{est.tipo}</td>
                          <td>{est.total}</td>
                          <td>{est.porcentaje}%</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-info"
                              onClick={() => setDetalles(detalles === index ? null : index)}
                            >
                              {detalles === index ? 'Ocultar' : 'Ver'} detalles
                            </button>
                          </td>
                        </tr>
                        
                        {detalles === index && (
                          <tr>
                            <td colSpan="4">
                              <div className="p-3 bg-light rounded">
                                <h5>Distribución por edades ({est.tipo})</h5>
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>Rango de edad</th>
                                      <th>Cantidad</th>
                                      <th>Porcentaje</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {est.registros.map((reg, i) => (
                                      <tr key={i}>
                                        <td>{reg.rango}</td>
                                        <td>{reg.cantidad}</td>
                                        <td>
                                          {est.total > 0 
                                            ? ((reg.cantidad / est.total) * 100).toFixed(2) + '%' 
                                            : '0%'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="alert alert-warning">
              No hay datos disponibles para la fecha seleccionada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}