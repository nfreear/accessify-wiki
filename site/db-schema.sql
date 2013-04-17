--
-- SQLite database schema
--
-- https://scraperwiki.com/views/accessify-form
--


CREATE TABLE `fixes` (
  `updated` text,
  `name` text,
  `url` text,
  `yaml` text,
  `key` text,
  `email` text
)

CREATE TABLE `include_map` (
  `pattern` text,
  `key` text
)


-- End.
