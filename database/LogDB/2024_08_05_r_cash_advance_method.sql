/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 8.0.31 : Database - phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`phoenix` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `phoenix`;

/*Table structure for table `r_cash_advance_method` */

DROP TABLE IF EXISTS `r_cash_advance_method`;

CREATE TABLE `r_cash_advance_method` (
  `CASH_ADVANCE_METHOD_ID` int unsigned NOT NULL AUTO_INCREMENT,
  `CASH_ADVANCE_METHOD_NAME` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CASH_ADVANCE_METHOD_CREATED_AT` datetime DEFAULT NULL,
  `CASH_ADVANCE_METHOD_UPDATED_AT` datetime DEFAULT NULL,
  PRIMARY KEY (`CASH_ADVANCE_METHOD_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_cash_advance_method` */

insert  into `r_cash_advance_method`(`CASH_ADVANCE_METHOD_ID`,`CASH_ADVANCE_METHOD_NAME`,`CASH_ADVANCE_METHOD_CREATED_AT`,`CASH_ADVANCE_METHOD_UPDATED_AT`) values (1,'Transfer',NULL,NULL),(2,'Cash',NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
