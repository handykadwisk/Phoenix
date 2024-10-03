DELIMITER $$

USE `phoenix`$$

DROP PROCEDURE IF EXISTS `sp_path_menu`$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_path_menu`(IN `input` INT, OUT `output` TEXT)
BEGIN
  DECLARE _id INT ;
  DECLARE _parent INT ;
  DECLARE _path TEXT ;
  SET `max_sp_recursion_depth` = 50000 ;
  SELECT 
    id,
    menu_parent_id INTO _id,
    _parent 
  FROM
    r_menu 
  WHERE id = input ;
  
  IF _parent IS NULL 
  OR _parent = 0 
  THEN SET _path = CONCAT(_id, '.') ;
  ELSE CALL `sp_path_menu` (
    _parent,
    _path
  ) ;
  SELECT 
    CONCAT(_path, _id, '.') INTO _path ;
  END IF ;
  SELECT 
    _path INTO output ;
END$$

DELIMITER ;