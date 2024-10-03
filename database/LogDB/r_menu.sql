/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 10.4.32-MariaDB : Database - phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Data for the table `r_menu` */

insert  into `r_menu`(`id`,`menu_name`,`menu_parent_id`,`menu_url`,`menu_is_deleted`,`menu_is_deleted_by`,`menu_is_deleted_at`,`menu_is_deleted_description`,`menu_sequence`,`menu_created_by`,`menu_updated_by`,`menu_created_date`,`menu_updated_date`,`menu_mapping`) values (1,'Dashboard',NULL,'dashboard',1,NULL,NULL,NULL,NULL,'admin',NULL,'2024-09-10 01:39:47',NULL,'1.'),(2,'Relation',NULL,NULL,0,NULL,NULL,NULL,1,'admin',NULL,'2024-09-10 01:39:47',NULL,'2.'),(3,'Policy',NULL,'policy',0,NULL,NULL,NULL,7,'admin',NULL,'2024-09-10 01:39:47',NULL,'3.'),(4,'Policy',2,'policy/policy',0,NULL,NULL,NULL,2,'admin',NULL,'2024-09-10 01:39:47',NULL,'2.4.'),(5,'Group',2,'relation/group',0,NULL,NULL,NULL,3,'admin',NULL,'2024-09-10 01:39:47',NULL,'2.5.'),(6,'Relation',2,'relation',0,NULL,NULL,NULL,4,'admin',NULL,'2024-09-10 01:39:47',NULL,'2.6.'),(7,'Agent',2,'relation/agent',0,NULL,NULL,NULL,5,'admin',NULL,'2024-09-10 01:39:47',NULL,'2.7.'),(8,'BAA',2,'relation/baa',0,NULL,NULL,NULL,6,'admin',NULL,'2024-09-10 01:39:47',NULL,'2.8.'),(9,'Finance',NULL,NULL,0,NULL,NULL,NULL,8,'admin',NULL,'2024-09-10 01:39:47',NULL,'9.'),(10,'Cash Advance',9,'cashAdvance',0,NULL,NULL,NULL,9,'admin',NULL,'2024-09-10 01:39:47',NULL,'9.10.'),(11,'Reimburse',9,'reimburse',0,NULL,NULL,NULL,10,'admin',NULL,'2024-09-10 01:39:47',NULL,'9.11.'),(12,'Other Expenses',9,'otherExpenses',0,NULL,NULL,NULL,11,'admin',NULL,'2024-09-10 01:39:47',NULL,'9.12.'),(13,'Approval Limit',9,'approvalLimit',0,NULL,NULL,NULL,12,'admin',NULL,'2024-09-10 01:39:47',NULL,'9.13.'),(14,'Setting',NULL,NULL,0,NULL,NULL,NULL,18,'admin',NULL,'2024-09-10 01:39:47',NULL,'14.'),(15,'ACL - Menu',14,'setting/menu',0,NULL,NULL,NULL,19,'admin',NULL,'2024-09-10 01:39:47',NULL,'14.15.'),(16,'ACL - Permission',14,'setting/permission',0,NULL,NULL,NULL,20,'admin',NULL,'2024-09-10 01:39:47',NULL,'14.16.'),(17,'ACL - Role',14,'setting/role',0,NULL,NULL,NULL,21,'admin',NULL,'2024-09-10 01:39:47',NULL,'14.17.'),(18,'HR',NULL,NULL,0,NULL,NULL,NULL,16,'admin',NULL,'2024-09-10 01:39:47',NULL,'18.'),(19,'Company Setting',18,'hr/settingCompany',0,NULL,NULL,NULL,17,'admin',NULL,'2024-09-10 01:39:47',NULL,'18.19.'),(20,'User Management',14,'settings/user',0,NULL,NULL,NULL,22,'1',NULL,'2024-09-09 18:48:05',NULL,'14.20.'),(31,'ACL-Job Post',14,'jobpost',0,NULL,NULL,NULL,24,'1','1','2024-09-19 08:52:03','2024-09-19 08:52:30','14.31.'),(35,'Setting Finance',9,NULL,0,NULL,NULL,NULL,13,'1',NULL,'2024-09-25 08:52:38',NULL,'9.35.'),(36,'Exchange Rate BI',35,NULL,0,NULL,NULL,NULL,14,'',NULL,'2024-09-25 15:56:20',NULL,'9.35.36.'),(37,'Exchange Rate Tax ',35,NULL,0,NULL,NULL,NULL,15,'',NULL,'2024-09-25 15:57:04',NULL,'9.35.37.'),(39,'test1',20,'policy/policy',0,NULL,NULL,NULL,23,'1','1','2024-09-25 09:28:33','2024-09-25 09:30:52','14.20.39.'),(44,'ACL - Example',14,NULL,0,NULL,NULL,NULL,25,'1',NULL,'2024-09-30 03:48:38',NULL,'14.44.'),(46,'ACL - Example1',44,'settings/user',0,NULL,NULL,NULL,26,'1',NULL,'2024-09-30 03:50:01',NULL,'14.44.46.'),(47,'ACL - Example2',44,NULL,0,NULL,NULL,NULL,27,'1',NULL,'2024-09-30 03:51:59',NULL,'14.44.47.'),(48,'ACL - Example 3',47,'settings/user',0,NULL,NULL,NULL,30,'1',NULL,'2024-09-30 04:27:05',NULL,'14.44.47.48.'),(49,'example 4',47,NULL,0,NULL,NULL,NULL,28,'1',NULL,'2024-09-30 07:04:01',NULL,'14.44.47.49.'),(50,'example 5',49,NULL,0,NULL,NULL,NULL,29,'1',NULL,'2024-09-30 07:14:22',NULL,'14.44.47.49.50.');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
