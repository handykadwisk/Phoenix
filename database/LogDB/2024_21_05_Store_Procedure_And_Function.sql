/*
SQLyog Ultimate v13.1.1 (32 bit)
MySQL - 8.3.0 : Database - phoenix
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/* Function  structure for function  `f_get_last_note_claim` */

/*!50003 DROP FUNCTION IF EXISTS `f_get_last_note_claim` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`admin`@`%` FUNCTION `f_get_last_note_claim`(`var_claim_id` BIGINT) RETURNS text CHARSET latin1
BEGIN
  DECLARE LAST_NOTE TEXT;
  SELECT 
    CLAIM_HISTORY_NOTE into LAST_NOTE 
  FROM
    photclaimhistory 
  where CLAIM_ID = var_claim_id 
  ORDER BY CLAIM_HISTORY_ID DESC 
  LIMIT 1 ;
  RETURN LAST_NOTE ;
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

/* Procedure structure for procedure `sp_get_last_note_claim` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_get_last_note_claim` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`admin`@`%` PROCEDURE `sp_get_last_note_claim`(IN `var_claim_id` bigINT)
BEGIN
  SELECT f_get_last_note_claim(var_claim_id) AS LAST_NOTE;
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
