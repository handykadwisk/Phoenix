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
/*Data for the table `t_job_posts` */

insert  into `t_job_posts`(`jobpost_id`,`company_division_id`,`jobpost_name`,`jobpost_description`,`jobpost_parent`,`jobpost_status`,`jobpost_created_by`,`jobpost_created_date`,`jobpost_updated_by`,`jobpost_updated_date`) values (1,5,'Marine New','Ini adalah tugas dari marine new baru',NULL,1,1,'2024-09-27 02:05:00',1,'2024-09-27 02:06:18'),(2,1,'IT Developer','Develope web aplication',NULL,0,1,'2024-09-27 04:22:25',NULL,'2024-09-27 11:22:25'),(3,1,'IT Helper','ini kerjaan IT Helper',NULL,1,1,'2024-09-27 07:02:46',1,'2024-09-27 07:08:36'),(4,1,'IT Security','Ini adalah tugas IT Secure',NULL,1,1,'2024-09-27 07:03:24',1,'2024-09-27 07:05:42');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
