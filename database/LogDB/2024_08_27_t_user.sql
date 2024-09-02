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
/*Data for the table `t_user` */

insert  into `t_user`(`id`,`employee_id`,`name`,`email`,`role_id`,`email_verified_at`,`password`,`remember_token`,`created_at`,`updated_at`) values (1,1,'Admin','admin@email.com',1,NULL,'$2y$12$ZcNsuAr2DVEqMYbuIlRdJudYl0R9q9Bw/ut/rReWAkXKM2yuXdrfO',NULL,'2024-08-28 02:54:44','2024-08-28 02:54:44'),(2,NULL,'Fadhlan','fadhlan@email.com',2,NULL,'$2y$12$HeYuSQYBMOyfwS5NQHNU4eUa4W/ha7jukWLu814QDbDmcveK60Al.',NULL,'2024-08-28 02:54:45','2024-08-28 02:54:45'),(3,NULL,'Haris','haris@email.com',2,NULL,'$2y$12$gHZ2b/RdmDYYZa3CVsRvmO8y9UCevbw4blvehu1/A.e4f2Ta4CTii',NULL,'2024-08-28 02:54:45','2024-08-28 02:54:45'),(4,NULL,'Pian','pian@email.com',2,NULL,'$2y$12$rZRcIMiUNFdM7vf9cXckw.MB9cG8C3vP.U7zsF4y8zW6lB6SSDvn2',NULL,'2024-08-28 02:54:46','2024-08-28 02:54:46'),(5,NULL,'Fitano','fitano@email.com',2,NULL,'$2y$12$FZMfE7e8JbJZKqw5f/OP6.Y9cUB0TjZcmIMOjgHG/.uF./4o5NIiG',NULL,'2024-08-28 02:54:47','2024-08-28 02:54:47'),(6,8,'Mei','mei@email.com',2,NULL,'$2y$12$gFzKb7KMInGei45vWo84XO5mhCHf03u78VKYhWZsxbIjikTiDjur2',NULL,'2024-08-28 02:54:47','2024-08-28 02:54:47'),(7,7,'Apep','apep@email.com',2,NULL,'$2y$12$fUdjDoMVbKNs8RBcSR1pyO76pLS/DcaJDVy2z7lMlyy4DWJNOb5Cq',NULL,'2024-08-28 02:54:48','2024-08-28 02:54:48'),(8,9,'Ica','ica@email.com',1,NULL,'$2y$12$py52PgYjBdoj56kTvXdaNu4n81Th37Dnac3sYs.MXtKcdGFlzW5f6',NULL,'2024-08-28 02:54:48','2024-08-28 02:54:48'),(9,10,'Fika','fika@email.com',1,NULL,'$2y$12$.vRqMq08w4Wl3MQKgpQxYOgfnJL/374WyHHLP73jRx6030QSlDv2u',NULL,'2024-08-28 02:54:49','2024-08-28 02:54:49');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
