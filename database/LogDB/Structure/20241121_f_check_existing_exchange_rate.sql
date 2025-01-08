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
/* Function  structure for function  `f_check_existing_ex_rate` */

/*!50003 DROP FUNCTION IF EXISTS `f_check_existing_ex_rate` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_check_existing_ex_rate`(
  date_ex_rate TEXT,
  currency_id TEXT
) RETURNS text CHARSET utf8mb4
BEGIN
  DECLARE ex_rate text ;
  DECLARE result TEXT DEFAULT 'No';
  
  SELECT 
    rtd.EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE INTO ex_rate 
  FROM
    t_exchange_rate_tax AS rt 
    LEFT JOIN t_exchange_rate_tax_detail AS rtd 
      ON rtd.`EXCHANGE_RATE_TAX_ID` = rt.`EXCHANGE_RATE_TAX_ID` 
  WHERE rtd.`EXCHANGE_RATE_TAX_DETAIL_CURRENCY_ID` = currency_id 
    AND rt.EXCHANGE_RATE_TAX_START_DATE <= DATE_FORMAT(date_ex_rate, '%Y-%m-%d') 
    AND rt.EXCHANGE_RATE_TAX_END_DATE >= DATE_FORMAT(date_ex_rate, '%Y-%m-%d') 
  ORDER BY rt.EXCHANGE_RATE_TAX_END_DATE DESC 
  LIMIT 1 ;
  
  IF ex_rate IS NOT NULL THEN 
    SET result = 'Yes';
  END IF;
  
  RETURN result;
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
