/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 5.7.12 : Database - phoenix_app_dev
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `phoenix_app_dev`;

/*Table structure for table `r_insurance_type` */

DROP TABLE IF EXISTS `r_insurance_type`;

CREATE TABLE `r_insurance_type` (
  `INSURANCE_TYPE_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `INSURANCE_TYPE_NAME` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `INSURANCE_TYPE_INITIAL` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `INSURANCE_TYPE_DESCRIPTION` text COLLATE utf8mb4_unicode_ci,
  `INSURANCE_TYPE_STATUS` smallint(6) DEFAULT NULL,
  `INSURANCE_TYPE_CREATED_BY` int(11) DEFAULT NULL,
  `INSURANCE_TYPE_CREATE_DATE` datetime DEFAULT NULL,
  `INSURANCE_TYPE_UPDATED_BY` int(11) DEFAULT NULL,
  `INSURANCE_TYPE_UPDATED_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`INSURANCE_TYPE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_insurance_type` */

insert  into `r_insurance_type`(`INSURANCE_TYPE_ID`,`INSURANCE_TYPE_NAME`,`INSURANCE_TYPE_INITIAL`,`INSURANCE_TYPE_DESCRIPTION`,`INSURANCE_TYPE_STATUS`,`INSURANCE_TYPE_CREATED_BY`,`INSURANCE_TYPE_CREATE_DATE`,`INSURANCE_TYPE_UPDATED_BY`,`INSURANCE_TYPE_UPDATED_DATE`) values (1,'Aviation Hull','AVH','',1,0,NULL,0,'2022-10-24 02:33:33'),(2,'Builders Risk','BDR',NULL,1,NULL,NULL,NULL,NULL),(3,'Burglary','BUR',NULL,1,NULL,NULL,NULL,NULL),(4,'Contractor Plant & Machinery','CPM',NULL,1,NULL,NULL,NULL,NULL),(5,'Contractors All Risk','CAR',NULL,1,NULL,NULL,NULL,NULL),(6,'Credit','CRI',NULL,1,NULL,NULL,NULL,NULL),(7,'Customs Bond','CUB',NULL,1,NULL,NULL,NULL,NULL),(8,'Earthquake','EQVE',NULL,1,NULL,NULL,NULL,NULL),(9,'Electronic Equipment Insurance','EEI',NULL,1,NULL,NULL,NULL,NULL),(10,'Erection All Risk','EAR',NULL,1,NULL,NULL,NULL,NULL),(11,'Fidelity','FI',NULL,1,NULL,NULL,NULL,NULL),(12,'Fine Art','FAI','',1,0,NULL,0,'2023-04-06 06:31:20'),(13,'Fire','FR',NULL,1,NULL,NULL,NULL,NULL),(14,'Health','HI',NULL,1,NULL,NULL,NULL,NULL),(15,'Heavy Equipment','HE',NULL,1,NULL,NULL,NULL,NULL),(16,'Hole In One','HIO',NULL,1,NULL,NULL,NULL,NULL),(17,'Industrial All Risk','IAR',NULL,1,NULL,NULL,NULL,NULL),(18,'Industrial Special Risk','ISR',NULL,1,NULL,NULL,NULL,NULL),(19,'Liability','LIA',NULL,1,NULL,NULL,NULL,NULL),(20,'Machinery','MB',NULL,1,NULL,NULL,NULL,NULL),(21,'Marine Cargo','MC',NULL,1,NULL,NULL,NULL,NULL),(22,'Hull & Machinery','MH',NULL,1,NULL,NULL,NULL,NULL),(23,'Marine Open Cover','MOC',NULL,1,NULL,NULL,NULL,NULL),(24,'Money Insurance','MI',NULL,1,NULL,NULL,NULL,NULL),(25,'Motor Vehicle Insurance','MV','',1,0,NULL,0,'2024-02-22 07:55:58'),(26,'Moveable All Risk','MAR',NULL,1,NULL,NULL,NULL,NULL),(27,'PA & LoL','PAL',NULL,1,NULL,NULL,NULL,NULL),(28,'Personal Accident','PA',NULL,1,NULL,NULL,NULL,NULL),(29,'Professional Indemnity','PI',NULL,1,NULL,NULL,NULL,NULL),(30,'Property [Industrial] All Risk','PAR',NULL,1,NULL,NULL,NULL,NULL),(31,'Protection & Indemnity','P&I','Cover Liability against 3rd Party Property Damaged, Cargo, Crew & Passenger of a ship',1,NULL,NULL,NULL,NULL),(32,'Surety Bond','SB',NULL,1,NULL,NULL,NULL,NULL),(33,'Terrorism & Sabotage','TS',NULL,1,NULL,NULL,NULL,NULL),(34,'Travel','TR',NULL,1,NULL,NULL,NULL,NULL),(35,'Workmen\'s Compensation','WCI',NULL,1,NULL,NULL,NULL,NULL),(36,'Employer\'s Liability','EL',NULL,1,NULL,NULL,NULL,NULL),(37,'Business Interuption','BI','Cover BI secara terpisah dari Property',1,NULL,NULL,NULL,NULL),(38,'Growing Crops','GC','Asuransi untuk tanaman perkebunan / industri',1,NULL,NULL,NULL,NULL),(39,'Public Liability','PL',NULL,1,NULL,NULL,NULL,NULL),(40,'Premises Pollution Liability','PPL',NULL,1,NULL,NULL,NULL,NULL),(41,'Container Insurance','CI',NULL,1,NULL,NULL,NULL,NULL),(42,'Cable Operator\'s Policy','COP',NULL,1,NULL,NULL,NULL,NULL),(43,'Comprehensive Machinery Insurance','CMI','Cover any sudden physical loss of or damage to property insured against operational material damage and operational business interruption',1,NULL,NULL,NULL,NULL),(44,'Civil Engineering Completed Risk','CECR','Coverage for any Finished Civil Construction mostly against AOG and Fire',1,NULL,NULL,NULL,NULL),(45,'Machinery Loss of Profit','MLoP',NULL,1,NULL,NULL,NULL,NULL),(46,'Comprehensive Project Insurance','CPI',NULL,1,NULL,NULL,NULL,NULL),(47,'Ship Repairer Liability','SRL','Subject to the limit of liability and the terms and conditions of this policy we will pay all sums which you become legally liable to pay in compensation arising from your business for',1,NULL,NULL,NULL,NULL),(48,'Freight Forwarder Liability','FFL',NULL,1,NULL,NULL,NULL,NULL),(49,'Live Stock (Asuransi Ternak)','LS',NULL,1,NULL,NULL,NULL,NULL),(50,'Product Liability','PROL',NULL,1,NULL,NULL,NULL,NULL),(51,'Pollution Liability','POL',NULL,1,NULL,NULL,NULL,NULL),(52,'Director & Officer','D&O',NULL,1,NULL,NULL,NULL,NULL),(53,'HE Special Risk','HESR',NULL,1,NULL,NULL,NULL,NULL),(54,'Bid Bond','BB',NULL,1,NULL,NULL,NULL,NULL),(55,'Advance Payment Bond','APB','',1,0,NULL,0,'2024-02-21 04:14:32'),(56,'Performance Bond','PB',NULL,1,NULL,NULL,NULL,NULL),(57,'Custom Bond','CB',NULL,1,NULL,NULL,NULL,NULL),(58,'Maintenance Bond','MB',NULL,1,NULL,NULL,NULL,NULL),(59,'Bank Guarantee','BG',NULL,1,NULL,NULL,NULL,NULL),(60,'Jiwa Kredit','AJK',NULL,1,NULL,NULL,NULL,NULL),(61,'Term Life','TL',NULL,1,NULL,NULL,NULL,NULL),(62,'Marine Open Policy','MOP',NULL,1,NULL,NULL,NULL,NULL),(63,'Terminal Operator Liability','TOL',NULL,1,NULL,NULL,NULL,NULL),(64,'Port Operator Liability','POL',NULL,1,NULL,NULL,NULL,NULL),(65,'Trade Credit Insurance','TCI',NULL,1,NULL,NULL,NULL,NULL),(66,'Export Credit Insurance','ECI',NULL,1,NULL,NULL,NULL,NULL),(67,'Credit Insurance','CI',NULL,1,NULL,NULL,NULL,NULL),(68,'Employee Benefit','EB',NULL,1,NULL,NULL,NULL,NULL),(69,'Boiler & Pressure Vessel','BPV',NULL,1,NULL,NULL,NULL,NULL),(70,'Neon Sign Insurance','NSI',NULL,1,NULL,NULL,NULL,NULL),(71,'Land Rig Insurance','LRI',NULL,1,NULL,NULL,NULL,NULL),(72,'Offshore Rig Insurance','ORI',NULL,1,NULL,NULL,NULL,NULL),(73,'Port Terminal Operator Liability','PTOL',NULL,1,NULL,NULL,NULL,NULL),(74,'Neon Sign Billboard','TB',NULL,1,NULL,NULL,NULL,NULL),(75,'Comprehensive General Liability','CGL',NULL,1,NULL,NULL,NULL,NULL),(76,'Store Financing Askred','SFA',NULL,1,NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
