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

/*Table structure for table `r_cash_advance_status` */

DROP TABLE IF EXISTS `r_cash_advance_status`;

CREATE TABLE `r_cash_advance_status` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `CA_STATUS_ID` tinyint NOT NULL,
  `CA_STATUS_NAME` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_cash_advance_status` */

insert  into `r_cash_advance_status`(`ID`,`CA_STATUS_ID`,`CA_STATUS_NAME`,`created_at`,`updated_at`) values (1,0,'Request','2024-07-29 08:33:56','2024-07-29 08:33:56'),(2,1,'Approved','2024-07-29 08:33:56','2024-07-29 08:33:56'),(3,2,'Reject','2024-07-29 08:33:56','2024-07-29 08:33:56'),(4,3,'Need Revision','2024-07-29 08:33:56','2024-07-29 08:33:56'),(5,4,'Execute','2024-07-29 08:33:56','2024-07-29 08:33:56'),(6,5,'Pending Report','2024-07-29 08:33:56','2024-07-29 08:33:56'),(7,6,'Complited','2024-07-29 08:33:56','2024-07-29 08:33:56');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
