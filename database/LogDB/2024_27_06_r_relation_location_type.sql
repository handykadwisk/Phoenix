/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 5.7.12 : Database - phoenix_prod
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Data for the table `phorlocationtype` */

insert  into `r_relation_location_type`(`RELATION_LOCATION_TYPE_ID`,`RELATION_LOCATION_TYPE_NAME`,`RELATION_LOCATION_TYPE_ORDER`) values (1,'Office',NULL),(2,'Correspondence',NULL),(3,'Risk Location',NULL),(4,'Invoice Delivery',NULL),(5,'Endorsement Delivery',NULL),(6,'Policy Delivery Original',NULL),(7,'Policy Delivery Duplicate',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
