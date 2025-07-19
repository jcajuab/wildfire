CREATE TABLE `displays` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	CONSTRAINT `displays_id` PRIMARY KEY(`id`),
	CONSTRAINT `displays_name_unique` UNIQUE(`name`),
	CONSTRAINT `displays_slug_unique` UNIQUE(`slug`)
);
