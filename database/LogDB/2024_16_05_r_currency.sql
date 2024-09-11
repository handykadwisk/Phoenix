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

insert  into `r_currency`(`CURRENCY_ID`,`CURRENCY_SYMBOL`,`CURRENCY_NAME`,`CURRENCY_SEQ_EXCHANGE_RATE_BI`,`CURRENCY_SEQ_EXCHANGE_RATE_TAX`) values (1,'IDR','Indonesian Rupiah',1,1),(2,'AUD\r\n','Australian Dollar\r\n',2,3),(3,'BND\r\n','Brunei Dollar\r\n',3,23),(4,'CAD\r\n','Canadian Dollar\r\n',4,4),(5,'CHF\r\n','Swiss Franc\r\n',5,13),(6,'CNH\r\n','China Yuan\r\n',6,27),(7,'CNY\r\n','China Yuan Renmibi\r\n',7,25),(8,'DKK\r\n','Denmark Krone\r\n',8,5),(9,'EUR\r\n','Euro\r\n',9,24),(10,'GBP\r\n','Great Britain Pounds\r\n',10,10),(11,'HKD\r\n','Hong Kong Dollar\r\n',11,6),(12,'JPY\r\n','Japan Yen\r\n',12,14),(13,'KRW\r\n','Korean Won\r\n',13,26),(14,'KWD\r\n','Kuwait Dinar\r\n',14,17),(15,'LAK\r\n','Laos Kips\r\n',15,28),(16,'MYR\r\n','Malaysian Ringgit\r\n',16,7),(17,'NOK\r\n','Norwegian Krone\r\n',17,9),(18,'NZD\r\n','New Zealand Dollar\r\n',18,8),(19,'PGK\r\n','Papua N.G. Kina\r\n',19,29),(20,'PHP\r\n','Philippines Peso\r\n',20,19),(21,'SAR\r\n','Saudi Arabian Riyal\r\n',21,20),(22,'SEK\r\n','Swedish Krona\r\n',22,12),(23,'SGD\r\n','Singapore Dollar\r\n',23,11),(24,'THB\r\n','Thailand Baht\r\n',24,22),(25,'USD\r\n','US Dollar\r\n',25,2),(26,'VND\r\n','Vietnam Dong\r\n',26,30),(27,'MMK','Myanmar Kyat\r\n',27,15),(28,'INR\r\n','Indian Rupee\r\n',28,16),(29,'PKR\r\n','Pakistan Rupee\r\n',29,18),(30,'LKR\r\n','Sri Lanka Rupee\r\n',30,21);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
