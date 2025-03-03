/*
SQLyog Trial v13.1.9 (64 bit)
MySQL - 8.2.0 : Database - phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `t_detail_reminder` */

DROP TABLE IF EXISTS `t_detail_reminder`;

CREATE TABLE `t_detail_reminder` (
  `DETAIL_REMINDER_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `REMINDER_DATA_ID` bigint DEFAULT NULL,
  `DETAIL_REMINDER_USER_FROM` bigint DEFAULT NULL,
  `DETAIL_REMINDER_USER_TO` bigint DEFAULT NULL,
  `DETAIL_REMINDER_USER_STATUS_READ` bigint DEFAULT NULL COMMENT '0 = unread, 1 = read',
  `DETAIL_REMINDER_USER_READ_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`DETAIL_REMINDER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `t_reminder_data` */

DROP TABLE IF EXISTS `t_reminder_data`;

CREATE TABLE `t_reminder_data` (
  `REMINDER_DATA_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `REMINDER_DATA_DATE` date DEFAULT NULL,
  `REMINDER_DATA_HOUR` time DEFAULT NULL,
  `REMINDER_ID` bigint DEFAULT NULL,
  `USER_ID` bigint DEFAULT NULL,
  `REMINDER_TIER_ID` bigint DEFAULT NULL,
  `REMINDER_DATA_STATUS` smallint DEFAULT '1' COMMENT '1 = Active, 0 = Inactive',
  PRIMARY KEY (`REMINDER_DATA_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
