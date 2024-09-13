/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 10.4.32-MariaDB : Database - phoenix2
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`phoenix2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

/*Data for the table `t_user` */

insert  into `t_user`(`id`,`employee_id`,`individual_relation_id`,`user_login`,`name`,`user_type_id`,`password`,`user_status`,`email_verified_at`,`remember_token`,`created_at`,`updated_at`) values (1,1,NULL,'admin','admin',1,'$2y$12$ZcNsuAr2DVEqMYbuIlRdJudYl0R9q9Bw/ut/rReWAkXKM2yuXdrfO',1,NULL,NULL,'2024-09-10 21:50:24','2024-09-10 21:50:28'),(9,4,NULL,'dyka@mail.com','dyka',2,'$2y$12$ad5Vj3ROTYhvOB9q3H2TmuIfbQoq3Sd5wuupK8.5tQgqrr42j6fGi',1,NULL,NULL,'2024-09-10 15:04:22','2024-09-11 03:02:48'),(11,0,NULL,'dwsk','dwsk',1,'$2y$12$H0Jx6hJzm6pQJdTBMaHoUuYzwbz45DP2F1qtTHI8SUwYzrkTa9MJ.',1,NULL,NULL,'2024-09-10 15:07:02','2024-09-11 06:43:06'),(12,1,NULL,'fadhlan@email.com','fadhlan@email.com',2,'$2y$12$7fuZmSnkJLnb0VGm7HtAqueZDQJo3y0IeAYvW2IutHOXBVqwOsb76',1,NULL,NULL,'2024-09-11 06:46:15','2024-09-11 06:46:15'),(13,2,NULL,'HarisIT','HarisIT',2,'$2y$12$ehucrCUdtRHTjQAiZdGWceyYiy8D.d7ucqHp1J.lkwuiqqYn4xdOC',1,NULL,NULL,'2024-09-11 06:46:44','2024-09-11 06:46:44'),(14,3,NULL,'Pian123','Pian123',2,'$2y$12$JIpNs5SI6W67BcU6pnDhIu2Kv3NOC/F9FBzyTeI1vP1vJ/DG4CmAK',1,NULL,NULL,'2024-09-11 06:47:28','2024-09-11 06:47:28'),(15,2,NULL,'Haris@email.com','Haris@email.com',2,'$2y$12$OavPJe8bIjApQwWpowQSoeVlN1brt1SqdiNokMEUYbuhvKKfK0Ce2',1,NULL,NULL,'2024-09-11 09:25:39','2024-09-11 09:25:39');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
