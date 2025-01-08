/*
SQLyog Trial v13.1.9 (64 bit)
MySQL - 5.7.36 : Database - phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `r_plugin_process` */

DROP TABLE IF EXISTS `r_plugin_process`;

CREATE TABLE `r_plugin_process` (
  `PLUGIN_PROCESS_ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `PLUGIN_PROCESS_NAME` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PLUG_PROCESS_CLASS` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PLUGIN_PROCESS_SHOW_CONTEXT_MENU` smallint(6) DEFAULT NULL,
  `PLUGIN_PROCESS_SHOW_OBJECT` smallint(6) DEFAULT NULL,
  `PLUGIN_PROCESS_DESCRIPTION` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`PLUGIN_PROCESS_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_plugin_process` */

insert  into `r_plugin_process`(`PLUGIN_PROCESS_ID`,`PLUGIN_PROCESS_NAME`,`PLUG_PROCESS_CLASS`,`PLUGIN_PROCESS_SHOW_CONTEXT_MENU`,`PLUGIN_PROCESS_SHOW_OBJECT`,`PLUGIN_PROCESS_DESCRIPTION`) values 
(1,'Chat','cls_attach_chat',1,1,NULL),
(2,'Task','cls_attach_task',0,1,NULL),
(5,'Reminder','cls_attach_reminder',0,1,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
