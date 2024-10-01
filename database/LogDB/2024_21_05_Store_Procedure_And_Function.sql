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
/* Function  structure for function  `f_get_path_company_division` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_company_division` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_company_division`(`input_company_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_company_division`(input_company_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_company_job_desc` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_company_job_desc` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_company_job_desc`(`input_company_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_company_job_desc`(input_company_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_company_office` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_company_office` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_company_office`(`input_company_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_company_office`(input_company_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_company_structure` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_company_structure` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_company_structure`(`input_company_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_company_structure`(input_company_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_relation_division` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_relation_division` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_relation_division`(`input_relation_organization_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_relation_division`(input_relation_organization_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_relation_group` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_relation_group` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_relation_group`(`input_relation_group_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_relation_group`(input_relation_group_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_relation_job_desc` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_relation_job_desc` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_relation_job_desc`(`input_relation_organization_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_relation_job_desc`(input_relation_organization_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_relation_office` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_relation_office` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_relation_office`(`input_relation_organization_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_relation_office`(input_relation_organization_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_relation_organization` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_relation_organization` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_relation_organization`(`input_relation_group_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_relation_organization`(input_relation_group_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Function  structure for function  `f_get_path_relation_structure` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_path_relation_structure` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_relation_structure`(`input_relation_organization_id` INT, `input` INT) RETURNS text CHARSET latin1
BEGIN
  CALL `sp_path_relation_structure`(input_relation_organization_id,input, @path);
  RETURN @path;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_company_division` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_company_division` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_company_division`(IN `input_company_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_company_id IS NULL 
  THEN 
  SELECT 
    COMPANY_DIVISION_ID,
    COMPANY_DIVISION_PARENT_ID,
    COMPANY_ID,
    COMPANY_DIVISION_ALIAS,
    @path_combo := `f_get_path_company_division` (NULL, COMPANY_DIVISION_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_DIVISION_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_DIVISION_ALIAS
      )
    ) text_combo 
  FROM
    t_company_division 
  ORDER BY COMPANY_ID,
    mapping ;
  ELSE 
  SELECT 
    COMPANY_DIVISION_ID,
    COMPANY_DIVISION_PARENT_ID,
    COMPANY_ID,
    COMPANY_DIVISION_ALIAS,
    @path_combo := `f_get_path_company_division` (input_company_id, COMPANY_DIVISION_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_DIVISION_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_DIVISION_ALIAS
      )
    ) text_combo 
  FROM
    t_company_division 
  WHERE COMPANY_ID = input_company_id 
  ORDER BY COMPANY_ID,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_company_job_desc` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_company_job_desc` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_company_job_desc`(IN `input_company_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_company_id IS NULL 
  THEN 
  SELECT 
    COMPANY_JOBDESC_ID,
    COMPANY_JOBDESC_PARENT_ID,
    COMPANY_ID,
    COMPANY_JOBDESC_ALIAS,
    @path_combo := `f_get_path_company_job_desc` (NULL, COMPANY_JOBDESC_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_JOBDESC_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_JOBDESC_ALIAS
      )
    ) text_combo 
  FROM
    t_job_desc_company 
  ORDER BY COMPANY_ID,
    mapping ;
  ELSE 
  SELECT 
    COMPANY_JOBDESC_ID,
    COMPANY_JOBDESC_PARENT_ID,
    COMPANY_ID,
    COMPANY_JOBDESC_ALIAS,
    @path_combo := `f_get_path_company_job_desc` (input_company_id, COMPANY_JOBDESC_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_JOBDESC_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_JOBDESC_ALIAS
      )
    ) text_combo 
  FROM
    t_job_desc_company 
  WHERE COMPANY_ID = input_company_id 
  ORDER BY COMPANY_ID,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_company_office` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_company_office` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_company_office`(IN `input_company_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_company_id IS NULL 
  THEN 
  SELECT 
    COMPANY_OFFICE_ID,
    COMPANY_OFFICE_PARENT_ID,
    COMPANY_ID,
    COMPANY_OFFICE_ALIAS,
    @path_combo := `f_get_path_company_office` (NULL, COMPANY_OFFICE_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_OFFICE_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_OFFICE_ALIAS
      )
    ) text_combo 
  FROM
    t_company_office 
  ORDER BY COMPANY_ID,
    mapping ;
  ELSE 
  SELECT 
    COMPANY_OFFICE_ID,
    COMPANY_OFFICE_PARENT_ID,
    COMPANY_ID,
    COMPANY_OFFICE_ALIAS,
    @path_combo := `f_get_path_company_office` (input_company_id, COMPANY_OFFICE_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_OFFICE_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_OFFICE_ALIAS
      )
    ) text_combo 
  FROM
    t_company_office 
  WHERE COMPANY_ID = input_company_id 
  ORDER BY COMPANY_ID,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_company_structure` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_company_structure` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_company_structure`(IN `input_company_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_company_id IS NULL 
  THEN 
  SELECT 
    COMPANY_STRUCTURE_ID,
    COMPANY_STRUCTURE_PARENT_ID,
    COMPANY_ID,
    COMPANY_STRUCTURE_ALIAS,
    @path_combo := `f_get_path_company_structure` (NULL, COMPANY_STRUCTURE_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_STRUCTURE_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_STRUCTURE_ALIAS
      )
    ) text_combo 
  FROM
    t_company_structure 
  ORDER BY COMPANY_ID,
    mapping ;
  ELSE 
  SELECT 
    COMPANY_STRUCTURE_ID,
    COMPANY_STRUCTURE_PARENT_ID,
    COMPANY_ID,
    COMPANY_STRUCTURE_ALIAS,
    @path_combo := `f_get_path_company_structure` (input_company_id, COMPANY_STRUCTURE_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      COMPANY_STRUCTURE_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        COMPANY_STRUCTURE_ALIAS
      )
    ) text_combo 
  FROM
    t_company_structure 
  WHERE COMPANY_ID = input_company_id 
  ORDER BY COMPANY_ID,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_relation_division` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_relation_division` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_relation_division`(IN `input_relation_organization_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_organization_id IS NULL 
  THEN 
  SELECT 
    RELATION_DIVISION_ID,
    RELATION_DIVISION_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_DIVISION_ALIAS,
    @path_combo := `f_get_path_relation_division` (NULL, RELATION_DIVISION_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_DIVISION_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_DIVISION_ALIAS
      )
    ) text_combo 
  FROM
    t_relation_division 
  ORDER BY RELATION_ORGANIZATION_ID,
    mapping ;
  ELSE 
  SELECT 
    RELATION_DIVISION_ID,
    RELATION_DIVISION_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_DIVISION_ALIAS,
    @path_combo := `f_get_path_relation_division` (input_relation_organization_id, RELATION_DIVISION_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_DIVISION_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_DIVISION_ALIAS
      )
    ) text_combo 
  FROM
    t_relation_division 
  WHERE RELATION_ORGANIZATION_ID = input_relation_organization_id 
  ORDER BY RELATION_ORGANIZATION_ID,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_relation_group` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_relation_group` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_relation_group`(IN `input_relation_group_group_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_group_group_id IS NULL 
  THEN 
  SELECT 
    RELATION_GROUP_ID,
    RELATION_GROUP_PARENT,
    RELATION_GROUP_NAME,
    @path_combo := `f_get_path_relation_group` (NULL, RELATION_GROUP_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_GROUP_NAME,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_GROUP_NAME
      )
    ) text_combo 
  FROM
    t_relation_group 
  ORDER BY RELATION_GROUP_ID,
    mapping ;
  ELSE 
  SELECT 
    RELATION_GROUP_ID,
    RELATION_GROUP_PARENT_ID,
    RELATION_GROUP_NAME,
    @path_combo := `f_get_path_relation_group` (input_relation_group_group_id, RELATION_GROUP_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_GROUP_NAME,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_GROUP_NAME
      )
    ) text_combo 
  FROM
    t_relation_group 
  WHERE RELATION_GROUP_ID = input_relation_group_group_id 
  ORDER BY RELATION_GROUP_ID,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_relation_job_desc` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_relation_job_desc` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_relation_job_desc`(IN `input_relation_organization_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
IF  input_relation_organization_id IS NULL THEN
SELECT 
    RELATION_JOBDESC_ID,
    RELATION_JOBDESC_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_JOBDESC_ALIAS,
    @path_combo:=`f_get_path_relation_job_desc`(NULL, RELATION_JOBDESC_ID) mapping,
  IF(
    (
    LENGTH(@path_combo)-   
    LENGTH(
      REPLACE(
        @path_combo,
        ".",
        ""
      )
    )) <= 1,
    RELATION_JOBDESC_ALIAS,
    CONCAT(
      REPEAT(
        '++',
        (
        LENGTH(@path_combo)-
        LENGTH(
          REPLACE(
            @path_combo,
            ".",
            ""
          )
        )) - 1
      ),
      RELATION_JOBDESC_ALIAS
    )
  ) text_combo     
  FROM
    t_job_desc 
  ORDER BY RELATION_ORGANIZATION_ID,mapping ;
ELSE
  
  SELECT 
    RELATION_JOBDESC_ID,
    RELATION_JOBDESC_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_JOBDESC_ALIAS,
    @path_combo:=`f_get_path_relation_job_desc`(input_relation_organization_id, RELATION_JOBDESC_ID) mapping,
  IF(
    (
    LENGTH(@path_combo)-
    LENGTH(
      REPLACE(
        @path_combo,
        ".",
        ""
      )
    )) <= 1,
    RELATION_JOBDESC_ALIAS,
    CONCAT(
      REPEAT(
        '++',
        (
        LENGTH(@path_combo)-
        LENGTH(
          REPLACE(
            @path_combo,
            ".",
            ""
          )
        )) - 1
      ),
      RELATION_JOBDESC_ALIAS
    )
  ) text_combo     
  FROM
    t_job_desc 
  WHERE RELATION_ORGANIZATION_ID = input_relation_organization_id 
  ORDER BY RELATION_ORGANIZATION_ID,mapping ;
  END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_relation_office` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_relation_office` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_relation_office`(IN `input_relation_organization_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
IF  input_relation_organization_id IS NULL THEN
SELECT 
    RELATION_OFFICE_ID,
    RELATION_OFFICE_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_OFFICE_ALIAS,
    @path_combo:=`f_get_path_relation_office`(NULL, RELATION_OFFICE_ID) mapping,
  IF(
    (
    LENGTH(@path_combo)-	
    LENGTH(
      REPLACE(
        @path_combo,
        ".",
        ""
      )
    )) <= 1,
    officealias,
    CONCAT(
      REPEAT(
        '++',
        (
        LENGTH(@path_combo)-
        LENGTH(
          REPLACE(
            @path_combo,
            ".",
            ""
          )
        )) - 1
      ),
      RELATION_OFFICE_ALIAS
    )
  ) text_combo     
  FROM
    t_relation_office 
  ORDER BY RELATION_ORGANIZATION_ID,mapping ;
ELSE
  
  SELECT 
RELATION_OFFICE_ID,
    RELATION_OFFICE_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_OFFICE_ALIAS,
    @path_combo:=`f_get_path_relation_office`(input_relation_organization_id, RELATION_OFFICE_ID) mapping,
  IF(
  (
  LENGTH(@path_combo)-
    LENGTH(
      REPLACE(
        @path_combo,
        ".",
        ""
      )
    )) <= 1,
    RELATION_OFFICE_ALIAS,
    CONCAT(
      REPEAT(
        '++',
        (
        LENGTH(@path_combo)-
        LENGTH(
          REPLACE(
            @path_combo,
            ".",
            ""
          )
        )) - 1
      ),
      RELATION_OFFICE_ALIAS
    )
  ) text_combo     
  FROM
    t_relation_office 
  WHERE RELATION_ORGANIZATION_ID = input_relation_organization_id 
  ORDER BY RELATION_ORGANIZATION_ID,mapping ;
  END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_relation_organization` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_relation_organization` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_relation_organization`(IN `input_relation_group_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_group_id IS NULL 
  THEN 
  SELECT 
    RELATION_ORGANIZATION_ID,
    RELATION_ORGANIZATION_PARENT_ID,
    RELATION_ORGANIZATION_GROUP,
    RELATION_ORGANIZATION_ALIAS,
    @path_combo := `f_get_path_relation_organization` (NULL, RELATION_ORGANIZATION_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_ORGANIZATION_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_ORGANIZATION_ALIAS
      )
    ) text_combo 
  FROM
    t_relation 
  ORDER BY RELATION_ORGANIZATION_GROUP,
    mapping ;
  ELSE 
  SELECT 
    RELATION_ORGANIZATION_ID,
    RELATION_ORGANIZATION_PARENT_ID,
    RELATION_ORGANIZATION_GROUP,
    RELATION_ORGANIZATION_ALIAS,
    @path_combo := `f_get_path_relation_organization` (input_relation_group_id, RELATION_ORGANIZATION_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_ORGANIZATION_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_ORGANIZATION_ALIAS
      )
    ) text_combo 
  FROM
    t_relation 
  WHERE RELATION_ORGANIZATION_GROUP = input_relation_group_id 
  ORDER BY RELATION_ORGANIZATION_GROUP,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_combo_relation_structure` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_combo_relation_structure` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_relation_structure`(IN `input_relation_organization_id` INT)
BEGIN
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_organization_id IS NULL 
  THEN 
  SELECT 
    RELATION_STRUCTURE_ID,
    RELATION_STRUCTURE_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_STRUCTURE_ALIAS,
    @path_combo := `f_get_path_relation_structure` (NULL, RELATION_STRUCTURE_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_STRUCTURE_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_STRUCTURE_ALIAS
      )
    ) text_combo 
  FROM
    t_relation_structure 
  ORDER BY RELATION_ORGANIZATION_ID,
    mapping ;
  ELSE 
  SELECT 
    RELATION_STRUCTURE_ID,
    RELATION_STRUCTURE_PARENT_ID,
    RELATION_ORGANIZATION_ID,
    RELATION_STRUCTURE_ALIAS,
    @path_combo := `f_get_path_relation_structure` (input_relation_organization_id, RELATION_STRUCTURE_ID) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      RELATION_STRUCTURE_ALIAS,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        RELATION_STRUCTURE_ALIAS
      )
    ) text_combo 
  FROM
    t_relation_structure 
  WHERE RELATION_ORGANIZATION_ID = input_relation_organization_id 
  ORDER BY RELATION_ORGANIZATION_ID,
    mapping ;
  END IF ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_company_division` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_company_division` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_company_division`(IN `input_comapny_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_comapny_id IS NULL 
  THEN 
  SELECT 
    COMPANY_DIVISION_ID,
    COMPANY_DIVISION_PARENT_ID INTO _id,
    _parent 
  FROM
    t_company_division 
  WHERE COMPANY_DIVISION_ID = input ;
  ELSE 
  SELECT 
    COMPANY_DIVISION_ID,
    COMPANY_DIVISION_PARENT_ID INTO _id,
    _parent 
  FROM
    t_company_division 
  WHERE COMPANY_DIVISION_ID = input 
    AND COMPANY_ID = input_comapny_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_company_division` (
    input_comapny_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_company_job_desc` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_company_job_desc` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_company_job_desc`(IN `input_comapny_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_comapny_id IS NULL 
  THEN 
  SELECT 
    COMPANY_JOBDESC_ID,
    COMPANY_JOBDESC_PARENT_ID INTO _id,
    _parent 
  FROM
    t_job_desc_company 
  WHERE COMPANY_JOBDESC_ID = input ;
  ELSE 
  SELECT 
    COMPANY_JOBDESC_ID,
    COMPANY_JOBDESC_PARENT_ID INTO _id,
    _parent 
  FROM
    t_job_desc_company 
  WHERE COMPANY_JOBDESC_ID = input 
    AND COMPANY_ID = input_comapny_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_company_job_desc` (
    input_comapny_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_company_office` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_company_office` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_company_office`(IN `input_comapny_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_comapny_id IS NULL 
  THEN 
  SELECT 
    COMPANY_OFFICE_ID,
    COMPANY_OFFICE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_company_office 
  WHERE COMPANY_OFFICE_ID = input ;
  ELSE 
  SELECT 
    COMPANY_OFFICE_ID,
    COMPANY_OFFICE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_company_office 
  WHERE COMPANY_OFFICE_ID = input 
    AND COMPANY_ID = input_comapny_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_company_office` (
    input_comapny_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_company_structure` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_company_structure` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_company_structure`(IN `input_comapny_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_comapny_id IS NULL 
  THEN 
  SELECT 
    COMPANY_STRUCTURE_ID,
    COMPANY_STRUCTURE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_company_structure 
  WHERE COMPANY_STRUCTURE_ID = input ;
  ELSE 
  SELECT 
    COMPANY_STRUCTURE_ID,
    COMPANY_STRUCTURE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_company_structure 
  WHERE COMPANY_STRUCTURE_ID = input 
    AND COMPANY_ID = input_comapny_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_company_structure` (
    input_comapny_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_relation_division` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_relation_division` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_relation_division`(IN `input_relation_organization_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_organization_id IS NULL 
  THEN 
  SELECT 
    RELATION_DIVISION_ID,
    RELATION_DIVISION_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation_division 
  WHERE sdivisionid = input ;
  ELSE 
  SELECT 
    RELATION_DIVISION_ID,
    RELATION_DIVISION_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation_division 
  WHERE RELATION_DIVISION_ID = input 
    AND RELATION_ORGANIZATION_ID = input_relation_organization_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_relation_division` (
    input_relation_organization_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_relation_group` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_relation_group` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_relation_group`(IN `input_relation_group_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_group_id IS NULL 
  THEN 
  SELECT 
    RELATION_GROUP_ID,
    RELATION_GROUP_PARENT INTO _id,
    _parent 
  FROM
    t_relation_group 
  WHERE RELATION_GROUP_ID = input ;
  ELSE 
  SELECT 
    RELATION_GROUP_ID,
    RELATION_ORGANIZATION_PARENT INTO _id,
    _parent 
  FROM
    t_relation 
  WHERE RELATION_GROUP_ID = input 
    AND RELATION_ORGANIZATION_GROUP = input_relation_group_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_relation_group` (
    input_relation_group_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_relation_job_desc` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_relation_job_desc` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_relation_job_desc`(IN `input_relation_organization_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_organization_id IS NULL 
  THEN 
  SELECT 
    RELATION_JOBDESC_ID,
    RELATION_JOBDESC_PARENT_ID INTO _id,
    _parent 
  FROM
    t_job_desc 
  WHERE RELATION_JOBDESC_ID = input ;
  ELSE 
  SELECT 
    RELATION_JOBDESC_ID,
    RELATION_JOBDESC_PARENT_ID INTO _id,
    _parent 
  FROM
    t_job_desc 
  WHERE RELATION_JOBDESC_ID = input 
    AND RELATION_ORGANIZATION_ID = input_relation_organization_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_relation_job_desc` (
    input_relation_organization_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_relation_office` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_relation_office` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_relation_office`(IN `input_relation_organization_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_organization_id IS NULL 
  THEN 
  SELECT 
    RELATION_OFFICE_ID,
    RELATION_OFFICE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation_office 
  WHERE RELATION_OFFICE_ID = input ;
  ELSE 
  SELECT 
    RELATION_OFFICE_ID,
    RELATION_OFFICE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation_office 
  WHERE RELATION_OFFICE_ID = input 
    AND RELATION_ORGANIZATION_ID = input_relation_organization_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_relation_office` (
    input_relation_organization_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_relation_organization` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_relation_organization` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_relation_organization`(IN `input_relation_group_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_group_id IS NULL 
  THEN 
  SELECT 
    RELATION_ORGANIZATION_ID,
    RELATION_ORGANIZATION_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation 
  WHERE RELATION_ORGANIZATION_ID = input ;
  ELSE 
  SELECT 
    RELATION_ORGANIZATION_ID,
    RELATION_ORGANIZATION_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation 
  WHERE RELATION_ORGANIZATION_ID = input 
    AND RELATION_ORGANIZATION_GROUP = input_relation_group_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_relation_organization` (
    input_relation_group_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_path_relation_structure` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_path_relation_structure` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_relation_structure`(IN `input_relation_organization_id` INT, IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 5000 ;
  IF input_relation_organization_id IS NULL 
  THEN 
  SELECT 
    RELATION_STRUCTURE_ID,
    RELATION_STRUCTURE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation_structure 
  WHERE RELATION_STRUCTURE_ID = input ;
  ELSE 
  SELECT 
    RELATION_STRUCTURE_ID,
    RELATION_STRUCTURE_PARENT_ID INTO _id,
    _parent 
  FROM
    t_relation_structure 
  WHERE RELATION_STRUCTURE_ID = input 
    AND RELATION_ORGANIZATION_ID = input_relation_organization_id ;
  END IF ;
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_relation_structure` (
    input_relation_organization_id,
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_company_division` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_company_division` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_company_division`(IN `input_company_id` INT)
BEGIN
IF input_company_id IS NULL THEN
UPDATE t_company_division SET COMPANY_DIVISION_MAPPING=f_get_path_company_division(input_company_id, COMPANY_DIVISION_ID); 
ELSE
UPDATE t_company_division SET COMPANY_DIVISION_MAPPING=f_get_path_company_division(input_company_id, COMPANY_DIVISION_ID) WHERE COMPANY_ID=input_company_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_company_job_desc` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_company_job_desc` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_company_job_desc`(IN `input_company_id` INT)
BEGIN
IF input_company_id IS NULL THEN
UPDATE t_job_desc_company SET COMPANY_JOBDESC_MAPPING=f_get_path_company_job_desc(input_company_id, COMPANY_JOBDESC_ID); 
ELSE
UPDATE t_job_desc_company SET COMPANY_JOBDESC_MAPPING=f_get_path_company_job_desc(input_company_id, COMPANY_JOBDESC_ID) WHERE COMPANY_ID=input_company_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_company_office` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_company_office` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_company_office`(IN `input_company_id` INT)
BEGIN
IF input_company_id IS NULL THEN
UPDATE t_company_office SET COMPANY_OFFICE_MAPPING=f_get_path_company_office(input_company_id, COMPANY_OFFICE_ID); 
ELSE
UPDATE t_company_office SET COMPANY_OFFICE_MAPPING=f_get_path_company_office(input_company_id, COMPANY_OFFICE_ID) WHERE COMPANY_ID=input_company_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_company_structure` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_company_structure` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_company_structure`(IN `input_company_id` INT)
BEGIN
IF input_company_id IS NULL THEN
UPDATE t_company_structure SET COMPANY_STRUCTURE_MAPPING=f_get_path_company_structure(input_company_id, COMPANY_STRUCTURE_ID); 
ELSE
UPDATE t_company_structure SET COMPANY_STRUCTURE_MAPPING=f_get_path_company_structure(input_company_id, COMPANY_STRUCTURE_ID) WHERE COMPANY_ID=input_company_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_relation_division` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_relation_division` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_relation_division`(IN `input_relation_organization_id` INT)
BEGIN
IF input_relation_organization_id IS NULL THEN
UPDATE t_relation_division SET RELATION_DIVISION_MAPPING=f_get_path_relation_division(input_relation_organization_id, RELATION_DIVISION_ID); 
ELSE
UPDATE t_relation_division SET RELATION_DIVISION_MAPPING=f_get_path_relation_division(input_relation_organization_id, RELATION_DIVISION_ID) WHERE RELATION_ORGANIZATION_ID=input_relation_organization_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_relation_group` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_relation_group` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_relation_group`(IN `input_group_id` INT)
BEGIN
IF input_group_id IS NULL THEN
UPDATE t_relation_group SET RELATION_GROUP_MAPPING=f_get_path_relation_group(input_group_id, RELATION_GROUP_ID); 
ELSE
UPDATE t_relation_group SET RELATION_GROUP_MAPPING=f_get_path_relation_group(input_group_id, RELATION_GROUP_ID) WHERE RELATION_ORGANIZATION_GROUP=input_group_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_relation_job_desc` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_relation_job_desc` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_relation_job_desc`(IN `input_relation_organization_id` INT)
BEGIN
IF input_relation_organization_id IS NULL THEN
UPDATE t_job_desc SET RELATION_JOBDESC_MAPPING=f_get_path_relation_job_desc(input_relation_organization_id, RELATION_JOBDESC_ID); 
ELSE
UPDATE t_job_desc SET RELATION_JOBDESC_MAPPING=f_get_path_relation_job_desc(input_relation_organization_id, RELATION_JOBDESC_ID) WHERE RELATION_ORGANIZATION_ID=input_relation_organization_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_relation_office` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_relation_office` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_relation_office`(IN `input_relation_organization_id` INT)
BEGIN
IF input_relation_organization_id IS NULL THEN
UPDATE t_relation_office SET RELATION_OFFICE_MAPPING=f_get_path_relation_office(input_relation_organization_id, RELATION_OFFICE_ID); 
ELSE
UPDATE t_relation_office SET RELATION_OFFICE_MAPPING=f_get_path_relation_office(input_relation_organization_id, RELATION_OFFICE_ID) WHERE RELATION_ORGANIZATION_ID=input_relation_organization_id; 
END IF;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_relation_organization` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_relation_organization` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_relation_organization`(IN `input_group_id` INT)
BEGIN
if input_group_id is null then
UPDATE t_relation SET RELATION_ORGANIZATION_MAPPING=f_get_path_relation_organization(input_group_id, RELATION_ORGANIZATION_ID); 
else
UPDATE t_relation SET RELATION_ORGANIZATION_MAPPING=f_get_path_relation_organization(input_group_id, RELATION_ORGANIZATION_ID) WHERE RELATION_ORGANIZATION_GROUP=input_group_id; 
end if;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_set_mapping_relation_structure` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_set_mapping_relation_structure` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_relation_structure`(IN `input_relation_organization_id` INT)
BEGIN
IF input_relation_organization_id IS NULL THEN
UPDATE t_relation_structure SET RELATION_STRUCTURE_MAPPING=f_get_path_relation_structure(input_relation_organization_id, RELATION_STRUCTURE_ID); 
ELSE
UPDATE t_relation_structure SET RELATION_STRUCTURE_MAPPING=f_get_path_relation_structure(input_relation_organization_id, RELATION_STRUCTURE_ID) WHERE RELATION_ORGANIZATION_ID=input_relation_organization_id; 
END IF;
END */$$
DELIMITER ;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
