import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/App.css';
import './style/Encabezado.css';
import './style/PieDePagina.css';
import './style/Login.css';
import './style/Taquilla.css';
import './style/FormularioDatos.css';
import './style/ListaEventos.css';
import './style/EventosVisitantes.css';
import './style/EventosDescripcion.css';
import './style/ReservasGenerales.css';
import './style/CalendarioOcupado.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Routes from './routes/Routes'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
