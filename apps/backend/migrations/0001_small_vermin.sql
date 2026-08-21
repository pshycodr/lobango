CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`payment_method` text,
	`payment_status` text DEFAULT 'pending',
	`razorpay_order_id` text,
	`razorpay_payment_id` text,
	`razorpay_signature` text,
	`created_at` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `payment_method`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `payment_status`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `razorpay_signature`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `razorpay_payment_id`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `razorpay_order_id`;