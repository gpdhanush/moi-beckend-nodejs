-- Add status column to gp_moi_upcoming_functions table
-- Status will be 'completed' if date has passed, otherwise NULL or empty string

ALTER TABLE `gp_moi_upcoming_functions` 
ADD COLUMN `status` VARCHAR(20) NULL DEFAULT NULL AFTER `uf_status`;

-- Update existing records: set status to 'completed' if date has passed
UPDATE `gp_moi_upcoming_functions` 
SET `status` = 'completed' 
WHERE `uf_date` < CURDATE();
