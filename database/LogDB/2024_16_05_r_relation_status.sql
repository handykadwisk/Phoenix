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
/*Table structure for table `r_relation_status` */

DROP TABLE IF EXISTS `r_relation_status`;

CREATE TABLE `r_relation_status` (
  `relation_status_id` int(11) NOT NULL AUTO_INCREMENT,
  `relation_status_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`relation_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `r_relation_status` */

insert  into `r_relation_status`(`relation_status_id`,`relation_status_name`) values (1,'Corporate'),(2,'Individu');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
