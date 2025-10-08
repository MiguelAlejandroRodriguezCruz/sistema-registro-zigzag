-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-10-2025 a las 23:22:00
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
-- Estructura de tabla para la tabla `archivos_formulario`
--

CREATE TABLE `archivos_formulario` (
  `id` int(11) NOT NULL,
  `id_formulario` int(11) NOT NULL,
  `campo_id` varchar(100) NOT NULL,
  `ruta_archivo` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `archivos_formulario`
--

INSERT INTO `archivos_formulario` (`id`, `id_formulario`, `campo_id`, `ruta_archivo`, `created_at`) VALUES
(14, 32, '1759956942581', 'http://localhost:3001/docs_eventos/25_Campamento/doc_1759957397917_590003685_boletos.pdf', '2025-10-08 21:03:17'),
(15, 33, '1759956942581', 'http://localhost:3001/docs_eventos/25_Campamento/doc_1759957485733_254586077_boletos (1).pdf', '2025-10-08 21:04:45');

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
(2, 'miguel.ale.rodri.cruz@gmail.com', 676734, '2025-07-02 19:14:32'),
(3, 'miguel.ale.rodri.cruz@gmail.com', 655382, '2025-07-16 19:47:19'),
(4, 'miguel.ale.rodri.cruz@gmail.com', 237578, '2025-08-05 12:02:00'),
(5, 'miguel.ale.rodri.cruz@gmail.com', 476487, '2025-08-05 12:09:22'),
(6, 'miguel.ale.rodri.cruz@gmail.com', 593860, '2025-08-05 12:18:18'),
(7, 'miguel.ale.rodri.cruz@gmail.com', 198599, '2025-08-05 12:18:43'),
(8, 'miguel.ale.rodri.cruz@gmail.com', 929781, '2025-08-05 12:31:46'),
(9, 'miguel.ale.rodri.cruz@gmail.com', 165443, '2025-08-05 12:32:56'),
(10, 'miguel.ale.rodri.cruz@gmail.com', 895658, '2025-08-05 12:36:05'),
(11, 'miguel.ale.rodri.cruz@gmail.com', 709101, '2025-09-04 12:04:36'),
(12, 'miguel.ale.rodri.cruz@gmail.com', 735960, '2025-09-04 12:10:37'),
(13, 'miguel.ale.rodri.cruz@gmail.com', 980644, '2025-09-04 12:18:57'),
(14, 'miguel.ale.rodri.cruz@gmail.com', 675261, '2025-09-04 12:20:54'),
(15, 'miguel.ale.rodri.cruz@gmail.com', 654788, '2025-09-04 12:27:53'),
(16, 'miguel.ale.rodri.cruz@gmail.com', 582623, '2025-09-04 12:32:29'),
(17, 'miguel.ale.rodri.cruz@gmail.com', 660325, '2025-09-04 12:42:38');

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
  `formulario` varchar(2000) NOT NULL,
  `baner` varchar(100) NOT NULL,
  `maxPersonas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evento`
--

INSERT INTO `evento` (`id`, `nombre`, `fechaInicio`, `fechaFinal`, `lugar`, `descripcion`, `formulario`, `baner`, `maxPersonas`) VALUES
(24, 'Semana Cientifica', '2025-10-14', '2025-10-23', 'Area de ciencias', '¡Celebra con nosotros la Semana Científica y descubre cómo la ciencia transforma el mundo! Durante siete días, el museo se llenará de experimentos, demostraciones, talleres, conferencias y actividades interactivas diseñadas para despertar la curiosidad y fomentar el aprendizaje en todas las edades.\r\n\r\nCada día estará dedicado a una rama diferente del conocimiento: desde la astronomía y la biología, hasta la robótica, la energía y la tecnología del futuro. ', '[{\"id\":1759956650029,\"type\":\"text\",\"label\":\"Nombre\",\"required\":true,\"options\":null},{\"id\":1759956655822,\"type\":\"number\",\"label\":\"Edad\",\"required\":true,\"options\":null},{\"id\":1759956662062,\"type\":\"checkbox\",\"label\":\"Traeras bata de laboratorio?\",\"required\":true,\"options\":null}]', 'http://localhost:3001/uploads/baner-1759956686687-214253732.png', 50),
(25, 'Campamento', '2025-10-13', '2025-10-23', 'Area designada', '¡La ciencia se vive, se toca y se experimenta! En nuestro Campamento Científico, los participantes se convertirán en jóvenes exploradores del conocimiento, experimentando con la física, la biología, la robótica, la astronomía y muchas otras áreas de la ciencia de forma divertida, dinámica e interactiva.', '[{\"id\":1759956913068,\"type\":\"text\",\"label\":\"Nombre\",\"required\":true,\"options\":null},{\"id\":1759956918773,\"type\":\"number\",\"label\":\"Edad\",\"required\":true,\"options\":null},{\"id\":1759956925732,\"type\":\"number\",\"label\":\"Num. Emergencia\",\"required\":true,\"options\":null},{\"id\":1759956942581,\"type\":\"file\",\"label\":\"Certificado Medico\",\"required\":true,\"options\":null,\"acceptedTypes\":\".pdf\"}]', 'http://localhost:3001/uploads/baner-1759956960752-694498326.webp', 50),
(26, 'Semana Arqueologica', '2025-10-20', '2025-10-24', 'Area de Arqueologica ', '¡Acompáñanos en una semana llena de descubrimientos, ciencia y aventura! En la Semana de la Arqueología, exploraremos cómo la tecnología moderna nos ayuda a revelar los secretos del pasado. A través de talleres interactivos, exhibiciones, charlas y actividades prácticas, los visitantes podrán convertirse en arqueólogos por un día, desenterrando piezas, analizando hallazgos y comprendiendo la historia de las civilizaciones antiguas.', '[]', 'http://localhost:3001/uploads/baner-1759957200265-477874851.jpg', 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formularios`
--

CREATE TABLE `formularios` (
  `id` int(11) NOT NULL,
  `id_visitante` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `formulario` varchar(2000) NOT NULL,
  `fecha_evento` date NOT NULL,
  `num_adultos` int(11) NOT NULL,
  `num_ninos` int(11) NOT NULL,
  `codigo_qr` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formularios`
--

INSERT INTO `formularios` (`id`, `id_visitante`, `id_evento`, `formulario`, `fecha_evento`, `num_adultos`, `num_ninos`, `codigo_qr`) VALUES
(32, 11, 25, '{\"1759956913068\":\"Miguel\",\"1759956918773\":\"22\",\"1759956925732\":\"2447854632\",\"1759956942581\":\"boletos.pdf\"}', '2025-10-14', 1, 0, 'uploads\\qrcode-32-1759957397933.png'),
(33, 10, 25, '{\"1759956913068\":\"Axel\",\"1759956918773\":\"21\",\"1759956925732\":\"4921234567\",\"1759956942581\":\"boletos (1).pdf\"}', '2025-10-17', 1, 1, 'uploads\\qrcode-33-1759957485745.png');

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
(34, 24, 'http://localhost:3001/uploads/imagenes-1759956686716-800811033.jpg'),
(35, 24, 'http://localhost:3001/uploads/imagenes-1759956686717-289542162.jpg'),
(36, 25, 'http://localhost:3001/uploads/imagenes-1759956960791-301702465.jpg'),
(37, 25, 'http://localhost:3001/uploads/imagenes-1759956960808-984508872.jpg'),
(38, 26, 'http://localhost:3001/uploads/imagenes-1759957200301-541476136.jpeg');

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
(43, 1, 'Maestro', '20-30', 8, '2025-07-31'),
(44, 5, 'Maestro', '40+', 1, '2025-08-29'),
(45, 3, 'Maestro', '40+', 1, '2025-08-29'),
(46, 2, 'Niño', '5-10', 4, '2025-08-29'),
(47, 2, 'Niño', '15-18', 4, '2025-08-29'),
(48, 2, 'Niña', '10-15', 4, '2025-08-29'),
(49, 2, 'Hombre', '30-40', 6, '2025-08-29'),
(50, 2, 'Mujer', '30-40', 6, '2025-08-29'),
(51, 2, 'Maestro', '20-30', 2, '2025-08-29'),
(52, 2, 'Maestro', '40+', 2, '2025-08-29'),
(53, 1, 'Maestro', '40+', 1, '2025-08-29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuariosadmin`
--

CREATE TABLE `usuariosadmin` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuariosadmin`
--

INSERT INTO `usuariosadmin` (`id`, `nombre`, `contrasena`) VALUES
(1, 'ADMIN', 'Admin123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitanteseventos`
--

CREATE TABLE `visitanteseventos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `edad` int(3) NOT NULL,
  `contrasena` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitanteseventos`
--

INSERT INTO `visitanteseventos` (`id`, `nombre`, `correo`, `edad`, `contrasena`) VALUES
(10, 'axel', 'axelojedahernandez64@gmail.com', 22, '$2b$10$1H8ge3O42si7eRuzmZMM3.196tCfHzl233/7EUdUaeZ091mgUhozS'),
(11, 'Alejandro', 'papu20066@gmail.com', 21, '$2b$10$lpZ7aDPzERTFXCopafSEMuu3s9Q9yWumWUE6UyiLq8DDRMyMNIV9u');

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
  `estatus` varchar(20) DEFAULT 'pendientes' CHECK (`estatus` in ('nuevo','pendientes','aprobadas','rechazadas','registradas')),
  `descuento` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitantesinstitucion`
--

INSERT INTO `visitantesinstitucion` (`id`, `nombreSoli`, `nombreOrg`, `noVisitantesA`, `noVisitantesD`, `telefono`, `direccion`, `colonia`, `municipio`, `autobus`, `correo`, `tipoRecorrido`, `gradoEscolar`, `autorizaFotos`, `fecha`, `horario`, `medioEnterado`, `comentarios`, `precioEntrada`, `estatus`, `descuento`) VALUES
(7, 'Miguel', 'Cbtis ', 50, 4, '2447854632', 'De Rayo', 'Florez Magon', 'Zacatecas Centro', 'Si', 'miguel.ale.rodri.cruz@gmail.com', 'Presencial', '5to', 'Si', '2025-10-15', '01:00', 'Amigos', '', 50.00, 'aprobadas', NULL),
(8, 'Axel', 'Marcelino Gonzalez', 60, 5, '1234567890', 'Calle Loma Dorada', 'La loma', 'Zacatecas Centro', 'No', 'marcelino@gmail.com', 'Presencial', '6to', 'Si', '2025-10-11', '03:00', 'Redes Sociales', 'No se', 50.00, 'aprobadas', NULL),
(9, 'Omar', 'Tecnica ', 40, 3, '1234567890', 'Frezno ', 'Santa Maria La Rivera', 'Cuautemoc', 'Si', 'Omar@gmail.com', 'Presencial', '2do', 'Si', '2025-10-17', '01:00', 'Amigos', '', 50.00, 'rechazadas', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `archivos_formulario`
--
ALTER TABLE `archivos_formulario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formulario` (`id_formulario`);

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
-- Indices de la tabla `usuariosadmin`
--
ALTER TABLE `usuariosadmin`
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
-- AUTO_INCREMENT de la tabla `archivos_formulario`
--
ALTER TABLE `archivos_formulario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `formularios`
--
ALTER TABLE `formularios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `registrovisitas`
--
ALTER TABLE `registrovisitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `usuariosadmin`
--
ALTER TABLE `usuariosadmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `visitanteseventos`
--
ALTER TABLE `visitanteseventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `visitantesinstitucion`
--
ALTER TABLE `visitantesinstitucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `archivos_formulario`
--
ALTER TABLE `archivos_formulario`
  ADD CONSTRAINT `archivos_formulario_ibfk_1` FOREIGN KEY (`id_formulario`) REFERENCES `formularios` (`id`) ON DELETE CASCADE;

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
