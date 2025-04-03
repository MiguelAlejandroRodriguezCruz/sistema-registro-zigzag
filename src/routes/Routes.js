import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Inicio from '../components/Inicio'
import ReservasGenerales  from '../components/ReservasGenerales';

const AppRoutes = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/ReservasGenerales" element={<ReservasGenerales />} />


                <Route path="/" element={<Inicio />} />
                <Route path="*" element={<Navigate to="/inicio" />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
