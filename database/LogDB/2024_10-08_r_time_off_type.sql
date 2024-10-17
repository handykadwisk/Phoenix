/*
SQLyog Ultimate v12.5.1 (64 bit)
MySQL - 5.7.12 : Database - phoenix_prod
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
-- CREATE DATABASE /*!32312 IF NOT EXISTS*/`phoenix_prod` /*!40100 DEFAULT CHARACTER SET latin1 */;

-- USE `phoenix_prod`;

/*Data for the table `phortimeofftype` */

insert  into `r_time_off_type`(`TIME_OFF_TYPE_ID`,`TIME_OFF_TYPE_NAME`,`TIME_OFF_TYPE_IS_NEED_DOCUMENT`,`TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE`,`TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH`,`TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY`,`TIME_OFF_TYPE_NOTE`,`TIME_OFF_TYPE_IS_ACTIVE`) values 
(1,'Sakit - Tanpa Surat',0,1,NULL,1,'Sakit tanpa surat dokter 1 hari',0),
(2,'Sakit - Dengan Surat',1,1,NULL,NULL,'Sakit dengan surat dokter sesuai hari sesuai surat',0),
(3,'Cuti Tahunan',0,0,NULL,NULL,'Harus memotong cuti tahunan',0),
(4,'Cuti PP - Karyawan Menikah',0,1,NULL,3,'Karyawan menikah 3 hari',0),
(5,'Cuti PP - Istri Menikahkan Anak',0,1,NULL,2,'Istri menikahkan anak 2 hari',0),
(6,'Cuti PP - Mengkhitankan Anak',0,1,NULL,2,'Mengkhitankan anak 2 hari',0),
(7,'Cuti PP - Membaptis Anak',0,1,NULL,2,'Membaptis anak 2 hari',0),
(8,'Cuti PP - Istri Melahirkan/Keguguran',0,1,NULL,2,'Istri melahirkan/keguguran 2 hari',0),
(9,'Cuti PP - Keluarga Meninggal Dunia(Orang Tua Kandung,Mertua,dan Anak)',0,1,NULL,2,'Keluarga meninggal dunia 2 hari',0),
(10,'Cuti PP - Melahirkan Anak',0,1,3,NULL,'Melahirkan anak 3 bulan',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
