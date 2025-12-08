-- Migration: Add firstName, secondName, and city columns to gp_moi_credit_debit_master table
-- Date: 2025-12-07

ALTER TABLE `gp_moi_credit_debit_master`
ADD COLUMN `mcd_first_name` VARCHAR(100) NULL AFTER `mcd_person_id`,
ADD COLUMN `mcd_second_name` VARCHAR(100) NULL AFTER `mcd_first_name`,
ADD COLUMN `mcd_city` VARCHAR(100) NULL AFTER `mcd_second_name`;

-- Update existing records with data from gp_moi_persons table
UPDATE `gp_moi_credit_debit_master` mcd
INNER JOIN `gp_moi_persons` mp ON mp.mp_id = mcd.mcd_person_id
SET 
    mcd.mcd_first_name = mp.mp_first_name,
    mcd.mcd_second_name = mp.mp_second_name,
    mcd.mcd_city = mp.mp_city
WHERE mcd.mcd_active = 'Y' AND mp.mp_active = 'Y';
