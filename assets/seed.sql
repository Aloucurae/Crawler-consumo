/* SQLyog Ultimate v13.1.1 (64 bit) MySQL - 5.7.40 : Database - teste ********************************************************************* */ /*!40101

SET NAMES utf8 */; /*!40101
SET SQL_MODE = ''*/; /*!40014
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */; /*!40014
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */; /*!40101
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */; /*!40111
SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`teste` /*!40100 DEFAULT CHARACTER

SET latin1 */; USE `teste`; /*Table structure for TABLE `carro` */ DROP TABLE IF EXISTS `carro`;

CREATE TABLE `carro` ( `id` int(11) NOT NULL AUTO_INCREMENT, `nome` varchar(255) DEFAULT NULL, `url` varchar(255) DEFAULT NULL, `image` varchar(255) DEFAULT NULL, `marcaId` int(11) NOT NULL, PRIMARY KEY (`id`), KEY `marcaId` (`marcaId`), CONSTRAINT `carro_ibfk_1` FOREIGN KEY (`marcaId`) REFERENCES `marca` (`id`) ) ENGINE = InnoDB AUTO_INCREMENT = 634 DEFAULT CHARSET = latin1; /*Table structure for TABLE `consumo` */ DROP TABLE IF EXISTS `consumo`;

CREATE TABLE `consumo` ( `id` int(11) NOT NULL AUTO_INCREMENT, `tipo` varchar(250) DEFAULT NULL, `consumo` float DEFAULT NULL, `combustivel` varchar(250) DEFAULT NULL, `versaoID` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE = InnoDB AUTO_INCREMENT = 17723 DEFAULT CHARSET = latin1; /*Table structure for TABLE `marca` */ DROP TABLE IF EXISTS `marca`;

CREATE TABLE `marca` ( `id` int(11) NOT NULL AUTO_INCREMENT, `nome` varchar(250) DEFAULT NULL, `image` varchar(250) DEFAULT NULL, `url` varchar(250) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE = InnoDB AUTO_INCREMENT = 29 DEFAULT CHARSET = latin1; /*Table structure for TABLE `versao` */ DROP TABLE IF EXISTS `versao`;
CREATE TABLE `versao` ( `id` int(11) NOT NULL AUTO_INCREMENT, `carroID` int(11) NOT NULL, `versao` varchar(250) DEFAULT NULL, `image` varchar(250) DEFAULT NULL, `ano` varchar(250) DEFAULT NULL, `tipo` varchar(250) DEFAULT NULL, `url` varchar(250) DEFAULT NULL, `tanque` int(11) DEFAULT NULL, `valorFipe` float DEFAULT NULL, `ModeloFipe` varchar(250) DEFAULT NULL, `anoFipe` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE = InnoDB AUTO_INCREMENT = 6134 DEFAULT CHARSET = latin1; /*!40101
SET SQL_MODE = @OLD_SQL_MODE */; /*!40014
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */; /*!40014
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS */; /*!40111
SET SQL_NOTES = @OLD_SQL_NOTES */;