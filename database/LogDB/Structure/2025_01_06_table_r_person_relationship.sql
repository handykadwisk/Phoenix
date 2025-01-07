/*
SQLyog Trial v13.1.9 (64 bit)
MySQL - 5.7.36 : Database - phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `r_person_relationship` */

DROP TABLE IF EXISTS `r_person_relationship`;

CREATE TABLE `r_person_relationship` (
  `PERSON_RELATIONSHIP_ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `PERSON_RELATIONSHIP_NAME` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PERSON_RELATIONSHIP_IS_FAMILY_MEMBER` bigint(1) DEFAULT '0' COMMENT '0 = No, 1 = Yes',
  PRIMARY KEY (`PERSON_RELATIONSHIP_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `r_person_relationship` */

insert  into `r_person_relationship`(`PERSON_RELATIONSHIP_ID`,`PERSON_RELATIONSHIP_NAME`,`PERSON_RELATIONSHIP_IS_FAMILY_MEMBER`) values 
(1,'Aunty',0),
(2,'Brother',1),
(3,'Cousin',0),
(4,'Father',1),
(5,'Grandfather',0),
(6,'Grandmother',0),
(7,'Sister',1),
(8,'Stepdad',0),
(9,'Stepmum',0),
(10,'Uncle',0),
(11,'Friend',0),
(12,'Wife',1),
(13,'Husband',1),
(14,'Mother',1),
(15,'Children',1),
(16,'Others',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
