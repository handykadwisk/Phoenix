/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 10.4.32-MariaDB : Database - insurance_wording
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `r_cobs` */

DROP TABLE IF EXISTS `r_cobs`;

CREATE TABLE `r_cobs` (
  `COB_ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `COB_NAME` varchar(191) NOT NULL,
  `CREATED_BY` int(11) NOT NULL,
  `CREATED_DATE` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`COB_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_cobs` */

insert  into `r_cobs`(`COB_ID`,`COB_NAME`,`CREATED_BY`,`CREATED_DATE`) values (1,'Aviation Hull',0,'2025-01-06 09:19:26'),(2,'Builders Risk',0,'2024-12-16 14:42:03'),(3,'Burglary',0,'2024-12-16 14:42:03'),(4,'Contractor Plant & Machinery',0,'2024-12-16 14:42:03'),(5,'Contractors All Risk',0,'2024-12-16 14:42:03'),(6,'Credit',0,'2024-12-16 14:42:03'),(7,'Customs Bond',0,'2024-12-16 14:42:03'),(8,'Earthquake',0,'2024-12-16 14:42:03'),(9,'Electronic Equipment Insurance',0,'2024-12-16 14:42:03'),(10,'Erection All Risk',0,'2024-12-16 14:42:03'),(11,'Fidelity',0,'2024-12-16 14:42:03'),(12,'Fine Art',0,'2024-12-16 14:42:03'),(13,'Fire',0,'2024-12-16 14:42:03'),(14,'Health',0,'2024-12-16 14:42:03'),(15,'Heavy Equipment',0,'2024-12-16 14:42:03'),(16,'Hole In One',0,'2024-12-16 14:42:03'),(17,'Industrial All Risk',0,'2024-12-16 14:42:03'),(18,'Industrial Special Risk',0,'2024-12-16 14:42:03'),(19,'Liability',0,'2024-12-16 14:42:03'),(20,'Machinery',0,'2024-12-16 14:42:03'),(21,'Marine Cargo',0,'2024-12-16 14:42:03'),(22,'Hull & Machinery',0,'2024-12-16 14:42:03'),(23,'Marine Open Cover',0,'2024-12-16 14:42:03'),(24,'Money Insurance',0,'2024-12-16 14:42:03'),(25,'Motor Vehicle Insurance',0,'2024-12-16 14:42:03'),(26,'Moveable All Risk',0,'2024-12-16 14:42:03'),(27,'PA & LoL',0,'2024-12-16 14:42:03'),(28,'Personal Accident',0,'2024-12-16 14:42:03'),(29,'Professional Indemnity',0,'2024-12-16 14:42:03'),(30,'Property [Industrial] All Risk',0,'2024-12-16 14:42:03'),(31,'Protection & Indemnity',0,'2024-12-16 14:42:03'),(32,'Surety Bond',0,'2024-12-16 14:42:03'),(33,'Terrorism & Sabotage',0,'2024-12-16 14:42:03'),(34,'Travel',0,'2024-12-16 14:42:03'),(35,'Workmen\'s Compensation',0,'2024-12-16 14:42:03'),(36,'Employer\'s Liability',0,'2024-12-16 14:42:03'),(37,'Business Interuption',0,'2024-12-16 14:42:03'),(38,'Growing Crops',0,'2024-12-16 14:42:03'),(39,'Public Liability',0,'2024-12-16 14:42:03'),(40,'Premises Pollution Liability',0,'2024-12-16 14:42:03'),(41,'Container Insurance',0,'2024-12-16 14:42:03'),(42,'Cable Operator\'s Policy',0,'2024-12-16 14:42:03'),(43,'Comprehensive Machinery Insurance',0,'2024-12-16 14:42:03'),(44,'Civil Engineering Completed Risk',0,'2024-12-16 14:42:03'),(45,'Machinery Loss of Profit',0,'2024-12-16 14:42:03'),(46,'Comprehensive Project Insurance',0,'2024-12-16 14:42:03'),(47,'Ship Repairer Liability',0,'2024-12-16 14:42:03'),(48,'Freight Forwarder Liability',0,'2024-12-16 14:42:03'),(49,'Live Stock (Asuransi Ternak)',0,'2024-12-16 14:42:03'),(50,'Product Liability',0,'2024-12-16 14:42:03'),(51,'Pollution Liability',0,'2024-12-16 14:42:03'),(52,'Director & Officer',0,'2024-12-16 14:42:03'),(53,'HE Special Risk',0,'2024-12-16 14:42:03'),(54,'Bid Bond',0,'2024-12-16 14:42:03'),(55,'Advance Payment Bond',0,'2024-12-16 14:42:03'),(56,'Performance Bond',0,'2024-12-16 14:42:03'),(57,'Custom Bond',0,'2024-12-16 14:42:03'),(58,'Maintenance Bond',0,'2024-12-16 14:42:03'),(59,'Bank Guarantee',0,'2024-12-16 14:42:03'),(60,'Jiwa Kredit',0,'2024-12-16 14:42:03'),(61,'Term Life',0,'2024-12-16 14:42:03'),(62,'Marine Open Policy',0,'2024-12-16 14:42:03'),(63,'Terminal Operator Liability',0,'2024-12-16 14:42:03'),(64,'Port Operator Liability',0,'2024-12-16 14:42:03'),(65,'Trade Credit Insurance',0,'2024-12-16 14:42:03'),(66,'Export Credit Insurance',0,'2024-12-16 14:42:03'),(67,'Credit Insurance',0,'2024-12-16 14:42:03'),(68,'Employee Benefit',0,'2024-12-16 14:42:03'),(69,'Boiler & Pressure Vessel',0,'2024-12-16 14:42:03'),(70,'Neon Sign Insurance',0,'2024-12-16 14:42:03'),(71,'Land Rig Insurance',0,'2024-12-16 14:42:03'),(72,'Offshore Rig Insurance',0,'2024-12-16 14:42:03'),(73,'Port Terminal Operator Liability',0,'2024-12-16 14:42:03'),(74,'Neon Sign Billboard',0,'2024-12-16 14:42:03'),(75,'Comprehensive General Liability',0,'2024-12-16 14:42:03'),(76,'Store Financing Askred',0,'2024-12-16 14:42:03');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
