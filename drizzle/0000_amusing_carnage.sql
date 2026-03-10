CREATE TABLE `agent_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` text NOT NULL,
	`log_lines` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`current_dir` text NOT NULL,
	`project_id` text,
	`system_prompt` text NOT NULL,
	`agent_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`current_dir` text NOT NULL,
	`coding_agent_cli` text DEFAULT 'gemini' NOT NULL,
	`allowed_emails_modification` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
