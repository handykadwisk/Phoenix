/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 10.4.32-MariaDB : Database - phoenixfixed
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `r_duration_type` */

DROP TABLE IF EXISTS `r_duration_type`;

CREATE TABLE `r_duration_type` (
  `DURATION_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `DURATION_NAME` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`DURATION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `r_duration_type` */

insert  into `r_duration_type`(`DURATION_ID`,`DURATION_NAME`) values (1,'General'),(2,'Between');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
