--
-- SQLite database schema - Accessify Wiki form.
--
-- https://scraperwiki.com/views/accessify-form
-- http://sqlite.org/lang_expr.html
--


DROP TABLE IF EXISTS `fixes`;
CREATE TABLE `fixes` (
  `updated` text,
  `name` text,
  `url` text,
  `yaml` text,
  `key` text,
  `email` text,
  `status` text,
  `comment` text,
  `intouch` text,
  `active` text
);

DROP TABLE IF EXISTS `include_map`;
CREATE TABLE `include_map` (
  `pattern` text,
  `key` text,
  `locale` text
);


--SELECT * FROM `fixes` WHERE `key` LIKE '34a79%' ORDER BY `updated` DESC;
--SELECT * FROM `fixes` WHERE key GLOB '34a79*' ORDER BY updated DESC LIMIT 1; -- 2013-05-09T20:17:26.407904
--SELECT * FROM `fixes` WHERE key = '34a79d6f1309b206a8f28660212c2523' ORDER BY updated DESC LIMIT 1;
Select  * FROM `acfy`.`fixes` WHERE `key` = ? ORDER BY `updated` DESC LIMIT 1;
Select  * FROM `acfy`.`include_map`;


-- End.
