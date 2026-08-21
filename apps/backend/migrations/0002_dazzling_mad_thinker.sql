DROP TABLE `permissions`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`payment_method` text,
	`payment_status` text DEFAULT 'pending',
	`razorpay_order_id` text,
	`razorpay_payment_id` text,
	`razorpay_signature` text,
	`created_at` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_payments`("id", "order_id", "payment_method", "payment_status", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "created_at") SELECT "id", "order_id", "payment_method", "payment_status", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "created_at" FROM `payments`;--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
ALTER TABLE `__new_payments` RENAME TO `payments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `orders` ADD `payment_method` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `payment_status` text DEFAULT 'pending';