/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 8.2.0 : Database - phoenix_test
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Data for the table `r_salutation` */

insert  into `r_salutation`(`salutation_id`,`salutation_name`,`salutation_desc`,`relation_status_id`,`salutation_position`) values (1,'CV',NULL,1,1),(2,'PD',NULL,1,1),(3,'PT',NULL,1,1),(4,'UD',NULL,1,1),(5,'Pte. Ltd',NULL,1,2),(6,'Mr',NULL,2,1),(7,'Mrs',NULL,2,1),(8,'Ms',NULL,2,1),(9,'SDN BHD',NULL,1,2),(10,'Co. Ltd',NULL,1,2),(11,'Inc.',NULL,1,2),(12,'Yayasan',NULL,1,1),(13,'Koperasi',NULL,1,1),(14,'Perum',NULL,1,1),(15,'TBK',NULL,1,2);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
