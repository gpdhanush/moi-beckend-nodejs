-- Migration: Create Employee Tables
-- Description: Creates employee master table and employee permissions table
-- Date: 2025-01-XX

-- --------------------------------------------------------
-- Table structure for table `gp_moi_employee_master`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `gp_moi_employee_master` (
  `em_id` int(10) NOT NULL AUTO_INCREMENT,
  `em_full_name` varchar(100) NOT NULL,
  `em_email` varchar(75) NOT NULL,
  `em_mobile` varchar(10) NOT NULL,
  `em_password` varchar(255) NOT NULL,
  `em_status` char(1) NOT NULL DEFAULT 'Y' COMMENT 'Y=Active, N=Inactive',
  `em_created_by` int(10) DEFAULT NULL COMMENT 'Admin ID who created this employee',
  `em_create_dt` timestamp NOT NULL DEFAULT current_timestamp(),
  `em_update_dt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`em_id`),
  UNIQUE KEY `unique_email` (`em_email`),
  UNIQUE KEY `unique_mobile` (`em_mobile`),
  KEY `idx_status` (`em_status`),
  KEY `idx_created_by` (`em_created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `gp_moi_employee_permissions`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `gp_moi_employee_permissions` (
  `ep_id` int(10) NOT NULL AUTO_INCREMENT,
  `ep_em_id` int(10) NOT NULL COMMENT 'Employee ID',
  `ep_function_id` int(10) DEFAULT NULL COMMENT 'Function ID (NULL means all functions)',
  `ep_permission_type` varchar(50) NOT NULL DEFAULT 'MOI_INSERT' COMMENT 'MOI_INSERT, FUNCTION_CREATE, etc.',
  `ep_status` char(1) NOT NULL DEFAULT 'Y' COMMENT 'Y=Active/Assigned, N=Cancelled',
  `ep_assigned_by` int(10) DEFAULT NULL COMMENT 'Admin ID who assigned this permission',
  `ep_assigned_dt` timestamp NOT NULL DEFAULT current_timestamp(),
  `ep_cancelled_dt` timestamp NULL DEFAULT NULL,
  `ep_cancelled_by` int(10) DEFAULT NULL COMMENT 'Admin ID who cancelled this permission',
  PRIMARY KEY (`ep_id`),
  KEY `idx_employee` (`ep_em_id`),
  KEY `idx_function` (`ep_function_id`),
  KEY `idx_status` (`ep_status`),
  KEY `idx_permission_type` (`ep_permission_type`),
  CONSTRAINT `fk_employee_permissions_employee` FOREIGN KEY (`ep_em_id`) REFERENCES `gp_moi_employee_master` (`em_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_employee_permissions_function` FOREIGN KEY (`ep_function_id`) REFERENCES `gp_moi_functions` (`f_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
