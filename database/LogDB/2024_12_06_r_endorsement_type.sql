/*
SQLyog Ultimate v12.5.1 (64 bit)
MySQL - 5.7.12 : Database - phoenix_app_dev
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `r_endorsement_type` */

DROP TABLE IF EXISTS `r_endorsement_type`;

CREATE TABLE `r_endorsement_type` (
  `ENDORSEMENT_TYPE_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ENDORSEMENT_TYPE_NAME` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ENDORSEMENT_TYPE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_endorsement_type` */

insert  into `r_endorsement_type`(`ENDORSEMENT_TYPE_ID`,`ENDORSEMENT_TYPE_NAME`) values 
(1,'Increase of SI'),
(2,'Decrease of SI'),
(3,'Alteration value of Interest Insured'),
(4,'Cancellation of Policy'),
(5,'Alteration of Insured Name'),
(6,'Alteration of Risk Location'),
(7,'Alteration of Period'),
(8,'Alteration of Coverage'),
(9,'Change Occupancy'),
(10,'Alteration of TC'),
(11,'Alteration content of Interest Insured');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
