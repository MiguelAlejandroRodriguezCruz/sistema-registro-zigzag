import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ReservasGenerales  from '../components/ReservasAdmin/ReservasGenerales';
import Taquilla from '../components/Taquilla/Taquilla';
import Visitas from '../components/Visitas/Visitas';
import Eventos from '../components/EventosAdmin/Eventos';
import ListaEventos from '../components/EventosAdmin/ListaEventos';
import EventosVisitantes from '../components/EventosUsuario/EventosVisitantes';
import EventosDescripcion from '../components/EventosUsuario/EventosDescripcion';
import Login from '../components/Login/Login';
import LoginAdmin from '../components/Login/LoginAdmin';
import Registro from '../components/Login/Registro'
import NuevaContrasena from '../components/Login/NuevaContrasena';
import SolicitarCodigo from '../components/Login/SolicitarCodigo';
import VerificarCodigo from '../components/Login/VerificarCodigo';
import PrivateRouteUsuario from '../components/PrivateRoutes/PrivateRouteUsuario';
import PrivateRouteAdmin from '../components/PrivateRoutes/PrivateRouteAdmin';

const AppRoutes = () => {

    return (
        <Router>
            <Routes>
                <Route path="/ReservasGenerales" element={<PrivateRouteAdmin><ReservasGenerales /></PrivateRouteAdmin>} />
                <Route path='/taquilla' element={<Taquilla />} />
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/visitas" element={<Visitas />} />
                <Route path="/eventos" element={<PrivateRouteAdmin><Eventos /></PrivateRouteAdmin>} />
                <Route path="/eventos/:id" element={<PrivateRouteAdmin><Eventos /></PrivateRouteAdmin>} />
                <Route path="/lista-eventos" element={<PrivateRouteAdmin><ListaEventos /></PrivateRouteAdmin>} />
                <Route path="/eventos-visitantes" element={<PrivateRouteUsuario><EventosVisitantes /></PrivateRouteUsuario>} />
                <Route path="/eventos-descripcion/:id" element={<PrivateRouteUsuario><EventosDescripcion /></PrivateRouteUsuario>} />
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