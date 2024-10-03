DELIMITER $$

USE `phoenix`$$

DROP PROCEDURE IF EXISTS `sp_set_mapping_menu`$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_set_mapping_menu`()
BEGIN
UPDATE r_menu SET menu_mapping=f_get_path_menu(id); 
END$$

DELIMITER ;