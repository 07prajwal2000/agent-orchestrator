import { NextResponse } from "next/server";
import { spawnAgentSchema } from "@/app/lib/schemas";
import { SystemPromptBuilder } from "@/app/lib/prompt-builder";
import { ProjectService } from "@/app/lib/db/project-service";
import { AgentRunner } from "@/app/lib/agent-runner";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		// Validate JSON payload
		const parsed = spawnAgentSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid payload schema", details: parsed.error.issues },
				{ status: 400 },
			);
		}

		const payload = parsed.data;

		// Verify project exists
		const project = await ProjectService.getById(payload.projectId);
		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Normalize and convert to system prompt
		const systemPrompt = SystemPromptBuilder.fromCustomTask(payload);

		// Spawn AI Agent asynchronously using worker thread
		console.log(
			"System Prompt Generated for Custom Agent Spawn:",
			systemPrompt,
		);
		AgentRunner.spawnAndMonitor({
			projectId: project.id,
			workDir: project.currentDir,
			codingAgentCli: project.codingAgentCli,
			systemPrompt,
		}).catch((err) => {
			console.error("Failed to spawn agent runner:", err);
		});

		return NextResponse.json(
			{
				message: "Spawn agent request accepted and queued successfully.",
				projectId: payload.projectId,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error processing spawn agent request:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
