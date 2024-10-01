DELIMITER $$

USE `phoenixx`$$

DROP PROCEDURE IF EXISTS `sp_combo_menu`$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_combo_menu`()
BEGIN
  SET `max_sp_recursion_depth` = 50000 ;
  SELECT 
    id,
    menu_parent_id,
    menu_name,
    @path_combo := `f_get_path_menu` (id) mapping,
    IF(
      (
        LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
      ) <= 1,
      menu_name,
      CONCAT(
        REPEAT(
          '++',
          (
            LENGTH(@path_combo) - LENGTH(REPLACE(@path_combo, ".", ""))
          ) - 1
        ),
        menu_name
      )
    ) text_combo 
  FROM
    r_menu 
  WHERE menu_is_deleted <> 1 
  ORDER BY menu_sequence ; /*mapping*/
END$$

DELIMITER ;