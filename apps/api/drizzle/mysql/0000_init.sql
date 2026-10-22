CREATE TABLE `items` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` varchar(500),
	`created_at` timestamp(3) NOT NULL,
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
