CREATE TABLE `admin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_email` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`number_of_people` integer NOT NULL,
	`message` text DEFAULT 'N/A',
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_booking_id_unique` ON `bookings` (`booking_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_address` text NOT NULL,
	`customer_email` text NOT NULL,
	`longitude` text DEFAULT 'none',
	`latitude` text DEFAULT 'none',
	`total_amount` real NOT NULL,
	`status` text DEFAULT 'pending',
	`payment_method` text,
	`payment_status` text DEFAULT 'pending',
	`created_at` text,
	`razorpay_signature` text,
	`razorpay_payment_id` text,
	`razorpay_order_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_id_unique` ON `orders` (`order_id`);--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`quantity` text DEFAULT '1',
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`new_orders` integer DEFAULT true NOT NULL,
	`new_bookings` integer DEFAULT true NOT NULL
);
