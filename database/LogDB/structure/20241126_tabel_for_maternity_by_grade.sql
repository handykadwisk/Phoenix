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
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
