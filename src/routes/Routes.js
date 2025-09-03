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
import LoginAdmin from '../components/Login/LoginAdmin';
import Registro from '../components/Login/Registro'
import NuevaContrasena from '../components/Login/NuevaContrasena';
import SolicitarCodigo from '../components/Login/SolicitarCodigo';
import VerificarCodigo from '../components/Login/VerificarCodigo';
import PrivateRoute from '../components/PrivateRoute';

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
                <Route path="/eventos-visitantes" element={<PrivateRoute><EventosVisitantes /></PrivateRoute>} />
                <Route path="/eventos-descripcion/:id" element={<PrivateRoute><EventosDescripcion /></PrivateRoute>} />
                <Route path='/login' element={<Login />} />
                <Route path='/login-admin' element={<LoginAdmin />} />
                <Route path='/registro' element={<Registro />} />
                <Route path='/nueva-contrasena' element={<NuevaContrasena />} />
                <Route path='/solicitar-codigo' element={<SolicitarCodigo />} />
                <Route path='/verificar-codigo' element={<VerificarCodigo />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;