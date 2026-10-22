CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(120) NOT NULL,
	`description` text(500),
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
