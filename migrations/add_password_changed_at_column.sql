-- Migration: Add um_password_changed_at column to gp_moi_user_master table
-- This column tracks when a user last changed their password

ALTER TABLE `gp_moi_user_master` 
ADD COLUMN `um_password_changed_at` TIMESTAMP NULL DEFAULT NULL 
AFTER `um_password`;

-- For existing users, set um_password_changed_at to um_create_dt (registration date)
-- This assumes existing users haven't changed their password since registration
UPDATE `gp_moi_user_master` 
SET `um_password_changed_at` = `um_create_dt` 
WHERE `um_password_changed_at` IS NULL;
