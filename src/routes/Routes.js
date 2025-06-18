import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Inicio from '../components/Inicio'
import ReservasGenerales  from '../components/ReservasGenerales';
import Taquilla from '../components/Taquilla/Taquilla';
import Visitas from '../components/Visitas';
import Eventos from '../components/Eventos';
import ListaEventos from '../components/ListaEventos';
import EventosVisitantes from '../components/EventosVisitantes';
import EventosDescripcion from '../components/EventosDescripcion';
import Login from '../components/Login/Login';
import Registro from '../components/Login/Registro'

const AppRoutes = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/ReservasGenerales" element={<ReservasGenerales />} />
                <Route path='/taquilla' element={<Taquilla />} />
                <Route path="/" element={<Inicio />} />
                <Route path="*" element={<Navigate to="/inicio" />} />
                <Route path="/visitas" element={<Visitas />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/eventos/:id" element={<Eventos />} />
                <Route path="/lista-eventos" element={<ListaEventos />} />
                <Route path="/eventos-visitantes" element={<EventosVisitantes />} />
                <Route path="/eventos-descripcion" element={<EventosDescripcion />} />
                <Route path='/login' element={<Login />} />
                <Route path='/registro' element={<Registro />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;