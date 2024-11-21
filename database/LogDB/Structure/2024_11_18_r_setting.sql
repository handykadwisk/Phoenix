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
/*Table structure for table `r_setting` */

DROP TABLE IF EXISTS `r_setting`;

CREATE TABLE `r_setting` (
  `SETTING_ID` int unsigned NOT NULL AUTO_INCREMENT,
  `SETTING_VARIABLE` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SETTING_VALUE` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `SETTING_DESCRIPTION` text COLLATE utf8mb4_unicode_ci,
  `SETTING_CREATED_BY` int DEFAULT NULL,
  `SETTING_CREATED_DATE` datetime DEFAULT NULL,
  `SETTING_UPDATED_BY` int DEFAULT NULL,
  `SETTING_UPDATED_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`SETTING_ID`),
  UNIQUE KEY `r_setting_setting_variable_unique` (`SETTING_VARIABLE`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_setting` */

insert  into `r_setting`(`SETTING_ID`,`SETTING_VARIABLE`,`SETTING_VALUE`,`SETTING_DESCRIPTION`,`SETTING_CREATED_BY`,`SETTING_CREATED_DATE`,`SETTING_UPDATED_BY`,`SETTING_UPDATED_DATE`) values (1,'journal_type','1',NULL,NULL,NULL,NULL,NULL),(2,'auto_journal_add_receipt','1','1 untuk auto journal, 0 untuk tidak auto journal',NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
