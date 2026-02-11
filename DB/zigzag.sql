-- ==========================================
-- INICIO DEL SCRIPT DE REINICIO DE BASE DE DATOS
-- ==========================================

-- 1. Eliminar la base de datos si ya existe
DROP DATABASE IF EXISTS zigzag;

-- 2. Crear la base de datos nueva
CREATE DATABASE zigzag CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 3. Seleccionar la base de datos para usarla
USE zigzag;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- CREACIÓN DE TABLAS (SIN DATOS)
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--
CREATE TABLE `imagenes` (
  `id` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `ruta_imagen` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuariosadmin`
--
CREATE TABLE `usuariosadmin` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------
-- DEFINICIÓN DE ÍNDICES Y LLAVES PRIMARIAS
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- DEFINICIÓN DE AUTO_INCREMENT
-- --------------------------------------------------------

--
-- AUTO_INCREMENT de la tabla `archivos_formulario`
--
ALTER TABLE `archivos_formulario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formularios`
--
ALTER TABLE `formularios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registrovisitas`
--
ALTER TABLE `registrovisitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuariosadmin`
--
ALTER TABLE `usuariosadmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `visitanteseventos`
--
ALTER TABLE `visitanteseventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `visitantesinstitucion`
--
ALTER TABLE `visitantesinstitucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------
-- DEFINICIÓN DE RELACIONES (FOREIGN KEYS)
-- --------------------------------------------------------

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