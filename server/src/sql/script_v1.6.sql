-- MySQL Script generated by MySQL Workbench
-- dom 25 abr 2021 16:02:15
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mktwar
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mktwar` ;

-- -----------------------------------------------------
-- Schema mktwar
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mktwar` ;
USE `mktwar` ;

-- -----------------------------------------------------
-- Table `mktwar`.`player`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mktwar`.`player` ;

CREATE TABLE IF NOT EXISTS `mktwar`.`player` (
  `player_id` INT NOT NULL AUTO_INCREMENT,
  `player_name` VARCHAR(90) NULL,
  `player_username` VARCHAR(90) NULL,
  `player_password` VARCHAR(256) NULL,
  `player_trophies` INT NULL,
  `player_avatar` INT NULL,
  `player_coins` INT NULL,
  PRIMARY KEY (`player_id`),
  UNIQUE INDEX `player_username_UNIQUE` (`player_username` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mktwar`.`player_stats`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mktwar`.`player_stats` ;

CREATE TABLE IF NOT EXISTS `mktwar`.`player_stats` (
  `stats_player_id` INT NOT NULL,
  `stats_total_games` INT NULL,
  `stats_max_trophies` INT NULL,
  `stats_total_losses` INT NULL,
  `stats_total_wins` INT NULL,
  `stats_total_ties` INT NULL,
  PRIMARY KEY (`stats_player_id`),
  CONSTRAINT `fk_player_stats_id`
    FOREIGN KEY (`stats_player_id`)
    REFERENCES `mktwar`.`player` (`player_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mktwar`.`player_settings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mktwar`.`player_settings` ;

CREATE TABLE IF NOT EXISTS `mktwar`.`player_settings` (
  `sett_player_id` INT NOT NULL,
  `sett_sound_on` TINYINT NULL,
  PRIMARY KEY (`sett_player_id`),
  CONSTRAINT `fk_player_settings_id`
    FOREIGN KEY (`sett_player_id`)
    REFERENCES `mktwar`.`player` (`player_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mktwar`.`match_status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mktwar`.`match_status` ;

CREATE TABLE IF NOT EXISTS `mktwar`.`match_status` (
  `match_status_id` INT NOT NULL,
  `match_status_name` VARCHAR(45) NULL,
  PRIMARY KEY (`match_status_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mktwar`.`_match`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mktwar`.`_match` ;

CREATE TABLE IF NOT EXISTS `mktwar`.`_match` (
  `match_id` INT NOT NULL AUTO_INCREMENT,
  `round` INT NULL,
  `match_status` INT NULL,
  `last_question` VARCHAR(45) NULL,
  `opponent_id` INT NULL,
  `owner_id` INT NULL,
  `owner_ready` TINYINT NULL DEFAULT 0,
  `opponent_ready` TINYINT NULL DEFAULT 0,
  `owner_last_answer` INT NULL,
  `opponent_last_answer` INT NULL,
  `owner_score` INT NULL,
  `opponent_score` INT NULL,
  `owner_disconnected` TINYINT NULL,
  `opponent_disconnected` TINYINT NULL,
  `winner_id` INT NULL,
  PRIMARY KEY (`match_id`),
  INDEX `fk_match_player_id_idx` (`owner_id` ASC) VISIBLE,
  INDEX `fk_match_opponent_id_idx` (`opponent_id` ASC) VISIBLE,
  INDEX `fk_match_status_id_idx` (`match_status` ASC) VISIBLE,
  CONSTRAINT `fk_match_owner_id`
    FOREIGN KEY (`owner_id`)
    REFERENCES `mktwar`.`player` (`player_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_match_opponent_id`
    FOREIGN KEY (`opponent_id`)
    REFERENCES `mktwar`.`player` (`player_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_match_status_id`
    FOREIGN KEY (`match_status`)
    REFERENCES `mktwar`.`match_status` (`match_status_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mktwar`.`online_players`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mktwar`.`online_players` ;

CREATE TABLE IF NOT EXISTS `mktwar`.`online_players` (
  `online_player_id` INT NOT NULL,
  `online_player_socketid` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`online_player_id`),
  CONSTRAINT `fk_online_players_id`
    FOREIGN KEY (`online_player_id`)
    REFERENCES `mktwar`.`player` (`player_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;



-- Match status populate
INSERT INTO match_status (match_status_id, match_status_name) VALUES (1, "pending");
INSERT INTO match_status (match_status_id, match_status_name) VALUES (2, "lobby");
INSERT INTO match_status (match_status_id, match_status_name) VALUES (3, "playing");
INSERT INTO match_status (match_status_id, match_status_name) VALUES (4, "disconnected");
INSERT INTO match_status (match_status_id, match_status_name) VALUES (5, "ended");
