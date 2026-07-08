/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 8.0.26 : Database - bencao_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`bencao_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `bencao_db`;

/*Table structure for table `herbs` */

DROP TABLE IF EXISTS `herbs`;

CREATE TABLE `herbs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pinyin` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nature` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channels` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `efficacy` text COLLATE utf8mb4_unicode_ci,
  `usage` text COLLATE utf8mb4_unicode_ci,
  `contraindications` text COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `herbs` */

insert  into `herbs`(`id`,`name`,`pinyin`,`category`,`nature`,`channels`,`description`,`efficacy`,`usage`,`contraindications`,`imageUrl`) values 
(1,'人参','Ren Shen','补气药','甘、微苦，微温','脾,肺,心','人参被称为\'百草之王\'，是著名的补气中药。','大补元气，复脉固脱，补脾益肺，生津养血，安神益智。','3~9g，另煎兑服；也可研末吞服。','实证、热证而正气不虚者忌服。反莱菔子，畏五灵脂。','/images/renshen.jpg'),
(2,'枸杞子','Gou Qi Zi','补阴药','甘，平','肝,肾','传统的滋补佳品，药食同源。','滋补肝肾，益精明目。','6~12g。','外感实热、脾虚泄泻者慎服。','/images/gouqizi.jpg'),
(3,'当归','Dang Gui','补血药','甘、辛，温','肝,心,脾','补血第一药，妇科圣药。','补血活血，调经止痛，润肠通便。','6~12g。','湿盛中满，大便泄泻者忌服。','/images/danggui.jpg'),
(4,'黄芪','Huang Qi','补气药','甘，微温','脾,肺','常用的补气药，常与人参同用。','补气升阳，固表止汗，利水消肿，生津养血，行滞通痹，托毒排脓，敛疮生肌。','9~30g。','表实邪盛，气滞湿阻，食积停滞，阴虚阳亢，痈疽初起或溃后热毒尚盛等实证忌用。','/images/huangqi.jpg'),
(5,'菊花','Ju Hua','解表药','辛、甘、苦，微寒','肺,肝','常用清热解毒药材。','疏散风热，平抑肝阳，清肝明目，清热解毒。','5~10g。','气虚胃寒，食少泄泻者慎服。','/images/juhua.jpg'),
(6,'甘草','Gan Cao','补气药','甘，平','心,肺,脾,胃','调和诸药，应用极其广泛。','补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。','2~10g。','不宜与海藻、京大戟、红大戟、甘遂、芫花同用。','/images/gancao.jpg'),
(7,'茯苓','Fu Ling','利水渗湿药','甘、淡，平','心,肺,脾,肾','利水渗湿，健脾，宁心。','利水渗湿，健脾，宁心。','10~15g。','阴虚而无湿热、虚寒滑精、气虚下陷者慎服。','/images/fuling.jpg'),
(8,'川芎','Chuan Xiong','活血化瘀药','辛，温','肝,胆,心包','为\'血中之气药\'，善行血中风气。','活血行气，祛风止痛。','3~10g。','阴虚火旺，舌红口干者，及月经过多、出血性疾病者慎用。','/images/chuanxiong.jpg'),
(9,'金银花','Jin Yin Hua','清热药','甘，寒','肺,心,胃','自古被誉为清热解毒的良药。','清热解毒，疏散风热。','6~15g。','脾胃虚寒及气虚疮疡脓清者忌用。','/images/jinyinhua.jpg'),
(10,'陈皮','Chen Pi','理气药','苦、辛，温','肺,脾','理气健脾，燥湿化痰。','理气健脾，燥湿化痰。','3~10g。','气虚体燥，阴虚燥咳，吐血及内有实热者慎服。','/images/chenpi.jpg');

/*Table structure for table `tests` */

DROP TABLE IF EXISTS `tests`;

CREATE TABLE `tests` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `result` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `tests` */

insert  into `tests`(`id`,`username`,`result`,`created_at`) values 
('1773154738703','访客','气虚质','2026-03-10 22:58:58'),
('1773154764821','访客','平和质','2026-03-10 22:59:24'),
('1773154778587','访客','气虚质','2026-03-10 22:59:38');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salt` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default.png',
  `role` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`salt`,`passwordHash`,`avatar`,`role`,`created_at`) values 
('1773153221378','admin','e3dfe17e11dab71702c9fce93104abdd','ce82f17c4d594b9a775782c1a2b32dbfd93fc3b526c2bfd5c479b0b7284c324ffb8e52724e3556b0dd3a0d8a76875e35dcd86dc031a58ac82763a90b7ee0b9b0','default.png','admin','2026-03-10 22:33:41'),
('1773153246024','123','0b668757782feaa908eeebcbb6f31a84','bf34c17f5f784be605d6e1b9e26f6c14e8ebc599fb354c71be6b568c63f4d561583a36f3f8f23e1fd7687ab6c21495aafedb331c6aba0d8f12cd56ed0fa0a5e3','default.png','user','2026-03-10 22:34:06');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
