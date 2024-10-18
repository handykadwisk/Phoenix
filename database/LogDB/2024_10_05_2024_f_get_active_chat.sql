/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 8.2.0 : Database - phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/* Function  structure for function  `f_get_active_chat` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_active_chat` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_active_chat`(start_date DATE) RETURNS text CHARSET latin1
BEGIN
  DECLARE RSLT TEXT ;
  DECLARE DOL INT ;
  DECLARE ExpiryDate TEXT ;
  set DOL = 90 ;
  SET ExpiryDate = DATE_ADD(start_date, INTERVAL DOL DAY) ;
  IF ExpiryDate < CURDATE() 
  THEN 
  SELECT 
    'InActive' INTO RSLT ;
  ELSE 
  SELECT 
    'Active' INTO RSLT ;
  END IF ;
  RETURN RSLT ;
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
