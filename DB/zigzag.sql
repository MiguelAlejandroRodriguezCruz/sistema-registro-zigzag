-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 29-04-2025 a las 01:31:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `zigzag`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitantesidependientes`
--

CREATE TABLE `visitantesidependientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `medioEnterado` varchar(100) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `estatus` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitantesidependientes`
--

INSERT INTO `visitantesidependientes` (`id`, `nombre`, `fecha`, `hora`, `telefono`, `correo`, `medioEnterado`, `monto`, `codigo`, `estatus`) VALUES
(1, 'Pedro López', '2025-04-05', '10:30 AM', '5551234567', 'pedro@example.com', 'Publicidad', 100.00, 'ABCD1234', 'nuevo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitantesinstitucion`
--

CREATE TABLE `visitantesinstitucion` (
  `id` int(11) NOT NULL,
  `nombreSoli` varchar(100) DEFAULT NULL,
  `nombreOrg` varchar(100) DEFAULT NULL,
  `noVisitantesA` int(11) DEFAULT NULL,
  `noVisitantesD` int(11) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `colonia` varchar(100) DEFAULT NULL,
  `municipio` varchar(100) DEFAULT NULL,
  `autobus` varchar(50) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `tipoRecorrido` varchar(100) DEFAULT NULL,
  `gradoEscolar` varchar(100) DEFAULT NULL,
  `autorizaFotos` varchar(10) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `horario` varchar(50) DEFAULT NULL,
  `medioEnterado` varchar(100) DEFAULT NULL,
  `comentarios` text DEFAULT NULL,
  `precioEntrada` decimal(10,2) DEFAULT NULL,
  `estatus` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitantesinstitucion`
--

INSERT INTO `visitantesinstitucion` (`id`, `nombreSoli`, `nombreOrg`, `noVisitantesA`, `noVisitantesD`, `telefono`, `direccion`, `colonia`, `municipio`, `autobus`, `correo`, `tipoRecorrido`, `gradoEscolar`, `autorizaFotos`, `fecha`, `horario`, `medioEnterado`, `comentarios`, `precioEntrada`, `estatus`) VALUES
(1, 'Juan Pérez', 'Escuela Primaria XYZ', 25, 5, '1234567890', 'Calle Falsa 123', 'Centro', 'Ciudad Ejemplo', 'Sí', 'juan.perez@example.com', 'Educativo', 'Primaria', 'Sí', '2025-04-17', '10:00 AM', 'Redes Sociales', 'Grupo de alumnos de primaria.', 50.00, 'aprobadas'),
(2, 'a', 'a', 1, 2, '2447854632', '4 norte', 'a', 'a', 'No', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'aa', 'Si', '2025-04-29', '03:00', 'Amigos', 'a', 50.00, 'rechazadas'),
(3, 'a', 'a', 12, 12, '2447854632', '4 norte', 'q', 'a', 'No', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'a', 'Si', '2025-04-29', '01:00', 'Amigos', '', 50.00, 'aprobadas');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `visitantesidependientes`
--
ALTER TABLE `visitantesidependientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `visitantesinstitucion`
--
ALTER TABLE `visitantesinstitucion`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `visitantesidependientes`
--
ALTER TABLE `visitantesidependientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `visitantesinstitucion`
--
ALTER TABLE `visitantesinstitucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
