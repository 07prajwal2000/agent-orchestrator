import { z } from "zod";

// Schema for GitHub Webhook: Issue event
// Docs: https://docs.github.com/en/webhooks/webhook-events-and-payloads#issues
export const issueWebhookSchema = z
	.object({
		action: z.enum([
			"opened",
			"edited",
			"deleted",
			"transferred",
			"pinned",
			"unpinned",
			"closed",
			"reopened",
			"assigned",
			"unassigned",
			"labeled",
			"unlabeled",
			"locked",
			"unlocked",
			"milestoned",
			"demilestoned",
		]),
		issue: z.object({
			number: z.number(),
			title: z.string(),
			body: z.string().nullable().optional(),
			state: z.string(),
			html_url: z.string().url().optional(),
			labels: z.array(z.object({ name: z.string() })).optional(),
			user: z
				.object({
					login: z.string(),
					email: z.string().optional().nullable(),
				})
				.optional(),
		}),
		repository: z
			.object({
				full_name: z.string(),
				clone_url: z.string().url().optional(),
				ssh_url: z.string().optional(),
			})
			.optional(),
		sender: z
			.object({
				login: z.string(),
				email: z.string().optional().nullable(),
			})
			.optional(),
	})
	.passthrough();

// Schema for GitHub Webhook: Issue Comment event
export const issueCommentWebhookSchema = z
	.object({
		action: z.enum(["created", "edited", "deleted"]),
		issue: z.object({
			number: z.number(),
			title: z.string(),
			body: z.string().nullable().optional(),
			state: z.string(),
			html_url: z.string().url().optional(),
			labels: z.array(z.object({ name: z.string() })).optional(),
		}),
		comment: z.object({
			body: z.string(),
			html_url: z.string().url().optional(),
			user: z.object({
				login: z.string(),
				email: z.string().optional().nullable(),
			}),
		}),
		repository: z
			.object({
				full_name: z.string(),
				clone_url: z.string().url().optional(),
				ssh_url: z.string().optional(),
			})
			.optional(),
		sender: z
			.object({
				login: z.string(),
				email: z.string().optional().nullable(),
			})
			.optional(),
	})
	.passthrough();

// Custom schema for spawning an agent
export const spawnAgentSchema = z.object({
	projectId: z.string().uuid(),
	title: z.string(),
	description: z.string(),
	workDirectory: z.string(),
	agentTool: z.enum(["gemini-cli"]),
});

export const createProjectSchema = z.object({
	id: z.string().uuid().optional(), // Can optionally provide from client
	name: z.string().min(1, "Name is required"),
	description: z.string(),
	currentDir: z.string().min(1, "Directory is required"),
	codingAgentCli: z.string().default("gemini"),
	allowedEmailsModification: z.string().default(""),
});

export const updateProjectSchema = createProjectSchema.omit({ id: true });
