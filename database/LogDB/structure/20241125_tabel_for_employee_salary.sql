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
/*Table structure for table `m_employee_basic_salary` */

DROP TABLE IF EXISTS `m_employee_basic_salary`;

CREATE TABLE `m_employee_basic_salary` (
  `employee_basic_salary_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` bigint unsigned DEFAULT NULL,
  `basic_salary_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`employee_basic_salary_id`)
) ENGINE=MyISAM AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `m_employee_basic_salary` */

insert  into `m_employee_basic_salary`(`employee_basic_salary_id`,`employee_id`,`basic_salary_id`) values 
(1,1,1),
(2,2,2),
(3,83,3),
(4,16,4),
(5,26,5),
(6,30,6),
(7,11,7),
(8,20,8),
(9,60,9),
(10,61,10),
(11,62,11),
(12,63,12),
(13,66,13),
(14,67,14),
(15,68,15),
(16,70,16),
(17,86,17),
(19,88,19),
(20,3,20),
(21,13,21),
(22,21,22),
(23,24,23),
(24,31,24),
(25,33,25),
(26,34,26),
(27,35,27),
(28,52,28),
(29,53,29),
(30,89,30),
(31,6,31),
(32,18,32),
(33,19,33),
(34,22,34),
(35,82,35),
(36,85,36),
(37,17,37),
(38,7,38),
(39,23,39),
(40,38,40),
(41,41,41),
(42,42,42),
(43,48,43),
(44,49,44),
(45,51,45),
(46,58,46),
(47,84,47),
(48,45,48),
(49,8,49),
(50,10,50),
(51,25,51),
(52,28,52),
(53,39,53),
(54,40,54),
(55,46,55),
(56,47,56),
(57,54,57),
(58,56,58),
(59,27,59),
(60,44,60),
(61,59,61),
(62,4,62),
(63,12,63),
(64,36,64),
(65,37,65),
(66,15,66),
(67,14,67),
(68,90,68),
(69,64,69),
(70,80,70),
(71,69,71),
(72,29,72),
(73,94,73),
(74,93,74);

/*Table structure for table `t_basic_salary` */

DROP TABLE IF EXISTS `t_basic_salary`;

CREATE TABLE `t_basic_salary` (
  `salaryBasicId` int NOT NULL AUTO_INCREMENT,
  `salaryBasicName` varchar(100) DEFAULT NULL,
  `salaryNominal` decimal(20,2) DEFAULT NULL,
  `salaryDescription` varchar(255) DEFAULT NULL,
  `salaryCreatedBy` varchar(100) DEFAULT NULL,
  `salaryCreatedDate` datetime DEFAULT NULL,
  `salaryUpdatedBy` varchar(100) DEFAULT NULL,
  `salaryUpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`salaryBasicId`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `t_basic_salary` */

insert  into `t_basic_salary`(`salaryBasicId`,`salaryBasicName`,`salaryNominal`,`salaryDescription`,`salaryCreatedBy`,`salaryCreatedDate`,`salaryUpdatedBy`,`salaryUpdatedDate`) values 
(1,'',90000000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:54:59','fitano.pdf','2024-01-17 03:52:55'),
(2,'',45000000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:55:18','fitano.pdf','2024-01-17 03:53:05'),
(3,'',0.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:56:41','fitano.pdf','2024-01-17 04:04:10'),
(4,'',15040000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:57:47','fitano.pdf','2024-01-17 03:53:23'),
(5,'',11520000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:58:18','fitano.pdf','2024-01-17 03:53:33'),
(6,'',9920000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:58:43','fitano.pdf','2024-01-17 03:54:36'),
(7,'',17216100.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:59:30','fitano.pdf','2024-01-17 03:55:34'),
(8,'',12240000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 03:59:54','fitano.pdf','2024-01-17 03:55:45'),
(9,'',3921438.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:00:20','fitano.pdf','2024-01-17 03:56:06'),
(10,'',4411618.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:00:59','fitano.pdf','2024-01-17 03:56:26'),
(11,'',4411618.00,'','fitano.pdf','2023-07-28 07:09:16','fitano.pdf','2024-01-17 03:56:38'),
(12,'',3921438.00,'','fitano.pdf','2023-07-28 07:09:33','fitano.pdf','2024-01-17 03:57:03'),
(13,'',3921438.00,'','fitano.pdf','2023-07-31 04:47:14','fitano.pdf','2024-01-17 03:57:44'),
(14,'',3921438.00,'','fitano.pdf','2023-08-30 04:00:36','fitano.pdf','2024-01-17 03:57:54'),
(15,'',3238770.00,'','fitano.pdf','2023-08-30 04:00:43','fitano.pdf','2024-01-17 03:58:19'),
(16,'',4072453.00,'','fitano.pdf','2023-08-30 04:01:04','fitano.pdf','2024-01-17 03:58:49'),
(17,'',12672000.00,'','fitano.pdf','2023-08-30 04:01:59','',NULL),
(18,'',10912000.00,'','fitano.pdf','2023-08-30 04:02:16','',NULL),
(19,'',18937710.00,'','fitano.pdf','2023-08-30 04:03:37','',NULL),
(20,'',18450000.00,'','fitano.pdf','2023-08-30 04:03:49','fitano.pdf','2024-01-17 03:59:14'),
(21,'',11898080.00,'','fitano.pdf','2023-08-30 04:04:08','fitano.pdf','2024-01-17 03:59:44'),
(22,'',8021070.00,'','fitano.pdf','2023-08-30 04:05:39','fitano.pdf','2024-01-17 03:59:57'),
(23,'',7777500.00,'','fitano.pdf','2023-08-30 04:05:55','fitano.pdf','2024-01-17 04:00:10'),
(24,'',8434741.00,'','fitano.pdf','2023-08-30 04:06:49','fitano.pdf','2024-01-17 04:00:40'),
(25,'',5600000.00,'','fitano.pdf','2023-08-30 04:08:17','fitano.pdf','2024-01-17 04:00:57'),
(26,'',6800000.00,'','fitano.pdf','2023-08-30 04:08:48','fitano.pdf','2024-01-17 04:01:07'),
(27,'',5130000.00,'','fitano.pdf','2023-08-30 04:09:06','fitano.pdf','2024-01-17 04:01:17'),
(28,'',5400000.00,'','fitano.pdf','2023-08-30 04:09:43','fitano.pdf','2024-01-17 04:01:33'),
(29,'',7600000.00,'','fitano.pdf','2023-08-30 07:45:58','fitano.pdf','2024-01-17 04:01:48'),
(30,'',15000000.00,'','fitano.pdf','2023-09-14 07:12:58','',NULL),
(31,'',15573400.00,'','fitano.pdf','2023-09-14 07:13:24','fitano.pdf','2024-01-17 04:03:25'),
(32,'',6000000.00,'','fitano.pdf','2023-09-14 07:35:30','',NULL),
(33,'',11745000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:29:16','fitano.pdf','2024-01-17 04:03:42'),
(34,'',9259840.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:29:40','fitano.pdf','2024-01-17 04:04:03'),
(35,'',10000087.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:30:04','',NULL),
(36,'',10000100.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:30:40','',NULL),
(37,'',13500000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:32:19','fitano.pdf','2024-01-17 04:09:06'),
(38,'',21104100.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:33:11','fitano.pdf','2024-01-17 04:04:30'),
(39,'',9289090.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:33:37','fitano.pdf','2024-01-17 04:04:47'),
(40,'',5850000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:34:12','fitano.pdf','2024-01-17 04:04:59'),
(41,'',4675000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:34:41','fitano.pdf','2024-01-17 04:05:18'),
(42,'',5850000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:35:14','fitano.pdf','2024-01-17 04:05:31'),
(43,'',8809618.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:36:12','fitano.pdf','2024-01-17 04:05:47'),
(44,'',6300000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:36:58','fitano.pdf','2024-01-17 04:06:02'),
(45,'',5950000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:37:40','fitano.pdf','2024-01-17 04:06:20'),
(46,'',5875000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:39:24','fitano.pdf','2024-01-17 04:06:32'),
(47,'',10000098.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:39:55','',NULL),
(48,'',6000000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:43:00','fitano.pdf','2024-01-17 04:11:20'),
(49,'',14184375.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:44:29','fitano.pdf','2024-01-17 04:06:56'),
(50,'',13840000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 04:45:40','fitano.pdf','2024-01-17 04:07:07'),
(51,'',8840000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 06:56:47','fitano.pdf','2024-01-17 04:07:23'),
(52,'',7428744.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 06:58:45','fitano.pdf','2024-01-17 04:07:38'),
(53,'',4320000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 06:59:42','fitano.pdf','2024-01-17 04:07:48'),
(54,'',6375000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:00:12','fitano.pdf','2024-01-17 04:07:59'),
(55,'',5400000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:06:44','fitano.pdf','2024-01-17 04:08:10'),
(56,'',5600000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:07:12','fitano.pdf','2024-01-17 04:08:24'),
(57,'',6351410.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:07:32','fitano.pdf','2024-01-17 04:08:39'),
(58,'',6562500.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:08:10','fitano.pdf','2024-01-17 04:08:51'),
(59,'',8737030.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:09:08','fitano.pdf','2024-01-17 04:09:18'),
(60,'',6409776.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:09:51','fitano.pdf','2024-01-17 04:09:40'),
(61,'',5912903.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:10:20','fitano.pdf','2024-01-17 04:09:55'),
(62,'',10000071.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:13:11','',NULL),
(63,'',10000078.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:13:44','',NULL),
(64,'',8075000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:14:36','fitano.pdf','2024-01-17 04:10:21'),
(65,'',6750000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:14:57','fitano.pdf','2024-01-17 04:10:31'),
(66,'',15240000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:15:45','fitano.pdf','2024-01-17 04:10:52'),
(67,'',15240000.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 07:16:15','fitano.pdf','2024-01-17 04:11:08'),
(68,'',10000102.00,'','ratih.anggraini@fresnel.co.id','2023-09-15 08:32:01','',NULL),
(69,'',3921438.00,'','fitano.pdf','2023-09-19 08:03:48','fitano.pdf','2024-01-17 03:57:34'),
(70,'',0.00,'','fitano.pdf','2023-12-14 06:43:08','fitano.pdf','2024-01-17 03:54:50'),
(71,'',3921438.00,'','fitano.pdf','2024-01-17 03:58:31','',NULL),
(72,'',13120000.00,'','fitano.pdf','2024-01-17 07:12:39','',NULL),
(73,NULL,11000000.00,NULL,'admin','2024-11-06 14:25:12','admin','2024-11-06 14:26:43'),
(74,NULL,75000000.00,NULL,'admin','2024-11-06 14:26:26',NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
