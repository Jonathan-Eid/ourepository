<?php $cwd[__FILE__] = __FILE__;
if (is_link($cwd[__FILE__])) $cwd[__FILE__] = readlink($cwd[__FILE__]);
$cwd[__FILE__] = dirname($cwd[__FILE__]);

require_once($cwd[__FILE__] . "/my_query.php");

$drop_tables = false;

if ($drop_tables) {
	query_our_db("DROP TABLE users");
	query_our_db("DROP TABLE projects");
    query_our_db("DROP TABLE mosaics");
    query_our_db("DROP TABLE tiling_trace");
    query_our_db("DROP TABLE mosaic_progress");
    query_our_db("DROP TABLE folders");
    query_our_db("DROP TABLE folder_assignments");
    query_our_db("DROP TABLE labels");
    query_our_db("DROP TABLE points");
    query_our_db("DROP TABLE `lines`");
    query_our_db("DROP TABLE polygons");
    query_our_db("DROP TABLE rectangles");
    query_our_db("DROP TABLE project_access");
    query_our_db("DROP TABLE mosaic_access");
    query_our_db("DROP TABLE label_access");
    query_our_db("DROP TABLE label_mosaics");
}

query_our_db("DROP TABLE mark_attributes");
query_our_db("DROP TABLE jobs");
query_our_db("DROP TABLE prediction");

query_our_db($query);

$query = "CREATE TABLE `tiling_trace` (
	`mosaic_id` INT(11) NOT NULL,
    `trace` BLOB default NULL,

	PRIMARY KEY(`mosaic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(256) NOT NULL,
	`name` VARCHAR(128) NOT NULL,
	`given_name` VARCHAR(64) NOT NULL,
	`family_name` VARCHAR(64) NOT NULL,

	PRIMARY KEY(`id`),
	UNIQUE KEY(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `projects` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`owner_id` INT(11) NOT NULL, 
    `name` VARCHAR(128) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY(`id`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `project_access` (
	`user_id` INT(11) NOT NULL, 
	`project_id` INT(11) NOT NULL, 
    `type` VARCHAR(16) NOT NULL,

	PRIMARY KEY (`user_id`, `project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);


$query = "CREATE TABLE `mosaic_access` (
    `owner_id` INT(11) NOT NULL,
	`user_id` INT(11) NOT NULL, 
	`mosaic_id` INT(11) NOT NULL, 
    `type` VARCHAR(16) NOT NULL,

	PRIMARY KEY (`user_id`, `mosaic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);


$query = "CREATE TABLE `folders` (
    `folder_id` INT(11) NOT NULL AUTO_INCREMENT,
    `owner_id` INT(11) NOT NULL,
    `name` VARCHAR(128) NOT NULL,

    PRIMARY KEY (`folder_id`),
    UNIQUE KEY (`owner_id`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `folder_assignments` (
    `owner_id` INT(11) NOT NULL,
    `mosaic_id` INT(11) NOT NULL,
    `folder_id` INT(11) NOT NULL,

    PRIMARY KEY (`owner_id`, `mosaic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `labels` (
    `label_id` INT(11) NOT NULL AUTO_INCREMENT,
    `label_name` VARCHAR(256) NOT NULL,
    `label_type` VARCHAR(32) NOT NULL,
    `label_color` VARCHAR(7),

    PRIMARY KEY (`label_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `label_mosaics` (
    `label_id` INT(11) NOT NULL,
    `mosaic_id` INT(11) NOT NULL,

    PRIMARY KEY (`label_id`, `mosaic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";
query_our_db($query);

$query = "CREATE TABLE `label_access` (
    `label_id` INT(11) NOT NULL,
    `user_id` INT(11) NOT NULL,
    `access` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`label_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";
query_our_db($query);

$query = "CREATE TABLE `polygons` (
    `polygon_id` INT(11) NOT NULL AUTO_INCREMENT,
    `owner_id` INT(11) NOT NULL,
    `mosaic_id` INT(11) NOT NULL,
    `label_id` INT(11) NOT NULL,
    `points_str` BLOB NOT NULL,

    PRIMARY KEY (`polygon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `mark_attributes` (
    `mark_id` int(11) NOT NULL,
    `attribute_key` varchar(125) NOT NULL,
    `attribute_value` varchar(125) NOT NULL,

    KEY `mark_id` (`mark_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);


$query = "CREATE TABLE `jobs` (
    `job_id` INT(11) NOT NULL AUTO_INCREMENT,
    `owner_id` INT(11) NOT NULL,
    `mosaic_id` INT(11) NOT NULL,
    `label_id` INT(11) NOT NULL,
    `name` VARCHAR(128) NOT NULL,

    PRIMARY KEY (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);

$query = "CREATE TABLE `prediction` (
    `prediction_id` INT(11) NOT NULL AUTO_INCREMENT,
    `job_id` INT(11) NOT NULL,
    `owner_id` INT(11) NOT NULL,
    `mosaic_id` INT(11) NOT NULL,
    `label_id` INT(11) NOT NULL,
    `mark_id` INT(11) NOT NULL,
    `prediction` double NOT NULL,
 
    PRIMARY KEY (`prediction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";

query_our_db($query);





?>
