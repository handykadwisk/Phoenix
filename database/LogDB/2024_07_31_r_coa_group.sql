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
/*Data for the table `r_coa_group` */

insert  into `r_coa_group`(`COA_GROUP_ID`,`COA_GROUP_CODE`,`COA_GROUP_PARENT`,`COA_CLASS_ID`,`COA_GROUP_TITLE`,`COA_GROUP_CREATED_BY`,`COA_GROUP_CREATED_DATE`,`COA_GROUP_LAST_UPDATE_BY`,`COA_GROUP_LAST_UPDATE`) values (78,'10000','0',10000,'Aktiva','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(79,'11000','10000',10000,'Aktiva Lancar','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(80,'11100','10000',10000,'Rekening Penampungan Premi','admin','2022-06-23 11:26:29','admin','2022-06-23 11:26:29'),(81,'12000','10000',10000,'Aktiva Tetap','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(82,'13000','10000',10000,'Aktiva Lain-lain','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(83,'21000','',20000,'Kewajiban Jangka Pendek','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(84,'22000','',20000,'Kewajiban Jangka Panjang','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(85,'30000','',30000,'Modal','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(86,'40000','',40000,'Pendapatan','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(87,'50000','50000',60000,'Biaya Operasional','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(88,'60000','70000',70000,'Biaya Non Operasional','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(89,'70000',NULL,70000,'Biaya Non Operasional',NULL,NULL,NULL,NULL),(90,'80000','',80000,'Pendapatan Lainnya','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48'),(91,'90000','',90000,'Biaya Lainnya','admin','2022-06-23 11:44:48','admin','2022-06-23 11:44:48');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
