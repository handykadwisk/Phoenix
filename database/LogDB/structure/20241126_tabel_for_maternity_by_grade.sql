/*
SQLyog Trial v13.1.9 (64 bit)
MySQL - 8.3.0 : Database - db_phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `m_grade_maternity_limit` */

DROP TABLE IF EXISTS `m_grade_maternity_limit`;

CREATE TABLE `m_grade_maternity_limit` (
  `GRADE_MATERNITY_ID` int NOT NULL AUTO_INCREMENT,
  `GRADE_ID` int DEFAULT NULL,
  `MATERNITY_LIMIT_ID` int DEFAULT NULL,
  PRIMARY KEY (`GRADE_MATERNITY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `m_grade_maternity_limit` */

insert  into `m_grade_maternity_limit`(`GRADE_MATERNITY_ID`,`GRADE_ID`,`MATERNITY_LIMIT_ID`) values 
(1,1,1),
(2,2,1),
(3,3,2),
(4,4,2),
(5,5,3),
(6,6,3),
(7,7,4),
(8,8,5),
(9,9,6);

/*Table structure for table `r_maternity_limit` */

DROP TABLE IF EXISTS `r_maternity_limit`;

CREATE TABLE `r_maternity_limit` (
  `MATERNITY_LIMIT_ID` int NOT NULL AUTO_INCREMENT,
  `DESCRIPTION` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MATERNITY_LIMIT_AMOUNT` decimal(20,2) DEFAULT NULL,
  PRIMARY KEY (`MATERNITY_LIMIT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_maternity_limit` */

insert  into `r_maternity_limit`(`MATERNITY_LIMIT_ID`,`DESCRIPTION`,`MATERNITY_LIMIT_AMOUNT`) values 
(1,'Untuk Golongan A',15000000.00),
(2,'Untuk Golongan B',12500000.00),
(3,'Untuk Golongan C',10000000.00),
(4,'Untuk Golongan D',7500000.00),
(5,'Untuk Golongan E',5000000.00),
(6,'Untuk Golongan F',2500000.00);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
