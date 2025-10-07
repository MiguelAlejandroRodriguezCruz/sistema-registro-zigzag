-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-10-2025 a las 19:21:43
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
(1, 23, '1759417824388', 'http://localhost:3001/docs_eventos/19_Evento1/doc_1759857320498_314550548_Comandos bÃ¡sicos de consola.pdf', '2025-10-07 17:15:20'),
(2, 23, '1759417836942', 'http://localhost:3001/docs_eventos/19_Evento1/doc_1759857320500_853967029_Comandos bÃ¡sicos de consola.pdf', '2025-10-07 17:15:20');

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
  `formulario` varchar(500) NOT NULL,
  `baner` varchar(100) NOT NULL,
  `maxPersonas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evento`
--

INSERT INTO `evento` (`id`, `nombre`, `fechaInicio`, `fechaFinal`, `lugar`, `descripcion`, `formulario`, `baner`, `maxPersonas`) VALUES
(19, 'Evento1', '2025-07-05', '2025-07-06', 'casa del pana', 'ejemplo de descripcion larga y yo, hvdeioufhdwibd cdhwilbdhb bhiqobnobc vjefiqpfhvu jn[w hdj9pqinvdjb vunjiqepbvdb vfejipbqvjdfbvp vjiqpvbnjefi vbrejipqvnjfd bvujefipbvndfjk bvfejipvbjndk bvufejipanfv vnefjipvnjcdsip bvfejipabvdjks bvjefipandsjkvn bvjciepanjvpn vjefipahfjenav[ nvre[aovdjocnjao[ uvjoeapvnjoanv vrjeorahfieoasnv fhcrioaj[sfdjcns hfreai[fjosadn hfio[awhfnerjna fjeario[fjcrjevn[ hvreioa[hfreaojfnfhrh hreo[ahv hfroeaphf freaofhreohf[or   fhro[eahfiahf frhio[eahf fheao[hfrjh[f hofa', '[{\"id\":1759417824388,\"type\":\"file\",\"label\":\"CURP\",\"required\":true,\"options\":null,\"acceptedTypes\":\".pdf\"},{\"id\":1759417836942,\"type\":\"file\",\"label\":\"Acta de nacimiento\",\"required\":true,\"options\":null,\"acceptedTypes\":\".pdf\"}]', 'http://localhost:3001/uploads/baner-1751503655418-6343986.jpeg', 10),
(20, 'Evento2', '2025-07-07', '2025-07-09', 'casa del pana', 'evento aca super genial bien jelou chido mega padre del zigzag', '[{\"id\":1751503719685,\"type\":\"checkbox\",\"label\":\"si marcas esta casilla es porque aceptas que asisitiras baniado y arreglado y no como te despertaste hoy por la maniana todo crudo y desvelado\",\"required\":true,\"options\":null}]', 'http://localhost:3001/uploads/baner-1751503762806-80455044.jpeg', 20),
(21, 'Fiesta', '2025-07-14', '2025-07-18', 'No se ', 'Hola', '[{\"id\":1752712868390,\"type\":\"text\",\"label\":\"Hola\",\"required\":true,\"options\":null}]', 'http://localhost:3001/uploads/baner-1752712874894-549289001.png', NULL);

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
(20, 9, 21, '{\"1752712868390\":\"q\"}', '2025-07-16', 12, 12, 'uploads\\qrcode-20-1757005854442.png'),
(23, 10, 19, '{\"1759417824388\":\"Comandos básicos de consola.pdf\",\"1759417836942\":\"Comandos básicos de consola.pdf\"}', '2025-07-05', 1, 10, 'uploads\\qrcode-23-1759857320514.png');

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
(18, 20, 'http://localhost:3001/uploads/imagenes-1751503762827-620082890.jpeg'),
(20, 21, 'http://localhost:3001/uploads/imagenes-1752715773153-240889153.png'),
(25, 20, 'http://localhost:3001/uploads/imagenes-1754414896885-683748217.jpg'),
(29, 20, 'http://localhost:3001/uploads/imagenes-1754502447298-690484407.png'),
(30, 20, 'http://localhost:3001/uploads/imagenes-1754502447300-795737231.png'),
(31, 20, 'http://localhost:3001/uploads/imagenes-1754502447301-268149763.png'),
(32, 20, 'http://localhost:3001/uploads/imagenes-1754502447303-341909390.png');

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
(9, 'Miguel Alejandro', 'miguel.ale.rodri.cruz@gmail.com', 22, '$2b$10$dsMalG1rV7m9pJcMj/7HM.rSxFbdWOho6Kd9ZyZPH2fxZ6U2YllFK'),
(10, 'axel', 'axelojedahernandez64@gmail.com', 22, '$2b$10$1H8ge3O42si7eRuzmZMM3.196tCfHzl233/7EUdUaeZ091mgUhozS');

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
(1, 'Juan Pérez', 'Escuela Primaria XYZ', 25, 5, '1234567890', 'Calle Falsa 123', 'Centro', 'Ciudad Ejemplo', 'Sí', 'juan.perez@example.com', 'Educativo', 'Primaria', 'Sí', '2025-04-17', '10:00 AM', 'Redes Sociales', 'Grupo de alumnos de primaria.', 50.00, 'aprobadas', 0),
(2, 'a', 'a', 1, 2, '2447854632', '4 norte', 'a', 'a', 'Si', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'aa', 'Si', '2025-04-29', '01:00', 'Amigos', 'a', 50.00, 'aprobadas', 0),
(3, 'a', 'a', 12, 12, '2447854632', '4 norte', 'q', 'a', 'No', 'miguel.ale.rodri.cruz@gmail.com', 'Virtual', 'a', 'Si', '2025-04-29', '01:00', 'Amigos', '', 50.00, 'aprobadas', 0),
(4, 'axel jo', 'IPN UPIIZ', 100, 5, '5 5555 5555', 'ejemplo', 'ejemplo', 'ejemplo', 'Si', 'ejemplo@ejemplo.com', 'Presencial', 'primaria', 'Si', '2025-07-16', '01:00', 'Amigos', 'vamos a loquear con ciencia', 50.00, 'aprobadas', 25),
(5, 'q', 'q', 12, 12, '1234567890', 'q', 'q', 'q', 'Si', 'miguel.ale.rodri.cruz@gmail.com', 'Presencial', 'q', 'Si', '2025-08-14', '01:00', 'Amigos', 'q', 50.00, 'aprobadas', 0),
(6, 'a', 'a', 12, 12, '1234567890', 'De Rayo', 's', 'asd', 'Si', 'miguel.ale.rodri.cruz@gmail.com', 'Presencial', '12', 'Si', '2025-09-10', '01:00', 'Amigos', 's', 50.00, 'aprobadas', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `formularios`
--
ALTER TABLE `formularios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `visitantesinstitucion`
--
ALTER TABLE `visitantesinstitucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
