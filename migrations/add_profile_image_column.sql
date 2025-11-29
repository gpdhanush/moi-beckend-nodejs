-- Migration: Add um_profile_image column to gp_moi_user_master table
-- This column stores the profile image path for users

ALTER TABLE `gp_moi_user_master` 
ADD COLUMN `um_profile_image` VARCHAR(255) NULL DEFAULT NULL 
AFTER `um_email`;

-- Note: Existing users will have NULL profile image, which is expected
-- Users can update their profile picture through the profile update API
