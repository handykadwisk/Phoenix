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
/*Data for the table `r_coa_class` */

insert  into `r_coa_class`(`ID_COA_CLASS`,`COA_CLASS_ID`,`COA_CLASS_TITLE`,`COA_CLASS_TYPE`,`COA_CLASS_CREATED_BY`,`COA_CLASS_CREATED_DATE`,`COA_CLASS_LAST_UPDATE_BY`,`COA_CLASS_LAST_UPDATE`) values (1,10000,'Aktiva',1,'admin','2009-11-19 11:35:17','admin','2009-11-19 11:35:17'),(2,20000,'Kewajiban',2,'admin','2009-11-19 11:52:55','admin','2009-11-19 11:52:55'),(3,30000,'Modal',3,'admin','2009-11-19 11:52:55','admin','2009-11-19 11:52:55'),(4,40000,'Pendapatan',4,'admin','2009-11-22 20:17:55','admin','2009-11-22 20:17:55'),(5,50000,'Cost of Sales',5,'admin','2009-12-05 22:36:15','admin','2009-12-05 22:36:15'),(6,60000,'Biaya Operasional',6,'admin','2009-12-07 03:55:20','admin','2009-12-07 03:55:20'),(7,70000,'Biaya Non Operasional',6,'admin','2009-12-07 03:55:49','admin','2009-12-07 03:55:49'),(8,80000,'Pendapatan Lainnya',4,'admin','2009-12-07 03:56:11','admin','2009-12-07 03:56:11'),(9,90000,'Biaya Lainnya',6,'admin',NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
