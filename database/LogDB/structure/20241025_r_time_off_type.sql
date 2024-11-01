/*
SQLyog Trial v13.1.9 (64 bit)
MySQL - 8.3.0 : Database - db_phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `r_time_off_type` */

DROP TABLE IF EXISTS `r_time_off_type`;

CREATE TABLE `r_time_off_type` (
  `TIME_OFF_TYPE_ID` int unsigned NOT NULL AUTO_INCREMENT,
  `TIME_OFF_TYPE_NAME` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TIME_OFF_TYPE_IS_NEED_DOCUMENT` int DEFAULT '0' COMMENT '0:No, 1:Yes',
  `TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE` int DEFAULT '0' COMMENT '0:No, 1:Yes',
  `TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH` int DEFAULT NULL COMMENT 'month(s)',
  `TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY` int DEFAULT NULL COMMENT 'Day(s)',
  `TIME_OFF_TYPE_NOTE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TIME_OFF_TYPE_IS_ACTIVE` int DEFAULT '0' COMMENT '0: YES,1: NO',
  `IS_SHOW` tinyint(1) DEFAULT '1' COMMENT '0:Hide 1:Show',
  PRIMARY KEY (`TIME_OFF_TYPE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_time_off_type` */

insert  into `r_time_off_type`(`TIME_OFF_TYPE_ID`,`TIME_OFF_TYPE_NAME`,`TIME_OFF_TYPE_IS_NEED_DOCUMENT`,`TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE`,`TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH`,`TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY`,`TIME_OFF_TYPE_NOTE`,`TIME_OFF_TYPE_IS_ACTIVE`,`IS_SHOW`) values 
(1,'Sakit - Tanpa Surat',0,1,NULL,1,'Sakit tanpa surat dokter 1 hari',0,1),
(2,'Sakit - Dengan Surat',1,1,NULL,NULL,'Sakit dengan surat dokter sesuai hari sesuai surat',0,1),
(3,'Cuti Tahunan',0,0,NULL,NULL,'Harus memotong cuti tahunan',0,1),
(4,'Cuti PP - Karyawan Menikah',0,1,NULL,3,'Karyawan menikah 3 hari',0,1),
(5,'Cuti PP - Istri Menikahkan Anak',0,1,NULL,2,'Istri menikahkan anak 2 hari',0,1),
(6,'Cuti PP - Mengkhitankan Anak',0,1,NULL,2,'Mengkhitankan anak 2 hari',0,1),
(7,'Cuti PP - Membaptis Anak',0,1,NULL,2,'Membaptis anak 2 hari',0,1),
(8,'Cuti PP - Istri Melahirkan/Keguguran',0,1,NULL,2,'Istri melahirkan/keguguran 2 hari',0,1),
(9,'Cuti PP - Keluarga Meninggal Dunia(Orang Tua Kandung,Mertua,dan Anak)',0,1,NULL,2,'Keluarga meninggal dunia 2 hari',0,1),
(10,'Cuti PP - Melahirkan Anak',0,1,3,NULL,'Melahirkan anak 3 bulan',0,1),
(11,'Cuti Bersama',0,0,NULL,NULL,'Cuti bersama, memotong cuti tahunan',0,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
