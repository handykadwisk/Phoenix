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
/*Data for the table `r_plugin_process` */

insert  into `r_plugin_process`(`PLUGIN_PROCESS_ID`,`PLUGIN_PROCESS_NAME`,`PLUG_PROCESS_CLASS`,`PLUGIN_PROCESS_SHOW_CONTEXT_MENU`,`PLUGIN_PROCESS_SHOW_OBJECT`,`PLUGIN_PROCESS_DESCRIPTION`) values 
(1,'Chat','cls_attach_chat',1,1,NULL),
(2,'Task','cls_attach_task',1,1,NULL),
(5,'Reminder','cls_attach_reminder',0,1,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
