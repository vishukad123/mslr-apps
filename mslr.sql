-- MySQL dump for MSLR
-- Updated by [Your Name] for CO3102 CW2

DROP DATABASE IF EXISTS mslr_db;
CREATE DATABASE mslr_db;
USE mslr_db;

-- Table for referendums
DROP TABLE IF EXISTS `referendum`;
CREATE TABLE `referendum` (
  `referendum_id` int NOT NULL AUTO_INCREMENT,
  `title` longtext,
  `description` longtext,
  `status` ENUM('open', 'closed') DEFAULT 'closed',
  PRIMARY KEY (`referendum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

INSERT INTO `referendum` VALUES 
(1, 'Should Shangri-La pursue an expansion of its administrative boundaries to incorporate adjacent counties?', 'Debate on boundary expansion.', 'open'),
(2, 'Should Shangri-La prohibit cigarette sales?', 'Public health initiative.', 'open');

-- Table for options
DROP TABLE IF EXISTS `referendum_options`;
CREATE TABLE `referendum_options` (
  `opt_id` int NOT NULL AUTO_INCREMENT,
  `referendum_id` int DEFAULT NULL,
  `option_text` longtext,
  `description` longtext,
  PRIMARY KEY (`opt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

INSERT INTO `referendum_options` VALUES 
(1, 1, 'Expand to all adjacent counties', 'Full expansion.'),
(2, 1, 'Remain status quo', 'No change.'),
(3, 2, 'Yes', 'Ban sales.'),
(4, 2, 'No', 'Allow sales.');

-- Table for voters
DROP TABLE IF EXISTS `voters`;
CREATE TABLE `voters` (
  `voter_email` varchar(50) NOT NULL,
  `fullname` varchar(45) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `passwordhash` varchar(255) NOT NULL,
  `scc` varchar(10) NOT NULL UNIQUE,
  PRIMARY KEY (`voter_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for voter history
DROP TABLE IF EXISTS `voter_history`;
CREATE TABLE `voter_history` (
  `voter_email` varchar(50) NOT NULL,
  `voted_referendum_id` int NOT NULL,
  `voted_option_id` int NOT NULL,
  `vote_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`voter_email`, `voted_referendum_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pre-insert EC (use bcrypt hash for 'Shangrilavote&2025@' in code, but placeholder)
INSERT INTO `voters` (voter_email, fullname, dob, passwordhash, scc) VALUES 
('ec@referendum.gov.sr', 'Election Commission', '1900-01-01', '$2b$10$placeholderhash', 'ADMINCODE');