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
/*Data for the table `r_menu` */

insert  into `r_menu`(`id`,`menu_name`,`menu_parent_id`,`menu_url`,`menu_is_deleted`,`menu_is_deleted_by`,`menu_is_deleted_at`,`menu_is_deleted_description`,`menu_sequence`,`menu_created_by`,`menu_updated_by`,`menu_created_date`,`menu_updated_date`) values (1,'Dashboard',NULL,'dashboard',1,NULL,NULL,NULL,1,'admin',NULL,'2024-09-08 15:58:34',NULL),(2,'Relation',NULL,NULL,0,NULL,NULL,NULL,2,'admin',NULL,'2024-09-08 15:58:34',NULL),(3,'Policy',NULL,'policy',0,NULL,NULL,NULL,3,'admin',NULL,'2024-09-08 15:58:34',NULL),(4,'Policy',2,'policy/policy',0,NULL,NULL,NULL,8,'admin',NULL,'2024-09-08 15:58:34',NULL),(5,'Group',2,'relation/group',0,NULL,NULL,NULL,5,'admin',NULL,'2024-09-08 15:58:34',NULL),(6,'Relation',2,'relation',0,NULL,NULL,NULL,4,'admin',NULL,'2024-09-08 15:58:34',NULL),(7,'Agent',2,'relation/agent',0,NULL,NULL,NULL,6,'admin',NULL,'2024-09-08 15:58:34',NULL),(8,'BAA',2,'relation/baa',0,NULL,NULL,NULL,7,'admin',NULL,'2024-09-08 15:58:34',NULL),(9,'Finance',NULL,NULL,0,NULL,NULL,NULL,NULL,'admin',NULL,'2024-09-08 15:58:34',NULL),(10,'Cash Advance',9,'cashAdvance',0,NULL,NULL,NULL,NULL,'admin',NULL,'2024-09-08 15:58:34',NULL),(11,'Reimburse',9,'reimburse',0,NULL,NULL,NULL,NULL,'admin',NULL,'2024-09-08 15:58:34',NULL),(12,'Other Expenses',9,'otherExpenses',0,NULL,NULL,NULL,NULL,'admin',NULL,'2024-09-08 15:58:34',NULL),(13,'Approval Limit',9,'approvalLimit',0,NULL,NULL,NULL,NULL,'admin',NULL,'2024-09-08 15:58:34',NULL),(14,'Setting',NULL,NULL,0,NULL,NULL,NULL,99,'admin',NULL,'2024-09-08 15:58:34',NULL),(15,'ACL - Menu',14,'setting/menu',0,NULL,NULL,NULL,6,'admin',NULL,'2024-09-08 15:58:34',NULL),(16,'ACL - Permission',14,'setting/permission',0,NULL,NULL,NULL,6,'admin',NULL,'2024-09-08 15:58:34',NULL),(17,'ACL - Role',14,'setting/role',0,NULL,NULL,NULL,6,'admin',NULL,'2024-09-08 15:58:35',NULL),(18,'HR',NULL,NULL,0,NULL,NULL,NULL,77,'admin',NULL,'2024-09-08 15:58:35',NULL),(19,'Company Setting',18,'hr/settingCompany',0,NULL,NULL,NULL,1,'admin',NULL,'2024-09-08 15:58:35',NULL),(20,'Exchange Rate Tax',9,'exchangeRateTax',0,NULL,NULL,NULL,1,'admin',NULL,'2024-09-08 15:58:35',NULL),(21,'Exchange Rate BI',9,'exchangeRateBI',0,NULL,NULL,NULL,1,'admin',NULL,'2024-09-08 15:58:35',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
