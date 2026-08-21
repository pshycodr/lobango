PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_email` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`number_of_people` integer NOT NULL,
	`message` text DEFAULT 'N/A',
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_bookings`("id", "booking_id", "customer_name", "customer_phone", "customer_email", "date", "time", "number_of_people", "message", "status", "created_at") SELECT "id", "booking_id", "customer_name", "customer_phone", "customer_email", "date", "time", "number_of_people", "message", "status", "created_at" FROM `bookings`;--> statement-breakpoint
DROP TABLE `bookings`;--> statement-breakpoint
ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_booking_id_unique` ON `bookings` (`booking_id`);--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_address` text NOT NULL,
	`customer_email` text NOT NULL,
	`longitude` text DEFAULT 'none',
	`latitude` text DEFAULT 'none',
	`total_amount` text NOT NULL,
	`payment_method` text NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "order_id", "customer_name", "customer_phone", "customer_address", "customer_email", "longitude", "latitude", "total_amount", "payment_method", "payment_status", "created_at", "status") SELECT "id", "order_id", "customer_name", "customer_phone", "customer_address", "customer_email", "longitude", "latitude", "total_amount", "payment_method", "payment_status", "created_at", "status" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_id_unique` ON `orders` (`order_id`);--> statement-breakpoint
CREATE TABLE `__new_orderItems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`quantity` text DEFAULT '1' NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_orderItems`("id", "order_id", "name", "price", "quantity") SELECT "id", "order_id", "name", "price", "quantity" FROM `orderItems`;--> statement-breakpoint
DROP TABLE `orderItems`;--> statement-breakpoint
ALTER TABLE `__new_orderItems` RENAME TO `orderItems`;