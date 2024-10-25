/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 10.4.32-MariaDB : Database - phoenixx
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Data for the table `r_menu` */

insert  into `r_menu`(`id`,`menu_name`,`menu_parent_id`,`menu_url`,`menu_is_deleted`,`menu_is_deleted_by`,`menu_is_deleted_at`,`menu_is_deleted_description`,`menu_sequence`,`menu_created_by`,`menu_updated_by`,`menu_created_date`,`menu_updated_date`,`menu_mapping`) values (1,'Dashboard',NULL,'dashboard',1,NULL,NULL,NULL,1,'admin','1','2024-08-05 01:54:01','2024-10-03 04:39:46','1.'),(19,'Relation',NULL,NULL,0,NULL,NULL,NULL,1,'admin',NULL,'2024-08-26 02:09:07',NULL,'19.'),(20,'Policy',NULL,NULL,0,NULL,NULL,NULL,7,'admin','1','2024-08-26 02:09:07','2024-09-13 08:47:31','20.'),(22,'Group',19,'relation/group',0,NULL,NULL,NULL,3,'admin',NULL,'2024-08-26 02:09:07',NULL,'19.22.'),(24,'Agent',19,'relation/agent',0,NULL,NULL,NULL,4,'admin',NULL,'2024-08-26 02:09:07',NULL,'19.24.'),(25,'BAA',19,'relation/baa',0,NULL,NULL,NULL,5,'admin',NULL,'2024-08-26 02:09:07',NULL,'19.25.'),(26,'Finance',NULL,NULL,0,NULL,NULL,NULL,11,'admin',NULL,'2024-08-26 02:09:07',NULL,'26.'),(27,'Cash Advance',26,'cashAdvance',0,NULL,NULL,NULL,12,'admin',NULL,'2024-08-26 02:09:07',NULL,'26.27.'),(28,'Reimburse',26,'reimburse',0,NULL,NULL,NULL,13,'admin',NULL,'2024-08-26 02:09:07',NULL,'26.28.'),(29,'Other Expenses',26,'otherExpenses',0,NULL,NULL,NULL,14,'admin',NULL,'2024-08-26 02:09:07',NULL,'26.29.'),(30,'Approval Limit',26,'approvalLimit',0,NULL,NULL,NULL,15,'admin',NULL,'2024-08-26 02:09:07',NULL,'26.30.'),(31,'Setting',NULL,NULL,0,NULL,NULL,NULL,19,'admin',NULL,'2024-08-26 02:09:07',NULL,'31.'),(32,'ACL - Menu',31,'setting/menu',0,NULL,NULL,NULL,20,'admin',NULL,'2024-08-26 02:09:07',NULL,'31.32.'),(33,'ACL - Permission',31,'setting/permission',0,NULL,NULL,NULL,21,'admin',NULL,'2024-08-26 02:09:07',NULL,'31.33.'),(34,'ACL - Role',31,'setting/role',0,NULL,NULL,NULL,22,'admin',NULL,'2024-08-26 02:09:07',NULL,'31.34.'),(35,'HR',NULL,NULL,0,NULL,NULL,NULL,9,'admin',NULL,'2024-08-26 02:09:07',NULL,'35.'),(36,'Company Setting',35,'hr/settingCompany',0,NULL,NULL,NULL,10,'admin',NULL,'2024-08-26 02:09:07',NULL,'35.36.'),(37,'ACL - User',31,'settings/user',0,NULL,NULL,NULL,23,'1','1','2024-09-13 03:59:28','2024-09-13 04:08:24','31.37.'),(38,'Relation',19,'relation',0,NULL,NULL,NULL,2,'1',NULL,'2024-09-13 04:15:06',NULL,'19.38.'),(39,'FBI By PKS',19,'relation/fbipks',0,NULL,NULL,NULL,6,'1',NULL,'2024-09-13 04:16:50',NULL,'19.39.'),(40,'List',20,'policy',0,NULL,NULL,NULL,8,'1',NULL,'2024-09-13 08:47:46',NULL,'20.40.'),(41,'ACL - Job Post',31,'jobpost',0,NULL,NULL,NULL,24,'1',NULL,'2024-10-01 02:43:20',NULL,'31.41.'),(43,'Settings',26,NULL,0,NULL,NULL,NULL,16,'1',NULL,'2024-10-03 08:19:28',NULL,'26.43.'),(44,'Exchange Rate Tax',43,'exchangeRateTax',0,NULL,NULL,NULL,17,'1',NULL,'2024-10-03 08:21:00',NULL,'26.43.44.'),(45,'Exchange Rate BI',43,'exchangeRateBI',0,NULL,NULL,NULL,18,'1','95','2024-10-03 08:21:23','2024-10-23 04:25:39','26.43.45.');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
