-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-07-2025 a las 04:08:57
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
-- Estructura de tabla para la tabla `codigos_recuperacion`
--

CREATE TABLE `codigos_recuperacion` (
  `id` int(11) NOT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `codigo` int(11) DEFAULT NULL,
  `expiracion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `codigos_recuperacion`
--

INSERT INTO `codigos_recuperacion` (`id`, `correo`, `codigo`, `expiracion`) VALUES
(1, 'miguel.ale.rodri.cruz@gmail.com', 812751, '2025-07-02 19:07:01'),
(2, 'miguel.ale.rodri.cruz@gmail.com', 676734, '2025-07-02 19:14:32');

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
(19, 'evento 3 con id 19', '2025-07-05', '2025-07-06', 'casa del pana', 'ejemplo de descripcion larga, hvdeioufhdwibd cdhwilbdhb bhiqobnobc vjefiqpfhvu jn[w hdj9pqinvdjb vunjiqepbvdb vfejipbqvjdfbvp vjiqpvbnjefi vbrejipqvnjfd bvujefipbvndfjk bvfejipvbjndk bvufejipanfv vnefjipvnjcdsip bvfejipabvdjks bvjefipandsjkvn bvjciepanjvpn vjefipahfjenav[ nvre[aovdjocnjao[ uvjoeapvnjoanv vrjeorahfieoasnv fhcrioaj[sfdjcns hfreai[fjosadn hfio[awhfnerjna fjeario[fjcrjevn[ hvreioa[hfreaojfnfhrh hreo[ahv hfroeaphf freaofhreohf[or   fhro[eahfiahf frhio[eahf fheao[hfrjh[f hofa', '[{\"id\":1751503649560,\"type\":\"checkbox\",\"label\":\"si marcas esta casilla es porque aceptas que asisitiras baniado y arreglado y no como te despertaste hoy por la maniana todo crudo y desvelado\",\"required\":true,\"options\":null}]', 'http://localhost:3001/uploads/baner-1751503655418-6343986.jpeg'),
(20, 'evento 4 con id 20', '2025-07-07', '2025-07-09', 'casa del pana', 'evento aca super genial bien jelou chido mega padre del zigzag', '[{\"id\":1751503719685,\"type\":\"checkbox\",\"label\":\"si marcas esta casilla es porque aceptas que asisitiras baniado y arreglado y no como te despertaste hoy por la maniana todo crudo y desvelado\",\"required\":true,\"options\":null}]', 'http://localhost:3001/uploads/baner-1751503762806-80455044.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formularios`
--

CREATE TABLE `formularios` (
  `id` int(11) NOT NULL,
  `id_visitante` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `formulario` varchar(500) NOT NULL,
  `fecha_evento` date NOT NULL,
  `num_adultos` int(11) NOT NULL,
  `num_ninos` int(11) NOT NULL,
  `codigo_qr` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formularios`
--

INSERT INTO `formularios` (`id`, `id_visitante`, `id_evento`, `formulario`, `fecha_evento`, `num_adultos`, `num_ninos`, `codigo_qr`) VALUES
(9, 2, 19, '{\"1751503649560\":true}', '2025-07-05', 1, 2, 'RES-9-1751509013611'),
(10, 2, 20, '{\"1751503719685\":true}', '2025-07-08', 2, 2, 'RES-10-1751509094795');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `ruta_imagen` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes`
--

INSERT INTO `imagenes` (`id`, `evento_id`, `ruta_imagen`) VALUES
(17, 19, 'http://localhost:3001/uploads/imagenes-1751503655437-754359859.jpeg'),
(18, 20, 'http://localhost:3001/uploads/imagenes-1751503762827-620082890.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registrovisitas`
--

CREATE TABLE `registrovisitas` (
  `id` int(11) NOT NULL,
  `id_institucion` int(11) NOT NULL,
  `tipo` enum('Niño','Niña','Hombre','Mujer','Maestro') NOT NULL,
  `rango` enum('5-10','10-15','15-18','20-30','30-40','40+') NOT NULL,
  `cantidad` int(3) NOT NULL,
  `fecha_registro` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registrovisitas`
--

INSERT INTO `registrovisitas` (`id`, `id_institucion`, `tipo`, `rango`, `cantidad`, `fecha_registro`) VALUES
(30, 4, 'Niño', '5-10', 10, '2025-07-16'),
(31, 4, 'Niño', '10-15', 20, '2025-07-16'),
(32, 4, 'Niña', '15-18', 20, '2025-07-16'),
(33, 4, 'Hombre', '30-40', 20, '2025-07-16'),
(34, 4, 'Mujer', '20-30', 20, '2025-07-16'),
(35, 4, 'Maestro', '20-30', 10, '2025-07-16'),
(36, 1, 'Niño', '5-10', 1, '2025-07-31'),
(37, 1, 'Niño', '10-15', 2, '2025-07-31'),
(38, 1, 'Niña', '10-15', 3, '2025-07-31'),
(39, 1, 'Hombre', '30-40', 4, '2025-07-31'),
(40, 1, 'Hombre', '40+', 5, '2025-07-31'),
(41, 1, 'Mujer', '20-30', 6, '2025-07-31'),
(42, 1, 'Mujer', '40+', 7, '2025-07-31'),
(43, 1, 'Maestro', '20-30', 8, '2025-07-31');

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
  `estatus` varchar(20) DEFAULT 'pendientes' CHECK (`estatus` in ('nuevo','pendientes','aprobadas','rechazadas','registradas'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitantesinstitucion`
--

INSERT INTO `visitantesinstitucion` (`id`, `nombreSoli`, `nombreOrg`, `noVisitantesA`, `noVisitantesD`, `telefono`, `direccion`, `colonia`, `municipio`, `autobus`, `correo`, `tipoRecorrido`, `gradoEscolar`, `autorizaFotos`, `fecha`, `horario`, `medioEnterado`, `comentarios`, `precioEntrada`, `estatus`) VALUES
(1, 'Juan Pérez', 'Escuela Primaria XYZ', 25, 5, '1234567890', 'Calle Falsa 123', 'Centro', 'Ciudad Ejemplo', 'Sí', 'juan.perez@example.com', 'Educativo', 'Primaria', 'Sí', '2025-04-17', '10:00 AM', 'Redes Sociales', 'Grupo de alumnos de primaria.', 50.00, 'registradas'),
(2, 'a', 'a', 1, 2, '2447854632', '4 norte', 'a', 'a', 'No', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'aa', 'Si', '2025-04-29', '03:00', 'Amigos', 'a', 50.00, 'aprobadas'),
(3, 'a', 'a', 12, 12, '2447854632', '4 norte', 'q', 'a', 'No', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'a', 'Si', '2025-04-29', '01:00', 'Amigos', '', 50.00, 'aprobadas'),
(4, 'axel', 'IPN', 100, 5, '5 5555 5555', 'ejemplo', 'ejemplo', 'ejemplo', 'Si', 'ejemplo@ejemplo.com', 'Presencial', 'primaria', 'Si', '2025-07-16', '01:00', 'Amigos', 'vamos a loquear con ciencia', 50.00, 'registradas');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formularios`
--
ALTER TABLE `formularios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_visitante` (`id_visitante`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evento_id` (`evento_id`);

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
-- Indices de la tabla `visitantesinstitucion`
--
ALTER TABLE `visitantesinstitucion`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `formularios`
--
ALTER TABLE `formularios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `registrovisitas`
--
ALTER TABLE `registrovisitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `visitanteseventos`
--
ALTER TABLE `visitanteseventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `visitantesinstitucion`
--
ALTER TABLE `visitantesinstitucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `formularios`
--
ALTER TABLE `formularios`
  ADD CONSTRAINT `formularios_ibfk_1` FOREIGN KEY (`id_visitante`) REFERENCES `visitanteseventos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `formularios_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
