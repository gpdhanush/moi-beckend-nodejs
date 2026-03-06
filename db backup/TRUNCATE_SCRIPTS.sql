-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- ================= CHILD TABLES FIRST =================

TRUNCATE TABLE user_otps;

TRUNCATE TABLE user_sessions;

TRUNCATE TABLE user_devices;

TRUNCATE TABLE user_profiles;

TRUNCATE TABLE user_credentials;

TRUNCATE TABLE feedbacks;

TRUNCATE TABLE upcoming_functions;

TRUNCATE TABLE transactions;

TRUNCATE TABLE transaction_functions;

TRUNCATE TABLE persons;

TRUNCATE TABLE user_referrals;

TRUNCATE TABLE admins;

-- ================= PARENT TABLE LAST =================

TRUNCATE TABLE users;

-- Enable foreign key checks back
SET FOREIGN_KEY_CHECKS = 1;