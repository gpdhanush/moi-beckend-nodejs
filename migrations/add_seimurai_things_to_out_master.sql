-- Add seimurai and things columns to gp_moi_out_master table
-- seimurai: ENUM with values 'Money' or 'Thinks'
-- things: TEXT field

ALTER TABLE `gp_moi_out_master` 
ADD COLUMN `seimurai` ENUM('Money', 'Thinks') NULL DEFAULT NULL AFTER `mom_remarks`,
ADD COLUMN `things` TEXT NULL DEFAULT NULL AFTER `seimurai`;
