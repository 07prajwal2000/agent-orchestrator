import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
	id: text("id").primaryKey(), // UUID
	name: text("name").notNull(),
	description: text("description").notNull(),
	currentDir: text("current_dir").notNull(),
	codingAgentCli: text("coding_agent_cli").notNull().default("gemini"),
	allowedEmailsModification: text("allowed_emails_modification").notNull(), // Comma separated email ids
	createdAt: text("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const agents = sqliteTable("agents", {
	id: text("id").primaryKey(), // UUID
	currentDir: text("current_dir").notNull(),
	projectId: text("project_id").references(() => projects.id),
	systemPrompt: text("system_prompt").notNull(),
	agentStatus: text("agent_status").notNull().default("pending"), // pending, started, finished, error
	createdAt: text("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const agentLogs = sqliteTable("agent_logs", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	agentId: text("agent_id")
		.notNull()
		.references(() => agents.id),
	logLines: text("log_lines").notNull(), // Huge text
});
