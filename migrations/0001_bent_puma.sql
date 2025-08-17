CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY NOT NULL,
	`task` text NOT NULL,
	`due_date` text NOT NULL,
	`user_id` integer,
	`completed` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "age" TO "age" integer NOT NULL DEFAULT 18;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `users` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `has_added_task` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `theme` text DEFAULT 'default' NOT NULL;