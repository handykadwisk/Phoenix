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
/*Data for the table `r_setting` */

insert  into `r_setting`(`SETTING_ID`,`SETTING_VARIABLE`,`SETTING_VALUE`,`SETTING_DESCRIPTION`,`SETTING_CREATED_BY`,`SETTING_CREATED_DATE`,`SETTING_UPDATED_BY`,`SETTING_UPDATED_DATE`) values 
(3,'reminder_start','08:30',NULL,NULL,NULL,NULL,NULL),
(4,'reminder_end','20:30',NULL,NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
