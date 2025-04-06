import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Inicio from '../components/Inicio';
import Taquilla from '../components/Taquilla';

const AppRoutes = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/" element={<Inicio />} />
                <Route path="*" element={<Navigate to="/inicio" />} />
                <Route path='taquilla' element={<Taquilla />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
