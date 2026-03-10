import { z } from "zod";
import {
	issueWebhookSchema,
	issueCommentWebhookSchema,
	spawnAgentSchema,
} from "./schemas";

type IssueWebhookPayload = z.infer<typeof issueWebhookSchema>;
type IssueCommentWebhookPayload = z.infer<typeof issueCommentWebhookSchema>;
type SpawnAgentPayload = z.infer<typeof spawnAgentSchema>;

export class SystemPromptBuilder {
	/**
	 * Generates a system prompt based on a general custom payload structure.
	 */
	static fromCustomTask(payload: SpawnAgentPayload): string {
		return `You are an AI Coding Agent assigned to complete a task.

Project ID: ${payload.projectId}
Working Directory: ${payload.workDirectory}

Task Title: ${payload.title}
Task Description: 
${payload.description}

Please analyze the request, understand the desired outcome, and use the provided tools to generate a solution.`;
	}

	/**
	 * Generates a system prompt based on a GitHub Issue webhook payload.
	 */
	static fromIssuePayload(
		payload: IssueWebhookPayload,
		projectId: string,
	): string {
		const { action, issue, repository, sender } = payload;

		return `You are an AI Coding Agent assigned to process a GitHub Issue.

Project ID: ${projectId}
Repository: ${repository?.full_name || "Unknown"}
Repo Clone URL: ${repository?.clone_url || "Unknown"}

Event Details:
- Action Performed: ${action}
- Triggered by: ${sender?.login || "Unknown"}

Issue Details:
- Issue #${issue.number}: ${issue.title}
- State: ${issue.state}
- Reported by: ${issue.user?.login || "Unknown"}
- Issue URL: ${issue.html_url || "Unknown"}

Issue Description:
${issue.body ? issue.body : "No description provided."}

Based on this issue context, formulate your task execution plan or generate the appropriate agent output to resolve or handle this issue.`;
	}

	/**
	 * Generates a system prompt based on a GitHub Issue Comment webhook payload.
	 */
	static fromIssueCommentPayload(
		payload: IssueCommentWebhookPayload,
		projectId: string,
	): string {
		const { action, issue, comment, repository, sender } = payload;

		return `You are an AI Coding Agent handling new feedback or instructions on an existing GitHub Issue.

Project ID: ${projectId}
Repository: ${repository?.full_name || "Unknown"}

Event Details:
- Comment Action: ${action}
- Commented By: ${sender?.login || "Unknown"}

Issue Context:
- Issue #${issue.number}: ${issue.title}

New Comment Provided:
${comment.body}

Please review the issue context and the new comment to determine any modifications required to the codebase, testing plan, or previous assumptions. Adjust your tasks directly in response to this feedback.`;
	}
}
