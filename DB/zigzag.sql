-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2025 a las 01:08:05
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFinal` date NOT NULL,
  `lugar` varchar(50) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `formulario` varchar(500) NOT NULL,
  `baner` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evento`
--

INSERT INTO `evento` (`id`, `nombre`, `fechaInicio`, `fechaFinal`, `lugar`, `descripcion`, `formulario`, `baner`) VALUES
(1, 'expo tt', '2025-06-17', '2025-06-18', 'ipn', 'el pana expone actualizado', 'form temporal', 'banner temporal'),
(2, 'expo tt', '2025-06-18', '2025-06-19', 'ipn', 'expone dess', 'form temporal', 'banner temporal'),
(3, 'expo tt', '2025-06-19', '2025-06-20', 'ipn', 'expone omar', 'form temporal', 'banner temporal'),
(4, 'expo tt', '2025-06-20', '2025-06-21', 'ipn', 'expone axel', 'form temporal', 'banner temporal'),
(5, 'expo tt', '2025-06-29', '2025-06-30', 'ipn', 'el pana expone otra vez porque la primera vez no funciono el prototipo', 'form temporal', 'banner temporal'),
(6, 'ejemplo formulario', '2025-06-29', '2025-06-30', 'casa del pana', 'formulario', '[{\"id\":1751228110988,\"type\":\"text\",\"label\":\"CURP\",\"required\":true,\"options\":null},{\"id\":1751228112797,\"type\":\"number\",\"label\":\"Edad\",\"required\":true,\"options\":null},{\"id\":1751228113398,\"type\":\"select\",\"label\":\"Estado\",\"required\":true,\"options\":[\"zac\",\"puebla\",\"cdmx\"]},{\"id\":1751228113874,\"type\":\"checkbox\",\"label\":\"Eres un robot??\",\"required\":true,\"options\":null},{\"id\":1751228485803,\"type\":\"text\",\"label\":\"Nombre\",\"required\":true,\"options\":null}]', 'banner temporal'),
(7, 'maicra', '2025-06-29', '2025-06-30', 'maicra', 'maicra', '[{\"id\":1751231984765,\"type\":\"checkbox\",\"label\":\"Te apuntas?\",\"required\":true,\"options\":null}]', 'http://localhost:3001/uploads/baner-1751231992849-269240250.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registrovisitas`
--

CREATE TABLE `registrovisitas` (
  `id` int(11) NOT NULL,
  `id_institucion` int(11) NOT NULL,
  `niños5a10` int(3) NOT NULL,
  `niños10a15` int(3) NOT NULL,
  `niños15a18` int(3) NOT NULL,
  `niñas5a10` int(3) NOT NULL,
  `niñas10a15` int(3) NOT NULL,
  `niñas15a18` int(3) NOT NULL,
  `hombres20a30` int(3) NOT NULL,
  `hombres30a40` int(3) NOT NULL,
  `hombres40omas` int(3) NOT NULL,
  `mujeres20a30` int(3) NOT NULL,
  `mujeres30a40` int(3) NOT NULL,
  `mujeres40omas` int(3) NOT NULL,
  `maestros20a30` int(3) NOT NULL,
  `maestros30a40` int(3) NOT NULL,
  `maestros40omas` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registrovisitas`
--

INSERT INTO `registrovisitas` (`id`, `id_institucion`, `niños5a10`, `niños10a15`, `niños15a18`, `niñas5a10`, `niñas10a15`, `niñas15a18`, `hombres20a30`, `hombres30a40`, `hombres40omas`, `mujeres20a30`, `mujeres30a40`, `mujeres40omas`, `maestros20a30`, `maestros30a40`, `maestros40omas`) VALUES
(1, 1, 11, 22, 23, 34, 54, 56, 76, 67, 87, 89, 98, 22, 0, 1, 2),
(2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -5, 0, 5),
(3, 3, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitanteseventos`
--

CREATE TABLE `visitanteseventos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `edad` int(3) NOT NULL,
  `contrasena` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitanteseventos`
--

INSERT INTO `visitanteseventos` (`id`, `nombre`, `correo`, `edad`, `contrasena`) VALUES
(1, 'axel ojeda hernandez', 'axel@ejemplo.com', 22, 'ejemplo'),
(2, 'patroclo', 'patroclo@ejemplo.com', 22, 'ejemplo');

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
(2, 'a', 'a', 1, 2, '2447854632', '4 norte', 'a', 'a', 'No', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'aa', 'Si', '2025-04-29', '03:00', 'Amigos', 'a', 50.00, 'nuevo'),
(3, 'a', 'a', 12, 12, '2447854632', '4 norte', 'q', 'a', 'No', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'a', 'Si', '2025-04-29', '01:00', 'Amigos', '', 50.00, 'nuevo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `registrovisitas`
--
ALTER TABLE `registrovisitas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `visitanteseventos`
--
ALTER TABLE `visitanteseventos`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `registrovisitas`
--
ALTER TABLE `registrovisitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `visitanteseventos`
--
ALTER TABLE `visitanteseventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
