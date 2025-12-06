-- Add seimurai and things columns to gp_moi_master_records table
-- seimurai: ENUM with values 'Money' or 'Thinks'
-- things: TEXT field

ALTER TABLE `gp_moi_master_records` 
ADD COLUMN `seimurai` ENUM('Money', 'Thinks') NULL DEFAULT NULL AFTER `mr_remarks`,
ADD COLUMN `things` TEXT NULL DEFAULT NULL AFTER `seimurai`;
