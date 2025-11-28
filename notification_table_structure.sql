-- Table structure for storing push notifications
-- Table: gp_moi_notifications

CREATE TABLE `gp_moi_notifications` (
  `n_id` int(10) NOT NULL AUTO_INCREMENT,
  `n_um_id` int(10) NOT NULL COMMENT 'User ID from gp_moi_user_master table',
  `n_title` varchar(255) NOT NULL COMMENT 'Notification title',
  `n_body` text NOT NULL COMMENT 'Notification body/content',
  `n_type` varchar(20) NOT NULL DEFAULT 'general' COMMENT 'Notification type: moi, moiOut, function, account, settings, general',
  `n_is_read` char(1) NOT NULL DEFAULT 'N' COMMENT 'Read status: Y=Read, N=Unread',
  `n_read_time` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when notification was read',
  `n_create_dt` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Notification creation timestamp',
  `n_update_dt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `n_active` char(1) NOT NULL DEFAULT 'Y' COMMENT 'Active status: Y=Active, N=Deleted/Inactive',
  PRIMARY KEY (`n_id`),
  KEY `fk_n_user_id` (`n_um_id`),
  KEY `idx_n_type` (`n_type`),
  CONSTRAINT `fk_n_user_id` FOREIGN KEY (`n_um_id`) REFERENCES `gp_moi_user_master` (`um_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- If table already exists, use this ALTER statement to add n_type column
--
-- ALTER TABLE `gp_moi_notifications`
--   ADD COLUMN `n_type` varchar(20) NOT NULL DEFAULT 'general' COMMENT 'Notification type: moi, moiOut, function, account, settings, general' AFTER `n_body`,
--   ADD KEY `idx_n_type` (`n_type`);
