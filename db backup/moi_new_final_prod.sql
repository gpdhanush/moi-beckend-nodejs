-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 06, 2026 at 04:33 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moi_new`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` binary(16) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_changed_at` datetime DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','BLOCKED') DEFAULT 'ACTIVE',
  `failed_login_attempts` tinyint(3) UNSIGNED DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `last_activity_at` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `full_name`, `email`, `mobile`, `password_hash`, `password_changed_at`, `status`, `failed_login_attempts`, `locked_until`, `email_verified_at`, `reset_token`, `reset_token_expires_at`, `last_login_at`, `last_activity_at`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x6c081b2a124e462984abf0631f891327, 'GNANA PRAKASAM', 'agprakash406@gmail.com', '7845456609', '$2a$10$EyPwwiGO./vAC.vS7zadEupmz2DQ5lxtAwoRrOvbu.KsgRjRejCSm', NULL, 'ACTIVE', 0, NULL, NULL, NULL, NULL, '2026-03-03 12:32:34', '2026-03-03 12:32:34', 0, NULL, '2026-03-03 05:58:45', '2026-03-03 07:02:34');

-- --------------------------------------------------------

--
-- Table structure for table `default_functions`
--

CREATE TABLE `default_functions` (
  `id` binary(16) NOT NULL,
  `name` varchar(150) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `default_functions`
--

INSERT INTO `default_functions` (`id`, `name`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x0a1252367b07488eaafd8c00013be322, 'நிக்காஹ் திருமண விழா', 0, NULL, '2026-02-26 13:10:31', '2026-02-26 13:10:31'),
(0x176e851a204b47f7a8f5f855a17e161b, 'கிடா வெட்டு விழா', 0, NULL, '2026-02-26 13:10:16', '2026-02-26 13:10:16'),
(0x2facb37d4a0b457c83fe5dad25a69991, 'இல்ல புதுமனை புகுவிழா', 0, NULL, '2026-02-26 13:10:02', '2026-02-26 13:10:02'),
(0x2fb0d914fdea46d58e5929804dd635c0, 'நிச்சயதார்த்த விழா', 0, NULL, '2026-02-26 13:09:24', '2026-02-26 13:09:24'),
(0x348e71d8b978402b979b023cd01348de, 'புதுமனை புகுவிழா', 0, NULL, '2026-03-03 09:22:21', '2026-03-03 09:22:21'),
(0x478adf2aa1c44344b417ff93b21165aa, 'திருமண நிச்சயதார்த்த விழா', 0, NULL, '2026-02-26 13:09:14', '2026-02-26 13:09:14'),
(0x622bedd241bb4aacaf048fca20eaa514, 'முதல் திருவிருந்து ஏற்பு விழா', 0, NULL, '2026-03-03 09:45:00', '2026-03-03 09:45:00'),
(0x6521bda19180434581764ecb9fceec0b, 'வளைகாப்பு விழா', 0, NULL, '2026-02-26 13:09:41', '2026-02-26 13:09:41'),
(0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', 0, NULL, '2026-02-26 15:45:35', '2026-02-26 15:45:35'),
(0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', 0, NULL, '2026-02-26 13:10:24', '2026-02-26 13:10:24'),
(0x8f22bcf35c1342c090179819c6a057e2, 'புதிய கட்டிட திறப்பு விழா', 0, NULL, '2026-02-26 13:10:38', '2026-02-26 13:10:38'),
(0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', 0, NULL, '2026-02-26 13:09:33', '2026-02-26 13:09:33'),
(0xe6040956d27f40329be4c4808dcf7acc, 'இல்ல பூப்புனித நீராட்டு விழா', 0, NULL, '2026-02-26 13:09:52', '2026-02-26 13:09:52'),
(0xebcb6eb00de84ddb8bb158a637bf1465, 'மொய் விருந்து விழா', 0, NULL, '2026-02-26 13:10:09', '2026-02-26 13:10:09');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `type` enum('GENERAL','BUG','FEATURE','COMPLAINT') DEFAULT 'GENERAL',
  `message` text NOT NULL,
  `admin_response` text DEFAULT NULL,
  `responded_at` datetime DEFAULT NULL,
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','REJECTED') DEFAULT 'OPEN',
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `user_id`, `type`, `message`, `admin_response`, `responded_at`, `status`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x14ff03f716a54a6cb11a238975464315, 0x7acdf7ad784648548203237921f87047, 'GENERAL', 'Try to add a pdf to take printout', 'Thank you for the feedback. We’re actively working on the PDF print functionality and testing it in multiple scenarios. We’ll keep you posted with an update soon.', '2026-03-03 19:10:32', 'RESOLVED', 0, NULL, '2026-03-03 13:12:01', '2026-03-03 13:40:32'),
(0x5dda682da2c3400691ae7d2babfe008c, 0x5205fe0a7bea4952830f1027543245ee, 'GENERAL', 'ஒருவர் இரண்டாம் முறை விசேஷம் வைத்தால் தனியாக சேமிக்க வேண்டுமா.. ஒரே பெயரில் மேலும் சேர்க்க முடியாதா?', NULL, NULL, 'IN_PROGRESS', 0, NULL, '2026-03-03 13:11:37', '2026-03-03 13:49:35'),
(0xda5bac93f5e94b018eef9bb5f4b1689c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'GENERAL', 'வணக்கம் நண்பர்களே', 'test reply', '2026-03-06 11:50:39', 'RESOLVED', 0, NULL, '2026-03-04 08:18:22', '2026-03-06 06:22:16');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `type` varchar(50) DEFAULT 'general',
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `persons`
--

CREATE TABLE `persons` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `persons`
--

INSERT INTO `persons` (`id`, `user_id`, `first_name`, `last_name`, `mobile`, `city`, `occupation`, `created_at`, `updated_at`) VALUES
(0x00467ae9752b46a58acc49507ea13735, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'மலர்', 'பூபாலன்', NULL, 'அனைப்பட்டி', NULL, '2026-03-06 14:00:47', '2026-03-06 14:00:47'),
(0x00812c6874cf48d3a9e46f3ab0a54384, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜேம்ஸ்', 'ஜெயமணி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-03 18:20:45', '2026-03-03 18:20:45'),
(0x01189bb8a66442679aa4847a974ff776, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சேவியர்', 'விமலா', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x01fd01ded5224aecb10e45e25e279570, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகன்', NULL, NULL, 'முருகபவனம்', 'இரும்பு கடை', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x02a869bd96cd488e9f648a2e43a1ad81, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'K முருகேசன்', 'நாகவல்லி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x02acd85d913e4d27bf3c8c12ece0b0f5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Murugesan', 'Selvarani', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x02deaf00b3294bf8931c11b8902cdca0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மணிக்கட்டி வீடு', 'சகாயராஜ்', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x02fbec78185d497f88839591c805e08b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலாஜி', 'ரூபி ஜெய கிறிஸ்டி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x039c02e6362d4366aa6be2bdaa0dd818, 0x7acdf7ad784648548203237921f87047, 'N. RAJENDRAN MARIYAMMAL', NULL, NULL, 'VADAKANANDAL ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x041a56db62a54822853570faf5ee6c40, 0x7acdf7ad784648548203237921f87047, 'MANI RAJESHWARI S/O KANNAN SUNDARAMBAL', NULL, NULL, 'MADHAVACHERI ANDHARANGOTTAI', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x0485827dcb9a4faaa7d95fa5ce58e360, 0x7acdf7ad784648548203237921f87047, 'T. CHINNADURAI DMK', NULL, NULL, 'VADAKANANDAL ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x0493da6dfdcf44f3a97e975961164400, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரமேஷ்', 'ஜெயக்கொடி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x04f22fbaa5f945dfb643a8382ee87dce, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'புஷ்பம்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x052c1556722746a6a7e587d763ee6431, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'S.S.K சுந்தர்', 'கிறிஸ்டி ', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x065152af0aef4c9fa6c138fa1c3284a2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சேசுராஜ்', 'ரோஸ் தெரஸ்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x06634c591c3745d1b1d70967e63cc4ef, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'L K முருகன்', 'சத்யா', NULL, 'சென்னை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x0694714750864504abd825203306ba41, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜெயக்குமார்', 'ஜெனிபர்', NULL, 'RV நகர்', 'நகை பட்டறை', '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x069f171194cd4147bf13939596d6f1cf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Muneeswari', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x06e9d1511c05457ab85e88c85867a892, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மக்கர் மகன் அற்புதராஜ்', 'லில்லி தெரஸ்', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x06f1dfe6254b4bb2975f144a2b2dbac8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜெயராஜ்', 'ஷர்மிளா', NULL, 'முள்ளிப்பாடி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x07dc947c28cb400faa88f47ec2faffe2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ROSELIN', 'ANJALI', NULL, 'மங்கரை அம்மாபட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x082a7f3be2274afaaae4ef5e2df440c2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தாமஸ் பீட்டர்', 'பிரியா', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x088c8c02e241429f812e7cdd654a7d15, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'K.முரளி கண்ணன்', 'நந்தினி', NULL, 'கொந்தகை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x08d01a5bdf0c42ccb65d625de7387e46, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜாங்கம்', 'உஷா', NULL, 'சின்னாளப்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x090ced20469d4c09afe0760eb9db32bd, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கோதண்டராமன்', NULL, NULL, 'சிவகங்கை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x097875e4f469430c9be469dd8a4e7cb0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கருப்பையா', 'ஜெசிந்தா', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x09cccb76e7a14f98857d0dc0eaf224ed, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாண்டி', 'விஜயலட்சுமி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x0a73e1aea4fb4b9eb53e61473a0fa096, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரவி', 'வேணி', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0ad20d69b5c441d89603614b0c6ce7f2, 0x5205fe0a7bea4952830f1027543245ee, 'JAYARAJ', 'VALANARASI', NULL, 'MADURAI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x0c118ed7af604f4ca01fa7e2e5757cb7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சரவணகுமார்', 'அருள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0c233bef34b848d7949c83126902701b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'உதயகுமார்', 'கீதா', NULL, 'மதுரை (பறவை)', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x0c7726e4affd48b2a5f2cac37717f945, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'அழகுராஜா (POLICE)', 'பாண்டி செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x0d68b1781033440690284103f58125b1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பவித்ரா', 'ரூபின் கண்ணன்', NULL, 'பித்தளப்பட்டி', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x0d88a471b87f4e1281589968c76c8eb2, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ராமர்', 'ஜக்கம்மா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x0ef47e787c7e4d20924f927d4495d571, 0x7acdf7ad784648548203237921f87047, 'GOVT SCHOOL TEACHERS', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x0f0e8166dab94d119652378b06ff1bbc, 0xada992157aed4af595ca9b6b512f3dd6, 'கூரி செல்வம்', NULL, NULL, 'Dindigul', NULL, '2026-03-03 10:49:04', '2026-03-03 10:49:04'),
(0x0fe383b5d7914ad9a576c80b06646c15, 0x7acdf7ad784648548203237921f87047, 'M. C. MUTHUSAMY', NULL, NULL, 'MATTUR', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x1003430d97a74a769880eb22684cdb96, 0xada992157aed4af595ca9b6b512f3dd6, 'Sathish Machi', NULL, NULL, 'Ramnadu', NULL, '2026-03-03 10:51:54', '2026-03-03 10:51:54'),
(0x109986633860445db4ed7aeb5ebf4073, 0x7acdf7ad784648548203237921f87047, 'VELU RICE MILL OWNER', NULL, NULL, 'DEVAPANDALAM ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x10ad3062eaa845ea8b10cb8b7c1fbb25, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R.சரவண பாண்டி (POLICE CONSTABLE)', 'ராம் ரோஷினி', NULL, 'சென்னை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x10c64ca7bc0e47da844cc6e39e9b80ec, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சின்ன பாண்டி', 'கருப்பையா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x1117ee1c9c2a43658b885451187f60d5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சகாய ஆரோக்கியராஜ்', NULL, NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x1136e87caac04d62ba75cae8de26d5c7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகராஜ்', NULL, NULL, 'முத்துராஜ் நகர்', 'பால்காரர்', '2026-03-03 09:54:40', '2026-03-03 09:54:40'),
(0x113bb0fd536b4e17a4835a991c6b171a, 0x7acdf7ad784648548203237921f87047, 'E. DHANAPAL ELLAMUTHU', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x123f15e2dbb44ae28f7b9f4a535bd4e6, 0x7acdf7ad784648548203237921f87047, 'N. SHAMMUGAM LAWYER', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x1264e064f8ca44e5afb8912826940315, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சன்னாசி மகன் முருகன்', 'லட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x137ba2250ff04ff5b21d4c25771e3fc4, 0x7acdf7ad784648548203237921f87047, 'A. KALAISELVAN SELVAM ELECTRICALS', NULL, NULL, 'YERVAIPATINAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x13ba6401f24141368a47c809b2384456, 0x7acdf7ad784648548203237921f87047, 'T. CHINNADURAI LAKSHMI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x148b9d9b048f4b4584bde3fe55a465d9, 0x7acdf7ad784648548203237921f87047, 'ANGAMUTHU SELVI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x148c2ce55c6049e49adeab1d47267f2b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Pookarammal', 'Vasanthamary', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x157b1bf396b84abf98bd93b808bdca4a, 0x7acdf7ad784648548203237921f87047, 'MUTHUVEL AISHWARYA', NULL, NULL, 'DEVAPANDALAM', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x15c0575cfa844a1a8580de05139ca5d9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'M.ராஜாங்கம்', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x15d8b7bc3a534d57a6a4e3c7fadbcf02, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தாஸ்', 'ரீட்டா மேரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x1609986085b64b0fbda45b02eaa8f4c1, 0x7acdf7ad784648548203237921f87047, 'SANTHOSH MALIGAI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x16a46a6543c74811993aa5da2256657b, 0x7acdf7ad784648548203237921f87047, 'ASMP. PARAMASIVAM', NULL, NULL, 'CHINNASALEM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x16aa75907e874f7885ab9bc5ee897af4, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'சிவா பாலன்', 'சிவா ( மாமா )', NULL, 'செந்தக்குடி -மன்னார்குடி', NULL, '2026-03-03 11:19:47', '2026-03-03 11:19:47'),
(0x16def075fbef43da90fc5f7ad208ebdd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தண்டபாணி', 'பாண்டியம்மாள்', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x17466baed6824537bd5825ada0477255, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜெயபிரகாஷ்', 'ஸ்டெல்லா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x1795c418bee84a5790a8aa9b5b7c8f59, 0x7acdf7ad784648548203237921f87047, 'P. RAMAMOORTHY OORATCHI URUPINAR EX', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x1814dd97d77442c39c6fc592a7147728, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரஞ்சித் குமார்', 'ராமுத்தாய்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x18bddac0b8894a89bfe40b8900d3500e, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'வேல்பாப்பு (போலீஸ்)', 'முத்து', NULL, 'உ. வாடிப்பட்டி', NULL, '2026-03-03 11:36:10', '2026-03-03 11:36:10'),
(0x18f7572c96b1492ca05acae94d9e32a1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜெனோவா', 'ஆனந்த்', NULL, 'மதுரை', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x193ac82859c74580a157c8c0c626df88, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சரவணகுமார்', 'ராஜி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x19450ed2f64d4791ab679bf7e19ab22f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மணியம் வேளாங்கண்ணி', NULL, NULL, 'கொடை ரோடு', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x19bb8bf5ec094c4ca51df65dfde4629a, 0x7acdf7ad784648548203237921f87047, 'R. SELLAPPAN KATHIR STUDIO', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x1a2331188c2d4e69a36a0ab60fbe703a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகராஜன்', 'சுஜாதா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x1b92b676dbf3484ca64e72d77cef4a81, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கந்தவேல்', 'மஞ்சுளா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x1bbb3d4c965e4e73a63e04a73be32ff1, 0x5205fe0a7bea4952830f1027543245ee, 'RENGAN', 'MURUGAYEE', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x1ca6072baa8f48008cae86cb1e3bcb58, 0x7acdf7ad784648548203237921f87047, 'D. AGASADURAI PERIYANAYAGAM', 'DURAIKANNU VEEDU', NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x1d59f0551e344421b32104685557348d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலமுருகன்', 'தீபஜோதி', NULL, 'காரைக்குடி', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x1d89e43e81894f03827339661fee45d8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'புஷ்பம்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x1e83f272db514881a2fcf75b964988ce, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியசாமி', 'கிரேசி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x1e8ae0de0c454f96b45aa95d2be5547d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பாலமுருகன்', 'தீபஜோதி', NULL, 'காரைக்குடி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x1eaa27c630104f22bb74f0d728e66f8e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மாரிமுத்து', 'கல்பனா', NULL, 'V.S கோட்டை (மார்க்கம்பட்டி)', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x1eb5562629eb4b698f4d3fb7f5e54d31, 0x7acdf7ad784648548203237921f87047, 'R.ANUSHUYA OORATCHI SEYALAALAR', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x1f002d74b36546a680894eb084aea8c6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராமையா', 'மேரி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0x1f26a56023f8419d8b566c2cb7498e45, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'M காமாட்சி பிள்ளை', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x20547a7321f749fe93e5aea6cc8bd840, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பன்னீர் செல்வம்', 'சரோஜா', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x20a122ab0b4f467eb555dbe5ac313e5e, 0x7acdf7ad784648548203237921f87047, 'P. GUNASEKAR DRIVER', NULL, NULL, 'VADAKANANDAL', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x211b02f1ef164344acd0ddea0fdf97ce, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செல்வி', 'கருப்பையா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x214add4dc23f4e2fa8b7a2e5f09cb155, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'K.சிவசாமி', 'லட்சுமி', NULL, 'சித்தரேவு', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x219b81ada95a4fc780aa5d20aab11ba5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'தங்கப்பாண்டி', 'சின்னதாய்', NULL, 'சென்னை', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x21b7cc59b50b4ffba4fec09848731e4f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராமமூர்த்தி', 'ஈஸ்வரி', NULL, 'ஒத்தக்கடை', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x22eb49157e3f43c2930302afaa74a3c6, 0x7acdf7ad784648548203237921f87047, 'S. RAMACHANDRAN C. R. PERURAATCHI', NULL, NULL, 'VADAKANANDAL ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x232d47ba606347b888567a9c1e1f07f5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜகோபால்', 'சரஸ்வதி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x2392ffa669e248d48ae0fff4f3a51514, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சின்ன பாண்டி', 'வசந்தி', NULL, 'சென்னை', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x23be8116e34f4d21883fdd2467fae682, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தேவேந்திரன்', 'அபிராமி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x23c5e3cfe52e42a590241e2086169990, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'விஜய பிரபாகரன்', 'சங்கீதா', NULL, 'முத்தனம்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x2400b63bcb65453f8ca41a76e8160acc, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'அசோக்', 'வனிதா', NULL, 'சித்தமல்லி', NULL, '2026-03-03 11:24:44', '2026-03-03 11:24:44'),
(0x2489c38f126649cc967c1c8f237cfc9f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கார்த்திக்', NULL, NULL, 'முத்துராஜ் நகர்', 'நகை பட்டறை', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x24b4dcd268ff4bb1a51f173ec103e471, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ஐயப்பன்', 'உமாதேவி (பீட்டர்)', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x24c28f0e182c422b83ce4e274cf96bd7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'K.கணேசன்', 'ரம்யா', NULL, 'மதுரை (பறவை)', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x24d2d02b7182404cb3f1d47e65535a0c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'M.பாஸ்கரன் மாவட்ட சேர்மன்', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x24f6b6d8d11a4b50983ec95b3e42d0e9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மரிய லூயிஸ்', 'ஜான்சி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x25191634232c4fddacd415407b22b3f7, 0x7acdf7ad784648548203237921f87047, 'V. JAPAN KUMAR', NULL, NULL, 'VANAKKAM ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x25207ffbff0642498addfa0377a481fc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R R V ராஜேஷ்', 'தவபாண்டி', NULL, 'சென்னை', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x25a45298b71f489b83ad4bc1136396d0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P. ஜான் சாமுவேல்', NULL, NULL, 'வெள்ளாளன் விளை', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x25e7fba5edc647db8611389a323e291e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அஜி', NULL, NULL, 'முத்தனம்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x2611eb1374394f14b559c68c60e51125, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Thamilselvan', 'arulviji', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x26d5f31c78574179b7b1dd48d43ca76a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முனீஸ்வரி', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x275057e850b745b4aa83234a8766c17e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'KAVIYARASU', 'KALAIYARASI', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x2751de5462c448e691915a631e1e8633, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலு', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x28f611ced5224cb9adb644b22b217f94, 0x7acdf7ad784648548203237921f87047, 'SRI KRISHNAN SRIDEVI PRIYA', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x2978e2ea2f20486d8086623aca7ed27e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜனனி', 'கேசவமணி', NULL, 'தாமரைபாடி', NULL, '2026-03-03 09:57:34', '2026-03-03 09:57:34'),
(0x29acab83bd314dfba56168d268d56513, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'சின்னசாமி', 'மோகனா', NULL, 'இந்திரா நகர்', NULL, '2026-03-06 14:00:47', '2026-03-06 14:00:47'),
(0x29bef000c8e6496fa6dc84c08c495e6d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கிறிஸ்து', 'ரோஸி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x29ede2a3e5664d0eadb0cf6eda4884fb, 0x5205fe0a7bea4952830f1027543245ee, 'SELVARAJ J', 'MEENA', NULL, 'P CHETTIAPATTI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x2a204e00763047fb85d5ffde351a9808, 0x7acdf7ad784648548203237921f87047, 'N. SELVAM KOONDRAAN VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x2a5ae2997d4847f0930d200e174e44d2, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'குமார்', 'கிருஷ்ணவேணி', NULL, 'சிவகங்கை', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x2a63dfb62f6c45f1afc09dfbbd997017, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகராஜன்', 'ஜோன் மலர்', NULL, 'காமலாபுரம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x2ac5f81f921b4a8db52238bb28163391, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜெயராம்', 'செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x2b28f02f6840445d8cf3b9078eadb169, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகன்', 'ராணி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x2b5ee95272374d23a4648e4c2208a31f, 0x7acdf7ad784648548203237921f87047, 'MURUGESAN JANAKIRAMAN UDAIYAR', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x2bc78b97eb89418088d12a2564d43cde, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சரவணகுமார்', NULL, NULL, 'மதுரை (வண்டியூர்)', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x2bcd8380f9c84e43ac239413fc35ac63, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அந்தோணி ராஜ்', 'வனிதா மேரி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-03 09:23:01', '2026-03-03 09:23:01'),
(0x2e269a36cbc2412fac8ba0f5e3eb9f6b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'V.ஹரி கிருஷ்ணன்(AVC)', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x2f0c9a19fb3446a5ab89d319dacadbf6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சிவா', 'பிரியா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x2f1ae7389f4d4455b423dcdd7b77109f, 0x7acdf7ad784648548203237921f87047, 'M. KUMAR SATHYAKALA', NULL, NULL, 'VADASIRUVALLUR', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x2f52831ae4684f2d98dbbab1fd53c251, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மேகவர்ணம்', 'சுபா', NULL, 'கொட்டப்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x2f61a47166bf4483974c43c9f8502ef7, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'போஸ் மகன் முனியசாமி', 'பாண்டீஸ்வரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x300e77d20f6f4f10b5600ca797fbb7f8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சகாயராஜ்', 'சகாயம்', NULL, 'மதுரை', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x309f4a2e80ed469ca36dc07254750a04, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மூர்த்தி', 'ஈஸ்வரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x30b3863893334b86a59bd7105349cb4b, 0x7acdf7ad784648548203237921f87047, 'EBI MOM SHYAMALA ECI CHURH', NULL, NULL, 'KANCHIPURAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x30c21089c62241b48d488ecd11d8c5e9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சரவணகுமார்', 'அருள்மணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-03 07:22:54', '2026-03-03 18:03:47'),
(0x30c4730de9d4495da058ecc9ccc805ad, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'V M K ரமேஷ் குமார்', 'ஜெயலட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x30e53b6840ca4188ace94bf1e30e87a6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பழனிசாமி', 'முருகேஸ்வரி', NULL, 'மேற்கு மீனாட்சி நாயக்கன்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3137f36515c14f609841ac048cb3a4ba, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ஜெயராம்', 'செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x324e2dcfd8f6441ca7450fbd0d6097cc, 0x7acdf7ad784648548203237921f87047, 'GANESAN KULLA MUDALI VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x32b4a2de16ad4ad9a59869df1c69cbb2, 0x7acdf7ad784648548203237921f87047, 'RUTH SHANTHI ECI CHURCH', NULL, NULL, 'KANCHIPURAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x32bb2fee37634c7b8d2e9f57b9d1104d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Ayyappan', NULL, NULL, 'ஓசி பிள்ளை நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x32dbabac51a644f1b69805c4d97e7ec7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அருளானந்து', 'செல்வி மேரி', NULL, 'குட்டது ஆரவாரம் பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x336b79320ce44ef989487e9daebea304, 0x5205fe0a7bea4952830f1027543245ee, 'ARPUTHAM T', 'ANITHA', NULL, 'P CHETTIAPATTI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x33720cdf8d4d493b81a539281fc9b7a1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Sakthivel', 'Malliga', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x33fffa5b98ee4ab79501c322f5b57258, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Dhinesh', NULL, NULL, 'வடக்கு மேட்டுப்பட்டி', 'Poo Market', '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3412a89a6e5d4cb7a279a04cc724deca, 0x5205fe0a7bea4952830f1027543245ee, 'KARUPPIAH', 'JAYA', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:42:37', '2026-03-06 14:42:37'),
(0x34800dee130049249207756c41f7777d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'R R V ராஜேஷ்', 'தவபாண்டி', NULL, 'சென்னை', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x34fe1b66d5f04587855c718576eb0026, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கண்ணன்', 'முருகேஸ்வரி', NULL, 'முருகனேரி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x35a76ba120cb4555a78be5772b798cfb, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'வண்டி தங்கம்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x35c0f41e25b0480abd3cb7460c3a8e64, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலசுப்பிரமணி', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x36451182b03d4c20ae023adab7f0084a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R.கனி(TNSTC Driver)', 'சாந்தி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x3696d1c3c2c04e0f8c1ddf76ab2c735c, 0x7acdf7ad784648548203237921f87047, 'MUTHULAKSHMI MANIKANDAN', 'ARUMUGAM PILLANGULATHAN', NULL, 'YEDUTHAVAINATHAM', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x372a7fee2f1d4d488bca08c489e18ce4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சுதா', 'நாகராஜ்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x378b9cb4a39446b6b58b52589c05c69f, 0x7acdf7ad784648548203237921f87047, 'AVVU CHINNATHAMBI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x37de976f122e45618b0fbd9007443eee, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செல்வராஜ்', 'சலேத் ராணி', NULL, 'கிறிஸ்து நகர்', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0x3821d3a35ef44900912ba9c8df4a292c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அருண்குமார்', 'அமலா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x3a809eea72b547819e8c4a70a2f3ca62, 0x6adf89f150d14a64b3fdb03acf5da408, 'Madhesh', NULL, NULL, 'தொழிற்பேட்டை', NULL, '2026-03-03 10:27:57', '2026-03-03 10:27:57'),
(0x3a9c8830a6d34a8eb9845c5c5726bc7f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அறிவழகன் (கேபிள்ஸ்)', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x3acb5a5b9d854623a3328c44d49344e2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முத்துராமலிங்கம்', 'சுதா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x3ad5090402eb4ed79028a8f0d3fb9101, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சுமித்ரா', 'சந்தியா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x3ad58b4a35f94d75b5014a00f2c74acb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சாக்ரடீஸ்', 'புளோரா சில்வேரியா', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-03 09:55:54', '2026-03-03 18:05:46'),
(0x3b4c9c618e1b418897ee9741c48a72f1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தங்கம்', NULL, NULL, 'முருகபவனம்', 'சலூன் கடை', '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3bd903dd50324f2bb775e7627fb0323d, 0x5205fe0a7bea4952830f1027543245ee, 'VADIVEL M', 'PETCHIAMMAL', NULL, 'P CHETTIAPATTI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x3be7e6c0a5a1469ba7deb11a05ecf648, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மணியம் A.வேளாங்கண்ணி', 'சிறுமணி', NULL, 'அம்மா நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x3c3a14db3cb6422d84023363a21649cb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரமேஷ் குமார்', 'நாகலட்சுமி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x3c49d5e419b741089a1e40b55e3a2f0c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பாலசுப்பிரமணி', 'ஈஸ்வரி', NULL, 'திண்டுக்கல் கொட்டாம்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x3c66a7fe393548d2be63bcb8bbe19191, 0x7acdf7ad784648548203237921f87047, 'S. VELU SANGEETHA TEA KADAI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x3cea18e260664d56ae61ac5d07ef745d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முத்துகிருஷ்ணன்', 'பிரவீனா', NULL, 'சென்னை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x3d77631cf2bb448180693e83c6d59a94, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'V M K அழகுராஜா', 'சிங்காரச் செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x3d95638bfa1f4f999212f74813352806, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பெருமாள் நாயகர் மகன் P. குருசாமி', 'முத்துலட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x3da698bf5ab54b168dcddb8386e8998a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மரிய ஜோசப்', NULL, NULL, 'வட்டப்பாறை', 'மேட்டுமாதா', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x3dd72f08317849dea8ecfb872171df99, 0x5205fe0a7bea4952830f1027543245ee, 'RAM KUMAR. S', 'RAKKU', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x3dee7512cab84a7fbc39e0c877d86c5e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கார்த்திக்', 'அஞ்சலி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x3e6947f5f27f401391873067064432e2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'MANJU', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3e80bfff0fd94a91889057ede331c7e8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கபிலன் மகள் சித்ரா', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x3e826d7f677547bfad0f1b8efc6bcace, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Lakshmi', 'Selvam', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x3e8998318d17406e90fa21c549487972, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R.முருகேசன்', 'பொன்னாத்தாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x3f619871630a4fac9939bc222a68f07c, 0x5205fe0a7bea4952830f1027543245ee, 'VIJAY P S/O PANDI', NULL, NULL, 'PERIYAKATTALAI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x3fc69d5b763b4c8c84b4bf27596e5ff1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜோசப்', 'செபஸ்தி அம்மாள்', NULL, 'வேடப்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x40093028441648c3b9ab610d5134daa3, 0xa2c6f2db04cf4679adeb97d1f2630f91, 'கோ. காசி ராமலிங்கம்', NULL, NULL, 'வடகாடு', NULL, '2026-03-06 13:54:38', '2026-03-06 13:54:38'),
(0x400a65c29c5d442280ff9d4e345e7f98, 0x7acdf7ad784648548203237921f87047, 'K. ARUMUGAM TAMIL REAL ESTATE', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x4037570757b94456b4aff5a818bd5ff8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தண்ணிகட்டியார் குடும்பம்', 'சூசை மணி - ஜோஸ்பின் மாதரசி', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x40aa80344a574a97bf51c39c2dd01ccf, 0x7acdf7ad784648548203237921f87047, 'ANGAMUTHU KUYARA VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x41105763035e4439a6f5809ab1a978bd, 0x7acdf7ad784648548203237921f87047, 'PRIYA MURUGAN', NULL, NULL, 'THAMMAMPATTI', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x4245dd3985fd40e39cf8fe65e5ead06b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சண்முகசுந்தரம்', 'அனிதா', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x42ab869f8f0b4d61b2f60a06c4b77b85, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'நகையா', 'விஜயலட்சுமி', NULL, 'சென்னை', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x42d08662bfd9434fb746877b7ee8fdd3, 0x7acdf7ad784648548203237921f87047, 'V. DEEPA VENKATESAN AGRI', NULL, NULL, 'DEVAPANDALAM', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x4389281018ca42f2aa0af3d9f3d44abb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கிளாரா', 'ஜான் பீட்டர்', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x438c899e2abe49a581015e2546ac8d08, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'R.கனி(TNSTC Driver)', 'சாந்தி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x439b8c2a77074dd686542fd62884d90e, 0x7acdf7ad784648548203237921f87047, 'D. RAMACHANDRAN SALES MAN', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x43fc844180f548459d0a5fe29cf10df4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கு.ரங்கசாமி', 'விஜயலட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x44417d66cf1f417a9c591ab2baf8f8a3, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பெருமாள் நாயகர் மகன் P. குருசாமி', 'முத்துலட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x44d76b2af8d3447c9001e4193d8edb0f, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'மூனுசாமி', 'சுகந்திரா தேவி', NULL, 'மேக்கிழார் பட்டி', NULL, '2026-03-03 11:30:24', '2026-03-03 11:30:24'),
(0x45e25d97d79a4243a880bbf4794f3b85, 0x5205fe0a7bea4952830f1027543245ee, 'AYYANAR', 'ALAGI', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x462e44c8bee24bbbb00ae56d0b9f82ab, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஐயப்பன்', 'உமாதேவி (பீட்டர்)', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x464304a9d60e461fb69a0cd294d170b5, 0x7acdf7ad784648548203237921f87047, 'S. SAMAYENDRAN', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x478332de4bb2440caf047c45db4c1b98, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகேசன்', 'செல்வராணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x47af86e0b5cf47da881c8f50d59812f6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முத்து சலூன்', NULL, NULL, 'முருகபவனம்', 'சலூன் கடை', '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x481276e4d5bb49418f2bfbdc19cba852, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆனந்த் அற்புதராஜ்', 'விண்ணரசி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x4891d69fb6264ce4bb997011b7279d7d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கிரேசி மேரி', 'குழந்தை ராஜ்', NULL, 'சின்னப்பபுரம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x489f3b400cd941309316a33628f1af21, 0x7acdf7ad784648548203237921f87047, 'N. PRABHUKUMAR PC POLICE', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x48ecd27136b3451797dbbcff729de67d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தங்கப்பாண்டி', 'சின்னதாய்', NULL, 'சென்னை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x48fdeaf6c6ab469bb7b8ca57409cdc38, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ராஜேந்திரன்', 'ஜெயமாலா', NULL, 'சென்னை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x49fb106f3a4d4425b67860577cd76a5e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'இருதயராஜ்', 'பெர்னத் மேரி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x4a153a448e3a4b2fb20c9ab8251b159d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'முதன்மை செல்வம்', 'உமா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x4a49f77fd4844f2780fcd5aa1fb31203, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தங்கமணி', 'செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x4b2f43b46428440caac707afd6549e68, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியதாஸ்', 'விண்ணரசி', NULL, 'மேட்டுப்பட்டி', 'காந்திகிராமம் ஹாஸ்பிடல்', '2026-03-06 07:15:37', '2026-03-06 07:15:37'),
(0x4be8429e94734aa4b51a155b8decdcdd, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'L K முருகன்', 'சத்யா', NULL, 'சென்னை', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x4bf473dbef8c4cf4b454c01329a35232, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கோ.பாலகுரு', 'செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x4c0479ab501e43568139b32d12ed93f4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முனியசாமி', 'சுகந்தி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x4cbf94cd9c624d6c94e0e21717a5176f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அப்துல்', 'பானு', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x4d02c97dfe684fd4aeeb7bf6aa98974a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மரியராஜா', 'அமுதா', NULL, 'கொடை ரோடு', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x4d14c6443fc14b64b920abc9d44c336c, 0x7acdf7ad784648548203237921f87047, 'RAJALAKSHMI SARAVANAN', 'KUPPUSAMY', NULL, 'CHINNASALEM MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x4d855d37793a42b992b0c79aba696725, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜான் பிரிட்டோ', 'செல்வி', NULL, 'வடக்கு மேட்டுப்பட்டி', 'John Electronics', '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x4e2197e2ecc94f379e56a846ca2deda3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R.மணிகண்டன்', NULL, NULL, 'சிவகங்கை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x4e5316b33d4242f1903608eecbee9198, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'உதயகுமார்', 'சாவித்திரி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x4f9dea7638444e57a61bc78aecaa0f6f, 0x7acdf7ad784648548203237921f87047, 'R. HARIKRISHNAN MALIGAI KADAI', NULL, NULL, 'VADASIRUVALLUR ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x4ff4e20ca9d94a759a7a27bb6daa84a1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'இருதயராஜ்', 'மேரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x5041ea1bdd284074b046b61bf94f2dad, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சேசுராஜ்', 'ரோஸி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x51090c14772743cebeb10fecb4bade62, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தண்ணிக்கட்டி', 'சூசைமணி மாதரசி', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x5185380875504696a50c0951200b0ce4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Rajeshkannan', 'thalappatti', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x51c1e9743dbd4fd0aca3b3b94fe03547, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'விவேக் (சிவா நண்பன்)', 'நடராஜன்', NULL, 'மேல மருதூர் - திருத்துறைப்பூண்டி', NULL, '2026-03-03 11:18:58', '2026-03-03 11:18:58'),
(0x523168ba6f2742b1aa9a351af8ea1848, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ஆனந்த சுந்தரபாண்டியன்', NULL, NULL, 'ஒத்தக்கடை', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x52759f4a1bc247a497a6eb8ed4e39d6d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அந்தோணிசாமி', 'மரிய செல்வம்', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-05 15:17:36', '2026-03-05 15:17:36'),
(0x52bfe39df1de4512a3d22e148cbe4445, 0x7acdf7ad784648548203237921f87047, 'ARUMUGAM ANBU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x53371e322612420aa40d277600d58983, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Jeyaprakash', 'Mahalakshmi', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x53ff5dc67c2e46faa512acfcdded544b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'V M K ரமேஷ் குமார்', 'ஜெயலட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x5425d8c0918244599732515d6ddffacc, 0x7acdf7ad784648548203237921f87047, 'R. SENTHIL SUGANYA', NULL, NULL, 'MADURAI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x54a5c324399f4629bbf6b06c71e00ef0, 0x7acdf7ad784648548203237921f87047, 'MANI MANAI GVB NAGAR', NULL, NULL, 'BANGALORE KARADICHITTUR ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x54a879ede4e14ce9955ffcd2f2f31419, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சீசர்', 'சசிகலா', NULL, 'சின்னப்பபுரம்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x54ed7971e8bd49bd90e0179254e81053, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ARUL VICTOR', 'RANI', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x55961ade2df54ddc820ccb3085e80cc2, 0x7acdf7ad784648548203237921f87047, 'R. SELLAMUTHU, SAMUNDEEAWARI AGENCY', NULL, NULL, 'AMMAN NAGAR, KALLAKURICHI ', 'fencing', '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x55a8aa20d6dd496da51b05d6073cc913, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'R.விஜயராமன்', 'மீனா', NULL, 'சென்னை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x55b7a6273d9d4fc4987f5deca5dee4a8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'இருதயராஜ்', 'அந்தோணியம்மாள்', NULL, 'வேடப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x55e689e2d71a40aa930e235b8abe20ec, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சாமுவேல்', 'அனிதா', NULL, 'சென்னை', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0x5743161da8524f1587f256bc2625d95f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சந்தியாகு', 'பிலோமினா', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x576c17ed264e496db1a3c334094b7f9c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சாந்தா', 'தக்ஷிணாமூர்த்தி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x57ad0094114743b69e5e26229d10c0ec, 0x7acdf7ad784648548203237921f87047, 'RAMADEVI SHANKAR', NULL, NULL, 'ELAVANASURKOTTAI', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x57b92f302e84469989c66734a4827fcc, 0x7acdf7ad784648548203237921f87047, 'S. CHRISTIAN KAVITHA', NULL, NULL, 'MADURAI', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x581eebdd9ce14bf6b129b9b799a0ad18, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Arockiyasamy', 'Masila', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x590bc6a9f00748798363094e716331d5, 0x7acdf7ad784648548203237921f87047, 'ALAGAPPAN LAKSHMI', NULL, NULL, 'AMMAMPALAYAM ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x592a3cdd10e54147b0c08e4758c87711, 0x5205fe0a7bea4952830f1027543245ee, 'SURESH', 'THAVAMANI', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x59687bfc5a7e49b7bd407b6bd13d90fd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜேந்திரன்', 'ஜெயமாலா', NULL, 'சென்னை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x599279a9703c4dcd9d3ca995e5952034, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Sahayamery', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x59a709e4b61a4c29ae73ddb762662b47, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாண்டி', 'மீனா', NULL, 'முத்துராஜ் நகர்', 'ஆட்டோ ஓட்டுநர்', '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x59dbed67b7a640bc9eed365f4437ad88, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பீட்டர் முருகன்', NULL, NULL, 'சிங்காரக்கோட்டை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x5adf6e03eb2e4bbb8a7bd26d3456aca5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தனுஷ்லாஸ்', 'லூர்து மேரி', NULL, 'புகையிலைபட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x5ba82776ff984169940f6440be1a4c3c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'வெங்கட்ராமன் டீக்கடை', NULL, NULL, 'சிங்காரக்கோட்டை', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x5bc89a1f76b2430fb5e8a39895dbeb59, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மரிய லூயிஸ்', 'ஜான்சி', NULL, 'வடக்கு மேட்டுப்பட்டி', 'ஆசிரியர்', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x5bdfb10be82842ad88f785b573e85ea1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சக்திவேல்', 'ராணி', NULL, 'குடை பாறைப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x5c31c67749cf440db5dc81d6b6831f26, 0x7acdf7ad784648548203237921f87047, 'N. SELVAM AUTO', NULL, NULL, 'MADHAVACHERI GVB NAGAR', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x5c7d8cfa515e4c5db8c65534808e6d8f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தீபிகா', 'ரவிச்சந்திரன்', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x5d524a74041341fd999a172f52979177, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R.பொன்னையா TNSTC', 'பாலகிருஷ்ணவேணி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x5d66759165a744969b3607457490aa26, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மரிய பிரின்ஸ்', 'அன்பு ரோஸ்', NULL, 'சின்னப்பபுரம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x5df6bc0643b3470d8eafe7fe9594e8de, 0x7acdf7ad784648548203237921f87047, 'MAYAKANNAN ARULJOTHI PILLANGULATHAN VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x5f07e88df9a94671939bf5169e02c47b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'E B கண்ணன்', 'உமா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x5f215146ae2e4e2bbd2c539f6f2ab72c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாபு கணேஷ்', 'மித்ரன்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x5f265231c4a64c6f8a013381908a41e0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மரிய ராஜ்', 'பாப்பா', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x5f850012e9ac45ce83a3814f45101e7b, 0x7acdf7ad784648548203237921f87047, 'PAASARAI BALU KAMARAJAR NAGAR VCK', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x606504e810824a53b755a56b1de59595, 0x7acdf7ad784648548203237921f87047, 'A. SUBRAMANIAN REAL ESTATE', NULL, NULL, 'KALLAKURICHI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x60ece1a1d27641b2a689f06fd3def449, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செல்லையா', 'அஞ்சலை', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x60f80d5a5eea45b586a02af36f49a8f5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'M.ராஜாங்கம்', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x6100e59372a44cc1a4f28e3af071003c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜான்சன்', 'செல்வராணி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x6104712ca3244bd082da214b13797a3e, 0x7acdf7ad784648548203237921f87047, 'PERIYASAMY DEEPA KOONDRAAN VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x616bf2c907254e55a087f5fc84d81116, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'தங்கமணி', 'செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x61c92c6d709244f98682c2abeed03a5c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜேந்திரன்', 'அமுதா', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x622587bd00f64cb99406dca8de665e2a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செல்வராஜ்', 'விஜயா', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x625d3b77851a453d9f518791046f5d9c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'டிரைவர் கோவிந்தன் மகன் சந்திரன்', 'பாண்டிச்சேரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x62d6c9aac19c4b5da642c13031e7c4dd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஸ்டீபன் பாஸ்கர்', NULL, NULL, 'முருகபவனம்', 'தாய் லேத்', '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x6310eb412e884afaa507091e67cd7b3d, 0x7acdf7ad784648548203237921f87047, 'KUMAR PUSHPA', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x638ba7d42f714d91afb9499f511bea70, 0x7acdf7ad784648548203237921f87047, 'GOVINDAN BHARATHI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x639bddeb2b274630a5ca980216694fe7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மக்கார் மகன் அற்புதராஜ்', 'லில்லி தெரஸ்', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0x6448cb4587d34e10bc9c042f378c1160, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஸ்டாலின்', 'தெரசா', NULL, 'வீனி சவேரியார் தெரு', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x645eb41be9d7446fb4e8eabfdd870e60, 0x7acdf7ad784648548203237921f87047, 'VENKATRAMAN', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x64a9ee39f354480f8fa56f9e0480f484, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Sahayam', 'Rakkiin', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x64b1131b11bd484c8da5853946647332, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜான்சன்', 'விண்ணரசி', NULL, 'வேளாங்கண்ணி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x64dbe1bc28a644ce90ae49bde10d73b9, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'S.பாண்டி', 'பஞ்சம்மாள் (பைனான்ஸ்)', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x65941a677c5642d7bbe78a09b24ac412, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Murugan', 'Rani', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x65a1649e3d7145358b831bc099277521, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பழனிசாமி', NULL, NULL, 'BSNL குவாட்டர்ஸ்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x6649ae781dcc49b99ceb2b60d48619ed, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகேந்திரன்', 'வசந்தா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x669904ac6d534498a9be39641b8e8eb5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சகாயம்', 'ரக்கினி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0x66b084ebfde5466e8c684226f286138a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Janova', 'Anand', NULL, 'மதுரை', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x66c5cf16b9da4e369dc4820ec7119a3a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சரவணகுமார்', 'நாகேஸ்வரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0x675d2cbaa5ba49edaaf809422f03d9ba, 0x7acdf7ad784648548203237921f87047, 'CHIDAMBARAM ADMK', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x677758a99cbd47eeb85f9aafe3da8e6f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P. Muthaiya', 'Peachiyammal', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x678ec9c481ba4da49849db302bfe1521, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'V.ஹரி கிருஷ்ணன்(AVC)', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x67ab54dc5c764636ad98c1a33c72cbfe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'துரை', 'லட்சுமி', NULL, 'மேட்டுப்பட்டி', 'டெய்லர்', '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0x67fd181daa4f49f7b54d7c9b8dced5a3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜெயசீலன்', 'ஸ்டெல்லா மேரி', NULL, 'முத்துராஜ் நகர்', 'மீன் கடை', '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x68389d6ac7e94444ab9865604ca6d056, 0x7acdf7ad784648548203237921f87047, 'M. NALLATHAMBI RADHA', NULL, NULL, 'THIRUVARANGAM', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x68c0b687a0e347b4bbafcfb73b5aa7bc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராணி', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x68cb0a674fa3464ea7fa64cced4c67b6, 0x7acdf7ad784648548203237921f87047, 'P. PACHAMUTHU PODAIYURAAN', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x6906a5760b5a47a6a54a4fd184a20de6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சவேரியார்', 'தங்கம்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x693b6421810a4c508e06372d23001bcc, 0x7acdf7ad784648548203237921f87047, 'SADAIYAN JOTHI', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x69a1fa102dcd49adb43d466f9b2246b8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'K.முரளி கண்ணன்', 'நந்தினி', NULL, 'கொந்தகை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x69bab42b0349414a804649ffd7ed4ec2, 0x7acdf7ad784648548203237921f87047, 'SURESH POMMI', NULL, NULL, 'KANCHIPURAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x6a313e110eb6458d8ab4bc4611f0dac7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அழகுராஜா (POLICE)', 'பாண்டி செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29');
INSERT INTO `persons` (`id`, `user_id`, `first_name`, `last_name`, `mobile`, `city`, `occupation`, `created_at`, `updated_at`) VALUES
(0x6a44a93d00eb4b54a27fd1a736fcca08, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முதன்மை செல்வம்', 'உமா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x6a79a53995464f8ebf877ec454b1fde4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரத்தின ஜான்சி ராணி', 'ஜோவிலா மேரி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x6b256facfd3e4f78a077b0d08e5e9b72, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகன் ஹார்டுவேர்ஸ்', NULL, NULL, 'ஓசி பிள்ளை நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x6b5d677ceb2341b381c0474b08fd71fa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கிறிஸ்துராஜ்', 'வசந்தா மேரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x6b7c0604a3ae4091a3b9092fc4f87826, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'தவமணி', 'அபி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x6b9782e19bcd4b04aa4bf60f3aeec459, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மகாலிங்கம்', 'முனியம்மாள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-03 09:36:25', '2026-03-03 09:36:25'),
(0x6bb89c8708324b56b7d19f73d0189a0f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரத்தின ஜான்சி ராணி', 'டேவிட் ராஜ்', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x6bc348903e1a4edf9b7fb12eb368c5e2, 0x7acdf7ad784648548203237921f87047, 'KOTTALATHAN RAMASAMY', NULL, NULL, 'MADHAVACHERI SIVAGANGAI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x6bcf433db8f34b918b6177e150903d92, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாக்கியம்', 'சிறுமணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x6ca3c7863ca343c7a14982a8049f5af7, 0x5205fe0a7bea4952830f1027543245ee, 'SUNDARAM K', 'RAMYA', NULL, 'KARUKKATTAN PATTI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x6cd2f79cd0274575844c1f05677a34b4, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சங்கர்', 'முத்துலட்சுமி', NULL, 'சத்திரப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x6cdf46bf5ccd4fae96769d152fd595f9, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'R.மணிகண்டன்', NULL, NULL, 'சிவகங்கை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x6d1810b66bd345e9952b74c15994f643, 0x7acdf7ad784648548203237921f87047, 'ANGAMUTHU THANDAPANI', 'CHANDRALEKHA', NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x6d2f9c621ad54f5eb823b6b3e38a070f, 0x7acdf7ad784648548203237921f87047, 'RAMAKANNAN THAMBACHI VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x6df9605805c1435096cf0189cead7e6a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Israel', 'Savariammal', NULL, 'கொசவப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x6e25e054e94f4c86be614f979a35311d, 0x7acdf7ad784648548203237921f87047, 'NARMADHA S. K. TATOOS', NULL, NULL, 'KALLAKURICHI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x6f42531c3d144866ad3e5466b77dbf38, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சின்ன பாண்டி', 'வசந்தி', NULL, 'சென்னை', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x6f4677a312f640088c3a9c2e9e82ca34, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'வீரசின்னு', 'சுப்புலட்சுமி', NULL, 'முருகனேரி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x7107adb75ef84d2ca4690daded5b3111, 0x6adf89f150d14a64b3fdb03acf5da408, 'Muruganatham', NULL, NULL, 'Pugalur Four Road', NULL, '2026-03-03 10:14:44', '2026-03-03 10:14:44'),
(0x7118671a706d4d1c8e3a7cb17599a3bb, 0x3ff8de4622804be0aa4e405d8c404df3, 'கருப்பட்டி அந்தோணி', NULL, NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 14:08:59', '2026-03-06 14:08:59'),
(0x7173b6b373e34feaab2f7934d8795b43, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகராஜ்', 'முனியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x727533c8fcd84232a4dab346d0fe634e, 0x7acdf7ad784648548203237921f87047, 'N. GOPALAKANNAN JAYA', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x73205d199e0f44a9a9dda264b287b9d4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தனுஷ்', 'லூர்து மேரி', NULL, 'புகையிலைபட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x739849ef4fa34131867153bd9cc32b09, 0x78fe398c0e3c418e9f00092a62dbed38, 'Moorthi Sithapa', NULL, NULL, 'Thirumangalakkottai Keelaiyur', NULL, '2026-03-03 10:31:20', '2026-03-03 10:31:20'),
(0x740832d4f7614b139961155e36bf629e, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'மு. சிவா MBA', 'S. செல்லக்காமு & ஜெயகீதா நர்சிங்', NULL, 'நல்லப்பெருமாள் பட்டி', NULL, '2026-03-03 11:23:37', '2026-03-03 11:23:37'),
(0x74254329fcec44f39e4b8f99c81074b1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மக்கார் தாமஸ் பீட்டர்', 'பிரியா', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0x7439207db1594e6d84296cd14f347165, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜேசுதாஸ்', 'ரஞ்சிதா மேரி', NULL, 'இராமையன்பட்டி', 'அட்வகேட்', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x743ade813b7549c09883fdd1af17920c, 0x7acdf7ad784648548203237921f87047, 'A. P. DOMINIC SSI POLICE', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x744f7f7cb7ea444b84a2391b2d088e3b, 0x7acdf7ad784648548203237921f87047, 'THIRUMENI KANNAN', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x75841f812f05489a905021f2585bc3b3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'A. ராஜேந்திரன்', NULL, NULL, 'ஓசி பிள்ளை நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x75f854a65b244967bcc4b3998c4e50d0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகநாதன்(முதன்மை)', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x762dff122d784261b3a28211a38dde84, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Thalampathi Lasar Magan', 'Seker', NULL, 'முத்தழகுபட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x76339f172f1746d6b2c7b660bad25e91, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சன்னாசி மகன் பெருமாள்', 'வேல்மயில்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x7681df813471458da764242a1ca2a63f, 0xada992157aed4af595ca9b6b512f3dd6, 'சரண்யா', NULL, NULL, 'Dindigul', NULL, '2026-03-03 10:53:57', '2026-03-03 10:53:57'),
(0x773cfc5fe3544badb20def754d12f8a0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'விக்டர்', 'செல்வி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x7758297c4e1b4fd795d571a5148d2d88, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'முத்துராமலிங்கம்', 'சுதா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x77734e7330a94308949d795ccc6b54fd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'KAKKAYAN CHINAVAR', 'RANI', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x77c0fdd9548248d69e2a72cd455fb2c9, 0x7acdf7ad784648548203237921f87047, 'K. BALAKRISHNAN SENGUTHAR', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x7863de9eef824ce888b767d4e73f8d1d, 0x7acdf7ad784648548203237921f87047, 'RADHAKRISHNAN EX. THALAIVAR', NULL, NULL, 'KARADICHITTUR ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x78f21ebc7a034d2695375abbac10763b, 0x5205fe0a7bea4952830f1027543245ee, 'SRIDHAR STEPHEN', 'SUGANYA', NULL, 'CHETTIAPATTI P', NULL, '2026-03-03 15:18:34', '2026-03-03 15:18:34'),
(0x791da09f380e45c0ae6a02b52e7e6cab, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'ராஜதுரை', 'கௌஷால்யா', NULL, 'ஆலங்குடி', NULL, '2026-03-03 11:34:12', '2026-03-03 11:34:12'),
(0x79576c9e78e640f09920eeb151ac77e0, 0x7acdf7ad784648548203237921f87047, 'MADURAI PANDIYAN TNSTC', NULL, NULL, 'KANCHIPURAM ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7a4f306a22984ada82e0f3c90f4e4930, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகேசன்', 'சாந்தி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x7aac0011a1694f78ba3519a0c908594a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கலையரசு', 'பிச்சைமுத்து', NULL, 'அம்மாபட்டி ', 'Teacher', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x7ada42528446405e9ddea5b7afc20c2e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P.விஜய்', 'சுப்புலட்சுமி', NULL, 'மதுரை (வண்டியூர்)', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x7b1bb0fa217e479283e7c0c08406ef8a, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'மாயகிருஷ்ணன்', 'சங்கரம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x7b31fd7fbd814964b676a95063400a27, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கண்ணன்', 'முருகேஸ்வரி', NULL, 'முருகனேரி', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x7b3ad182471d46fb934b68d381cfca0d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தாமஸ் எடிசன்', 'சிறுமணி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x7bb05d1ac8d541d58569afec7a9588f4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Kakkayan Sesu', 'Anthoni', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x7bbf45e6bb6648f58d1f90a2f5421a11, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அருள் டேவிட்', 'கிறிஸ்டினா ரூத் பிரியா', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x7c0b4513a4ab4543bcce5cc71e482895, 0x7acdf7ad784648548203237921f87047, 'KASI PULUVAN VEEDU SADACHI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7c6b935e62d44b4ab04621127b128c63, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Kannan', 'Vimala', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x7d6f07c987944b3aa387b432da4902db, 0xa2c6f2db04cf4679adeb97d1f2630f91, 'ந.முத்துராசு செட்டியார்', NULL, NULL, 'வடகாடு', NULL, '2026-03-03 10:35:29', '2026-03-03 10:35:29'),
(0x7ee6ea983578445d9a1c131fb121c0df, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகேசன்', 'எமல்டா மேரி', NULL, 'Y.M.R பட்டி', 'பழக்கடை', '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x7f00f98c6aac434b85cacf380e945a13, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வண்டி தங்கம்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x7f2ffbb135214c1684a37046ab934a9f, 0x7acdf7ad784648548203237921f87047, 'RAJAVEL JAYALAKSHMI', NULL, NULL, 'AMMAPETTAI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7f3ed7f8c54948c3a95d916440402e30, 0x7acdf7ad784648548203237921f87047, 'KUMARAN M. A. KARUPPAN', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7f51593afdb749e7801ccd7d06d45649, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பிரிட்டோ', 'செல்வி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-03 09:39:27', '2026-03-03 09:39:27'),
(0x7f559701ad1a455db2e4dbf106538be2, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'முனியசாமி', 'சுகந்தி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x7f5e51632f4346f0ba29dd4db6c841f4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'லாசர் சுந்தரம்', 'சுசீலா மேரி', NULL, 'யாகப்பன் பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x7f5ead9187d2408fb12c4bffbc001e55, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வனிதா', 'நாட்ராயன்', NULL, 'முருகபவனம்', 'ஆசிரியர்', '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x7f710414197143bdb4c393ba51eb173a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஞானராஜ்', NULL, NULL, 'முருகபவனம்', 'மளிகை கடை', '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x800ee0cb7d3249bdb98d50db9e9a0c63, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலசுப்பிரமணி', 'ஈஸ்வரி', NULL, 'திண்டுக்கல் கொட்டாம்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x80b9e858262c48df9966d9a33ac1e4af, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராம்குமார்', 'பவித்ரா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x8110195ea9ee489391c55e595eb7422b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சைமன்', 'சுதா ரீனா', NULL, 'தாமரைக்குளம்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x82774508c389435a8d98430f3bd07a7a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியதாஸ்', 'ஸ்வேதா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x82ae502b7de4482aa6314a9f74c32555, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முத்து', NULL, NULL, 'மீனாட்சிநாயக்கன்பட்டி', 'சலூன்', '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x82c5a8212f33470ba6abe3bed16f5417, 0x7acdf7ad784648548203237921f87047, 'RAJAMANI PALANI AGENT', NULL, NULL, 'MATTUR', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x82c7179f1c854091af0427aad4b810c2, 0x7acdf7ad784648548203237921f87047, 'D. SELVAMANI SEYAR PORIYALAR OIVU TAMILA', NULL, NULL, 'SANKARAPURAM ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x82d06803ea474bbd958f68ec4d3174b2, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சுதா', 'நாகராஜ்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x83604c1f27b24fd982e8bd6b077b049a, 0x5205fe0a7bea4952830f1027543245ee, 'VINCENT', 'DHANAM', NULL, 'P CHETTIAPATTI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x83b5cb1a4cc643049f794d4ea30b9717, 0x5205fe0a7bea4952830f1027543245ee, 'SANTHANA KUMAR', NULL, NULL, 'KARISAL PATTI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x83c830e1bc454c35b35070c3e1c0bc85, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தெய்வேந்திரன்', 'அபிராமி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x83caed98b95841dfb85c1adabf0b1ee0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வடிவேல்', 'பஞ்சு', NULL, 'பட்டிவீரம்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x83d40b1d82604125ab3e7f06e4c66f65, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பாலன்', 'முனியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x84462dca1b584d40b8b3fa90daeaac1a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மணிகண்டன்', 'நந்தினி பிரியா', NULL, 'முருகபவனம்', 'மளிகை கடை', '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x84895d2761b447309d3a7edb29deab70, 0x5205fe0a7bea4952830f1027543245ee, 'GUNA SEKAR', 'PUSHPA', NULL, 'P CHETTIAPATTI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x8493c70dc78e4d47b7f65cdb6c910416, 0x7acdf7ad784648548203237921f87047, 'G. DURAI DEVI VADAKKU THERU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x84974993892d411b86db1a30e9023c19, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'M அழகுராஜா', 'கவிதா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x8561448686df436e92e2590f416f17db, 0x7acdf7ad784648548203237921f87047, 'UDHUASURYAN ANNAN CHAIRMAN', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x85f49d7ca673437dbcdd5f019ae52894, 0x7acdf7ad784648548203237921f87047, 'A. MALARVANNAN REAL ESTATE BAJAJ VARNA', NULL, NULL, 'KALLAKURICHI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x8609cff72e954058aa680c8655747ec6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஈஸ்வரன்', 'குமாரம்மாள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x8645f12d6fa84927b82c4a26900bbdfe, 0x7acdf7ad784648548203237921f87047, 'T. KANNAN VASANTHI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x86c1184d1a474ae6a47b7fe69cff632a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வேல்முருகன்', 'சுப்புலட்சுமி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x86c34c8851e5427a826a358f35cec7d7, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'காளீஸ்வரி', 'ஸ்ரீனிவாசன்', NULL, 'கோயம்புத்தூர்', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x86e719abe0e7492c9c97770c4e7f9340, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'மீசை டீக்கடை கிருஷ்ணன் மகள் பஞ்சம்மாள்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x86ed238589d84385b373ccc38a3c6d9e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாஸ்கரன் ஞானம்', NULL, NULL, 'திண்டுக்கல்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x86eda4ae2a71454ba868b4bb6028be1a, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பாண்டி செல்வம்', 'பாண்டியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x871c6deef45f4bf296182a8d478e4481, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'E B கண்ணன்', 'உமா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x8756c05f69b043d6b562830959d15bfe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகன் (டிரைவர்)', 'செல்வி', NULL, 'காந்திபுரம்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x8757ee16f2904be78587aae22278e7b8, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'நாகேந்திரன்', 'வசந்தா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x878d9a7c6cb54451b22eff7350d337cd, 0x7acdf7ad784648548203237921f87047, 'SAKTHIVEL. K. SELVI THIRUVATHA VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x87faa869504c4330b6979ec1627130bf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சிவானந்தம்', NULL, NULL, 'BSNL குவாட்டர்ஸ்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x8864d7144fac48e49f31ccd36bcfb464, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சேசுராஜ்', 'சகாயராணி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8865d7004f5e4ce9bbb3e15066d523d0, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'முத்துகிருஷ்ணன்', 'பிரவீனா', NULL, 'சென்னை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x889e5c28d2034e109ef6b14945648087, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ராஜேந்திரன்', 'சாந்தா', NULL, 'சிவகங்கை', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x8916a617781346b6a6a3cc5250624c36, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மரிய ஜோசப்', 'பெப்பின் கிளாரா மேரி', NULL, 'வட்டப்பாறை', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x894e619a864e433bacd5a4177d1b9483, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மாயகிருஷ்ணன்', 'சங்கரம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x89d439da0e304b67a3f5a6a6315abc8c, 0x7acdf7ad784648548203237921f87047, 'K. PANDURANGAN PICHAYI', NULL, NULL, 'THOPPUR YERVAIPATINAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x8a08c325ae3047b09c3396473efb3b6d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சூசை', 'செலின்', NULL, 'வடக்கு மேட்டுப்பட்டி', 'பூ மார்க்கெட்', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8a3d205ba7d843e784d0d682ab4b3d2a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'குமார்', 'சூர்யா ( டீக்கடை)', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x8a7d7caf884d455bad27f706cfb967e1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மாரியப்பன்', 'இளமதி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x8ad4623b91764ec2acc2ecd0b45a44b5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சரவணன்', 'ராஜேஸ்வரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8b9cf299fa5c47aa941654849b841d27, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜேந்திரன்', 'சாந்தா', NULL, 'சிவகங்கை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x8bb33059145c42d7baabf0ebc151658a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாண்டி', 'மீனா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-03 09:41:47', '2026-03-03 09:41:47'),
(0x8bf1594e30e64eca81c00da88e47d32d, 0x5205fe0a7bea4952830f1027543245ee, 'JEYA KANNU', 'MUTHU PILLAI', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x8c13de1618f44fef9af1ffaf3bee7bf3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'SAVARIYAR', 'RENATH AMMAL', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8c169fdec4af4f53ac609503387573c1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அருளானந்த பீட்டர்', 'சிவரஞ்சனி', NULL, 'முத்தழகுபட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8c291ecfba444331b766057bac5ad8b7, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சந்திரன்', 'சாந்தி', NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x8c8e7cc1a59c47c29fab93866bc62871, 0x7acdf7ad784648548203237921f87047, 'R. MANIKANDAN AKILA LORRY SERVICE', NULL, NULL, 'VADAKANANDAL ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x8cc1c578e28845c090ea892ba5e81c90, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரவி', 'சிவகாமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x8cf08d94f7e3483ca65112047ad8164e, 0x4f51468c74ac4af9bc3d04a529d21744, 'கண்ணன்', 'சுந்தரபாண்டியன்', NULL, 'V. Naduvur', NULL, '2026-03-03 10:09:52', '2026-03-03 10:09:52'),
(0x8db0289eb5094234b801ade7318ab197, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சன்னாசி மகன் முருகன்', 'லட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x8db89caef7eb416ba5a9df00c6be4871, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P.முனியாண்டி', 'முத்துமாரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x8dc83cdf741142aa8445461941c8d4bc, 0x5205fe0a7bea4952830f1027543245ee, 'NATARAJAN', 'BUMA', NULL, 'THERKU THERU', NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x8e2a38d45e844507b3f4dc98fd20f34b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வின்சென்ட்', 'திவ்யா மேரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8e69e3c733b043e1ab794cbe14070c3a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சந்திரன்', 'சாந்தி', NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x8e8064b9f8dd4a1c96cd1e8ed774e5ce, 0x7acdf7ad784648548203237921f87047, 'M. P. RAMESH DMK 4TH WARD URUPINAR', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x8e81912c79ff4903a8a572c858218d1d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சந்தியாகு', 'வேளாங்கண்ணி', NULL, 'முத்துராஜ் நகர்', 'மீன் கடை', '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0x8e8523d38dbd4c34b3ea46487956cf75, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியசாமி', 'ரேசி', NULL, 'குள்ளனம்பட்டி ', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8f3471f1d6e04ca6831a8db6d8bbaf2f, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'V பாண்டி முருகன்', 'அழகு மீனா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x8f59814546724d048b48eba04681344f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சந்தியாகு', 'கமலா மேரி', NULL, 'மேட்டுப்பட்டி', 'மரக்கடை', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8f66be6cb5e6418f9dc461e3e1f8cee6, 0x5205fe0a7bea4952830f1027543245ee, 'PANDEES', 'MUNIAMMAL', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x8fa90427198543bfba86918ab2d5db78, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜி அம்மா', 'வேளாங்கண்ணி மாமியார்', NULL, 'M.G.R நகர் (மொட்டணம் பட்டி ரோடு)', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0x919c7be60ae0430ea88e99d1b7160822, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கணேசன்', 'பூமாரி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0x92073fe05913418ebe91db76ed5c8713, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஸ்டெல்லா', NULL, NULL, 'முத்துராஜ் நகர்', 'மீன் கடை', '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0x92160476c03a4cd5bb7ab1e191ed0c6d, 0x7acdf7ad784648548203237921f87047, 'S. PADIYAN W/O MOOKAAYI', NULL, NULL, 'VENKATAMPETTAI', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9280d9252d10412c84e36af61b81b9eb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P.ராஜேந்திரன்', 'முருகம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x94089484abb549bf9f582665412cd25f, 0x75fe4201272e4aada72baed0b0834764, 'P.ராஜா', 'செல்வி', NULL, 'மதுரை', NULL, '2026-03-03 10:41:05', '2026-03-03 10:41:05'),
(0x9424c573b47c4684933247d063e7ea35, 0x3ff8de4622804be0aa4e405d8c404df3, 'சங்கீதா', 'விக்டர்', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 14:08:59', '2026-03-06 14:08:59'),
(0x9427299f92174093ad1bb3dd67a3a62d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரோஸ்லின்', 'ஜெரோவின்', NULL, 'நந்தவனப்பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x946d18290ca0497e969b235624de4b6b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சச்சின்', 'பிளசி', NULL, 'திண்டுக்கல்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x947323d9efb54daab65e5857277c360e, 0x5205fe0a7bea4952830f1027543245ee, 'THAVAM', 'MATHINA', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:42:37', '2026-03-06 14:42:37'),
(0x955fcadc8d804e8e8742fbab6d83b151, 0x7acdf7ad784648548203237921f87047, 'M. KANNAN SATHYA', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x956452c662194b258dc8e3d41ed3c561, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சகாயராஜ்', 'மேரி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x95941a86bcad4546b8306db6a1620fdc, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'நாகநாதன்(முதன்மை)', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x95ae2d6f1a1a4ba2abd0fd042138a4f8, 0x7acdf7ad784648548203237921f87047, 'S. P. RAJA', NULL, NULL, 'PANDALAM', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x95d0352071bb47a991964a44feeb926a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாண்டி செல்வம்', 'பாண்டியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x9611f83efedf40139e401888d23fb623, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'போஸ் மகன் முனியசாமி', 'பாண்டீஸ்வரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x967480a5ca444014b2571880bec19a8d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கணேசன்', 'பூமாரி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x96a39db4ee2f40e48ed0b75106378aff, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'P.விஜய்', 'சுப்புலட்சுமி', NULL, 'மதுரை (வண்டியூர்)', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x970ad6f4c6aa431a8d388d17d7e18bb5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'V M K அழகுராஜா', 'சிங்காரச் செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0x9742372e7970436ba5fa4b927b6fdcde, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சக்திவேல்', 'மல்லிகா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0x974f41257ec2463f9a43991e0bbfd8ed, 0x7acdf7ad784648548203237921f87047, 'V. A. VENKATESAN EX COUNCILLOR', NULL, NULL, 'VADAKANANDAL ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x977b9aade23a43c98c7fc98e082af03b, 0x7acdf7ad784648548203237921f87047, 'KALAIMANI ASHOK', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x9794174456db40119c740a913d42b543, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'லாரன்ஸ்', 'ராசம்மா', NULL, 'மேட்டுப்பட்டி', 'பெயிண்டர்', '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0x97d2aa2cd59540d79a0cb26edfcfb2c3, 0x5205fe0a7bea4952830f1027543245ee, 'GOPALA KRISHNAN PGS TILES', 'SASIKALA', NULL, 'PERIYAKATTALAI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x9820ab899c6b42a692064af35183975e, 0x7acdf7ad784648548203237921f87047, 'PACHAMUTHU SELVI', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x9872a4bc68544419978d1b6409101917, 0x7acdf7ad784648548203237921f87047, 'K. KANNAN S/O SELVI KUNDRA NAGAR', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x98f614f887f5460da4621ff6266f9757, 0x7acdf7ad784648548203237921f87047, 'V. VENKATACHALAM', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x99034fdb89c14ea5a5ab7654d8730f13, 0x7acdf7ad784648548203237921f87047, 'K. SAKTHIVEL DURGADEVI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x990753849aa94fc3a552f8c856a6cac2, 0x7acdf7ad784648548203237921f87047, 'AGASADURAI THAADI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x99141deffe5e4d75999ea4d948d23e89, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சதீஷ்குமார்', 'ரஞ்சிதா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x9abbf2194e984e07b6b980f053ccaae5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'முனியசாமி', 'முருகேஸ்வரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x9acc1abc29f6404dac0b18d1adcd6cf4, 0x7acdf7ad784648548203237921f87047, 'SAKTHIVEL SUMATHI DRIVER', NULL, NULL, 'MADHAVACHERI COLONY', 'driver', '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9b3eb7555beb48e8a769b51a61c18cd0, 0x7acdf7ad784648548203237921f87047, 'LOGU MAMANAR KANDHAN', NULL, NULL, 'SERALUR', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9b656a0215e04409b2d4b1517da1c492, 0x5205fe0a7bea4952830f1027543245ee, 'RAMESH C', 'MUTTON', NULL, 'PERIYAKATTALAI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x9b8484d79b81413e851005efd52c1f5a, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'கண்ணன்', 'லதா', NULL, 'கம்பன்குடி -வடிவாயிலக்கள்', NULL, '2026-03-03 11:32:56', '2026-03-03 11:32:56'),
(0x9bce52ce5d384fa2937584de7d4a6bc5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சேசுராஜ் மகன்', 'ஆரோக்கிய நிக்ஸன்', NULL, 'சின்னப்பபுரம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x9be836b96c7245e0b7908946ea8568b5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பவித்ரா', 'ரூபின் கண்ணன்', NULL, 'பித்தளப்பட்டி', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x9c01859112a44e73926fff2e918d9157, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அந்தோணிசாமி', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x9c0b4fdcd57b4a79ae9b914575dda388, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரவீந்திரன்', 'மகேஸ்வரி', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x9caf4497cc96431f8c55703ae5103bf0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சங்கர்', 'முத்துலட்சுமி', NULL, 'சத்திரப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0x9cf9d7d4d1af4ce6ba36f1269fa2b653, 0x7acdf7ad784648548203237921f87047, 'LATHA', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x9d6df1552c6847c3bfbc712984061ecc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியசாமி', NULL, NULL, 'சின்னப்பபுரம்', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0x9d7dc4f4cdaf4fbc9d95a125ed5d08ff, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'வீரசின்னு', 'செல்வி', NULL, 'முருகனேரி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x9e4953ae4d384fa0a3301948005bb684, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரமேஷ் குமார்', 'தாயம்மாள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0x9e50e2f09051418598167cadfc51a186, 0x7acdf7ad784648548203237921f87047, 'R. KRISHNAN DOCUMENT WRITER', NULL, NULL, 'VADAKANANDAL ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x9e5b0050cbe0484e962afc590e566983, 0x7acdf7ad784648548203237921f87047, 'P. CHELLAKANNU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9e80e01aaafa46bd8b0ff1ee3a56c0ab, 0x7acdf7ad784648548203237921f87047, 'P. PRIYA', NULL, NULL, 'YERVAIPATINAM', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x9ece3fb41a9c46598f3c6313711432b3, 0xada992157aed4af595ca9b6b512f3dd6, 'Sekar Chithappa', NULL, NULL, 'Nallarikkai', NULL, '2026-03-03 10:52:52', '2026-03-03 10:52:52'),
(0x9eeb5a0fffcf484a838998a7801cc7b0, 0x7acdf7ad784648548203237921f87047, 'D. MANIKANNAN SATHYA', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9f57ecb1e6b448649e0b9acb7f8e0034, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சுப்பிரமணி', 'அழகு மீனா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x9f78577157ed4b70b10b6940b6b2cc63, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியம்', 'ஸ்டெல்லா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xa05bc383b3ce45c3bbd01c2eb3c351fa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கற்பகவேல்', 'பழனியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xa066f3060faf424e9fb74b0a6fc386b9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வேலுசாமி', 'மாரி', NULL, 'முத்துராஜ் நகர்', 'டிபன் கடை', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa12683e22c6b4d3b8fcda56b6ec1ab6c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜு', 'சாருமதி', NULL, 'YMR பட்டி', NULL, '2026-03-03 09:47:22', '2026-03-03 09:47:22'),
(0xa1344383fda74db1bd8d0f4521ab1252, 0x5205fe0a7bea4952830f1027543245ee, 'VELLAISAMY VM', NULL, NULL, 'P CHETTIAPATTI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0xa13fb08abdd14863af7792ecc1979931, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'SSK சுந்தர்', NULL, NULL, 'முருகபவனம்', 'சிமெண்ட் தொட்டி கடை', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa146790c721a48e0b49360c5fa110f04, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தண்ணி கட்டி', 'வேளாங்கண்ணி', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xa1c2e8a97fa240f6b72b04abbec4d2f1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'K பழனிசாமி', NULL, NULL, 'BSNL குவாட்டர்ஸ்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa21642a809ed4197b39c7eff5f6d6eed, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சன்னாசி மகன் பெருமாள்', 'வேல்மயில்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xa25e902ff308440289b6d071d37c7e7c, 0x5205fe0a7bea4952830f1027543245ee, 'THIRUMURUGAN', 'VALLI', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0xa29edc5f0fa04db3b9eec8e0b605af9a, 0x7acdf7ad784648548203237921f87047, 'SAMSON ECI CHURCH', NULL, NULL, 'KANCHIPURAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xa2dcd5d07df849019ac2923a2bf9aebf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கண்ணன்', 'விமலா', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0xa314206e7f664b95a12532828c92e20b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செபஸ்தியார்', 'சிவகாமி', NULL, 'முத்தழகுபட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xa3af2636f5264b48a780ed487fcd71ee, 0x7acdf7ad784648548203237921f87047, 'SHANKAR PREMA VELLACHI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xa446228238cc4da3b5786b77d802e528, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சேவியர்', 'ஆரோக்கியம்மாள்', NULL, 'திண்டுக்கல்', 'பழக்கடை', '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xa59254536f7c4179a9497e6c0d0f8be1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'A. James Raj', NULL, NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xa6502b83b2d14c02a230b04aeffc2a76, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கசாவடி மகன் முருகன்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xa699835bf5144a53a54b33cf79ca9f54, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'உதயகுமார்', 'கீதா', NULL, 'மதுரை (பறவை)', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xa6ace38eb6f04a31a576a3c37e27ef0d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பூலாம்பட்டியார் மகன்', 'வேளாங்கண்ணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xa70daf750bcf40c7a947714a16d9b5e5, 0x7acdf7ad784648548203237921f87047, 'KONDI. T. GOVINDAN', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xa719c648bb0d4b479d4252303c7fcb99, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Sirumani', NULL, NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xa787be5269d448e9b9ff32df85d6217a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சிறுமணி', NULL, NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xa8010abcb0644e8c96bd04896984b461, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அருள் மேரி', NULL, NULL, 'முருகபவனம்', 'ஆசிரியர்', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa80af1d0219b4eaab492632e01e65460, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பிளசி', 'சச்சின்', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-03 09:34:02', '2026-03-03 09:34:02'),
(0xa865f9c8f9d64f11b5b156b79ecaa6fb, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'J.விக்னேஷ்', NULL, NULL, 'பழையனூர்', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xa89044adc6034c89a3d27251d524e95e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செந்தில்குமார்', 'பாண்டியம்மாள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa8ad4cbfd2e645bfbb6821b90b96c241, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கருப்பட்டி சேவியர்', 'விமலா', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa8daafb005954e2f89bfc5a62217016d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Sathish Kumar', 'Viji', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xa8ff593520704c2987979602ff6bc472, 0xd12420858add461aba10af9c3cd3c564, 'காந்தி', NULL, NULL, 'கிருஷ்ணா கவண்டான்யார்', NULL, '2026-03-06 14:11:32', '2026-03-06 14:11:32'),
(0xa90235a01fa64b2688684f096ac367d9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R. Sesal Naidu', 'Dhanalakshmi', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xab5f0245f67448818a94131842557a71, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'M.பாஸ்கரன் மாவட்ட சேர்மன்', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xab6f4004f0444ef9add4039f2716536a, 0x7acdf7ad784648548203237921f87047, 'P. MUTHUSAMY S/O PANJASAARAM', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xabc64f2a4f5f405abd8d338d77427f12, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Jeyaraj', 'Easwari', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xac26a5bed9ea464988a21daee82ea51c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பெரிய கருப்பன்', NULL, NULL, 'கூடத்துப்பட்டி', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xacd06c7a73ed4b2f90085dc148d80d68, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சீசர் ஆரோக்கியம்', NULL, NULL, 'சின்னப்பபுரம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xad02fc29d29d475a841e49922605b53d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'லாரன்ஸ்', 'பன்னீர் செல்வி', NULL, 'வேடப்பட்டி', 'வாட்டர் சர்வீஸ்', '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xad3ea510491b4cfda93f17824ad501b5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'முருகன் (டிரைவர்)', 'செல்வி', NULL, 'காந்திபுரம்', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xad5c819a18904e14a85e0df349236c6c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மெல்யூர்', 'நிர்மலா மேரி', NULL, 'திண்டுக்கல்', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0xae1495bc707d4b219364d85425b3454f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரகுமான்', NULL, NULL, 'KK நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xaeaf2e7757354b21b276b6545e1f837a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'S.பாண்டி', 'பஞ்சம்மாள் (பைனான்ஸ்)', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xaeb3154bd94646da8bb11092c85fcb66, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சித்தா முருகேசன்', 'ஹேமா', NULL, 'திண்டுக்கல்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xaf7cd7f54f934dbb9c85ece58c6d4a9d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜான் போஸ்கோ', 'மாரீஸ்வரி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xaf88802df55d405d8ddf9ccdcfe6f39e, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'K.கணேசன்', 'ரம்யா', NULL, 'மதுரை (பறவை)', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xaf92cd9b97a44cd09f9fd0448e344198, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'P.கிருஷ்ணமூர்த்தி', 'சுதா', NULL, 'சென்னை', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xb0c46aabfc6342e2ae54f0d4ba34e723, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'துரைப்பாண்டி', NULL, NULL, 'நல்லாம்பிள்ளை', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xb132a5ac031f4c60acd5e090381d5fa3, 0x7acdf7ad784648548203237921f87047, 'P. PERIYASAMY KAMARAJ NAGAR', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xb14ab9d3448b4f3bbd36b65391ed59e2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'M அழகுராஜா', 'கவிதா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xb15d12bbf29c41d3a9bddb30cf07e4af, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலச்சந்திரன்', 'அங்காள ஈஸ்வரி', NULL, 'சிங்காரக்கோட்டை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xb166045e55fd4e42a9db9da633bb740d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சரவணன்', 'சுமதி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xb1b84fc149004cfabd8f65096e7d5c21, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சரவணன்', 'சுமதி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xb24d6724c0b844228729ea6dd7f5d5dd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'R.விஜயராமன்', 'மீனா', NULL, 'சென்னை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xb2a8c1d480ed4f80ae746b8ea9d9a315, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தங்கம்', NULL, NULL, 'மீனாட்சிநாயக்கன்பட்டி', 'சலூன் கடை', '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xb2bd042f4c644546b638a1b4f63f1739, 0x7acdf7ad784648548203237921f87047, 'LAKSHATHIPATHI. S', NULL, NULL, 'AMMAPETTAI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xb37eeecbe5e8425ab7449004a59e507d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'காளீஸ்வரி', 'ஸ்ரீனிவாசன்', NULL, 'கோயம்புத்தூர்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xb3da878153944dc8a9f48d027911ee3d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'S. சந்திரன்', 'S. காந்தி ராஜன்', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xb444d2cf29ee45b49ff2aab157276dac, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'காக்காயன் சேசு அந்தோணி', NULL, NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xb45a2b0e19424de79612a794bf818332, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நிர்மலா', 'ஜெகதீசன்', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xb46ecb85370e4663a53b438f40f4ffd1, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ராமமூர்த்தி', 'ஈஸ்வரி', NULL, 'ஒத்தக்கடை', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xb6551b57d15d45a89e17dd9db041a8ac, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியதாஸ்', 'சேசம்மாள்', NULL, 'சின்ன முத்து நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xb720584f1ba44988bc4e2348ff6f98e1, 0x5205fe0a7bea4952830f1027543245ee, 'ELANGOVAN P', NULL, NULL, 'USILAI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0xb728bb8b0ab445149c584beb22c62a59, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'நாகராஜ்', 'முனியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xb735328877264a9c94e5181c587ed999, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராஜி', 'ரமேஷ்', NULL, 'BSNL குவாட்டர்ஸ்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xb7c1ce4470b9456da2140e669ea93cd1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'J.விக்னேஷ்', NULL, NULL, 'பழையனூர்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xb7f0f3e488a1448e83b272ececc049a8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கந்தவேல்', 'மஞ்சுளா', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xb85a5932a8064f2c9d074e24d251eabd, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'P.முனியாண்டி', 'முத்துமாரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xb8b8c81c030146aa9b59f67aacdcf389, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கற்பகவேல்', 'பழனியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xb973d0b4f46642cf84a5f4d97529334b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'வடிவேல்', 'பஞ்சு', NULL, 'பட்டிவீரம்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xbabfc3e6c8c24027ba1eb68ea8983430, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பெரிய கருப்பன்', NULL, NULL, 'கூடத்துப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xbad2efbe3dbf4062aaa363bbde7142ef, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'இஸ்ரவேல்', 'சவரியம்மாள்', NULL, 'கொசவப்பட்டி', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0xbb3765431e2b4282ace0f3e727bb26d3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வெங்கட்ராமன் டீக்கடை', NULL, NULL, 'சிங்காரக்கோட்டை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xbbe14ba78f054593806e618f14a21596, 0x7acdf7ad784648548203237921f87047, 'M. KAMARAJ- MUNNAL THALAIVAR', NULL, NULL, 'MATTUR', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xbc12fb7f73ad46e2bc115f87839fc60b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலுசாமி', 'சந்திரா', NULL, 'BSNL குவாட்டர்ஸ்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xbcc19dd94e04486b8977a3a86085299e, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கபிலன் மகள் சித்ரா', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xbd236f9b982f4a679a8d0425dcea0db5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மீசை டீக்கடை கிருஷ்ணன் மகள் பஞ்சம்மாள்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xbde7d852146f45b5bd2b9766d1f4118f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வெங்கடேஷ் குமார்', 'சக்தி மாரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xbea8dcfc8de344c69d5ffc524206a207, 0x7acdf7ad784648548203237921f87047, 'P. ANAND EX. THALAIVAR', NULL, NULL, 'THACHUR KALLAKURICHI ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xbed6cd599b6649afa126a87a2637ac08, 0x7acdf7ad784648548203237921f87047, 'P. RAJAPANDIYAN VELAN PADAIYATCHI VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xbf284772af0e4bc49e1e873c9afe4375, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஈஸ்வரன்', 'குமரம்மாள்', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0xbf629de0f11d448aa62cb8380deb3336, 0x7acdf7ad784648548203237921f87047, 'KUYARA. M. SEENIVASAN KAMARAJ NAGAR', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xbf81670c423f4e47bec83c5824a55cc9, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'கிருஷ்ணன் - கருப்பாயி', 'ராகுல் (Apollo)', NULL, 'கவனம்பட்டி (உசிலம்பட்டி)', NULL, '2026-03-03 10:57:15', '2026-03-03 10:57:15'),
(0xc001b774e4994ba291bd29430227e8d2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகானந்தம்', 'தவமணி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xc02ed389cdb344dfb7d1131f36bc7951, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அருளானந்து பீட்டர்', 'சிவரஞ்சனி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0xc0439183f76c46da8dd5343432c40f6d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகராஜ்', 'உமா', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xc05666890bbd4e7dbbe6b3b69b24de1b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கோ.பாலகுரு', 'செல்வி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xc0b6ebc0604f4d3f913825c30a13dfa6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'துரைப்பாண்டி', NULL, NULL, 'நல்லாம்பிள்ளை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xc0e0d21cd27941f59208c77106b3fc0b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சைமன் ராஜ்', 'அமலா', NULL, 'புகையிலைபட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc0e8737300e54cca82f99d3db2128cbc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P மணிகண்டன்', NULL, NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xc0ef4c7540f343b496ea11324c992865, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரமேஷ்', 'ஜெயா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xc1fe41f2ce7049dfb02f4da8a1699567, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P.கிருஷ்ணமூர்த்தி', 'சுதா', NULL, 'சென்னை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xc21d8b60e35d49e0bb49729819a81278, 0x5205fe0a7bea4952830f1027543245ee, 'JAYARAM', 'MALAR', NULL, 'GAVI', NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0xc2c31f52a65d42aba65ba408024df9e5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கசாவடி மகன் முருகன்', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xc32664ea3c334ed8b4da3ade9c7cf773, 0x7acdf7ad784648548203237921f87047, 'A. MURUGAN KUNDHI VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xc3471ffdd63e48e09cc135c75425740d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'அழகுராஜா', 'அமுதா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xc36fe52d8eca4efd9ed3390505656dce, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Kalaiyarasi', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xc371db4215cd47c790324fbaa13e35ce, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜோஸ்பின் ஜெயராணி', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc4214bb9a7a74f4a867fb2b67fa8bc57, 0x7acdf7ad784648548203237921f87047, 'T. MANIKANNAN VELVIZHI', NULL, NULL, 'MATTUR ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xc4571c1646134cf2bde9ac7b235e6f33, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அம்முலு மாமா', 'மேரி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc583bad18eb84da3a5ec8ced3c704f89, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வெங்கடேஸ்வரி', NULL, NULL, 'BSNL குவாட்டர்ஸ்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc5ac0d4f6be9448e897d55f11af105f7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜெயராஜ்', NULL, NULL, 'சின்னப்பபுரம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xc5eb879e49dc4699995a9c0d36e416be, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பால்பாண்டி', 'அமுதா மைக் செட்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xc60ec23a95d843279c9658c296a80aa9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அற்புதம் மகன்', 'பெனிகோ', NULL, 'வட்டப்பாறை', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xc654c96859284e61a9acbe73be740945, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜோசப் ராஜ்', 'மோனிகா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0xc66c33d422464d6bacadc688a51b0e2a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரங்கராஜ்', 'காட்டு ராணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xc6a87aa8c5d0495c95ed8c5305c8f801, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'அறிவழகன் (கேபிள்ஸ்)', NULL, NULL, 'சிங்கார கோட்டை', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xc71fdf55d6e945d2a0a973f56a25bbef, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சரவணகுமார்', NULL, NULL, 'மதுரை (வண்டியூர்)', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xc737797bf04f4b29b6bf199fa6dc2299, 0x7acdf7ad784648548203237921f87047, 'KANNAN SARANYA', 'RAMALINGA MUDALIYAR NADU THERU', NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xc7fd8384e0b140d89dc2a161700686e7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நாகலிங்கம்', 'அஜந்தா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xc8b690583327470f9921f3d1439ef55d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Velusamy', 'Panjavarnam', NULL, 'பெரியார் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xca093aaa52ca436294d4cd4826ccbbea, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Thannikatti', 'Velanganni', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xca8425600d664fa9ba1001cef8f08bda, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Balan', 'Nagalakshmi', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xcab2650d21f5406f84142a3085f23456, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியம்', 'ஸ்டெல்லா மேரி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xcada8a35de854b529ce84f3bcf24b4ee, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'சென்றாயன்', 'அம்மாளு', NULL, 'காந்திபுரம்', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28');
INSERT INTO `persons` (`id`, `user_id`, `first_name`, `last_name`, `mobile`, `city`, `occupation`, `created_at`, `updated_at`) VALUES
(0xcbe00b8459804ee2b4030ab8308d15d0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அன்பு ரோஸ்', 'ராசாத்தி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xcc65b87ca61543f893413ebfefdb45c9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அழகுராஜா', 'அமுதா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xcc79e72d2e19430da4bdb49af4837ac3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முனியசாமி', 'முருகேஸ்வரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xcc7faaea15b14b899bdcb39fe6541355, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'கு.ரங்கசாமி', 'விஜயலட்சுமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xcd021fb4c13a411a8071c54c4655fcad, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'R.முருகேசன்', 'பொன்னாத்தாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xcd9d0c83c8c24c599c1a9e431333cfb7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சுப்பையா', 'தங்கமணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xce63bc1a61494c66afe598f66dc21129, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'G. பிலிப் முருகானந்தம்', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xce99113fba1449aa8220415588463203, 0x7acdf7ad784648548203237921f87047, 'R. MURUGAN PILLANGULATHAN VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xce9e572f4ee14cbc9628f5a6275d3114, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராமசாமி', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xcf111fcefefe413cac5988659e554d89, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மோட்ச மேரி', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xcfccb2fb0eea46f0b159a56e04fa9005, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மகேஸ்வரி', 'ரவீந்திரன்', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xcfd4c50504814d248b88786ef6dcdc29, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராமர்', 'ஜக்கம்மா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xcfeb2d53a7a14e3488e38a2603cccf5b, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'மோகன்', 'ரோபா', NULL, 'நெடும்பலம் - திருத்துறைப்பூண்டி', NULL, '2026-03-03 11:22:17', '2026-03-03 11:22:17'),
(0xd01ae09556144b368408046350ca4d44, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாண்டி', 'நாச்சியார்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xd09cfcdd738d412ebddc571bf29c451c, 0x7acdf7ad784648548203237921f87047, 'A. PALANI MALIGAI KADAI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xd0d2e607eec34b46ae08d937e6b4df2a, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'தண்டபாணி', 'பாண்டியம்மாள்', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xd113a4c1b1864d248d827d044af9904e, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'குமார்', 'சூர்யா ( டீக்கடை)', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xd158bb2097394f4eb09eb999adff0368, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'S விஜேந்திரன்', 'தங்க புஷ்பம்', NULL, 'சங்கரெட்டிகோட்டை', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xd2497597a92f48df870cf3c020c17b25, 0x5205fe0a7bea4952830f1027543245ee, 'CHINNA SAMY', 'RAJA', NULL, 'DHARMATHU PATTI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0xd293b457c55043d6bebb311b3a549c9d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலு', 'விஜி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0xd2db4ed427224925ad48fa672ed969c3, 0x7acdf7ad784648548203237921f87047, 'KUCHIKOLUTHI SELVARAJ', NULL, NULL, 'AMMAPETTAI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xd30adb6dfe3d4047b6c854c38ee66e52, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'நித்யா (PAPA)', 'M', NULL, 'செம்பட்டி', NULL, '2026-03-06 14:00:47', '2026-03-06 14:00:47'),
(0xd327322722f54171a929434c6e3d971b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பாலச்சந்திரன்', 'அங்காள ஈஸ்வரி', NULL, 'சிங்காரக்கோட்டை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xd34c5848671c4bf1bc2e108b2cb8cc90, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'நகையா', 'விஜயலட்சுமி', NULL, 'சென்னை', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xd3510476e41e41d0bec1079286c9d9cc, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பால்பாண்டி', 'அமுதா மைக் செட்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xd354d293bb05426fa443622348eaf61f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வீரசின்னு', 'செல்வி', NULL, 'முருகனேரி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xd3d73ae7e0514abbb1495e64c7a6c856, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜி மாணிக்கம்', NULL, NULL, 'காமாட்சிபுரம்', 'இரும்பு கடை', '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xd4b022a19b96408889e5e6f6192ee73d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சகாயராஜ்', 'சாந்தி லில்லி', NULL, 'வேடப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd4c1353da9274bc99e74e0265cbd64d6, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'நாகலிங்கம்', 'அஜந்தா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xd62429d58c8941bf829d0ef92357d4b9, 0x7acdf7ad784648548203237921f87047, 'ANBUMANI. P. R MANIKANDAN SASIKALA', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xd626aa18c28e445c9876eba8e90f1b40, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'S விஜேந்திரன்', 'தங்க புஷ்பம்', NULL, 'சங்கரெட்டிகோட்டை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xd637875a902a4448baeedab01eb0776d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மக்கர் மகன்', 'சேசுராஜ்', NULL, 'பாரதிபுரம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xd637d245c96d44c29f411b81b4ef80c8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Saimanbabu', 'julietmary', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd65dc9b0c82f495081dc8859d090645b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'கோதண்டராமன்', NULL, NULL, 'சிவகங்கை', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xd66ec0310dfd44ada609bb54d2e52b73, 0x5205fe0a7bea4952830f1027543245ee, 'JAYARAJ', 'DHANAM', NULL, 'NAGAMALAI', NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0xd69199a4124c4420909808eee630655f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மக்கர் மகள் ரேசி', NULL, NULL, 'குள்ளனம்பட்டி ', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xd6adc52815e14a5ba1bf7b4c6a871531, 0x7acdf7ad784648548203237921f87047, 'KUNDACHI MARIKUMAR IRUMBU KADAI', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xd6dfbb96f1ba4fdfaa442f36b6202bfa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அனிதா', 'சாமுவேல்', NULL, 'சென்னை', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd72875e0284e4fbebc6039a2b1c9aea7, 0x7acdf7ad784648548203237921f87047, 'S. SHANMUGAM MANOGARI EX. VAO', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xd78cc9690e824482a9b14151fe80c540, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'முருகன்', 'பொன்னம்மாள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xd7eba0f3e230484fa56fba23114a146f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வீரம்மாள் மகள்', 'அமுதா', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xd7f404e4ed2a4976b30398eeb16444db, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சென்றாயன்', 'அம்மாளு', NULL, 'காந்திபுரம்', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xd7f891bb681a4085aa5867a9109db350, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'R.சரவண பாண்டி (POLICE CONSTABLE)', 'ராம் ரோஷினி', NULL, 'சென்னை', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xd8e896b025164001961b6bfc7345b821, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Santhiyagu ', 'Velanganni', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd9e53f9dcf264f088c69d3f87d2d858e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'M காமாட்சி பிள்ளை', NULL, NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xdb2f309b973549d8a1329b462a452dca, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Jeyaprakash', 'Stella', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xdb3477f5492e475ab6ca63ab658eec0f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Eliyesar', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xdb885112beb34919930e08984a03bbb7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராணி சம்மனசு', 'பப்லு', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xdc5d16bc336c44d2ad7d3a17495a9af3, 0x7acdf7ad784648548203237921f87047, 'VELU AMUTHA PILLANGULATHAN VEEDU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xdc90a31aaeb3436c957207a7b315887c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'குணசீலன்', 'விஜய் பிரதீபா', NULL, 'முத்தனம்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xdca669848da64c9a8e3db2263ac3e98c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'K முருகேசன்', 'நாகவல்லி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xdcf3092c52ad49c7a2631283a8df3a59, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பாண்டி', 'நாச்சியார்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xdcfdd114872b4a43896ee7b7d0eb399b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சின்னசாமி', 'சாந்தி', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xdd06e9c51e6a447baffdac1283319999, 0x7acdf7ad784648548203237921f87047, 'M. THANGARAJ ARISIKADAI', NULL, NULL, 'AMMAPETTAI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xdd366ba3dbda4292b920079fa23963a1, 0x7acdf7ad784648548203237921f87047, 'MOZHAI POOMALAI PONNAMMAL', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xdd4c52be6dc84a58b887a13d65d6c127, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Sathish Kumar', 'Ranjitha', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xdd4cc4c0a4734e2b8702443c639dab7b, 0x7acdf7ad784648548203237921f87047, 'S. KANNAN KAMARAJAR NAGAR', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xde016fa3c85c492a9dad300be8fa6262, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பால்பாண்டி', 'கலா', NULL, 'முத்துராஜ் நகர்', 'Auto', '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xde72935fa57e4c75882729d663c05269, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சைமன் ராஜ்', 'அமலா', NULL, 'புகையிலைப்பட்டி', NULL, '2026-03-03 09:45:35', '2026-03-03 09:45:35'),
(0xde9c4600f20546368e60f93574a5e734, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'குமார்', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:39:24'),
(0xdf60b1dbd21940f98edcd31b10c83294, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாண்டி பஞ்சர் கடை', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xe047d1aba7df412381d34fb62daa920e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஸ்டெல்லா', 'ஜெயப்பிரகாஷ்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-03 09:52:30', '2026-03-03 09:52:30'),
(0xe0d48deff18b4efabe540c54ad059388, 0x7acdf7ad784648548203237921f87047, 'SENTHIL GAYATHRI', NULL, NULL, 'KACHIRAYAPALAYAM GV MAHAL OPP', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xe152048c99a94a45921f5ec9e81ddc69, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'K.சிவசாமி', 'லட்சுமி', NULL, 'சித்தரேவு', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xe17940c441234d579d44e4db2362fe1f, 0x6adf89f150d14a64b3fdb03acf5da408, 'Jegaan', NULL, NULL, 'Pugalur Four Road', NULL, '2026-03-03 10:14:04', '2026-03-03 10:14:04'),
(0xe179df0e9e474b3e91b8bf233ff5df25, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வின்சென்ட்', 'ரோஸி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xe238d1bb964c4b5ba3d5b44f0fd92e45, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரூபன்', 'கமலி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe287b99e926043099380b22563b288ae, 0x7acdf7ad784648548203237921f87047, 'S. VASANTHA SELVARAJ', 'PILLANGULATHAN VEEDU', NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xe2c6f83a9ddd4acaadd7139537421ba1, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'P.மணிபாரதி', 'சுகன்யா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xe33f4308ddf44d7cacfe68de8cd63997, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அந்தோணியம்மாள் மகன்', 'ஸ்டீபன் துரை ராஜ்', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe34b6a65917f4e7eb2b08a3ab456b128, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'பீட்டர் முருகன்', NULL, NULL, 'சிங்காரக்கோட்டை', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xe3d1f772e9c947cbb5ad3a75302fe727, 0x7acdf7ad784648548203237921f87047, 'V. SUBRAMANIAN A. E TNEB', NULL, NULL, 'VADAKANANDAL ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xe480ad20a6144361a25cc869861c6a47, 0x3ff8de4622804be0aa4e405d8c404df3, 'கிரேஸா', NULL, NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 14:08:59', '2026-03-06 14:08:59'),
(0xe4b37e8e51d54e29813341cf1f59d694, 0x5205fe0a7bea4952830f1027543245ee, 'ANANDA RAJ', NULL, NULL, 'KARAIKUDI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0xe545ea4ded3f4670a6fdd531587631db, 0x7acdf7ad784648548203237921f87047, 'GOVINDASAMY AMBIKA', NULL, NULL, 'AMMAMPALAYAM', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xe633fcb0d49b4900937e7c9d7d117752, 0x7acdf7ad784648548203237921f87047, 'ILAI KADAI MANI', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xe679a5bdf2fa45e1a6ca8736c745cfc7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பால்பாண்டி', 'கலா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xe6c47061f6fa409187c086c9acab8e88, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'P மணிகண்டன்', NULL, NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xe6cb9ae0260d4a1bb19ae7dfa7cffd1e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மணிகண்டன்', 'கங்கா', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xe75f20522c584b31b76c6a2a34fde352, 0x7acdf7ad784648548203237921f87047, 'V. SUBRAMANIAN OORATCHI SEYALAR', NULL, NULL, 'MATTUR', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xe77f67a1d1e846328f40303eb7599c92, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பர்மா அமல்ராஜ்', 'அந்தோணி மேரி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xe7be83537dfb498c821891d0b9b2f605, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சகாயராஜ்', 'சாந்தி', NULL, 'வேடப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xe84dac5556654f80be41a7be82fb156d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தாமரைச்செல்வன்', 'செண்பக பிரியா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xe877723d35f841ffa2e2bce92a0bab27, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'குமார்', 'கிருஷ்ணவேணி', NULL, 'சிவகங்கை', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xe8e4b4bb327f465d9fad912e4b67129a, 0x7acdf7ad784648548203237921f87047, 'K. NALLAAN S/O ARUMUGAM', NULL, NULL, 'MADHAVACHERI SIVAGANGAI', NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xe9730c873f9a4ca8b14500998f83ea44, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சின்னப்பொண்ணு மகள்', 'ராணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0xea427a1b9c5f45eabaf634d4ffc97af7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாலன்', 'முனியம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xea8be983026d4385b38320ee3248abae, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'டிரைவர் கோவிந்தன் மகன் சந்திரன்', 'பாண்டிச்சேரி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xeab7563dee644fa095cf03e5a550846b, 0x5205fe0a7bea4952830f1027543245ee, 'CHINNA RAJA', NULL, NULL, 'KUPPAL NATHAM', NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0xed0b3387d8704fda8bb78fff01be061a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆனந்த சுந்தரபாண்டியன்', NULL, NULL, 'ஒத்தக்கடை', NULL, '2026-03-06 13:01:29', '2026-03-06 13:01:29'),
(0xed1ceccb9a46458fb27518880f0178d7, 0x7acdf7ad784648548203237921f87047, 'M. V. PONNUSAMY ADMK', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xed56ece188f14dadb81b6e79bdfc20a6, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'ரவி', 'சிவகாமி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xed7ed28e93ee495990858e31233dc44e, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'செல்லையா', 'அஞ்சலை', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xee080cbdd6a342308461022d0d13a9a8, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'P.ராஜேந்திரன்', 'முருகம்மாள்', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xee2e1d454d2541bdbe4eac69cf64ae61, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ராமசாமி', 'சாந்தி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xee46bce2d3ed423da85babfff450ebe4, 0x7f0b50a76d8e467cb7d144f26576da34, 'கௌசி', 'கௌசி சுந்தரம்', '7845663980', 'மதுரை மாட்டுத்தாவணி', 'DCC', '2026-03-05 06:31:20', '2026-03-05 07:00:53'),
(0xeed7233d93314e6ea04c04dd5cb8ef9c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சின்ன பாண்டி', 'கருப்பையா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xeee9351f41c643fea171b5a618fcb4b2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பாக்கியம் மகன் அருள்', 'பிரியா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:17', '2026-03-06 11:57:17'),
(0xeeefade3940b46d584e22ca9b3032cd8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சங்கர்', 'இந்திராணி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xef12da0fd21e46a09e1d23c8fa073ec6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆறுமுகம்', 'மகாலட்சுமி', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xef6cf08d180d4f3099a60187b3e02d20, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'லட்சுமி', 'பாஸ்கர்', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xf0181d41b72545a6b309236d743a92fc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சுப்பிரமணி', 'அழகு மீனா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xf03e68f10035471cb32e8d5b71055dfd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'குமரேசன்', 'ஆண்டாள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xf0fc1a79a5fe46dc94585e8aed4e428d, 0x7acdf7ad784648548203237921f87047, 'MURUGAN MARI MUTHU', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xf13d4999a6a749d9adb6da0cab8dcaeb, 0x5205fe0a7bea4952830f1027543245ee, 'SELVAM KARUPPIAH', 'POORNIMA', NULL, 'KARISAL PATTI', NULL, '2026-03-06 14:42:37', '2026-03-06 14:42:37'),
(0xf156761d242b4821ba5725fd85f1d8cd, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'R.பொன்னையா TNSTC', 'பாலகிருஷ்ணவேணி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xf1fef07f85ee4773969b5fb0a1a1d96d, 0x7acdf7ad784648548203237921f87047, 'P. SIVAMURUGAN CID PC', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xf21a56033bf448f7bb97f485a3046b21, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'அருளானந்தம்', 'செல்வி மேரி', NULL, 'குட்டத்து ஆவாரம் பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xf2b2a818431f40b5adc4da3601bad924, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Lakshmi', NULL, NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xf33cc0d770694bfa85b591ac71551c3b, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'சின்னதுரை', 'ஜோதிடர். சித்தப்பா', NULL, 'மேட்டுப்பட்டி. அனைப்பட்டி', NULL, '2026-03-03 11:25:26', '2026-03-03 11:25:26'),
(0xf35f5d90890f4bc1ae151cdbe9963736, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜான்சன்', 'விண்ணரசி', NULL, 'நாகப்பட்டினம்', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0xf3c18bb59bbe402793e16e3dabd0e7eb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செல்வம்', 'ரேவதி', NULL, 'Y.M.R பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xf3e7bd5e24fa42429b3f25e888286c20, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'M. நாகராஜ்', NULL, NULL, 'முத்துராஜ் நகர்', 'நூல் மில்', '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xf41fa79f2e834918bf443af95f2bb4f2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செபஸ்தியார் மகன் வேளாங்கண்ணி', 'ஜோஸ்பின் பௌலா', NULL, 'இராமையன்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xf45edb3f6f0049938f5dc305f3a6b8e5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சேசுராஜ்', 'மரிய செல்வம்', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 07:20:44', '2026-03-06 07:20:44'),
(0xf4727ca3a5014bd586f50f4ca99a7f05, 0x5205fe0a7bea4952830f1027543245ee, 'RAJA SS', NULL, NULL, 'SEMPATTI', NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0xf4cfc5b477d241f6a8e8ab3378079c95, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'பிரிட்டோ', 'ஷீலா', NULL, 'கோயம்புத்தூர்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xf51e76ad59794dee936bea6134ef553b, 0x7acdf7ad784648548203237921f87047, 'E. GOVINDARAJ W/ O CHINNAMMAL', NULL, NULL, 'PALRAMPATTU ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xf53bae4faa6f4c67b5a28a733b5daaf5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Thandapani', 'Latha', NULL, 'திண்டுக்கல்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xf557d5893dcf4066a674ac1ca3c3e0d9, 0x7acdf7ad784648548203237921f87047, 'P. KANNAN KALAVATHI', NULL, NULL, 'MADHAVACHERI ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xf5cae7a732a44dcd9dda7de3c5041c1d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மகாலட்சுமி', 'காளமேகம்', NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xf65ca39122c244a8af2506457cd3ca88, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Dass', 'Reeta', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xf665711b50c84554a86ba79f30aba4e2, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'முருகேசன்', 'சாந்தி', NULL, 'வாடி கிராமம்', NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xf7350529a9a447d0801cebcfb5f8a2cc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வீரசின்னு', 'சுப்புலட்சுமி', NULL, 'முருகனேரி', NULL, '2026-03-06 13:01:16', '2026-03-06 13:01:16'),
(0xf78e74890535410faca797a05acf3397, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மதன்', 'வினிலா', NULL, 'கரிசல்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xf8ee32f5a482472a9b55d660da23b034, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'தவமணி', 'அபி', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xf9e8f36abd684114bdf66781d4664dee, 0x7acdf7ad784648548203237921f87047, 'D. KANNAN NEL VIYABARI', NULL, NULL, 'KACHIRAYAPALAYAM ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xfa906101ee8646718292c0acf6d19999, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'வி.இந்திராணி', NULL, NULL, 'முருகபவனம்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xfa9e2b9a813f41bfaa3eb1886dd42836, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'V பாண்டி முருகன்', 'அழகு மீனா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xfb040d2b737f4319ac1686e680735429, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'P.மணிபாரதி', 'சுகன்யா', NULL, 'ஒட்டுப்பட்டி', NULL, '2026-03-06 13:01:03', '2026-03-06 13:01:03'),
(0xfb5c54672e44450c95681f415fb0e897, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'செல்வமணி', 'ஹேமா', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:56:50', '2026-03-06 11:56:50'),
(0xfb7539f874654a65bf660cd5fa2b3520, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சந்தோஷ் குமார்', 'தாயம்மாள்', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xfbbed01a06fd4cce820becdfff27d851, 0x7acdf7ad784648548203237921f87047, 'R. RAMALINGAM SATHYA', NULL, NULL, 'VADASIRUVALLUR ', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xfbe387fe79044778a227b8b18de0dc97, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆறுமுகம்', 'சரஸ்வதி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xfbe6fa58091842d3aa99fe1204e90583, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஜான் பீட்டர்', 'கிளாரா மேரி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xfbeacdf7c7d645e98d7dca54419feb55, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Mary', 'Selvamani', NULL, 'முத்துராஜ் நகர்', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xfc142199ac0449aa85da75dbd027dccd, 0x7acdf7ad784648548203237921f87047, 'S. M. SENTHIL', NULL, NULL, 'DEVAPANDALAM', NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xfc48d924496246d1a354d1ff5f7f5020, 0x7acdf7ad784648548203237921f87047, 'KOMARAN KOLANJI', NULL, NULL, 'YERVAIPATINAM ', NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xfcad4f5b73894117a19f784b2413c326, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'சைமன் பாபு', 'ஜூலியட் மேரி', NULL, 'வடக்கு மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:02', '2026-03-06 11:57:02'),
(0xfdbb0443d29e4a539a443b3392dfdf8a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ஆரோக்கியசாமி', 'செல்வராணி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-05 15:16:49', '2026-03-05 15:16:49'),
(0xfdd44dcff111434bbe6025bbf613bd8c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'மக்கார் சந்தியாகு', 'பிலோமி', NULL, 'மேட்டுப்பட்டி', NULL, '2026-03-06 11:57:30', '2026-03-06 11:57:30'),
(0xfe18443c70ba4101b9d7b736bbb506d4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'Iruthayaraj', 'anthoniyammal', NULL, 'வேடப்பட்டி', NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xfecfb249868d4e458b5b0eacb816287d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'ரேணுகா', 'பாண்டி', NULL, 'BSNL குவாட்டர்ஸ்', NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `person_id` binary(16) NOT NULL,
  `transaction_function_id` binary(16) DEFAULT NULL,
  `transaction_function_name` varchar(150) DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `type` enum('INVEST','RETURN') NOT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `item_name` varchar(150) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_custom` tinyint(1) NOT NULL DEFAULT 0,
  `custom_function` varchar(150) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `person_id`, `transaction_function_id`, `transaction_function_name`, `transaction_date`, `type`, `amount`, `item_name`, `notes`, `is_custom`, `custom_function`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x01519cd3c8de4e81b03f9c9d3972f40f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x481276e4d5bb49418f2bfbdc19cba852, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 5000.00, NULL, 'கிருபா மாமா', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0236b91348894996b8d49c891dfd7039, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x069f171194cd4147bf13939596d6f1cf, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 101.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x027b0d44619043c2ba58d5ac26b13da4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1136e87caac04d62ba75cae8de26d5c7, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2025-03-10', 'RETURN', 300.00, NULL, 'அறிவு கல்யாணம்', 0, NULL, 0, NULL, '2026-03-03 09:54:40', '2026-03-03 09:54:40'),
