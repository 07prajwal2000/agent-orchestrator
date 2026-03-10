import { Worker } from "node:worker_threads";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { AgentService } from "@/app/lib/db/agent-service";

export interface SpawnAgentParams {
	projectId: string;
	workDir: string;
	systemPrompt: string;
	codingAgentCli: string;
}

export class AgentRunner {
	/**
	 * Spawns a worker thread to execute the coding agent CLI and monitor its lifecycle.
	 * Decoupled from the API endpoints for cleaner code architecture.
	 */
	static async spawnAndMonitor(params: SpawnAgentParams): Promise<string> {
		const agentId = randomUUID();

		// 1. Create the agent record in the database as 'pending'
		await AgentService.create({
			id: agentId,
			projectId: params.projectId,
			currentDir: params.workDir,
			systemPrompt: params.systemPrompt,
			agentStatus: "pending",
		});

		// 2. Resolve the path to the worker thread script
		const workerPath = path.join(
			process.cwd(),
			"app",
			"lib",
			"agent-worker.js",
		);

		// 3. Initialize the worker thread with the required data
		const worker = new Worker(workerPath, {
			workerData: {
				codingAgentCli: params.codingAgentCli,
				systemPrompt: params.systemPrompt,
				workDir: params.workDir,
			},
		});

		// 4. Listen to worker lifecycle events to update the agent's status and logs
		worker.on("online", async () => {
			await AgentService.updateStatus(agentId, "started");
			await AgentService.appendLog(
				agentId,
				"Worker thread started successfully.\n",
			);
		});

		worker.on("message", async (msg: { type: string; payload: string }) => {
			if (msg.type === "log") {
				await AgentService.appendLog(agentId, msg.payload);
			} else if (msg.type === "status") {
				await AgentService.updateStatus(agentId, msg.payload);
			}
		});

		worker.on("error", async (err) => {
			console.error(`Worker error for agent ${agentId}:`, err);
			await AgentService.appendLog(
				agentId,
				`Worker encountered an error: ${err.message}\n`,
			);
			await AgentService.updateStatus(agentId, "error");
		});

		worker.on("exit", async (code) => {
			if (code !== 0) {
				await AgentService.appendLog(
					agentId,
					`Worker stopped with exit code ${code}\n`,
				);
				// Let 'status' message take precedence if already emitted, otherwise mark error
				const agent = await AgentService.getById(agentId);
				if (agent?.agentStatus === "started") {
					await AgentService.updateStatus(agentId, "error");
				}
			}
		});

		return agentId;
	}
}
