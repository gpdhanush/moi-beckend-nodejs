-- Migration: Add CASCADE DELETE to foreign key constraints
-- This allows automatic deletion of related records when parent records are deleted
-- Date: 2025-12-07

-- IMPORTANT: Before running this script, make sure you have a database backup!
-- This will modify foreign key constraints and may affect data integrity.

-- Step 1: Drop existing foreign key constraints from gp_moi_credit_debit_master
-- Note: You may need to check the exact constraint names in your database first
-- Run: SHOW CREATE TABLE gp_moi_credit_debit_master;

ALTER TABLE `gp_moi_credit_debit_master`
DROP FOREIGN KEY `fk_mcd_person`,
DROP FOREIGN KEY `fk_mcd_default_function`;

-- Note: If fk_mcd_function exists, uncomment the line below
-- DROP FOREIGN KEY `fk_mcd_function`;

-- Step 2: Re-add foreign key constraints with CASCADE DELETE
ALTER TABLE `gp_moi_credit_debit_master`
ADD CONSTRAINT `fk_mcd_person` 
    FOREIGN KEY (`mcd_person_id`) 
    REFERENCES `gp_moi_persons` (`mp_id`) 
    ON DELETE CASCADE
    ON UPDATE CASCADE,
ADD CONSTRAINT `fk_mcd_default_function` 
    FOREIGN KEY (`mcd_function_id`) 
    REFERENCES `gp_moi_default_functions` (`mdf_id`) 
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- Optional: If you have a foreign key to gp_moi_functions table, uncomment below:
-- ADD CONSTRAINT `fk_mcd_function` 
--     FOREIGN KEY (`mcd_function_id`) 
--     REFERENCES `gp_moi_functions` (`f_id`) 
--     ON DELETE RESTRICT
--     ON UPDATE CASCADE;

-- Explanation:
-- - CASCADE DELETE on person: When a person is deleted, all their transactions are automatically deleted
-- - RESTRICT on functions: Prevents deletion of functions that have transactions (safer for reference data)
-- - CASCADE UPDATE: If parent ID changes, child records are updated automatically

-- To verify the changes, run:
-- SHOW CREATE TABLE gp_moi_credit_debit_master;