(0x02fdcd17d04c4818849107df223081bb, 0x7acdf7ad784648548203237921f87047, 0x19bb8bf5ec094c4ca51df65dfde4629a, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x03284df7405045f887f5735f7ec03b5c, 0x5205fe0a7bea4952830f1027543245ee, 0x84895d2761b447309d3a7edb29deab70, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-06-10', 'RETURN', 1500.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x03b98f6706804c04ae7acbb0cc599754, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x01189bb8a66442679aa4847a974ff776, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x03c52b63ee334121a41dac62f3b41fd2, 0x7acdf7ad784648548203237921f87047, 0x8e8064b9f8dd4a1c96cd1e8ed774e5ce, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x03e52cb4c3a7453b92f98453c5130d25, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf2b2a818431f40b5adc4da3601bad924, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x0441c9a11a15474e8b4af67b2e83d7e9, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x6cd2f79cd0274575844c1f05677a34b4, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x052957d709244f8795dfc77bda1bc245, 0x7acdf7ad784648548203237921f87047, 0xb2bd042f4c644546b638a1b4f63f1739, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x05758017677743d7b62e4ad24843cedc, 0x5205fe0a7bea4952830f1027543245ee, 0xeab7563dee644fa095cf03e5a550846b, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2018-06-13', 'RETURN', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x0592854e366f4f4b85760d2465e171a1, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xa865f9c8f9d64f11b5b156b79ecaa6fb, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x05cb443d706c48bca58ac6cc9aeef102, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x5f07e88df9a94671939bf5169e02c47b, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x0619e13df30a4ecca8d86cfedf1a2a5b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7c6b935e62d44b4ab04621127b128c63, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x063021f08bef4ed2a737a86870a495db, 0x7acdf7ad784648548203237921f87047, 0xd09cfcdd738d412ebddc571bf29c451c, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x065ccbe1f5814e06b0c775f826c3a5d8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa719c648bb0d4b479d4252303c7fcb99, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, 'Aaya', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x0685599d875c456c8c6ef92744391e92, 0x7acdf7ad784648548203237921f87047, 0x8645f12d6fa84927b82c4a26900bbdfe, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, 'nalluraan veedu', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x06f7131ffa4a462890c8e845a09bf3de, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xaf88802df55d405d8ddf9ccdcfe6f39e, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x0731f2d7d3eb4466aae946a7a4fbd31e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x19450ed2f64d4791ab679bf7e19ab22f, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x076a77588f9f431a99fb3e7ad4e634ac, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xad5c819a18904e14a85e0df349236c6c, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x0833974dcbb54039ba22bf9e7bc9b823, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xee2e1d454d2541bdbe4eac69cf64ae61, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x083c5e7aba0a4be3b3f90ffd65537261, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x29acab83bd314dfba56168d268d56513, 0xbd6bece4af3d41e7b824417fdce581d1, 'குழந்தை பிறப்பு', '2026-02-08', 'INVEST', NULL, 'ஆடை(dress)', NULL, 0, NULL, 0, NULL, '2026-03-06 14:00:47', '2026-03-06 14:00:47'),
(0x0880cd56f5704778a295bf26ed53cc74, 0xd12420858add461aba10af9c3cd3c564, 0xa8ff593520704c2987979602ff6bc472, 0xec929f1589024523b43af0e5e1134782, 'திருமணம்', '2026-03-02', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:11:32', '2026-03-06 14:11:32'),
(0x097056b4a79c4fba8682974a618f3e9a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xb735328877264a9c94e5181c587ed999, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x0989c730797248dea7a0cb861b34412f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe238d1bb964c4b5ba3d5b44f0fd92e45, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 2000.00, NULL, 'மக்கார் அற்புத ராஜ் மகன்', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x09ab2297faba42db8d3080e727d4fa04, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd6dfbb96f1ba4fdfaa442f36b6202bfa, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'கிருபா அக்கா', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x09e8e5ffb02b462583291158f4b2897f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x275057e850b745b4aa83234a8766c17e, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0ade46820c2a47d3a7037a799be68716, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xc3471ffdd63e48e09cc135c75425740d, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, 'கால்நடை ஆய்வாளர்', 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x0bd4319681244ca3a104d14274f26019, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xcfccb2fb0eea46f0b159a56e04fa9005, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x0c6eb3e62b7844a2b8cfd7b845fe3704, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8e2a38d45e844507b3f4dc98fd20f34b, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, 'அலெக்ஸ் மாமா', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0d11b385a0184908a6f9cec30a41f000, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x24b4dcd268ff4bb1a51f173ec103e471, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x0d7c8ca5e75b446d97bfdc35d5fc13d1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd637875a902a4448baeedab01eb0776d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 2501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0dc48107705a4431bf1ad7fe458af5f2, 0x7acdf7ad784648548203237921f87047, 0x974f41257ec2463f9a43991e0bbfd8ed, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x0dd2215c39a14f5ba4e41a584aeb0f90, 0x7acdf7ad784648548203237921f87047, 0xd62429d58c8941bf829d0ef92357d4b9, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x0e76ee40c48942a89a8bacb78365d29b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x300e77d20f6f4f10b5600ca797fbb7f8, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 250.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x0e9575269d994c318dd699333b7945f5, 0x5205fe0a7bea4952830f1027543245ee, 0xa1344383fda74db1bd8d0f4521ab1252, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-05-31', 'RETURN', 1000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x0e9a93ff823448ef80415c97ba711685, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9d6df1552c6847c3bfbc712984061ecc, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0x0eb3c114af7749e79e306ca80caee210, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2a63dfb62f6c45f1afc09dfbbd997017, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0f0a699d852043a1988ee940d67de82f, 0x7acdf7ad784648548203237921f87047, 0x3c66a7fe393548d2be63bcb8bbe19191, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x0f1048f42133434290610dec48299cde, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4b2f43b46428440caac707afd6549e68, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 3000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0x0f4db6c2a696402b85d2f31e9be5a793, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x64b1131b11bd484c8da5853946647332, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x0f69940483e245e5ac25187df7e66118, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xb728bb8b0ab445149c584beb22c62a59, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x0f6a25072b284129858200c7602710b9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x07dc947c28cb400faa88f47ec2faffe2, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x0f8dfdcc2aa94af9b69227a23a630202, 0x5205fe0a7bea4952830f1027543245ee, 0x45e25d97d79a4243a880bbf4794f3b85, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-08-17', 'RETURN', 3000.00, '5.5 KG POT 5 PLATES', NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x0f9df671d1494f9ba64d1006cb09ef3a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6100e59372a44cc1a4f28e3af071003c, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'நாட்டாமை', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x0fe80f026ff144ef99d1e957e61afeec, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf78e74890535410faca797a05acf3397, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x10d812009ecd46889bce8b1f4bf6fb59, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4d855d37793a42b992b0c79aba696725, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 4500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x111f46e9ef4f439eb79bd9fc56cf5456, 0x7acdf7ad784648548203237921f87047, 0x3696d1c3c2c04e0f8c1ddf76ab2c735c, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x114c6656974b4df9baed02c0fcb89f51, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x946d18290ca0497e969b235624de4b6b, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, 'மாசிலாமணிபுரம்', 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x11c0ac21cd15445fa90bb06de0acd86a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc0439183f76c46da8dd5343432c40f6d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x1263893e2bca45c1b75fdc7b733b2a24, 0x7acdf7ad784648548203237921f87047, 0x9e5b0050cbe0484e962afc590e566983, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x143f94ec5f0645a189901690e66384b3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1eaa27c630104f22bb74f0d728e66f8e, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x1440e0a94c044f5a9ad59c74f844ca9e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7b3ad182471d46fb934b68d381cfca0d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x14531a617e974c5caa8c5178e6203a07, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x30e53b6840ca4188ace94bf1e30e87a6, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x146a501e00ca4874b8c3383ff9a361e2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9c0b4fdcd57b4a79ae9b914575dda388, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x14a15af4fdfe45e0a6461b220c641ace, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xf156761d242b4821ba5725fd85f1d8cd, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, 'TNSTCநடத்துனர்', 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x158ba0b6e5e2427a827c8ac9dba40035, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x33720cdf8d4d493b81a539281fc9b7a1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x162c29887706453bb64326d2741af48e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x52759f4a1bc247a497a6eb8ed4e39d6d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1100.00, NULL, 'சம்மந்தி மொய்', 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x165dcdd5c7584f8992102b4c41495e2f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x232d47ba606347b888567a9c1e1f07f5, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x182560f6e24747dd994ec348c9032abd, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x04f22fbaa5f945dfb643a8382ee87dce, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 250.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x18b04c6b3a8e42abb211a3c8a03c5585, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x0694714750864504abd825203306ba41, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x1925344d9b664ea5b59a9a4ea6c9357e, 0x7acdf7ad784648548203237921f87047, 0x28f611ced5224cb9adb644b22b217f94, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, 'opp to G. V. MAHAL', 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x19a73e2dd47b45c48118a310c2418cd7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x61c92c6d709244f98682c2abeed03a5c, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x19b0edc7cba24068b1858a6fcd9117ef, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xaeb3154bd94646da8bb11092c85fcb66, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x19e19ec1298946358db71fa4a015c574, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x1264e064f8ca44e5afb8912826940315, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x1a3e9f602ff043159f0583c8872e13df, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xf665711b50c84554a86ba79f30aba4e2, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x1a6cff017fcb44ebb2e62a79893d1c97, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x83d40b1d82604125ab3e7f06e4c66f65, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x1a9b3acbf3a44af3aa29160a8ed32b80, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x9d7dc4f4cdaf4fbc9d95a125ed5d08ff, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x1ac6d4b27ee34faa80e7361ac7e25508, 0x7acdf7ad784648548203237921f87047, 0x955fcadc8d804e8e8742fbab6d83b151, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, 'mk brothers auto', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x1ad5b552d2d440a3987d366043e37ad9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x64a9ee39f354480f8fa56f9e0480f484, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x1bc4e2904aff4675832db4b20a0cb370, 0x7acdf7ad784648548203237921f87047, 0x638ba7d42f714d91afb9499f511bea70, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x1c643689e6bf4d4da4943e1134603167, 0x7acdf7ad784648548203237921f87047, 0xd2db4ed427224925ad48fa672ed969c3, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x1d7503fbbe77432a92ff0888f8c9ac62, 0x3ff8de4622804be0aa4e405d8c404df3, 0x7118671a706d4d1c8e3a7cb17599a3bb, 0xe1580ee83e624845b58fbcaa45198e2d, 'குழந்தைசாமி இறப்பு', '2026-02-19', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:08:59', '2026-03-06 14:08:59'),
(0x1deb1d86f3074d53a9d043d1b9daa3a7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xce63bc1a61494c66afe598f66dc21129, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x1f06a250b3c345afa1b1681f63292983, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x8c291ecfba444331b766057bac5ad8b7, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 600.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x1f1396809d4f42eca9f400bc1fad06b3, 0x5205fe0a7bea4952830f1027543245ee, 0x9b656a0215e04409b2d4b1517da1c492, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-06-03', 'RETURN', 1000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x1f4546c72e284937a8efa72384101b92, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xcada8a35de854b529ce84f3bcf24b4ee, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x1f73cc018d954e9f90418134a06c4d9e, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xd7f891bb681a4085aa5867a9109db350, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x1f7f040f8c594232bbe9986d060a09f2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xdb885112beb34919930e08984a03bbb7, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x203323737f844d6ca06af0abfdc15922, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x99141deffe5e4d75999ea4d948d23e89, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 205.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x207a925d799f407699d5f8f45be962d1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5185380875504696a50c0951200b0ce4, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x211aea31d2f54f5babf967ec35087ebd, 0x7acdf7ad784648548203237921f87047, 0xbed6cd599b6649afa126a87a2637ac08, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x219440794cbc48b2ba558e232a16cdc4, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x6cdf46bf5ccd4fae96769d152fd595f9, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x21fe06f32dfe4132b2dcf3d935f556cc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7ee6ea983578445d9a1c131fb121c0df, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 5000.00, NULL, 'அத்தை', 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x224f9317551540919bbdd6390cec9b50, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x065152af0aef4c9fa6c138fa1c3284a2, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x2257382917544ad084be1ac141bbdaab, 0x7acdf7ad784648548203237921f87047, 0x9cf9d7d4d1af4ce6ba36f1269fa2b653, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x23e3a9fd84c74e0a9094764db4a7b03a, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x6b7c0604a3ae4091a3b9092fc4f87826, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x24224d44497a43d6a96ee8574980f97c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x47af86e0b5cf47da881c8f50d59812f6, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x2444b14f0e494a69b6dee0fc34d94f99, 0x5205fe0a7bea4952830f1027543245ee, 0x3dd72f08317849dea8ecfb872171df99, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2017-02-20', 'RETURN', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x249cce4bc06940bab4d04ef0248ef3b8, 0x7acdf7ad784648548203237921f87047, 0x1795c418bee84a5790a8aa9b5b7c8f59, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x259dfca2c3e54a1b815e2bb1c2d7856f, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x10c64ca7bc0e47da844cc6e39e9b80ec, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x25becc79da554a98847e88f1a8e5e88f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc0ef4c7540f343b496ea11324c992865, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1051.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x260f70dc33534c208a95258a74575a4c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x6f42531c3d144866ad3e5466b77dbf38, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x2643ff5988994a71a45012b84c1b4488, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7bb05d1ac8d541d58569afec7a9588f4, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 4005.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x2684399fec824c52a26a867a1cebee70, 0x5205fe0a7bea4952830f1027543245ee, 0x83b5cb1a4cc643049f794d4ea30b9717, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2018-06-06', 'RETURN', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x270a175001524ad8a6d51b15c3d1b3e7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe84dac5556654f80be41a7be82fb156d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x274ee191ea244779990a970633f90f6e, 0x5205fe0a7bea4952830f1027543245ee, 0xb720584f1ba44988bc4e2348ff6f98e1, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2017-02-28', 'RETURN', 1000.00, NULL, 'TEA STALL', 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x2762f6b6ec7a4f09bfc0f34d6108ce38, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa59254536f7c4179a9497e6c0d0f8be1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 250.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x28134e995a2944a18a3f6fee225eb453, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8a7d7caf884d455bad27f706cfb967e1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x28ab201a08e645ccb7bcd2b7a00088a8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xef12da0fd21e46a09e1d23c8fa073ec6, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0x29388395e2db4a109044b6ff9b8fc00a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7bbf45e6bb6648f58d1f90a2f5421a11, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x2949863b22b44d81bcf58560734aa3c9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa8ad4cbfd2e645bfbb6821b90b96c241, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x29d30e2fffea456b8ab297bac53c60fa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5bdfb10be82842ad88f785b573e85ea1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x2a5ae5b929a4476fa30697a87d03fe0b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd3d73ae7e0514abbb1495e64c7a6c856, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x2bb3a953477d4e8b8fc39be56d34f6ea, 0x5205fe0a7bea4952830f1027543245ee, 0x8bf1594e30e64eca81c00da88e47d32d, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2017-02-20', 'RETURN', 500.00, NULL, 'PALANI KUMAR MARRIAGE', 0, NULL, 0, NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x2c69777ff6584d5f831e6fab29b13034, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x967480a5ca444014b2571880bec19a8d, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x2c75840eed174bab999bab0982554083, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xca8425600d664fa9ba1001cef8f08bda, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x2d9ffaecc8de4e5bba75d50ba42d75c7, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x740832d4f7614b139961155e36bf629e, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2026-01-24', 'RETURN', 2000.00, NULL, 'APM.. ஆச்சி மஹால். தான். விலக்கு', 0, NULL, 0, NULL, '2026-03-03 11:23:37', '2026-03-03 11:23:37'),
(0x2daaecfe4b2c4800a36af18363f614ac, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0xcfeb2d53a7a14e3488e38a2603cccf5b, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2025-06-06', 'RETURN', 1000.00, NULL, 'திருமண விழா', 0, NULL, 0, NULL, '2026-03-03 11:22:17', '2026-03-03 11:22:17'),
(0x2e3f3780afda415c800a48031594077c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4ff4e20ca9d94a759a7a27bb6daa84a1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x2e51bd3ad175493dbe75286682b1cd77, 0x7acdf7ad784648548203237921f87047, 0x0ef47e787c7e4d20924f927d4495d571, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x2ebfb5e4a9544f7c888ba8891aed3f5b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa8010abcb0644e8c96bd04896984b461, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x2ef7a5b3a47148dc92071bc548982948, 0x7acdf7ad784648548203237921f87047, 0xdd366ba3dbda4292b920079fa23963a1, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x2f6cf2b00c5047f2b27a4107ac60149b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x75841f812f05489a905021f2585bc3b3, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 210.00, NULL, 'RR MILL', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x2fda36f0e5e6474f87737075d725e56b, 0xa2c6f2db04cf4679adeb97d1f2630f91, 0x7d6f07c987944b3aa387b432da4902db, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2025-07-31', 'RETURN', 7000.00, NULL, NULL, 1, 'மூவிருந்து', 0, NULL, '2026-03-03 10:35:29', '2026-03-03 10:35:29'),
(0x3055064795f643069ca24aeb54a2cf62, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x84462dca1b584d40b8b3fa90daeaac1a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x30c80f1b7db24283b6af70162ed4c039, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf65ca39122c244a8af2506457cd3ca88, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x316db6421e50469e8228cd1766b7947c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xc2c31f52a65d42aba65ba408024df9e5, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x31a9c94a2efc4bfaa2bdf9b74f575753, 0x7acdf7ad784648548203237921f87047, 0xdd06e9c51e6a447baffdac1283319999, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x31d98bc80cf6474c9a7e8fba6cfa5615, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7aac0011a1694f78ba3519a0c908594a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, 'ஞானசௌந்தரி மகன் ராபர்ட்', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x322b5166e2f047bdab1d9f1da4435f83, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x86ed238589d84385b373ccc38a3c6d9e, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 206.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x325e8415cce04c079a59628dae823606, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xcbe00b8459804ee2b4030ab8308d15d0, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x3284625d82b84f968957ddb32b08673c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4891d69fb6264ce4bb997011b7279d7d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x337d495470a945438368f9a0a8a07120, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3fc69d5b763b4c8c84b4bf27596e5ff1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 510.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x33e7de062dcd4ab5a52823fb6ea034d4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1eaa27c630104f22bb74f0d728e66f8e, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0x341a19ecfd134c0cbc5e1e34de8a4733, 0x7acdf7ad784648548203237921f87047, 0xdc5d16bc336c44d2ad7d3a17495a9af3, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x343080ee679c407d92a610121fb9a782, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x0c7726e4affd48b2a5f2cac37717f945, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x34fd95580a0046e688f517701a0edbaf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3b4c9c618e1b418897ee9741c48a72f1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, 'மீனாட்சி சலூன்', 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3557491f65a8443cb450a6500b894867, 0x7acdf7ad784648548203237921f87047, 0x727533c8fcd84232a4dab346d0fe634e, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x35ac817ba60f4a3a9e76cd82139b6ad6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8fa90427198543bfba86918ab2d5db78, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 550.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x3619df608a6e4def89b0f2dde66b2216, 0x7acdf7ad784648548203237921f87047, 0x55961ade2df54ddc820ccb3085e80cc2, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x367d3f27e6e246b3b30e7e7722b6b9af, 0x6adf89f150d14a64b3fdb03acf5da408, 0x3a809eea72b547819e8c4a70a2f3ca62, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2025-06-08', 'RETURN', 1000.00, NULL, 'Marriage', 0, NULL, 0, NULL, '2026-03-03 10:27:57', '2026-03-03 10:27:57'),
(0x383de182b1b04bdbb2e9e1e78d523158, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1f002d74b36546a680894eb084aea8c6, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 200.00, NULL, 'மேரி அப்பாயி', 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x38cd79dc15e4455b985f239243d34582, 0x7f0b50a76d8e467cb7d144f26576da34, 0xee46bce2d3ed423da85babfff450ebe4, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2026-01-13', 'INVEST', 500.00, '2 gram gold ring', 'Notes content of this person', 1, 'தனிப்பட்ட புது விழா', 0, NULL, '2026-03-05 06:31:20', '2026-03-05 06:56:48'),
(0x38e68195f47646d19ece0f4d7b30369a, 0x7acdf7ad784648548203237921f87047, 0x20a122ab0b4f467eb555dbe5ac313e5e, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, 'VADAKANANDAL peruratchi', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x39a45ec1e39141669f944618587f81a2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xeee9351f41c643fea171b5a618fcb4b2, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0x39f9bfece5884cf08b16a9d2f6e660c8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xef6cf08d180d4f3099a60187b3e02d20, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3a78d225137543a6be833f16a838b8b5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x7f559701ad1a455db2e4dbf106538be2, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x3ac73db260c24084ab932a2bf54d3516, 0x7acdf7ad784648548203237921f87047, 0x40aa80344a574a97bf51c39c2dd01ccf, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x3bf88ce79dd14e8c8adaa7fe7948b773, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x51c1e9743dbd4fd0aca3b3b94fe03547, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2026-01-13', 'RETURN', 1000.00, NULL, NULL, 1, 'பட திறப்பு விழா ', 0, NULL, '2026-03-03 11:18:58', '2026-03-03 11:18:58'),
(0x3c151df7f07e41f784c25963c0ec487f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf78e74890535410faca797a05acf3397, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x3c6e194978ce470d969e3e98ee12f3df, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf45edb3f6f0049938f5dc305f3a6b8e5, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1500.00, NULL, 'கிருபா பெரியப்பா', 0, NULL, 0, NULL, '2026-03-06 07:20:44', '2026-03-06 07:20:44'),
(0x3c8506942ab043968dc33802677e0e7a, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x791da09f380e45c0ae6a02b52e7e6cab, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2025-06-10', 'RETURN', 10000.00, '1 கிராம் காசு', NULL, 0, NULL, 0, NULL, '2026-03-03 11:34:12', '2026-03-03 11:34:12'),
(0x3c933d1d0160445ab4a430539d308ff7, 0x5205fe0a7bea4952830f1027543245ee, 0xa25e902ff308440289b6d071d37c7e7c, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-06-10', 'RETURN', 1000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x3ca847d0a9b944aeb431efd7ffecc15f, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x090ced20469d4c09afe0760eb9db32bd, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x3ca97eb02ff44bfeb52f1f09d6b505dd, 0x7acdf7ad784648548203237921f87047, 0x5df6bc0643b3470d8eafe7fe9594e8de, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x3d8994a669a74052ba8b833fb2cf9a93, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe179df0e9e474b3e91b8bf233ff5df25, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3e5a4f20492f4cc8b3d4e4a7195e5e8f, 0x7acdf7ad784648548203237921f87047, 0x2a204e00763047fb85d5ffde351a9808, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x3ee5a6e00999406a91be7a9bebf3ea68, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8e8523d38dbd4c34b3ea46487956cf75, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x3ef9f8d2836a432fba1f31c82e025537, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xb7f0f3e488a1448e83b272ececc049a8, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x3f8cba4d30d24b31bb59b85e612fd120, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xad3ea510491b4cfda93f17824ad501b5, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x3fc2519957ac47c6bf3c502677f5c45c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x87faa869504c4330b6979ec1627130bf, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x3ff626913e1644c8a4143c61aa1ecb88, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6b5d677ceb2341b381c0474b08fd71fa, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x3ffea1cea97749979ffe66fc7b70a3de, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xb973d0b4f46642cf84a5f4d97529334b, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x4000f741188a4a60a2fa926656564df0, 0x7acdf7ad784648548203237921f87047, 0x6bc348903e1a4edf9b7fb12eb368c5e2, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x404273187cd047d1817ee4e35c0e6424, 0x7acdf7ad784648548203237921f87047, 0x439b8c2a77074dd686542fd62884d90e, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x404dd87c6d1d433c888e61a862aa1140, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd4b022a19b96408889e5e6f6192ee73d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x404e6c5f99ef4fe19001a9c758d6114c, 0x7acdf7ad784648548203237921f87047, 0x109986633860445db4ed7aeb5ebf4073, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x41f0d8c934ab40668c3c5dc679936509, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xc05666890bbd4e7dbbe6b3b69b24de1b, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x4352f6dac8bf4a40bf8a0c9eee5397e1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x08d01a5bdf0c42ccb65d625de7387e46, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 400.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x436f543d1dfe4b22ba5d5973b687874c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xb3da878153944dc8a9f48d027911ee3d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, 'Ganesh Maligai', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x43a6181ab6c94c4983c2d70d822279aa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6a79a53995464f8ebf877ec454b1fde4, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x43bfd187bed7419a8ad42d33428cd6d5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x86e719abe0e7492c9c97770c4e7f9340, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x44c9b3d960f748d2b9865b438cafce10, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf3e7bd5e24fa42429b3f25e888286c20, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x4510b51c90644cd18ab352f66e0a46d8, 0x7acdf7ad784648548203237921f87047, 0x5425d8c0918244599732515d6ddffacc, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x45533fbe808f4e8b88f85b9ca348341d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x481276e4d5bb49418f2bfbdc19cba852, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x458c489d3c4746b3b41f7630dfac48a9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd69199a4124c4420909808eee630655f, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x461c09f9410a4fc98ca9f4c7787ec4a2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x762dff122d784261b3a28211a38dde84, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x469a23a9296c4107a59924a7a56e0abc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xbde7d852146f45b5bd2b9766d1f4118f, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x469bd892392c41508715479faf86fe57, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8f59814546724d048b48eba04681344f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x46b72969094a48f1bfa2fdc95e564fff, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x24f6b6d8d11a4b50983ec95b3e42d0e9, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x46d5576534f24fe19552b237250f7fba, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa90235a01fa64b2688684f096ac367d9, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x4821e5c8594848619aae4fad4f3da921, 0x5205fe0a7bea4952830f1027543245ee, 0x0ad20d69b5c441d89603614b0c6ce7f2, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-05-16', 'RETURN', 2000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x48cd8831bd9847fe9c62750b85b871d4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4389281018ca42f2aa0af3d9f3d44abb, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x4914d1f70b6c4036b31c78d8e1f75756, 0x7acdf7ad784648548203237921f87047, 0x113bb0fd536b4e17a4835a991c6b171a, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x49d2ac3cdffb45378d2d65185f6d86e3, 0x7acdf7ad784648548203237921f87047, 0xdd4cc4c0a4734e2b8702443c639dab7b, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x49e44cd6d233433197a75237ea283661, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xd4c1353da9274bc99e74e0265cbd64d6, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x49f841f7cbd64ad4a5be4138f9e77a48, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x148c2ce55c6049e49adeab1d47267f2b, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x4a26b8c18c9a47d3a0e83361a88a52f4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5743161da8524f1587f256bc2625d95f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 5001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x4c69fa7377404607b8e1e65ee7096911, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf41fa79f2e834918bf443af95f2bb4f2, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 250.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19');
INSERT INTO `transactions` (`id`, `user_id`, `person_id`, `transaction_function_id`, `transaction_function_name`, `transaction_date`, `type`, `amount`, `item_name`, `notes`, `is_custom`, `custom_function`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x4caff790d05d4dbfb12ec130046a86c9, 0x7acdf7ad784648548203237921f87047, 0xd6adc52815e14a5ba1bf7b4c6a871531, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x4d081274cdb844eb92b1399dc8607a0f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xdd4c52be6dc84a58b887a13d65d6c127, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 101.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x4d4e6bbf95a04d3984d054838e9ef4af, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5f215146ae2e4e2bbd2c539f6f2ab72c, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, 'Ilamathi Magan ', 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x4ddb9ae5077a46a5b7efbf092c5edb74, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x052c1556722746a6a7e587d763ee6431, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x4e8175095a3f45b587574ebf6086b643, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2f0c9a19fb3446a5ab89d319dacadbf6, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 101.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x4eef2969f8be4d948c290e938908dbc9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xcab2650d21f5406f84142a3085f23456, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x4f1ebcfac3634a6a8cdb71a83de38d24, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa89044adc6034c89a3d27251d524e95e, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x4f5d308f706e4d5880f2e0dbc26541c6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3ad5090402eb4ed79028a8f0d3fb9101, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x4f695ea55a6c460583aeaf601cb326f4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x29bef000c8e6496fa6dc84c08c495e6d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x506ae3b87a47456690fe83583264d912, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8ad4623b91764ec2acc2ecd0b45a44b5, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x507c073bb5384423bc0e491e6adcc329, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3821d3a35ef44900912ba9c8df4a292c, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x50a95d024d61412f87f3aabb4ababfbd, 0x7acdf7ad784648548203237921f87047, 0x123f15e2dbb44ae28f7b9f4a535bd4e6, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x50f09cd5d8ba4eab82963288f72be24b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xdcf3092c52ad49c7a2631283a8df3a59, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x51e9bb4bc623490a89cbe0c2d4b6b4d4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfb7539f874654a65bf660cd5fa2b3520, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x52d0e12ff08a46e2ba7f32d4a5ee589c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1a2331188c2d4e69a36a0ab60fbe703a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x52df853fae784605b4e58093fba0ffef, 0x7acdf7ad784648548203237921f87047, 0xa70daf750bcf40c7a947714a16d9b5e5, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x5320874c836940a2bf6697dca2d2c644, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfdbb0443d29e4a539a443b3392dfdf8a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, 'தாய்மாமன்', 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x534be79466ce4f199ae89a3c527a895d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8916a617781346b6a6a3cc5250624c36, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x5355ddf8947c46c8b31b2f5a2c5ee624, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x669904ac6d534498a9be39641b8e8eb5, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x5373ec7154b04f3aa0d4066d9ec42ec4, 0x7acdf7ad784648548203237921f87047, 0x99034fdb89c14ea5a5ab7654d8730f13, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x53e89464813a43468371d833cb9a0379, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9742372e7970436ba5fa4b927b6fdcde, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x54222c3c67d0452eb377abb89f768633, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x3137f36515c14f609841ac048cb3a4ba, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, 'ஜிம்பா மகன்', 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x5480b8206b6f4bef928330ec2048343a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xeeefade3940b46d584e22ca9b3032cd8, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x54b43e9820ae4faa8e93b3c194f9783f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xca093aaa52ca436294d4cd4826ccbbea, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x54e2484eca26474bb072b35cd9346dfe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x599279a9703c4dcd9d3ca995e5952034, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x556e7f13e9454327924a8e4f0e85dc64, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf5cae7a732a44dcd9dda7de3c5041c1d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x55933caec6e840d1aee158e0d0667b0c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfbeacdf7c7d645e98d7dca54419feb55, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, 'Mary Appaie', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x55a428235bec4b2ea28e02339e351342, 0x7acdf7ad784648548203237921f87047, 0x324e2dcfd8f6441ca7450fbd0d6097cc, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x562040705c454a7ea4d65f968dd75578, 0x7acdf7ad784648548203237921f87047, 0x25191634232c4fddacd415407b22b3f7, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x5698d004b07642b19335fb0cc1f73520, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9794174456db40119c740a913d42b543, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0x577727f2cf964a67bbe0c90d32eac875, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x67ab54dc5c764636ad98c1a33c72cbfe, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x578b9e5b8f29400aa0d63b8352d3976c, 0x7acdf7ad784648548203237921f87047, 0xbf629de0f11d448aa62cb8380deb3336, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x581aab1c2a6b4570be3e988f07c87a22, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x06f1dfe6254b4bb2975f144a2b2dbac8, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x5835bf4b43294b92a4d640b087b79829, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x8865d7004f5e4ce9bbb3e15066d523d0, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x58bfdcfe7f954122aa9250aae30f7c5e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9f78577157ed4b70b10b6940b6b2cc63, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, 'அலெக்ஸ் வீடு', 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x5922c33f3be94877b5ca2e119040bb9d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x7758297c4e1b4fd795d571a5148d2d88, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x598571f5e074419186240f02502a587e, 0x7acdf7ad784648548203237921f87047, 0x2f1ae7389f4d4455b423dcdd7b77109f, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x59aa98e9ffe1471f855a91edf0f1bc6d, 0x7acdf7ad784648548203237921f87047, 0x1ca6072baa8f48008cae86cb1e3bcb58, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x59c55d0123fe4ec4b7d2ecad996da8fb, 0x7acdf7ad784648548203237921f87047, 0xf0fc1a79a5fe46dc94585e8aed4e428d, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x5a0dc22a5b1c43c49595bff396ac7dc8, 0x7acdf7ad784648548203237921f87047, 0xfc48d924496246d1a354d1ff5f7f5020, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x5a4f532172584229ac7cf561fa858645, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x2400b63bcb65453f8ca41a76e8160acc, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2025-03-02', 'RETURN', 15000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-03 11:24:44', '2026-03-03 11:24:44'),
(0x5b140b1b31874fae85092292e1d346ef, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x5ba82776ff984169940f6440be1a4c3c, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x5b60d7ce4b184832a436d3ab57174dcb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x55e689e2d71a40aa930e235b8abe20ec, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x5bb9dbbfc70c4462bbfac365fcae9ec1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xbad2efbe3dbf4062aaa363bbde7142ef, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x5c72713ffd294d5c8906382a772d8032, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x0c118ed7af604f4ca01fa7e2e5757cb7, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x5c99ef1432ce472abdea732b35e29ee8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe7be83537dfb498c821891d0b9b2f605, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 205.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x5cbd4dc90e894b618daf67de011308a8, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x84974993892d411b86db1a30e9023c19, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x5ce23447292545a8afd04a6c54ad1b73, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x76339f172f1746d6b2c7b660bad25e91, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x5d047c38eda34721b52f76b880abcd33, 0x7acdf7ad784648548203237921f87047, 0x82c5a8212f33470ba6abe3bed16f5417, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x5d22cc70cdce41d88e83f0fca3c59581, 0x7acdf7ad784648548203237921f87047, 0x4f9dea7638444e57a61bc78aecaa0f6f, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x5d4f63414dbd472b9b9374f5f1e31ffb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa6ace38eb6f04a31a576a3c37e27ef0d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x5d706f7d65534349bfed56fe0daa7d92, 0x7acdf7ad784648548203237921f87047, 0xc737797bf04f4b29b6bf199fa6dc2299, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x5e5e027b7cb946dca36eeceb315d048d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc0e0d21cd27941f59208c77106b3fc0b, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x5f0f8c7b09b148f79623970865409c33, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8e81912c79ff4903a8a572c858218d1d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x5f5b6d17ed5b461ba21921323bc8cadc, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x64dbe1bc28a644ce90ae49bde10d73b9, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x5f7ce302084a459fa3a08d77b3caccfa, 0x5205fe0a7bea4952830f1027543245ee, 0xe4b37e8e51d54e29813341cf1f59d694, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2017-03-31', 'RETURN', 500.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x5f873c2c712f4e1ab99a6816e0e1b418, 0x7acdf7ad784648548203237921f87047, 0xf9e8f36abd684114bdf66781d4664dee, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x5fe9020660f846cda94b1c1e3248ace5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x438c899e2abe49a581015e2546ac8d08, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x5ff3d7ba5a5d48cbb7a391662b664e5a, 0x3ff8de4622804be0aa4e405d8c404df3, 0x9424c573b47c4684933247d063e7ea35, 0xe1580ee83e624845b58fbcaa45198e2d, 'குழந்தைசாமி இறப்பு', '2026-02-19', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:08:59', '2026-03-06 14:08:59'),
(0x5ffcf7e9c6724cbab88031e2d2af6beb, 0x5205fe0a7bea4952830f1027543245ee, 0x3f619871630a4fac9939bc222a68f07c, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2026-02-19', 'RETURN', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x6150b14d4ebd48c29e66d9182a3a9a04, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x622587bd00f64cb99406dca8de665e2a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 605.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x6165392e0c08457eab2cdb7aa971ef5c, 0x7acdf7ad784648548203237921f87047, 0x98f614f887f5460da4621ff6266f9757, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, 'varisai padaiyatchi veedu', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x625debb4d4dd485db5f9925687c8f4c1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xb45a2b0e19424de79612a794bf818332, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x625e0cf5836b4598ad33555b3953c5b6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3be7e6c0a5a1469ba7deb11a05ecf648, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x62793ae0ec1348aeafc119fa3081ea77, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2751de5462c448e691915a631e1e8633, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 101.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x6382faa35e83414ea162856e8cb4ab48, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8864d7144fac48e49f31ccd36bcfb464, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x639909c3d64d4e49a2bcd57fa9728bea, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x1e8ae0de0c454f96b45aa95d2be5547d, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 15001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x63a40553daf346ee925c1192fbe45258, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xed56ece188f14dadb81b6e79bdfc20a6, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x642358b52a5f42828d82a7b4c50c3122, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x15d8b7bc3a534d57a6a4e3c7fadbcf02, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x647c91f694f54725b3a1ad2ad2a4dace, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf3c18bb59bbe402793e16e3dabd0e7eb, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x64ab4d3565014a7e8454c87f33af01bd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7439207db1594e6d84296cd14f347165, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1002.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x64dfc296c6ba418188730967c1020790, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8e2a38d45e844507b3f4dc98fd20f34b, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x65661da91ed94ac0806eb924ce6fe91c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x86eda4ae2a71454ba868b4bb6028be1a, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, 'பருத்தி வியாபாரம்', 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x6589554bd6994700b5cf28ead8c64540, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe6cb9ae0260d4a1bb19ae7dfa7cffd1e, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x659b1a5d9d5a4cebba73478d8fef02a2, 0x7acdf7ad784648548203237921f87047, 0x8c8e7cc1a59c47c29fab93866bc62871, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x65a7249abef44e1b9c506ac3938a9421, 0x5205fe0a7bea4952830f1027543245ee, 0xd66ec0310dfd44ada609bb54d2e52b73, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2017-02-20', 'RETURN', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x6654f81e208d4361b76bb7a29ea3ac0f, 0x7acdf7ad784648548203237921f87047, 0xab6f4004f0444ef9add4039f2716536a, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, 'kamaraj- nagar', 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x6775e1cee5564b458bf5ffcac72ca4da, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc5ac0d4f6be9448e897d55f11af105f7, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x67a3e106821e45d19d4847a4f0382121, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6b9782e19bcd4b04aa4bf60f3aeec459, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x67bae2d0204c4a2d8609e688337f44cc, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x889e5c28d2034e109ef6b14945648087, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x681ce8405d04453b86f3dd8a2045641a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2978e2ea2f20486d8086623aca7ed27e, 0x348e71d8b978402b979b023cd01348de, 'புதுமனை புகுவிழா', '2025-12-03', 'RETURN', 505.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-03 09:57:34', '2026-03-03 09:57:34'),
(0x68a518cc2a4f402590efa394cf6346a3, 0x7acdf7ad784648548203237921f87047, 0x8493c70dc78e4d47b7f65cdb6c910416, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x69cae54155344926bf7b8b4fc03a7d80, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x44d76b2af8d3447c9001e4193d8edb0f, 0x2facb37d4a0b457c83fe5dad25a69991, 'இல்ல புதுமனை புகுவிழா', '2026-01-26', 'RETURN', 5000.00, NULL, 'புதுமனை புகுவிழா', 0, NULL, 0, NULL, '2026-03-03 11:30:24', '2026-03-03 11:30:24'),
(0x69e149cfd3814150a136520cfc539c78, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x35a76ba120cb4555a78be5772b798cfb, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x6a9e754a379f4edabf2aa17ec7fcb24e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6b256facfd3e4f78a077b0d08e5e9b72, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x6bacbd369b874084addc750e115fc151, 0x7acdf7ad784648548203237921f87047, 0x68cb0a674fa3464ea7fa64cced4c67b6, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x6be3bd9e5a5a4f778683c7e1235bb76e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfa906101ee8646718292c0acf6d19999, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x6c4c7bcb664646cdb23a07ac84e8f2e4, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x3c49d5e419b741089a1e40b55e3a2f0c, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x6c871a3e3e2d40e39b80df65c3f7a43d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xaf92cd9b97a44cd09f9fd0448e344198, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x6cbbbe15cf26477db1303f388f26d912, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe9730c873f9a4ca8b14500998f83ea44, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x6d47ff9b7f1e4db2999c57b852f1f431, 0x7acdf7ad784648548203237921f87047, 0x54a5c324399f4629bbf6b06c71e00ef0, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, 'scd transport', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x6d8c4a46a3a948d3b3ddfe91a98c93d6, 0x7acdf7ad784648548203237921f87047, 0xa29edc5f0fa04db3b9eec8e0b605af9a, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x6ddd0b7aa9ae40308d72c88b6dc75cfa, 0x7acdf7ad784648548203237921f87047, 0xfc142199ac0449aa85da75dbd027dccd, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x6e013210e7f7454ea57b11ae7555c003, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf3c18bb59bbe402793e16e3dabd0e7eb, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x6e50afc234bd4704b2b90e17cafffa38, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8c13de1618f44fef9af1ffaf3bee7bf3, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 250.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x6ea83a2e180a453694ec36d96eb8be15, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x088c8c02e241429f812e7cdd654a7d15, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x6f4d16015ed2439c9156ceb6815e46f8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x09cccb76e7a14f98857d0dc0eaf224ed, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 400.00, NULL, 'Water Cane', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x6fa3e3d5c18142d090106cba52d83e65, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x23be8116e34f4d21883fdd2467fae682, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x70113fbfad9d437893e913f7b26031e3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfdd44dcff111434bbe6025bbf613bd8c, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x7047fb9e7f954bd4bf4593f06683aced, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xd3510476e41e41d0bec1079286c9d9cc, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2000.00, NULL, 'V M S sound service', 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x705e5d57557a44509cf5c23c7db1465c, 0x7acdf7ad784648548203237921f87047, 0x5c31c67749cf440db5dc81d6b6831f26, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x70f872be356842d9b98c92ca0064c5fe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1b92b676dbf3484ca64e72d77cef4a81, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x7135e3085be04af0881c7bc3bdbdd655, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x18bddac0b8894a89bfe40b8900d3500e, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2026-02-20', 'RETURN', 500.00, NULL, 'Total Amount 1500-1000=500', 0, NULL, 0, NULL, '2026-03-03 11:36:10', '2026-03-03 11:36:10'),
(0x714441a162984bf5a50ae883e6f336f5, 0x7acdf7ad784648548203237921f87047, 0x52bfe39df1de4512a3d22e148cbe4445, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, 'pillangulathan veedu', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7170be798a634ac5a3fe78b9e70da5c4, 0x5205fe0a7bea4952830f1027543245ee, 0x947323d9efb54daab65e5857277c360e, 0xe6040956d27f40329be4c4808dcf7acc, 'இல்ல பூப்புனித நீராட்டு விழா', '2018-06-06', 'RETURN', 2000.00, 'POT 2 KG 5 PLATES', NULL, 0, NULL, 0, NULL, '2026-03-06 14:42:37', '2026-03-06 14:42:37'),
(0x71a80ab5fd874bb883d0ab04099e39b1, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xe34b6a65917f4e7eb2b08a3ab456b128, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x71b26e18e4884ce78a6e92a1a71ff1cb, 0x7acdf7ad784648548203237921f87047, 0x039c02e6362d4366aa6be2bdaa0dd818, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x71ce211652124a6a866f01ca9f80290e, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xd158bb2097394f4eb09eb999adff0368, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x72657913539e4c6a9d58b4d8b31a3516, 0x5205fe0a7bea4952830f1027543245ee, 0x29ede2a3e5664d0eadb0cf6eda4884fb, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2018-08-31', 'RETURN', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0x7357907e18d244ffbb7f752b3e5c25e4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8bb33059145c42d7baabf0ebc151658a, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2024-09-04', 'RETURN', 1001.00, NULL, 'துர்கா கல்யாணம்', 0, NULL, 0, NULL, '2026-03-03 09:41:47', '2026-03-03 09:42:30'),
(0x741a48dbab0a43ada3f7f2cc0fbb1431, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4245dd3985fd40e39cf8fe65e5ead06b, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x74285df6d8f44a8f8f86afabd36b49ba, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2b28f02f6840445d8cf3b9078eadb169, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x7576666b191f4f8695f678086abc95af, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc66c33d422464d6bacadc688a51b0e2a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x7635e47d9e274ee29a5fb26b93ca8e64, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x0a73e1aea4fb4b9eb53e61473a0fa096, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x766c7fa24f054a75aca51d70ca384b8a, 0x7acdf7ad784648548203237921f87047, 0x6e25e054e94f4c86be614f979a35311d, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7670057802cf46eda0b592b504be398c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x9abbf2194e984e07b6b980f053ccaae5, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x7701bd8257f049c98329fcfa845f60b7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa12683e22c6b4d3b8fcda56b6ec1ab6c, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2024-09-10', 'RETURN', 1001.00, NULL, 'காது குத்து', 0, NULL, 0, NULL, '2026-03-03 09:47:22', '2026-03-03 09:47:22'),
(0x773e572f6cdd43788f3838f05f9e57d8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x02acd85d913e4d27bf3c8c12ece0b0f5, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x7765f54bb4cb41ae8a6c4e3fdfb92e18, 0x7acdf7ad784648548203237921f87047, 0xe633fcb0d49b4900937e7c9d7d117752, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x77bd9d11aac34ca1bdb9813f07b2c756, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x6f4677a312f640088c3a9c2e9e82ca34, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x7831c76dfc954b16a434a280611b2170, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9c01859112a44e73926fff2e918d9157, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x78891b05829c4da99fd38507173f871a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x83c830e1bc454c35b35070c3e1c0bc85, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 601.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x78c4be96fae742dc9363c5fb5850bac9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2f52831ae4684f2d98dbbab1fd53c251, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x792dcb4968874304bbcb1fb21e0e0ed6, 0x7acdf7ad784648548203237921f87047, 0x489f3b400cd941309316a33628f1af21, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x7a0a390b7a35456ba49bb94c62f6709a, 0x5205fe0a7bea4952830f1027543245ee, 0x3bd903dd50324f2bb775e7627fb0323d, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-05-31', 'RETURN', 2000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x7b67f638387942bd937cd35f9fcbf389, 0x7acdf7ad784648548203237921f87047, 0xf557d5893dcf4066a674ac1ca3c3e0d9, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, 'alathuraan veedu', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7bd0819b025843cbbc52fda195e200c4, 0x7acdf7ad784648548203237921f87047, 0x6d2f9c621ad54f5eb823b6b3e38a070f, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7c09fa2d9df34bddad6d29af8595b0ba, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x55b7a6273d9d4fc4987f5deca5dee4a8, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x7c8d0a9769ce489a92041ea8aa797751, 0x7acdf7ad784648548203237921f87047, 0x82c7179f1c854091af0427aad4b810c2, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x7ca4d9d8bb1045138e22e074e1658f72, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7439207db1594e6d84296cd14f347165, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x7cce05dd7080410391dfba13c86e3fc1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6906a5760b5a47a6a54a4fd184a20de6, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 600.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x7ce1245c303043da958492f3e1bea203, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5adf6e03eb2e4bbb8a7bd26d3456aca5, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x7e32aee65a524da8a55e5b3a4e244443, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xad02fc29d29d475a841e49922605b53d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 210.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x7ecfbac9e68941b7a8298b689d8ac11c, 0x7acdf7ad784648548203237921f87047, 0x137ba2250ff04ff5b21d4c25771e3fc4, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x7f0bf935756e4506a6019b9e6f9eec27, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf03e68f10035471cb32e8d5b71055dfd, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x7f45af000a754b2c8e2bbb2d7fdef6dd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x23c5e3cfe52e42a590241e2086169990, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'சுஷ்மி அண்ணன்', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x7f5e577b3f8944bf9c55a11f7bcc1ce5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xae1495bc707d4b219364d85425b3454f, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 308.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x7f9a1889a9ee41eca4b00e188f6b71db, 0x5205fe0a7bea4952830f1027543245ee, 0xf13d4999a6a749d9adb6da0cab8dcaeb, 0xe6040956d27f40329be4c4808dcf7acc, 'இல்ல பூப்புனித நீராட்டு விழா', '2019-05-05', 'RETURN', 5000.00, '2 GRM RING', NULL, 0, NULL, 0, NULL, '2026-03-06 14:42:37', '2026-03-06 14:42:37'),
(0x811467cc1d9e4115a4c5ed43429cb2aa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa1c2e8a97fa240f6b72b04abbec4d2f1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 101.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8141e6bd830d4514aebb394c9dd46a80, 0x7acdf7ad784648548203237921f87047, 0xc32664ea3c334ed8b4da3ade9c7cf773, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x815910e3e5864330a9fe0223c4c44df8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfe18443c70ba4101b9d7b736bbb506d4, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x821c2efeecad4050bb52d6f3195293b2, 0x5205fe0a7bea4952830f1027543245ee, 0x8f66be6cb5e6418f9dc461e3e1f8cee6, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2019-02-20', 'RETURN', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x829fe4bb307f4333aee8f62d8525e38c, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0xbf81670c423f4e47bec83c5824a55cc9, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2026-01-04', 'RETURN', 1001.00, NULL, 'புது மொய் - வசந்த விழா', 1, 'வசந்த விழா', 0, NULL, '2026-03-03 10:57:15', '2026-03-03 10:57:15'),
(0x82cbb41393fc451bb2ebd846db268f5a, 0x5205fe0a7bea4952830f1027543245ee, 0xc21d8b60e35d49e0bb49729819a81278, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2017-02-26', 'RETURN', 3000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x837182fa54a5468580e997ffb19e179b, 0x7acdf7ad784648548203237921f87047, 0x9872a4bc68544419978d1b6409101917, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x8379a88b9ee4405a9164f735a0c27bc7, 0x7acdf7ad784648548203237921f87047, 0x590bc6a9f00748798363094e716331d5, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x83b9b88e0cb749869f50c9eecf9879ab, 0x7acdf7ad784648548203237921f87047, 0x57ad0094114743b69e5e26229d10c0ec, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 8000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x83ca774b2b114066862ff16d375ad33e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe047d1aba7df412381d34fb62daa920e, 0x622bedd241bb4aacaf048fca20eaa514, 'முதல் திருவிருந்து ஏற்பு விழா', '2025-05-18', 'RETURN', 500.00, NULL, 'ஜான்சி புது நன்மை', 0, NULL, 0, NULL, '2026-03-03 09:52:30', '2026-03-03 09:52:30'),
(0x83dddadb1eb14b14bae0d7efc4fee8d3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x25a45298b71f489b83ad4bc1136396d0, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x83eed0ea249c4d41b6fc06d9982231f7, 0x7acdf7ad784648548203237921f87047, 0xa3af2636f5264b48a780ed487fcd71ee, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x84b9206d44fe4f5c9bfffe4a28b35b46, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x309f4a2e80ed469ca36dc07254750a04, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x854b4f1ac02b4e86a7b8c0d558a23669, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc36fe52d8eca4efd9ed3390505656dce, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 100.00, NULL, 'Water Bottle Company', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x85903bab582c407f850d8938f7647ab9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xde016fa3c85c492a9dad300be8fa6262, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x859ad2d2f8fe432fa18f82b42dc75e15, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xde72935fa57e4c75882729d663c05269, 0x622bedd241bb4aacaf048fca20eaa514, 'முதல் திருவிருந்து ஏற்பு விழா', '2024-09-10', 'RETURN', 1501.00, NULL, 'புது நன்மை', 0, NULL, 0, NULL, '2026-03-03 09:45:35', '2026-03-03 09:45:35'),
(0x859e7818ca994e0c804f6938b0256f52, 0x7acdf7ad784648548203237921f87047, 0xce99113fba1449aa8220415588463203, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x85ecb2f7ff2c4100a6e99453c7bd9ae1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa13fb08abdd14863af7792ecc1979931, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x862acee5c8834138ab7dc75ebc58619d, 0x7acdf7ad784648548203237921f87047, 0xf1fef07f85ee4773969b5fb0a1a1d96d, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x868ec78707fe4bf3a684e06a686c872a, 0x7acdf7ad784648548203237921f87047, 0x7c0b4513a4ab4543bcce5cc71e482895, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x8720aa6567f14fbca3077814b6d7e19a, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xed7ed28e93ee495990858e31233dc44e, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 600.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x873c8170d8ba46ff972dcbe569dffd88, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xb166045e55fd4e42a9db9da633bb740d, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 700.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x87cb87656f1e422288a12d5f4ea64ae2, 0x7acdf7ad784648548203237921f87047, 0x89d439da0e304b67a3f5a6a6315abc8c, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 210.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x884c1be29fd44121bde859f121aae6fe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1a2331188c2d4e69a36a0ab60fbe703a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x889e593213104a748704ca6643957c9a, 0x7acdf7ad784648548203237921f87047, 0x68389d6ac7e94444ab9865604ca6d056, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x88d721c821a5492680c3ed11da582ef2, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x2f61a47166bf4483974c43c9f8502ef7, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0x88fbd5ae53ae4b4ebbfc16852c4adafe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x097875e4f469430c9be469dd8a4e7cb0, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x89814076226e445eb2ad365cd0275b61, 0x7acdf7ad784648548203237921f87047, 0x8561448686df436e92e2590f416f17db, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x898ab6dfc3b645618ec5a99e7a3916cf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8a08c325ae3047b09c3396473efb3b6d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x89b55794920b47a7a83d516099b927ea, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa446228238cc4da3b5786b77d802e528, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x89c6246f097b4681b40ad416f40b7bf0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf53bae4faa6f4c67b5a28a733b5daaf5, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x8a4587eab02e48b8952626b648d93a08, 0x7acdf7ad784648548203237921f87047, 0x9acc1abc29f6404dac0b18d1adcd6cf4, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x8ac47db0dd7b43acb52b8f97322c2d7d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xabc64f2a4f5f405abd8d338d77427f12, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x8af587f538224fb281897cc12220e0ef, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xab5f0245f67448818a94131842557a71, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x8b1368ae4beb49d99d8c9ec69abaeadf, 0x7acdf7ad784648548203237921f87047, 0x85f49d7ca673437dbcdd5f019ae52894, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x8b3d382ed1cc40a9b75bc351fa565451, 0x7acdf7ad784648548203237921f87047, 0x9820ab899c6b42a692064af35183975e, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 600.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x8b7cb86753164bc1abe37a8a9cf6e660, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x66b084ebfde5466e8c684226f286138a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'Kiruba Athai', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x8b967c9fc6b8412587e1fd6057262e7b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe679a5bdf2fa45e1a6ca8736c745cfc7, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 600.00, NULL, 'தாரணி ஆட்டோ', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x8c5295dd6cbe4aa1a29ad826dbb832d7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfbe6fa58091842d3aa99fe1204e90583, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 3000.00, NULL, 'சித்தப்பா', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x8c9a08e23a774085a1d69565cd2b66a4, 0x7acdf7ad784648548203237921f87047, 0xe75f20522c584b31b76c6a2a34fde352, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x8d46d1584d32461e95676beabbac66c5, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x95941a86bcad4546b8306db6a1620fdc, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0x8d8d09b676e54abc8bf39d26b848d1ba, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x34fe1b66d5f04587855c718576eb0026, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28');
INSERT INTO `transactions` (`id`, `user_id`, `person_id`, `transaction_function_id`, `transaction_function_name`, `transaction_date`, `type`, `amount`, `item_name`, `notes`, `is_custom`, `custom_function`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x8e09463f17b3430f845892143fbf0569, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6bcf433db8f34b918b6177e150903d92, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x8f4ea1cd05f4404dbb4f3773abb197b5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8110195ea9ee489391c55e595eb7422b, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x8f7ea0aaad9c46988ca81be0b366f921, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x96a39db4ee2f40e48ed0b75106378aff, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0x8f8308a3f37a42fb86982e206e80d64a, 0x7acdf7ad784648548203237921f87047, 0x400a65c29c5d442280ff9d4e345e7f98, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x8fb9e8c9c525484393ad5b9b9a49b3de, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x30c21089c62241b48d488ecd11d8c5e9, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2024-05-08', 'RETURN', 500.00, NULL, 'கவின் ஜெனி காதுகுத்து', 0, NULL, 0, NULL, '2026-03-03 07:22:54', '2026-03-03 07:22:54'),
(0x9004928659cb457882e1a026ee1e28d6, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xdc90a31aaeb3436c957207a7b315887c, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x901bff80c4cf48eab488548cef9ad8a5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x581eebdd9ce14bf6b129b9b799a0ad18, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x90315c04293042a5b0540420117be720, 0x7acdf7ad784648548203237921f87047, 0x7863de9eef824ce888b767d4e73f8d1d, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0x918a31681b5a412eac884ebc07ec9d29, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfbe387fe79044778a227b8b18de0dc97, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 601.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x919d60e211d44204b22c27c41adf0d32, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xdb3477f5492e475ab6ca63ab658eec0f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x91a4ebcf490b4743b3a16f3a5e9bea26, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x54a879ede4e14ce9955ffcd2f2f31419, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x920863fe76404aa4a9219f801c9ad801, 0x7acdf7ad784648548203237921f87047, 0x9eeb5a0fffcf484a838998a7801cc7b0, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, 'ex. councillor', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9313121e06f1452ab9f17773d288fe6c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd7eba0f3e230484fa56fba23114a146f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x936386afe7304ce9b365b72be6748779, 0xada992157aed4af595ca9b6b512f3dd6, 0x0f0e8166dab94d119652378b06ff1bbc, 0x176e851a204b47f7a8f5f855a17e161b, 'கிடா வெட்டு விழா', '2025-10-16', 'RETURN', 500.00, NULL, '2nd', 0, NULL, 0, NULL, '2026-03-03 10:50:35', '2026-03-03 10:50:35'),
(0x93707bf15254495a8f9fab7de7600aab, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x0493da6dfdcf44f3a97e975961164400, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x93a89cfd84974126ab6453e8eb3cd287, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa314206e7f664b95a12532828c92e20b, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x93fd9d14dd744b9fa1d3ab5527a6d15a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x576c17ed264e496db1a3c334094b7f9c, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x940ff2bc2a2349f6b14738cd82ccbf2b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf35f5d90890f4bc1ae151cdbe9963736, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0x9533b44f6c394c39b52fbbb6a2b04e88, 0x5205fe0a7bea4952830f1027543245ee, 0xd66ec0310dfd44ada609bb54d2e52b73, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2017-02-20', 'RETURN', 500.00, NULL, 'KEERTHI MARRIAGE', 0, NULL, 0, NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0x95c06dd5bfdc487dad781812b9bc39a1, 0xada992157aed4af595ca9b6b512f3dd6, 0x0f0e8166dab94d119652378b06ff1bbc, 0x176e851a204b47f7a8f5f855a17e161b, 'கிடா வெட்டு விழா', '2024-12-12', 'RETURN', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-03 10:49:04', '2026-03-03 10:49:04'),
(0x9751d4a8c9c64d7ab82bf5f54a00c823, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xeeefade3940b46d584e22ca9b3032cd8, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x97d4c77d37f7472a8c7988312f264b0a, 0x7acdf7ad784648548203237921f87047, 0x32b4a2de16ad4ad9a59869df1c69cbb2, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x9806a23d81ed4c94afa4960e672dc885, 0x6adf89f150d14a64b3fdb03acf5da408, 0xe17940c441234d579d44e4db2362fe1f, 0x348e71d8b978402b979b023cd01348de, 'புதுமனை புகுவிழா', '2025-01-27', 'RETURN', 200.00, NULL, 'New Home', 0, NULL, 0, NULL, '2026-03-03 10:14:04', '2026-03-03 10:14:04'),
(0x9808d20a2a5843c6968a2f6b83e70e84, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0xf33cc0d770694bfa85b591ac71551c3b, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2026-02-22', 'RETURN', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-03 11:25:26', '2026-03-03 11:25:26'),
(0x993a52212d1345338c35ad6855078f8e, 0x7acdf7ad784648548203237921f87047, 0x69bab42b0349414a804649ffd7ed4ec2, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x998334c72b3e40c2b8d506063bc577f5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6bb89c8708324b56b7d19f73d0189a0f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 5000.00, NULL, 'கிளாரா மகள்', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x99987d8b93774142b979da652cf6c547, 0x7acdf7ad784648548203237921f87047, 0xe8e4b4bb327f465d9fad912e4b67129a, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0x99f9cfa93669474c9ff802184e14703e, 0x7acdf7ad784648548203237921f87047, 0x7f2ffbb135214c1684a37046ab934a9f, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9a22ba44cb994846bee6d797282f8b6c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x42ab869f8f0b4d61b2f60a06c4b77b85, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x9a8b1279692b4bae8d12287ddcffde7d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x01fd01ded5224aecb10e45e25e279570, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0x9a9e84f63a8f4023b5644974a30d98c4, 0x5205fe0a7bea4952830f1027543245ee, 0xf4727ca3a5014bd586f50f4ca99a7f05, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-05-31', 'RETURN', 2000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x9ac68e547d144fa19787006a66f9707e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x00812c6874cf48d3a9e46f3ab0a54384, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-04 15:08:43', '2026-03-06 11:59:19'),
(0x9b4c81d66de841c592b1fa9648c06706, 0x5205fe0a7bea4952830f1027543245ee, 0x336b79320ce44ef989487e9daebea304, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-05-31', 'RETURN', 1000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0x9c0bd32fdcef457fa18b96e5fdcbde04, 0x7acdf7ad784648548203237921f87047, 0x79576c9e78e640f09920eeb151ac77e0, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9c612fc4536044978e792d070b4fffbf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa787be5269d448e9b9ff32df85d6217a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0x9ca2e16d869943209de4b4341dafa1ec, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4b2f43b46428440caac707afd6549e68, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 4000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 07:15:37', '2026-03-06 07:15:37'),
(0x9cb144e25247411282e8ea3e06a4708c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xb6551b57d15d45a89e17dd9db041a8ac, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x9d18b924834140958d18f4d7e935dce8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x80b9e858262c48df9966d9a33ac1e4af, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0x9d88228c2cc743f1ba98cdf991440bdd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xce9e572f4ee14cbc9628f5a6275d3114, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x9d9a0c17b07743c6a1ec34a56bb1b15f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x25e7fba5edc647db8611389a323e291e, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x9e3c84509b8d43e88188af2339af9020, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xdb2f309b973549d8a1329b462a452dca, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x9e7dd4c348834470a881fe672a359062, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc8b690583327470f9921f3d1439ef55d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0x9ee3898ff5ea4507ab5c1c82e577454d, 0x7acdf7ad784648548203237921f87047, 0x30b3863893334b86a59bd7105349cb4b, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0x9f6cf3040cee4f079ba22e5690857022, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9427299f92174093ad1bb3dd67a3a62d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, 'கிருபா அத்தை', 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0x9faa0921635c47529619a279f1abbd76, 0x7acdf7ad784648548203237921f87047, 0x22eb49157e3f43c2930302afaa74a3c6, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0x9fbd8c0a2fa6492db191c128c6db1606, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xb46ecb85370e4663a53b438f40f4ffd1, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 7001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0x9fd31670e9b342e6873e2f585d6bbf95, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6b9782e19bcd4b04aa4bf60f3aeec459, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2024-09-03', 'RETURN', 2001.00, NULL, 'ரஞ்சிதா கல்யாணம் - MADURAI', 0, NULL, 0, NULL, '2026-03-03 09:36:25', '2026-03-03 09:37:37'),
(0xa1363524f6f44c99af44f57e9e13ee39, 0x6adf89f150d14a64b3fdb03acf5da408, 0x7107adb75ef84d2ca4690daded5b3111, 0x348e71d8b978402b979b023cd01348de, 'புதுமனை புகுவிழா', '2025-01-27', 'RETURN', 500.00, NULL, 'New Home', 0, NULL, 0, NULL, '2026-03-03 10:14:44', '2026-03-03 10:14:44'),
(0xa137d38aa4dd42d58c7e191af0a5f6c7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x54ed7971e8bd49bd90e0179254e81053, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 700.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xa1a4d3cc710c418b8b762810b0fd2ea9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfecfb249868d4e458b5b0eacb816287d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa298566fdf5a4a52963e033ed2d81762, 0x7acdf7ad784648548203237921f87047, 0xe3d1f772e9c947cbb5ad3a75302fe727, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xa2f46dd356324009a389e5db1a74a6e6, 0x78fe398c0e3c418e9f00092a62dbed38, 0x739849ef4fa34131867153bd9cc32b09, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2025-06-27', 'RETURN', 1000.00, NULL, 'kadhani vizha - new', 0, NULL, 0, NULL, '2026-03-03 10:31:20', '2026-03-03 10:31:20'),
(0xa31aaec75c0c4ec7a4fcba07e7a5a470, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xb0c46aabfc6342e2ae54f0d4ba34e723, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xa35e5cce19d843938add43a235dcf134, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x37de976f122e45618b0fbd9007443eee, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, 'T.R.S', 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xa37a95daccb242debb8eeb6628f7caee, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3ad58b4a35f94d75b5014a00f2c74acb, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2025-09-04', 'RETURN', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-03 09:55:54', '2026-03-03 09:55:54'),
(0xa38b8bf7b0a3400591e1dbce7440b370, 0x7acdf7ad784648548203237921f87047, 0x977b9aade23a43c98c7fc98e082af03b, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xa50cb2de017044678054f92c32084b56, 0x7acdf7ad784648548203237921f87047, 0x464304a9d60e461fb69a0cd294d170b5, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xa52a92bd02684ab8b4cc9d394453262e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x478332de4bb2440caf047c45db4c1b98, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xa53b3e046de64ac9b67c276078afe9ba, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5bc89a1f76b2430fb5e8a39895dbeb59, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 700.00, NULL, 'ஆயா மகள்', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa54128b402b149ff9fcb23b0d11efa28, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8c169fdec4af4f53ac609503387573c1, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa575f4d13c2c4ba59b731d76a9471a5a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x82774508c389435a8d98430f3bd07a7a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1105.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xa6062606022c49c4b199fe47f6d01328, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x8f3471f1d6e04ca6831a8db6d8bbaf2f, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xa6de3f50a7734dacbf1c4564c5e89772, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xef12da0fd21e46a09e1d23c8fa073ec6, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa74e8d7ccd4347b9bff1c728f3f0013b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xd327322722f54171a929434c6e3d971b, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xa768aaaad33148d9a9a67a837e59d497, 0x7acdf7ad784648548203237921f87047, 0xe545ea4ded3f4670a6fdd531587631db, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xa7c812067da44c338c3449164bde68cf, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x7b1bb0fa217e479283e7c0c08406ef8a, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 3000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xa802fecb539d4b9585be1df2ae15c1ff, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x86c1184d1a474ae6a47b7fe69cff632a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xa824509336894fc386f906709d1f35b3, 0x7acdf7ad784648548203237921f87047, 0xed1ceccb9a46458fb27518880f0178d7, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xa84a1002764449b19064d5a9963f4d51, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x616bf2c907254e55a087f5fc84d81116, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xa901eb0a157445928cdc4626125daa8a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3dee7512cab84a7fbc39e0c877d86c5e, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xa9618e259ffe46d9ab9c4b650eaed724, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8609cff72e954058aa680c8655747ec6, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xa98cc401052d4dcebf5309ae1a4c4058, 0x7acdf7ad784648548203237921f87047, 0x6310eb412e884afaa507091e67cd7b3d, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xa997cbab129d4151a6c6bc56bb6ff2ee, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xcd021fb4c13a411a8071c54c4655fcad, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xa9b864b7a0fb457c8c365899f51126a2, 0x7acdf7ad784648548203237921f87047, 0x1609986085b64b0fbda45b02eaa8f4c1, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xa9ec44bbf6924b398ec634322b035ac4, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x9b8484d79b81413e851005efd52c1f5a, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2026-01-25', 'RETURN', 1001.00, NULL, 'அறுபடை முருகன் கோவில்', 0, NULL, 0, NULL, '2026-03-03 11:32:56', '2026-03-03 11:32:56'),
(0xaab703a3b14343b7b9b75afb1ed2ef34, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x86c34c8851e5427a826a358f35cec7d7, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 7001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xab0a7c82051040308a6670bd5911c040, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x8bb33059145c42d7baabf0ebc151658a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xab187cd58c144484bf87141b60a9c420, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfcad4f5b73894117a19f784b2413c326, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xab72eeb93c5349a2be68a123b3648468, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xd113a4c1b1864d248d827d044af9904e, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xac3d0a5cf41140e8bfbcfca1e0058c86, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1814dd97d77442c39c6fc592a7147728, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xaca22181c19249a3b611176d3a0b4395, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x34800dee130049249207756c41f7777d, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xaca6130e88d6440995e8380fe479347b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x523168ba6f2742b1aa9a351af8ea1848, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 20001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xacc6e662680741fb98923ff5ebef978c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x211b02f1ef164344acd0ddea0fdf97ce, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xaccee6edc86249b9b4b3fd7d0746624b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x30c21089c62241b48d488ecd11d8c5e9, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xad139c26d07e427694292504a3862be3, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x1f26a56023f8419d8b566c2cb7498e45, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xad36e34d24f14cdc9008e0cd90d69111, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xb85a5932a8064f2c9d074e24d251eabd, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xad9638d221484011adf8f9cc5dd43287, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xde72935fa57e4c75882729d663c05269, 0x622bedd241bb4aacaf048fca20eaa514, 'முதல் திருவிருந்து ஏற்பு விழா', '2024-07-11', 'RETURN', 500.00, NULL, 'புது நன்மை', 0, NULL, 0, NULL, '2026-03-03 09:48:26', '2026-03-03 09:48:26'),
(0xadc1626de9e449d68060798158c6fdf4, 0x5205fe0a7bea4952830f1027543245ee, 0x78f21ebc7a034d2695375abbac10763b, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2019-02-10', 'RETURN', 5000.00, NULL, 'KATHANI VIZHA', 0, NULL, 0, NULL, '2026-03-03 15:18:34', '2026-03-03 15:20:37'),
(0xae67d6a0f021427eb62dcde42e5a4659, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x2e269a36cbc2412fac8ba0f5e3eb9f6b, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xaf0d42648fed49718cb40c682194face, 0x7acdf7ad784648548203237921f87047, 0x0485827dcb9a4faaa7d95fa5ce58e360, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, 'ambedkar nagar', 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xaf16ec3c6a6547dba9ab317381760ba3, 0x7acdf7ad784648548203237921f87047, 0xe287b99e926043099380b22563b288ae, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 3000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xaf49fc79b51647eca3dc13585f760230, 0xa2c6f2db04cf4679adeb97d1f2630f91, 0x40093028441648c3b9ab610d5134daa3, 0x3c87fa1a6ca9415181b48cd0600ed0af, 'மொய் விருந்து', '2021-10-20', 'INVEST', 250.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:54:38', '2026-03-06 13:54:38'),
(0xaffb3cfe4ff94d48a9fb240ff9c2cf8d, 0x5205fe0a7bea4952830f1027543245ee, 0x6ca3c7863ca343c7a14982a8049f5af7, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2017-02-25', 'RETURN', 1000.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0xb0046331802e46b2a69d037bab32d753, 0x7acdf7ad784648548203237921f87047, 0x157b1bf396b84abf98bd93b808bdca4a, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xb106b4bf267f4a55ac8d190fe637fedc, 0x7acdf7ad784648548203237921f87047, 0x7f3ed7f8c54948c3a95d916440402e30, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xb110a2e24fb845bc894ab9aeb0742fbd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x639bddeb2b274630a5ca980216694fe7, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xb22d7536cbb34ae9a6bc4ea49b449916, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x82ae502b7de4482aa6314a9f74c32555, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xb2822fcff5c84d8281e2a3f60f0867aa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xaf7cd7f54f934dbb9c85ece58c6d4a9d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 10000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xb2e2350c8aa94aa4977ea28b6d61c92e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfdbb0443d29e4a539a443b3392dfdf8a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 10001.00, NULL, 'தாய் மாமன்', 0, NULL, 0, NULL, '2026-03-05 15:16:49', '2026-03-05 15:16:49'),
(0xb30b7b389ec6451786efd1403bdb807a, 0x7acdf7ad784648548203237921f87047, 0xf51e76ad59794dee936bea6134ef553b, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xb339354054d94177a900f7d1ad44baa8, 0x7acdf7ad784648548203237921f87047, 0x9b3eb7555beb48e8a769b51a61c18cd0, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 50000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xb344a026ae534e80acb69dc452cc13cd, 0x5205fe0a7bea4952830f1027543245ee, 0x97d2aa2cd59540d79a0cb26edfcfb2c3, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-05-31', 'RETURN', 601.00, NULL, NULL, 1, 'HOME FUNCTION', 0, NULL, '2026-03-06 14:39:28', '2026-03-06 14:39:28'),
(0xb344f866546a4b96acea605e13b3f72b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x73205d199e0f44a9a9dda264b287b9d4, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, 'கிருபா சித்தப்பா', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xb3a697a5b8f943809f7d5544959707a0, 0x7acdf7ad784648548203237921f87047, 0x9e80e01aaafa46bd8b0ff1ee3a56c0ab, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xb3d1ed74218c41368929b4936118fdaa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3c3a14db3cb6422d84023363a21649cb, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xb44b84ddfe0d4f448c7bfbd44429aa71, 0x5205fe0a7bea4952830f1027543245ee, 0x83604c1f27b24fd982e8bd6b077b049a, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2018-06-24', 'RETURN', 10000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0xb566e25a2b9c4c8bb25353eb8b2bb5b5, 0x7acdf7ad784648548203237921f87047, 0x041a56db62a54822853570faf5ee6c40, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xb5a58efc646d490085e573352c7dde6b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4cbf94cd9c624d6c94e0e21717a5176f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xb698c2e6d7fc48b185fb33988b11fd0a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3e6947f5f27f401391873067064432e2, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xb74ade21d9284298b520996f00057be7, 0x7acdf7ad784648548203237921f87047, 0x42d08662bfd9434fb746877b7ee8fdd3, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xb7712cd5ea0e45f88c0e537ab01a7e53, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x74254329fcec44f39e4b8f99c81074b1, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 5001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0xb7e704be5c8c4172bb1f4c92f76e7352, 0x7acdf7ad784648548203237921f87047, 0x693b6421810a4c508e06372d23001bcc, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xb842821e1ee142b2b2299df7870f263b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5c7d8cfa515e4c5db8c65534808e6d8f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xb85cd5cd322a4be8ad72aef965abfa41, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x49fb106f3a4d4425b67860577cd76a5e, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 10000.00, NULL, 'சித்தப்பா', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xb8af0db45ba048489259ab857336f6fe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3da698bf5ab54b168dcddb8386e8998a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'சித்தப்பா', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xb91a576cf95042d89fc692d04bb4179f, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xbcc19dd94e04486b8977a3a86085299e, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xba1164907f3d47f9a770525bc4e813be, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc371db4215cd47c790324fbaa13e35ce, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, 'வின்சென்ட் அம்மா', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xba2ba99c30e8401785814405018c3fbd, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x214add4dc23f4e2fa8b7a2e5f09cb155, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xba5501e3f770416ea5e7b7419a48fd3e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xb444d2cf29ee45b49ff2aab157276dac, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1005.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xba9b6807a8c64cc4b7365409c58832d9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd293b457c55043d6bebb311b3a549c9d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xbac84f52f64e4138b38a87d476362cb1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe77f67a1d1e846328f40303eb7599c92, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xbb02260a85f743f9bc5ccdd9c2716e5b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x33fffa5b98ee4ab79501c322f5b57258, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xbb3d8621fe1c4bf798a6c2d347b5ea76, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xcc7faaea15b14b899bdcb39fe6541355, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, 'குண்டாசட்டி மகன்', 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xbb4fac920394445eaf40960910a04028, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc66c33d422464d6bacadc688a51b0e2a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xbbef0066b9f54deb90dc85106d498415, 0x7acdf7ad784648548203237921f87047, 0x77c0fdd9548248d69e2a72cd455fb2c9, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, 'senhutha amaipu seyalaalar', 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xbcb1e71433944ac5847e401b71c4b073, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x53371e322612420aa40d277600d58983, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xbd0ad4b1ca1542b7b4aa36c35928c491, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xbabfc3e6c8c24027ba1eb68ea8983430, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xbd90d2b7ac2a4d4faa7d4ad42e60d541, 0x7acdf7ad784648548203237921f87047, 0xd72875e0284e4fbebc6039a2b1c9aea7, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xbe1d4b5d0c424e12b1aa0da5dbc82682, 0x5205fe0a7bea4952830f1027543245ee, 0xd2497597a92f48df870cf3c020c17b25, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2019-05-05', 'RETURN', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0xbed67bfac37a4dc7be9a4cf275981643, 0x7acdf7ad784648548203237921f87047, 0xbea8dcfc8de344c69d5ffc524206a207, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xbf234a91c5ab4547b90c45a0f4e5b244, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x26d5f31c78574179b7b1dd48d43ca76a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xbf66c466cdbb440382b3c34fe2627bdf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x677758a99cbd47eeb85f9aafe3da8e6f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 350.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xbf70034aed1444569b143cbb160c0955, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3dee7512cab84a7fbc39e0c877d86c5e, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xc0b019c8ded4447cbdaae5655ba72218, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x65941a677c5642d7bbe78a09b24ac412, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xc1ce814aa63245a7b793c3fe9cbc40e2, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x9f57ecb1e6b448649e0b9acb7f8e0034, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xc1f57f2d0e0745a3be6aa55af22dae41, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x52759f4a1bc247a497a6eb8ed4e39d6d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 7001.00, NULL, 'தாய் மாமன்', 0, NULL, 0, NULL, '2026-03-05 15:17:36', '2026-03-05 15:17:36'),
(0xc22e7ad5c2f544a989fcdfd8392b2a99, 0x7acdf7ad784648548203237921f87047, 0x41105763035e4439a6f5809ab1a978bd, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 2500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xc25a41f4b4064e4287b89e54c66c8f4b, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x0d88a471b87f4e1281589968c76c8eb2, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xc33e857af10740a8a8f344896a908a05, 0x7acdf7ad784648548203237921f87047, 0x378b9cb4a39446b6b58b52589c05c69f, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xc397ab9c5a1b43d2be1b727b9190dd75, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7f51593afdb749e7801ccd7d06d45649, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2024-08-30', 'RETURN', 3333.00, NULL, 'பிளசி கல்யாணம்', 0, NULL, 0, NULL, '2026-03-03 09:39:27', '2026-03-03 09:39:27'),
(0xc4fb2c6b5e35448dbb9765669cc04f3d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xbc12fb7f73ad46e2bc115f87839fc60b, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 310.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc54b7bcd4c234ef6923de749f6df82c4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xe33f4308ddf44d7cacfe68de8cd63997, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc60a8c1228b440e58d846ab3a4540883, 0x7acdf7ad784648548203237921f87047, 0x6104712ca3244bd082da214b13797a3e, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xc6291101571143ee8608bb0007284564, 0x7acdf7ad784648548203237921f87047, 0x13ba6401f24141368a47c809b2384456, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, 'moopanaar keervattiyar veedu', 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xc661fd0a03764ee08254b3e30f160278, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xe6c47061f6fa409187c086c9acab8e88, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xc67567ecee494c42a57f2da31a140c73, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x9be836b96c7245e0b7908946ea8568b5, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xc6a830b5fbb7410a9c821863bccb98d8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc001b774e4994ba291bd29430227e8d2, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xc6d8f8c08fb14984aea91749dd72d91f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa80af1d0219b4eaab492632e01e65460, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2024-08-30', 'RETURN', 1111.00, NULL, 'பிளசி கல்யாணம்', 0, NULL, 0, NULL, '2026-03-03 09:34:02', '2026-03-03 09:34:02'),
(0xc7556d2cf5574f699b352a3df8eabd28, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x02fbec78185d497f88839591c805e08b, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xc8631dfb51284907876fcff3c34bd19e, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x8757ee16f2904be78587aae22278e7b8, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xc92940a941944b99914658ae578facdf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2489c38f126649cc967c1c8f237cfc9f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc929ee8f47f449b6a917cd9c3d201cbb, 0x7acdf7ad784648548203237921f87047, 0x675d2cbaa5ba49edaaf809422f03d9ba, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xc97000115ce34d3897c9452b3c4c5611, 0x7acdf7ad784648548203237921f87047, 0x4d14c6443fc14b64b920abc9d44c336c, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xc979de381eba4f949a73d142fc930a85, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6df9605805c1435096cf0189cead7e6a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xc9845348425e45c082bdd7255d906c59, 0x3ff8de4622804be0aa4e405d8c404df3, 0xe480ad20a6144361a25cc869861c6a47, 0xe1580ee83e624845b58fbcaa45198e2d, 'குழந்தைசாமி இறப்பு', '2026-02-19', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:08:59', '2026-03-06 14:08:59'),
(0xc98ad540e9e04543b414df166452f69d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x30c4730de9d4495da058ecc9ccc805ad, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 700.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xc9c95e15557941cf9bcc843844f2b22d, 0x5205fe0a7bea4952830f1027543245ee, 0x3412a89a6e5d4cb7a279a04cc724deca, 0xe6040956d27f40329be4c4808dcf7acc, 'இல்ல பூப்புனித நீராட்டு விழா', '2019-02-20', 'RETURN', 0.00, '3KG POT SAREE 1', NULL, 0, NULL, 0, NULL, '2026-03-06 14:42:37', '2026-03-06 14:42:37'),
(0xc9daaac2eaf147c0acb210564b1fdcb1, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x82d06803ea474bbd958f68ec4d3174b2, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xca43c495253940dab85995c2ccd530b8, 0x5205fe0a7bea4952830f1027543245ee, 0x1bbb3d4c965e4e73a63e04a73be32ff1, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2017-02-20', 'RETURN', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0xca79d9848d8540509c5d6ae124c7a522, 0x7acdf7ad784648548203237921f87047, 0x95ae2d6f1a1a4ba2abd0fd042138a4f8, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xcaa3e2fb614c44519dd9495f656b6139, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6b9782e19bcd4b04aa4bf60f3aeec459, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xcae5a91305c944a28592ef6dac610cdf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x00812c6874cf48d3a9e46f3ab0a54384, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1101.00, NULL, 'Sammanthi MOI', 0, NULL, 0, NULL, '2026-03-04 15:07:38', '2026-03-04 15:07:38'),
(0xcb1d8e1790e94ba68c5bb9b9afd7f1f9, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x4a153a448e3a4b2fb20c9ab8251b159d, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xcb9f1bc1eb9748b88685f55b0a2217e2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x62d6c9aac19c4b5da642c13031e7c4dd, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xcc2279cc90394587915e506fbe52f3a7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x68c0b687a0e347b4bbafcfb73b5aa7bc, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 151.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xcc384ad4cd2a41c3a3f7f17bb124ab09, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4037570757b94456b4aff5a818bd5ff8, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xccc2684f324040abac0ff68991a4c5eb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa2dcd5d07df849019ac2923a2bf9aebf, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:30', '2026-03-06 11:59:19'),
(0xccc86ca74ee743eeb274276319b2caf1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4cbf94cd9c624d6c94e0e21717a5176f, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xcd1098af2a8648ee981316e19340d78a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd8e896b025164001961b6bfc7345b821, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'Fish Kadai', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xcd73228ec02040eda553451bfea9717f, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa8daafb005954e2f89bfc5a62217016d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xce16fcb6a78346a590cc6fee023804c6, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x219b81ada95a4fc780aa5d20aab11ba5, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xce38b92b9eb34cd1b690550f5d74926d, 0x7acdf7ad784648548203237921f87047, 0x1eb5562629eb4b698f4d3fb7f5e54d31, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xce7edabeef3f4822b0c76c7b50997a71, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xa699835bf5144a53a54b33cf79ca9f54, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xce82bdfe5e8546f9a91a448996d0dcb3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1136e87caac04d62ba75cae8de26d5c7, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xceb26caf12ac4f5386cda3dbcc48f6c5, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc4571c1646134cf2bde9ac7b235e6f33, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'கொசவபட்டி', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xced877d260094a7abd9ffb1e385285ff, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xfb5c54672e44450c95681f415fb0e897, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xcf1ff3a919fd45e1b08046b155916ad6, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x2a5ae2997d4847f0930d200e174e44d2, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xcf35930c2d2340b09b168aa68e06ac3d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9e4953ae4d384fa0a3301948005bb684, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xcfee6a72194f496f8788ba380789137e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7f710414197143bdb4c393ba51eb173a, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'எலியேசர் மாமா', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd1183dc7436346b18e14b867b1e42c94, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x956452c662194b258dc8e3d41ed3c561, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32');
INSERT INTO `transactions` (`id`, `user_id`, `person_id`, `transaction_function_id`, `transaction_function_name`, `transaction_date`, `type`, `amount`, `item_name`, `notes`, `is_custom`, `custom_function`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0xd1a11e28b287485689126ab38507bcfe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x193ac82859c74580a157c8c0c626df88, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 305.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xd1b1e110cf8e44a98eb363bb6f134d47, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xb8b8c81c030146aa9b59f67aacdcf389, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xd21214c399224ab986f18acdcbf425a0, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xc71fdf55d6e945d2a0a973f56a25bbef, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xd24a34b10b6d4bd8913b71741c123d12, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x66c5cf16b9da4e369dc4820ec7119a3a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xd2cf98f4626f438d87ebf5c32c263db2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3ad5090402eb4ed79028a8f0d3fb9101, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd2d74a4edf4a4f6a850dbc7b2408c34f, 0xa2c6f2db04cf4679adeb97d1f2630f91, 0x7d6f07c987944b3aa387b432da4902db, 0x3c87fa1a6ca9415181b48cd0600ed0af, 'மொய் விருந்து', '2021-10-20', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:54:38', '2026-03-06 13:54:38'),
(0xd323b27f97f142e29df47ad497b7cdbe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc02ed389cdb344dfb7d1131f36bc7951, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xd4313721ac48405d9329252f0c89d8a8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5f265231c4a64c6f8a013381908a41e0, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xd550a15ac1554da7929bdc7c4dcaecf1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2611eb1374394f14b559c68c60e51125, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 551.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd56f904217f64824a3f13d23acfb4fcc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x3e826d7f677547bfad0f1b8efc6bcace, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xd6cfd29970aa48ab9ba05dd3abc7bd25, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x51090c14772743cebeb10fecb4bade62, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xd72f07491e4d4c7a8026b53615efb508, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xdf60b1dbd21940f98edcd31b10c83294, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xd768bf2ebaa54f2b804b7918c135e1fd, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x06e9d1511c05457ab85e88c85867a892, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 3000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xd8b7816880d843dfb6487c1219efd682, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc583bad18eb84da3a5ec8ced3c704f89, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xd99b867ff1fa440a870e71cc4835f3e4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xcf111fcefefe413cac5988659e554d89, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 700.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xd9b0de6e1fbb4756acdb10c13933993f, 0x7acdf7ad784648548203237921f87047, 0x148b9d9b048f4b4584bde3fe55a465d9, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, 'kovalan veedu', 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xd9d310b594054ae2920ecad6e24c7676, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x48fdeaf6c6ab469bb7b8ca57409cdc38, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xdabc1a7ed87a4d0483bf5c876b973532, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4d02c97dfe684fd4aeeb7bf6aa98974a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xdb027f3e13144d60af05d8afb4f060fe, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1e83f272db514881a2fcf75b964988ce, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xdb1cdf55b3d044758dfbca9b9180533a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x9bce52ce5d384fa2937584de7d4a6bc5, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xdb278153c8704b13a945ed89f50ce78b, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd3d73ae7e0514abbb1495e64c7a6c856, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xdd305c13d5c2417eb19baec57320d895, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5041ea1bdd284074b046b61bf94f2dad, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xdd4c83ca606e4c8f912562464f3f4f4a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf21a56033bf448f7bb97f485a3046b21, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xdd64f3440c094aa5b9e293a5cd3bd0a4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xaf7cd7f54f934dbb9c85ece58c6d4a9d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 3000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xdd66764a7d2942e1baa658d3f2c50b49, 0x7acdf7ad784648548203237921f87047, 0x57b92f302e84469989c66734a4827fcc, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 2500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xde62894cc8c54433897d29222030ef44, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x3d77631cf2bb448180693e83c6d59a94, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 700.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xdf37d942731145db9ee7c90fe0f27d9a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xae1495bc707d4b219364d85425b3454f, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xdf5af35fb6b740289cfb7a902385e296, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xc6a87aa8c5d0495c95ed8c5305c8f801, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:44', '2026-03-06 13:17:44'),
(0xe0213552a0a04fe5adcfd6e072a4d41e, 0xada992157aed4af595ca9b6b512f3dd6, 0x7681df813471458da764242a1ca2a63f, 0x176e851a204b47f7a8f5f855a17e161b, 'கிடா வெட்டு விழா', '2025-11-06', 'RETURN', 1001.00, NULL, 'கிடா வெட்டு', 0, NULL, 0, NULL, '2026-03-03 10:53:57', '2026-03-03 10:53:57'),
(0xe06a3d0f0fde4c96b41d56d961c104a2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xcf111fcefefe413cac5988659e554d89, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xe0e57d26508b4c6ba27dd85438da640d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x6448cb4587d34e10bc9c042f378c1160, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, 'மேட்டுப்பட்டி', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xe11ba2154eb64a599c76b2c0d69c6109, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x44417d66cf1f417a9c591ab2baf8f8a3, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xe1aea3525c764861a2ebc0d99e4831ca, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xf4cfc5b477d241f6a8e8ab3378079c95, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe1d9271375054501b78bf8f915bc3603, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x32dbabac51a644f1b69805c4d97e7ec7, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xe2cb686ea1074267ab5d80f765bbe9f0, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa066f3060faf424e9fb74b0a6fc386b9, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe42365bd93a1464cb52d2d8fbb494661, 0x5205fe0a7bea4952830f1027543245ee, 0x592a3cdd10e54147b0c08e4758c87711, 0x92b91678b7af4ace9f155ec8c3f905d9, 'இல்ல காதணி விழா', '2017-02-22', 'RETURN', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:34:54', '2026-03-06 14:34:54'),
(0xe4575b2035ed499eb63aad44360858fb, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xacd06c7a73ed4b2f90085dc148d80d68, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe46c347758bc400091e7201f8b3f21bf, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xcbe00b8459804ee2b4030ab8308d15d0, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, 'கிருபா பெரியப்பா', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe520870bd02a4314ba589da1d292a1c1, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x77734e7330a94308949d795ccc6b54fd, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1301.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe52bf5609e3446018e365d2d81225291, 0x7acdf7ad784648548203237921f87047, 0xc4214bb9a7a74f4a867fb2b67fa8bc57, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xe699111766c04fcf9d142e0d1a0d31dc, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x35c0f41e25b0480abd3cb7460c3a8e64, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 201.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xe6cfcaeeeef34d608bd2929b3caf538e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xcd9d0c83c8c24c599c1a9e431333cfb7, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xe711f9f3b4214a04bc7f1536f560b523, 0xada992157aed4af595ca9b6b512f3dd6, 0x9ece3fb41a9c46598f3c6313711432b3, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2025-11-06', 'RETURN', 1001.00, NULL, 'Marriage', 0, NULL, 0, NULL, '2026-03-03 10:52:52', '2026-03-03 10:52:52'),
(0xe795756823084a8985c72acf8cfd32ea, 0x7acdf7ad784648548203237921f87047, 0x606504e810824a53b755a56b1de59595, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xe7e57d872b7143e0851fb49efebf7f1c, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xde9c4600f20546368e60f93574a5e734, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 251.00, NULL, 'Finance', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xe85b8e20a9fd4ea6ae8fb5858387d9a8, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x1117ee1c9c2a43658b885451187f60d5, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xe8a80c97ce224d83a3c528617e77c2a3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd637875a902a4448baeedab01eb0776d, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xe8f7b70cd58445668f6eef4d90c48487, 0x7acdf7ad784648548203237921f87047, 0xbbe14ba78f054593806e618f14a21596, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xe948af19ddc94b3f8bf53e1f82adba92, 0x7acdf7ad784648548203237921f87047, 0x9e50e2f09051418598167cadfc51a186, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xe94dc8e89cf849c5b4f8edda82e4a6f0, 0x7acdf7ad784648548203237921f87047, 0x743ade813b7549c09883fdd1af17920c, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xe9bc37835f6f4a76b93031003ea8fa00, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x20547a7321f749fe93e5aea6cc8bd840, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 250.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xeaadd97f18704d93a5984aa2ab024e2b, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x16aa75907e874f7885ab9bc5ee897af4, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2026-01-12', 'RETURN', 1000.00, NULL, 'அருண் சென்று செயித்தது', 1, 'பட திறப்பு விழா ', 0, NULL, '2026-03-03 11:19:47', '2026-03-03 11:19:47'),
(0xebd02b2e096640fcb5b6c17c2b104fbf, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x4be8429e94734aa4b51a155b8decdcdd, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:11', '2026-03-06 13:17:11'),
(0xebd0d3fdce114585861d1ca410926e08, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x55a8aa20d6dd496da51b05d6073cc913, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xebd27a4dbccb466a9b877d6ae97dd570, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc654c96859284e61a9acbe73be740945, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1111.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xec041c8b846b4ccea6192c98f060ffc9, 0x4f51468c74ac4af9bc3d04a529d21744, 0x8cf08d94f7e3483ca65112047ad8164e, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2025-02-16', 'RETURN', 500.00, NULL, NULL, 1, 'விழா', 0, NULL, '2026-03-03 10:09:52', '2026-03-03 10:09:52'),
(0xecc77989023d4192be63a99c5af767a3, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7f5e51632f4346f0ba29dd4db6c841f4, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xed9407e648db450f85a9909f0a1a9d3d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xea8be983026d4385b38320ee3248abae, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xee7d5c3b608e47d8998fd67436bbdcc8, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xe2c6f83a9ddd4acaadd7139537421ba1, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xeeb391f3d8fb423bbac2293c8aaca94e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x5d66759165a744969b3607457490aa26, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 300.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xeee57af1e82d45f9bfc14d68642bf457, 0x7acdf7ad784648548203237921f87047, 0xb132a5ac031f4c60acd5e090381d5fa3, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xef2f7c2a50654ecb89174eda68963bfa, 0x7acdf7ad784648548203237921f87047, 0x878d9a7c6cb54451b22eff7350d337cd, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, 'GVB NAGAR', 0, NULL, 0, NULL, '2026-03-06 13:42:56', '2026-03-06 13:42:56'),
(0xef4a2958a7904faf97bc9fade874ffe2, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x17466baed6824537bd5825ada0477255, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xef9632f5c3544ac3b6fa131dbfa84caa, 0x7acdf7ad784648548203237921f87047, 0xe0d48deff18b4efabe540c54ad059388, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xefa18d47cbc140ae827d41a19685d0ce, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x02deaf00b3294bf8931c11b8902cdca0, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xefc982eaf7f640b5bd5d8b37ffc5a727, 0x7acdf7ad784648548203237921f87047, 0x6d1810b66bd345e9952b74c15994f643, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 5000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xf03bde6d32f5467d8f5c27f16c44fd71, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0x00467ae9752b46a58acc49507ea13735, 0xbd6bece4af3d41e7b824417fdce581d1, 'குழந்தை பிறப்பு', '2026-02-08', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:00:47', '2026-03-06 14:00:47'),
(0xf0da70dca68a4a35b9eb0563076dd845, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x18f7572c96b1492ca05acae94d9e32a1, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, 'கிருபா அத்தை', 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xf0e085921ed44dd79a6db720f8d0e0f4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x82774508c389435a8d98430f3bd07a7a, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xf1da339586204b75b0a9cb148c41e0e0, 0x7acdf7ad784648548203237921f87047, 0x16a46a6543c74811993aa5da2256657b, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xf1fef77ed82b49bc9c7cc9ec576f4570, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x7f5ead9187d2408fb12c4bffbc001e55, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, 'ஓசி பிள்ளை நகர்', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xf240b12312404886b86f1388f47ef861, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd637d245c96d44c29f411b81b4ef80c8, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xf264529f246343a9ab384efa8186df2d, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xd0d2e607eec34b46ae08d937e6b4df2a, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xf2770c8d033c4167a8219a89bbeea722, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xa146790c721a48e0b49360c5fa110f04, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xf2b25ee4853f478cae0a765e01ce9bd4, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x65a1649e3d7145358b831bc099277521, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, 'கடற்கரை', 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xf3a777ae677149b5b3bd60d3d4b56caa, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x32bb2fee37634c7b8d2e9f57b9d1104d, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xf3c83c76126e4b7a8e2f935b565e2052, 0x7acdf7ad784648548203237921f87047, 0x744f7f7cb7ea444b84a2391b2d088e3b, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xf5067c1502e94d36bac8410d3f8a2e82, 0x7acdf7ad784648548203237921f87047, 0x2b5ee95272374d23a4648e4c2208a31f, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xf5276cb01de14d1e996e7e83811494b3, 0x5205fe0a7bea4952830f1027543245ee, 0x8dc83cdf741142aa8445461941c8d4bc, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2018-06-25', 'RETURN', 5000.00, NULL, '2 son', 0, NULL, 0, NULL, '2026-03-06 14:44:16', '2026-03-06 14:44:16'),
(0xf5b1b3ce28f94b5db8e060ac863c01da, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x4e5316b33d4242f1903608eecbee9198, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 200.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xf6d7c116c89f4e9a9717b1520e6da5f7, 0x7acdf7ad784648548203237921f87047, 0x990753849aa94fc3a552f8c856a6cac2, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 10000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xf6eda72fa8574723b79785269c398d8d, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x67fd181daa4f49f7b54d7c9b8dced5a3, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 501.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xf73207d5d61a4731a30f3262dcfb893a, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x92073fe05913418ebe91db76ed5c8713, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xf73724d554b040a6a1a9e32c42056387, 0xd79f318a9eb543eb9b34fad18e3cca2d, 0xd30adb6dfe3d4047b6c854c38ee66e52, 0xbd6bece4af3d41e7b824417fdce581d1, 'குழந்தை பிறப்பு', '2026-02-08', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 14:00:47', '2026-03-06 14:00:47'),
(0xf764101f569f43e19163af58db6267d9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2bcd8380f9c84e43ac239413fc35ac63, 0x348e71d8b978402b979b023cd01348de, 'புதுமனை புகுவிழா', '2024-05-01', 'RETURN', 555.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-03 09:23:01', '2026-03-03 09:24:44'),
(0xf81d1347c34048f99610c5f1be4ad6ca, 0x7acdf7ad784648548203237921f87047, 0x0fe383b5d7914ad9a576c80b06646c15, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 100.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:57', '2026-03-06 13:42:57'),
(0xf836b890a95d4fd39daf5f507c7f7d90, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc5ac0d4f6be9448e897d55f11af105f7, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'சித்தப்பா', 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xf861918992724b1bacadd5118dd32dcf, 0xada992157aed4af595ca9b6b512f3dd6, 0x1003430d97a74a769880eb22684cdb96, 0x735d6ae5ffda477380c951c653bd5a2b, 'இல்ல திருமண விழா', '2025-12-07', 'RETURN', 1001.00, NULL, 'திருமணம்', 0, NULL, 0, NULL, '2026-03-03 10:51:54', '2026-03-03 10:51:54'),
(0xf882601a6fa1489680c6d99df58d679c, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x02a869bd96cd488e9f648a2e43a1ad81, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:17:28', '2026-03-06 13:17:28'),
(0xf955a657b4e244d3bd7df8d4fa10406a, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0x60f80d5a5eea45b586a02af36f49a8f5, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 1500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39'),
(0xf95c382ed01b40668faee8c3f15c8d91, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x082a7f3be2274afaaae4ef5e2df440c2, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 10000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xf9e2cc653b2f4c26bffc39a2ff62ab6e, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xc60ec23a95d843279c9658c296a80aa9, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xfb37ec8ae75748f78d0895b27a5e29d9, 0x7acdf7ad784648548203237921f87047, 0xfbbed01a06fd4cce820becdfff27d851, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xfb838610a6dc48499d25b572c59daea9, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xb2a8c1d480ed4f80ae746b8ea9d9a315, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 201.00, NULL, 'மீனாட்சி சலூன்', 0, NULL, 0, NULL, '2026-03-06 11:56:50', '2026-03-06 11:59:19'),
(0xfbee42e22e2e4c65a51bc26bc56fd841, 0x75fe4201272e4aada72baed0b0834764, 0x94089484abb549bf9f582665412cd25f, 0x6c55e4cf6ff543379c178da7c0cac083, 'மற்றவை', '2018-12-06', 'RETURN', 1000.00, NULL, NULL, 1, 'இல்ல விழா', 0, NULL, '2026-03-03 10:41:05', '2026-03-03 10:41:05'),
(0xfc1b2930142f4845918a20aa53aa8699, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xbf284772af0e4bc49e1e873c9afe4375, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 1001.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:17', '2026-03-06 11:59:19'),
(0xfdc129a33ae445fe9be060d997fea993, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x773cfc5fe3544badb20def754d12f8a0, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, 'MGR NAGAR', 0, NULL, 0, NULL, '2026-03-06 11:35:53', '2026-03-06 11:35:53'),
(0xfdd9385111aa4c7c87bb7797333ded94, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xdcfdd114872b4a43896ee7b7d0eb399b, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xfe174c741adf40e397db934a6458df88, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x2f52831ae4684f2d98dbbab1fd53c251, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 2000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:32', '2026-03-06 11:35:32'),
(0xfe3badea172b4668b9808d7fb00ec7d4, 0x7acdf7ad784648548203237921f87047, 0x645eb41be9d7446fb4e8eabfdd870e60, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xfe906ea3cd844009a9744a18e655c206, 0x7acdf7ad784648548203237921f87047, 0x92160476c03a4cd5bb7ab1e191ed0c6d, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:42:38', '2026-03-06 13:42:38'),
(0xfee6d004186d413dae37896d1223f199, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0xd78cc9690e824482a9b14151fe80c540, 0x64dcc22a12dd408e9630c722b60282ca, 'PRIYA MARRIAGE', '2023-05-21', 'INVEST', 151.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:57:02', '2026-03-06 11:59:19'),
(0xff39ff0a5ab94e0db524cfc1c246f495, 0x7acdf7ad784648548203237921f87047, 0x5f850012e9ac45ce83a3814f45101e7b, 0xb269e0be48ea41c2ac139771aa7d4eb1, 'காதுக்குத்து', '2025-12-14', 'INVEST', 1000.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:43:18', '2026-03-06 13:43:18'),
(0xffe6b5a1fc444ed586c4edb290f59bc7, 0x12badb81b9eb4feaaa10014c59fdf6aa, 0x59a709e4b61a4c29ae73ddb762662b47, 0x7039b47d12714da1995d495725dd1914, 'GP KIRUBA MARRIAGE', '2021-09-10', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 11:35:04', '2026-03-06 11:35:04'),
(0xffea6e1c40794bc09dababde00087651, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 0xee080cbdd6a342308461022d0d13a9a8, 0xbeaf1865613941b88735e3cd2ce99728, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'INVEST', 500.00, NULL, NULL, 0, NULL, 0, NULL, '2026-03-06 13:16:39', '2026-03-06 13:16:39');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_functions`
--

CREATE TABLE `transaction_functions` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `function_name` varchar(150) NOT NULL,
  `function_date` date DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaction_functions`
--

INSERT INTO `transaction_functions` (`id`, `user_id`, `function_name`, `function_date`, `location`, `notes`, `image_url`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x37c99d08b5dc419f9058a6e823359812, 0x1c3f49e8bffb4018b634c420e8ea910e, 'காதணி விழா', '2025-09-14', 'TPS MARRIAGE HALL', 'விவேக் சுவேதா/ஷன்விகா/கிரிஷ்விக்', NULL, 0, NULL, '2026-03-03 05:47:17', '2026-03-03 05:47:17'),
(0x3abdebb5e89441d2856dcd6d821954aa, 0x2ab82eb01a0d406c9148392acf97b38d, 'MARRIAGE', '2019-10-30', 'K Venkata subba Naidu Kalyana Mandapam Pulliyamarathu Kottai', 'LOGANATHAN MADHUMITHA', NULL, 0, NULL, '2026-03-03 04:49:08', '2026-03-03 04:49:08'),
(0x3c87fa1a6ca9415181b48cd0600ed0af, 0xa2c6f2db04cf4679adeb97d1f2630f91, 'மொய் விருந்து', '2021-10-20', NULL, 'குமரேசன்', NULL, 0, NULL, '2026-03-03 05:48:30', '2026-03-03 05:48:30'),
(0x64dcc22a12dd408e9630c722b60282ca, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'PRIYA MARRIAGE', '2023-05-21', 'பிரியா வீட்டில்', NULL, NULL, 0, NULL, '2026-03-02 18:41:42', '2026-03-02 18:41:42'),
(0x7039b47d12714da1995d495725dd1914, 0x12badb81b9eb4feaaa10014c59fdf6aa, 'GP KIRUBA MARRIAGE', '2021-09-10', 'இந்திரா கம்யூனிட்டி ஹால்', 'அய்யன்குளம்', NULL, 0, NULL, '2026-03-02 18:40:32', '2026-03-02 18:40:32'),
(0xa14e4d6593ec4d5f826a51afc6068d86, 0xd6095f7044074372aa2478e5a9c524b2, 'நாமகரணம் எ பெயர் சூட்டும்  விழா', '2025-02-02', 'பெத்தான் ஆண்டவர் கோவில்', 'தினேஷ் அபிநயா', NULL, 0, NULL, '2026-03-03 05:45:43', '2026-03-03 05:45:43'),
(0xa792dfd1232444babe3767e499e20886, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'வசந்த விழா', '2026-01-04', 'திவ்யா மஹால், உசிலம்பட்டி', 'கிருஷ்ணன் - கருப்பாயி, ராகுல் Apollo', NULL, 0, NULL, '2026-03-03 05:52:33', '2026-03-03 05:52:33'),
(0xb269e0be48ea41c2ac139771aa7d4eb1, 0x7acdf7ad784648548203237921f87047, 'காதுக்குத்து', '2025-12-14', 'GV MAHAL, KACHIRAYAPALAYAM', 'தேவசேனாதிபதி திருஅக்ஷய்', NULL, 0, NULL, '2026-03-03 05:51:23', '2026-03-06 13:29:56'),
(0xbd6bece4af3d41e7b824417fdce581d1, 0xd79f318a9eb543eb9b34fad18e3cca2d, 'குழந்தை பிறப்பு', '2026-02-08', 'ஹோம்', 'G R', NULL, 0, NULL, '2026-03-03 05:53:14', '2026-03-03 05:53:14'),
(0xbeaf1865613941b88735e3cd2ce99728, 0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'SARAVANAN SANDHIYA MARRIAGE', '2024-11-17', 'Samuthayakudam, Ottupatti ', NULL, 'uploads/invitation_uploads/19/Invitation_2024_11_18_08_17_26.jpg', 0, NULL, '2026-03-03 05:39:11', '2026-03-03 05:39:40'),
(0xc0c046a59db247a4a43bf6a65d355dfc, 0x75fe4201272e4aada72baed0b0834764, 'இல்ல விழா', '2025-12-01', 'இல்லம், மதுரை', 'சத்யபிரகாஷ் ராணி', NULL, 0, NULL, '2026-03-03 05:50:05', '2026-03-03 05:50:05'),
(0xe1580ee83e624845b58fbcaa45198e2d, 0x3ff8de4622804be0aa4e405d8c404df3, 'குழந்தைசாமி இறப்பு', '2026-02-19', 'வடக்கு மேட்டுப்பட்டி', 'குழந்தைசாமி', NULL, 0, NULL, '2026-03-06 14:06:31', '2026-03-06 14:06:31'),
(0xec929f1589024523b43af0e5e1134782, 0xd12420858add461aba10af9c3cd3c564, 'திருமணம்', '2026-03-02', NULL, 'வாழ்க', NULL, 0, NULL, '2026-03-02 18:37:12', '2026-03-02 18:37:12');

-- --------------------------------------------------------

--
-- Table structure for table `upcoming_functions`
--

CREATE TABLE `upcoming_functions` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `title` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `function_date` date NOT NULL,
  `location` varchar(150) NOT NULL,
  `invitation_url` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','CANCELLED','COMPLETED') DEFAULT 'ACTIVE',
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` binary(16) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `referral_code` varchar(50) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','BLOCKED','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `is_verified` tinyint(1) DEFAULT 0,
  `email_verified_at` datetime DEFAULT NULL,
  `last_activity_at` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `mobile`, `referral_code`, `status`, `is_verified`, `email_verified_at`, `last_activity_at`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(0x014c5ff501f0424f8254e5655a678acd, 'P SANTHOSHRAJ', 'bccnmart@gmail.com', '9087471277', 'JVDG4TZV', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:07:30', '2026-03-02 18:07:30'),
(0x12badb81b9eb4feaaa10014c59fdf6aa, 'GNANA PRAKASAM', 'agprakash406@gmail.com', '7845456609', 'JVQWEX7D', 'ACTIVE', 0, NULL, '2026-03-06 20:48:55', 0, NULL, '2026-03-02 18:01:58', '2026-03-06 15:18:55'),
(0x1c3f49e8bffb4018b634c420e8ea910e, 'VIVEK', 'suvekavivek@gmail.com', '7397004496', 'KU6AVPSU', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:15:27', '2026-03-02 18:15:27'),
(0x1f3877519d0346ecb457fee57c7b2cc0, 'KOWSALYA', 'kowsalya25071996@gmail.com', '6381377512', 'HX7Z4QPF', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:13:20', '2026-03-02 18:13:20'),
(0x2ab82eb01a0d406c9148392acf97b38d, 'LOGU', 'eeelogu11490@gmail.com', '9976791028', 'TDPK75UX', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:11:33', '2026-03-02 18:11:33'),
(0x3ff8de4622804be0aa4e405d8c404df3, 'J KIRENA', 'jkirena@gmail.com', '8072427471', 'WNV4HKAM', 'ACTIVE', 0, NULL, '2026-03-06 19:36:50', 0, NULL, '2026-03-06 14:03:21', '2026-03-06 14:06:50'),
(0x4f51468c74ac4af9bc3d04a529d21744, 'JEGADEESAN', 'jegadeesan528@gmail.com', '9487639047', 'J6FJ9HMP', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:14:40', '2026-03-02 18:14:40'),
(0x5205fe0a7bea4952830f1027543245ee, 'DANNY R', 'devrajdani@gmail.com', '9790363201', 'GMW3GJCS', 'ACTIVE', 0, NULL, '2026-03-06 20:48:47', 0, NULL, '2026-03-02 18:19:44', '2026-03-06 15:21:49'),
(0x6adf89f150d14a64b3fdb03acf5da408, 'BOOPATHI', 'boopathibaskar1104@gmail.com', '8608505183', 'FGD5QAAS', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:15:01', '2026-03-02 18:15:01'),
(0x6b51b00bad414175ac1dcd93ce31c30e, 'KARUNAMOORTHY', 'karunarajaram33@gmail.com', '9042833328', '4K6PQ4YC', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:17:59', '2026-03-02 18:17:59'),
(0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'SARAVANAN', 'saravanan0894@gmail.com', '8220105076', 'HSCX59AN', 'ACTIVE', 0, NULL, '2026-03-06 18:52:50', 0, NULL, '2026-03-02 18:12:30', '2026-03-06 13:23:06'),
(0x75fe4201272e4aada72baed0b0834764, 'Sathyaprakash', 'sathya@gmail.com', '9940030304', 'N3NJE3B2', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:18:14', '2026-03-02 18:18:14'),
(0x78fe398c0e3c418e9f00092a62dbed38, 'PRIYANGA', 'bpriyanga2013@gmail.com', '9345089270', 'NZABV889', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:15:47', '2026-03-02 18:15:47'),
(0x7acdf7ad784648548203237921f87047, 'THIRUMALAIKANNAN', 'vthirumalaikannan@gmail.com', '8778702712', '8SW6NV7D', 'ACTIVE', 0, NULL, '2026-03-06 19:12:31', 0, NULL, '2026-03-02 18:19:29', '2026-03-06 13:42:31'),
(0x7f0b50a76d8e467cb7d144f26576da34, 'RENZO ROWAN', 'renzorowan1@gmail.com', '9876543216', 'S4GPUZEG', 'ACTIVE', 0, NULL, '2026-03-06 11:54:33', 0, NULL, '2026-03-02 18:22:27', '2026-03-06 06:24:33'),
(0x9bd0f8d2c1ee4ae4a2b93bba586f3381, 'JAYAPRAKASH B', 'bjayaprakash75@gmail.com', '8098985612', 'CAPHNB5G', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:13:41', '2026-03-02 18:13:41'),
(0xa2c6f2db04cf4679adeb97d1f2630f91, 'B KRISHNA', 'kmoorthy362@gmail.com', '9940955808', 'NVJE7YBD', 'ACTIVE', 0, NULL, '2026-03-06 19:20:24', 0, NULL, '2026-03-02 18:16:07', '2026-03-06 13:50:24'),
(0xa3b4c19c5d364742a74820b129d89b81, 'KUPPUSAMY', 'shobibuvi@gmail.com', '9791585924', 'U7UWPKYR', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:19:52', '2026-03-02 18:19:52'),
(0xada992157aed4af595ca9b6b512f3dd6, 'SARAVANAN', 'saranvijay4564@gmail.com', '9345160921', 'VHAHRATE', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:19:15', '2026-03-02 18:19:15'),
(0xae68fd7a22bf4044a6c3eb659acf01ac, 'RAJESHWARAN S', 'rajeshtrisha007@gmail.com', '7373139756', 'SCP9DMRW', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:19:21', '2026-03-02 18:19:21'),
(0xd12420858add461aba10af9c3cd3c564, 'GANDHI', 'dhigan88@gmail.com', '7811882453', 'WTCWDW6S', 'ACTIVE', 0, NULL, '2026-03-06 19:39:47', 0, NULL, '2026-03-02 18:20:01', '2026-03-06 14:09:47'),
(0xd6095f7044074372aa2478e5a9c524b2, 'ABI ARJU', 'abiarju36@gmail.com', '9789402227', 'CQSZK3FM', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:14:00', '2026-03-02 18:14:00'),
(0xd79f318a9eb543eb9b34fad18e3cca2d, 'ARUNKUMAR M', '55arunkavi1990@gmail.com', '9786544850', 'XF2JBEPF', 'ACTIVE', 0, NULL, '2026-03-06 19:30:45', 0, NULL, '2026-03-02 18:19:35', '2026-03-06 14:00:45'),
(0xf2127a94478c4a6e9216824abf35a521, 'KARTHIKEYAN', 'tkarthik8656@gmail.com', '8056511475', 'CCMZBZ5F', 'ACTIVE', 0, NULL, NULL, 0, NULL, '2026-03-02 18:14:20', '2026-03-02 18:14:20');

-- --------------------------------------------------------

--
-- Table structure for table `user_credentials`
--

CREATE TABLE `user_credentials` (
  `user_id` binary(16) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_changed_at` datetime DEFAULT NULL,
  `failed_login_attempts` tinyint(3) UNSIGNED DEFAULT 0,
  `login_blocked_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_credentials`
--

INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_changed_at`, `failed_login_attempts`, `login_blocked_until`) VALUES
(0x014c5ff501f0424f8254e5655a678acd, '$2y$10$ctQqAqLktyqo1pkQPqR8veocodi27vPJ06HDHjlLXIT2UM.KbS0/K', '2026-03-02 23:59:14', 0, NULL),
(0x12badb81b9eb4feaaa10014c59fdf6aa, '$2a$10$/i7AWU79z7XQv.UhiymdYOFaux0Hujg.PI1X8BovTkGibNZEEaki.', '2026-03-02 23:59:14', 0, NULL),
(0x1c3f49e8bffb4018b634c420e8ea910e, '$2a$10$2b/tycxBWslcSITObnwVoOvvu0mOnv/Xbx4Tqko2LVMt5ch.eYaky', '2026-03-02 23:59:14', 0, NULL),
(0x1f3877519d0346ecb457fee57c7b2cc0, '$2a$10$VWnSl0g0YTQm13bljDqx6udRrrGLMVJ2i5LDmyby4Z7cseN6IpDmK', '2026-03-02 23:59:14', 0, NULL),
(0x2ab82eb01a0d406c9148392acf97b38d, '$2y$10$UvrPcm0FeIcVR02l1iJdW.IEyFWBdXM25ypLiNOPlNji5et5aEwoO', '2026-03-02 23:59:14', 0, NULL),
(0x3ff8de4622804be0aa4e405d8c404df3, '$2a$10$YshRhOkbHjyOBccaIkIVvOH89ZMx88XoTz90qV6r9WArlstDu.HRu', '2026-03-06 19:33:21', 0, NULL),
(0x4f51468c74ac4af9bc3d04a529d21744, '$2a$10$FQJdd8O0meH1MHJIfZnpseHx5xry22yUiwa.Zmo/vSXxGOxUmbM4y', '2026-03-02 23:59:14', 0, NULL),
(0x5205fe0a7bea4952830f1027543245ee, '$2a$10$aSity.fwP9rJsvKwLBvBGOa2xKh4caP52.5mLKO03sD2c5TyyHcCC', '2026-03-06 19:51:54', 0, NULL),
(0x6adf89f150d14a64b3fdb03acf5da408, '$2a$10$k17mvz9ZZuQ4TyQRYns3yeyXXcG4D.UTVLDomI5vh/qMPsdI25tPW', '2026-03-02 23:59:14', 0, NULL),
(0x6b51b00bad414175ac1dcd93ce31c30e, '$2a$10$ejk9/daHXdoOgaqkIJjiWORhekzy24VGNnP3Et1/vvohS2yvJkKUy', '2026-03-02 23:59:14', 0, NULL),
(0x6fd05f2a70c540aa8cb9c5f80a63bc3e, '$2y$10$OM1gkqj07ugGibS2nNVbT.gPKaFo.4Kz3Zci4.UI/m1SMzghZygam', '2026-03-06 18:42:07', 0, NULL),
(0x75fe4201272e4aada72baed0b0834764, '$2a$10$8MP/CF.oJCm9TQx6I4wtKO8bFcPX6yDJF5KHc.budwjE1GCFAthXS', '2026-03-02 23:59:14', 0, NULL),
(0x78fe398c0e3c418e9f00092a62dbed38, '$2a$10$J1dS5YyFbPZqbC/XF.Tx.uMKAVZyHGUxbLaQbYftzWO5mloZxO6Jq', '2026-03-02 23:59:14', 0, NULL),
(0x7acdf7ad784648548203237921f87047, '$2a$10$Tlq4Po0O8uPqta.Lxe4bC.eK8wQg6uYQgcuaQ5Coq/VapXlIqAgqa', '2026-03-06 19:00:29', 0, NULL),
(0x7f0b50a76d8e467cb7d144f26576da34, '$2a$10$wwE89VQzgT/57OfBb0o8IOInvIv3VPQLk3mOzg4i3lwBsaPZMbVYC', '2026-03-02 23:59:14', 0, NULL),
(0x9bd0f8d2c1ee4ae4a2b93bba586f3381, '$2a$10$CZdOs8EWtLVNQ4OzqoABlO4ou4brqXWPoigDHJFkfTtFr.ywQWwIa', '2026-03-02 23:59:14', 0, NULL),
(0xa2c6f2db04cf4679adeb97d1f2630f91, '$2a$10$TwnKA0li8DQcX0SHsMh3BeBDSi2B72Vckt14H5ZxlL6dP6FBdCwle', '2026-03-06 19:20:17', 0, NULL),
(0xa3b4c19c5d364742a74820b129d89b81, '$2a$10$QenKgMouhzacAQpPUWt42.YZSnH9k2u5JQ.U2.n/Ha3ZPz6oFzEi2', '2026-03-02 23:59:14', 0, NULL),
(0xada992157aed4af595ca9b6b512f3dd6, '$2a$10$Byn5HKt3yH1Mj26SGRsBE.4Bv5fryEuhxS1ftiUezx0XUeXyu0aj.', '2026-03-02 23:59:14', 0, NULL),
(0xae68fd7a22bf4044a6c3eb659acf01ac, '$2a$10$0ppemowGk05tYK9FrmzTIecv0XPwulevisdJYk3FJymVorPK1tXDq', '2026-03-02 23:59:14', 0, NULL),
(0xd12420858add461aba10af9c3cd3c564, '$2a$10$DJveKJxDkwXwcAeD7ESQoOdG9zTMDZ4SZzrl2/U7Zv.POD9gw3N.i', '2026-03-06 19:39:42', 0, NULL),
(0xd6095f7044074372aa2478e5a9c524b2, '$2a$10$Xu5WxH.Atx7xyIH.cDaL8OU09ueDjys4b1B7a40N5jN2Ww24KIyXu', '2026-03-02 23:59:14', 0, NULL),
(0xd79f318a9eb543eb9b34fad18e3cca2d, '$2a$10$cshz9/UA7/jbnh0XN4VjE.jv6ysRJwBW9lW465Mhg0XhOOeLV1/2q', '2026-03-06 19:26:43', 0, NULL),
(0xf2127a94478c4a6e9216824abf35a521, '$2a$10$NWa0DiABAWuwMXnO8LHPA.CVWLc8mNfT9JNsFlxrhtGL/7fTKKN0i', '2026-03-02 23:59:14', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` binary(16) NOT NULL,
  `device_name` varchar(150) DEFAULT NULL,
  `device_id` varchar(500) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `ram_size` varchar(10) DEFAULT NULL,
  `fcm_token` varchar(255) NOT NULL,
  `android_version` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_otps`
--

CREATE TABLE `user_otps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` binary(16) NOT NULL,
  `code` varchar(6) NOT NULL,
  `type` enum('LOGIN','RESET','VERIFY','RESTORE','FORGOT') NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `user_id` binary(16) NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `address_line1` varchar(150) DEFAULT NULL,
  `address_line2` varchar(150) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`user_id`, `gender`, `date_of_birth`, `profile_image_url`, `address_line1`, `address_line2`, `city`, `state`, `country`, `postal_code`) VALUES
(0x014c5ff501f0424f8254e5655a678acd, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x12badb81b9eb4feaaa10014c59fdf6aa, 'MALE', '2026-03-04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x1c3f49e8bffb4018b634c420e8ea910e, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x1f3877519d0346ecb457fee57c7b2cc0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x2ab82eb01a0d406c9148392acf97b38d, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x3ff8de4622804be0aa4e405d8c404df3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x4f51468c74ac4af9bc3d04a529d21744, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x5205fe0a7bea4952830f1027543245ee, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x6adf89f150d14a64b3fdb03acf5da408, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x6b51b00bad414175ac1dcd93ce31c30e, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x6fd05f2a70c540aa8cb9c5f80a63bc3e, 'MALE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x75fe4201272e4aada72baed0b0834764, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x78fe398c0e3c418e9f00092a62dbed38, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x7acdf7ad784648548203237921f87047, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0x7f0b50a76d8e467cb7d144f26576da34, 'MALE', '2017-01-17', 'uploads/7f0b50a7-6d8e-467c-b7d1-44f26576da34/profile/profile-1772691335768-775096481.jpg', 'முத்துராஜ் நகர்', 'முருக பவனம்', 'திண்டுக்கல்', 'தமிழ்நாடு', 'இந்தியா', '624001'),
(0x9bd0f8d2c1ee4ae4a2b93bba586f3381, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xa2c6f2db04cf4679adeb97d1f2630f91, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xa3b4c19c5d364742a74820b129d89b81, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xada992157aed4af595ca9b6b512f3dd6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xae68fd7a22bf4044a6c3eb659acf01ac, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xd12420858add461aba10af9c3cd3c564, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xd6095f7044074372aa2478e5a9c524b2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xd79f318a9eb543eb9b34fad18e3cca2d, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(0xf2127a94478c4a6e9216824abf35a521, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_referrals`
--

CREATE TABLE `user_referrals` (
  `referrer_user_id` binary(16) NOT NULL,
  `referred_user_id` binary(16) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` binary(16) NOT NULL,
  `login_at` datetime NOT NULL,
  `logout_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_admins_email` (`email`),
  ADD UNIQUE KEY `uk_admins_mobile` (`mobile`),
  ADD KEY `idx_admins_status` (`status`),
  ADD KEY `idx_admins_deleted` (`is_deleted`),
  ADD KEY `idx_admins_last_login` (`last_login_at`);

--
-- Indexes for table `default_functions`
--
ALTER TABLE `default_functions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_feedback_user` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_user_created` (`user_id`,`created_at`),
  ADD KEY `idx_user_read` (`user_id`,`is_read`);

--
-- Indexes for table `persons`
--
ALTER TABLE `persons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_person_per_user` (`user_id`,`first_name`,`last_name`,`mobile`,`city`),
  ADD KEY `idx_persons_user` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transactions_user` (`user_id`),
  ADD KEY `idx_transactions_person` (`person_id`),
  ADD KEY `idx_transactions_date` (`transaction_date`),
  ADD KEY `idx_transactions_type` (`type`),
  ADD KEY `idx_user_person_date` (`user_id`,`person_id`,`transaction_date`),
  ADD KEY `idx_transactions_function` (`transaction_function_id`);

--
-- Indexes for table `transaction_functions`
--
ALTER TABLE `transaction_functions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tf_user` (`user_id`),
  ADD KEY `idx_tf_date` (`function_date`),
  ADD KEY `idx_tf_image` (`image_url`);

--
-- Indexes for table `upcoming_functions`
--
ALTER TABLE `upcoming_functions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_upcoming_user` (`user_id`),
  ADD KEY `idx_upcoming_date` (`function_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_users_email` (`email`),
  ADD UNIQUE KEY `uk_users_mobile` (`mobile`),
  ADD UNIQUE KEY `uk_users_referral` (`referral_code`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_deleted` (`is_deleted`),
  ADD KEY `idx_users_activity` (`last_activity_at`);

--
-- Indexes for table `user_credentials`
--
ALTER TABLE `user_credentials`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `idx_login_blocked_until` (`login_blocked_until`);

--
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_user_token` (`user_id`,`fcm_token`),
  ADD UNIQUE KEY `uq_user_device` (`user_id`,`device_id`),
  ADD KEY `idx_user_devices_user` (`user_id`),
  ADD KEY `idx_user_devices_token` (`fcm_token`(64));

--
-- Indexes for table `user_otps`
--
ALTER TABLE `user_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otps_user` (`user_id`),
  ADD KEY `idx_otps_expiry` (`expires_at`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_referrals`
--
ALTER TABLE `user_referrals`
  ADD PRIMARY KEY (`referred_user_id`),
  ADD UNIQUE KEY `uk_referred` (`referred_user_id`),
  ADD KEY `idx_referrer` (`referrer_user_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sessions_user` (`user_id`),
  ADD KEY `idx_sessions_login` (`login_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_otps`
--
ALTER TABLE `user_otps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `persons`
--
ALTER TABLE `persons`
  ADD CONSTRAINT `persons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`person_id`) REFERENCES `persons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaction_functions`
--
ALTER TABLE `transaction_functions`
  ADD CONSTRAINT `transaction_functions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `upcoming_functions`
--
ALTER TABLE `upcoming_functions`
  ADD CONSTRAINT `upcoming_functions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_credentials`
--
ALTER TABLE `user_credentials`
  ADD CONSTRAINT `user_credentials_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_otps`
--
ALTER TABLE `user_otps`
  ADD CONSTRAINT `user_otps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_referrals`
--
ALTER TABLE `user_referrals`
  ADD CONSTRAINT `user_referrals_ibfk_1` FOREIGN KEY (`referrer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_referrals_ibfk_2` FOREIGN KEY (`referred_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
