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
CREATE DATABASE /*!32312 IF NOT EXISTS*/`phoenix` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `phoenix`;

/*Table structure for table `m_role_access_menu` */

DROP TABLE IF EXISTS `m_role_access_menu`;

CREATE TABLE `m_role_access_menu` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `m_role_access_menu_menu_id_foreign` (`menu_id`),
  KEY `m_role_access_menu_role_id_foreign` (`role_id`),
  CONSTRAINT `m_role_access_menu_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `r_menu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `m_role_access_menu_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `m_role_access_menu` */

insert  into `m_role_access_menu`(`id`,`menu_id`,`role_id`) values (1,1,1),(2,2,1),(3,3,1),(4,8,1),(5,9,1),(6,10,1),(7,11,1),(8,12,1),(9,5,1),(10,6,1),(11,7,1),(12,13,1),(13,14,1),(14,15,1),(15,16,1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
