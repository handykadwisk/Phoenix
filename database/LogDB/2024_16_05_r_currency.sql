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
/*Data for the table `r_currency` */

insert  into `r_currency`(`CURRENCY_ID`,`CURRENCY_SYMBOL`,`CURRENCY_NAME`,`CURRENCY_SEQ_EXCHANGE_RATE_BI`,`CURRENCY_SEQ_EXCHANGE_RATE_TAX`) values (1,'IDR','Indonesian Rupiah',1,1),(2,'AUD','Australian Dollar',2,3),(3,'BND','Brunei Dollar',3,23),(4,'CAD','Canadian Dollar',4,4),(5,'CHF','Swiss Franc',5,13),(6,'CNH','China Yuan',6,27),(7,'CNY','China Yuan Renmibi',7,25),(8,'DKK','Denmark Krone',8,5),(9,'EUR','Euro',9,24),(10,'GBP','Great Britain Pounds',10,10),(11,'HKD','Hong Kong Dollar',11,6),(12,'JPY','Japan Yen',12,14),(13,'KRW','Korean Won',13,26),(14,'KWD','Kuwait Dinar',14,17),(15,'LAK','Laos Kips',15,28),(16,'MYR','Malaysian Ringgit',16,7),(17,'NOK','Norwegian Krone',17,9),(18,'NZD','New Zealand Dollar',18,8),(19,'PGK','Papua N.G. Kina',19,29),(20,'PHP','Philippines Peso',20,19),(21,'SAR','Saudi Arabian Riyal',21,20),(22,'SEK','Swedish Krona',22,12),(23,'SGD','Singapore Dollar',23,11),(24,'THB','Thailand Baht',24,22),(25,'USD','US Dollar',25,2),(26,'VND','Vietnam Dong',26,30),(27,'MMK','Myanmar Kyat',27,15),(28,'INR','Indian Rupee',28,16),(29,'PKR','Pakistan Rupee',29,18),(30,'LKR','Sri Lanka Rupee',30,21);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
