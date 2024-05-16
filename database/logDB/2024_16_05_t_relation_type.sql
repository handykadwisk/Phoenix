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

/*Table structure for table `t_relation_type` */

DROP TABLE IF EXISTS `t_relation_type`;

CREATE TABLE `t_relation_type` (
  `RELATION_TYPE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `RELATION_TYPE_NAME` varchar(255) DEFAULT NULL,
  `RELATION_TYPE_DESCRIPTION` text,
  PRIMARY KEY (`RELATION_TYPE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Data for the table `t_relation_type` */

insert  into `t_relation_type`(`RELATION_TYPE_ID`,`RELATION_TYPE_NAME`,`RELATION_TYPE_DESCRIPTION`) values (1,'Insurance',NULL),(2,'Agent',NULL),(3,'Financial Institution',NULL),(4,'Loss Adjuster',NULL),(5,'Hospital',NULL),(6,'Autoworkshop',NULL),(7,'Supplier',NULL),(8,'Broker',NULL),(9,'Third Party Administrator',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
