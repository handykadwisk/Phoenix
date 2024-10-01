DELIMITER $$

USE `phoenixx`$$

DROP FUNCTION IF EXISTS `f_get_path_menu`$$

CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_path_menu`(`input` INT) RETURNS TEXT CHARSET latin1 COLLATE latin1_swedish_ci
BEGIN
  CALL `sp_path_menu`(input, @path);
  RETURN @path;
END$$

DELIMITER ;