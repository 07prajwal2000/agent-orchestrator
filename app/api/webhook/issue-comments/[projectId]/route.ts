import { NextResponse } from "next/server";
import { authorizeRequest } from "@/app/lib/auth";
import { issueCommentWebhookSchema } from "@/app/lib/schemas";
import { SystemPromptBuilder } from "@/app/lib/prompt-builder";
import { z } from "zod";
import { ProjectService } from "@/app/lib/db/project-service";
import { AgentRunner } from "@/app/lib/agent-runner";
export async function POST(
	req: Request,
	{ params }: { params: Promise<{ projectId: string }> },
) {
	try {
		const isAuthorized = await authorizeRequest(req);
		if (!isAuthorized) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { projectId } = await params;

		// Validate ProjectId is UUID
		const uuidSchema = z.string().uuid();
		const uuidParsed = uuidSchema.safeParse(projectId);
		if (!uuidParsed.success) {
			return NextResponse.json(
				{ error: "Invalid Project ID format" },
				{ status: 400 },
			);
		}

		const body = await req.json();

		// Validate GitHub Webhook payload
		const parsed = issueCommentWebhookSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid payload schema", details: parsed.error.issues },
				{ status: 400 },
			);
		}

		const payload = parsed.data;

		// Fetch project via Drizzle
		const project = await ProjectService.getById(projectId);

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Verify label
		const hasLlmAgentLabel = payload.issue.labels?.some(
			(label: { name: string }) => label.name === "LLM_AGENT",
		);

		if (!hasLlmAgentLabel) {
			return NextResponse.json(
				{ message: "Ignoring event: issue does not have 'LLM_AGENT' label." },
				{ status: 200 },
			);
		}

		// Verify sender/commenter is in the modifiers list
		const isModifierAllowed = ProjectService.isModifierAllowed(project, [
			payload.sender?.login,
			payload.sender?.email,
			payload.comment.user.login,
			payload.comment.user.email,
		]);

		if (!isModifierAllowed) {
			return NextResponse.json(
				{
					message:
						"Ignoring event: commenter/sender is not in the allowed modification list.",
				},
				{ status: 200 },
			);
		}

		// Normalize and convert to system prompt
		const systemPrompt = SystemPromptBuilder.fromIssueCommentPayload(
			payload,
			projectId,
		);

		// Spawn AI Agent asynchronously using worker thread
		console.log("System Prompt Generated for Issue Comment:", systemPrompt);
		AgentRunner.spawnAndMonitor({
			projectId: project.id,
			workDir: project.currentDir,
			codingAgentCli: project.codingAgentCli,
			systemPrompt,
		}).catch((err) => {
			console.error("Failed to spawn agent runner:", err);
		});

		return NextResponse.json(
			{ message: "Issue comment webhook received and processed successfully." },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error processing issue comment webhook:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
