import { db } from "@/app/lib/db";
import { agents, projects, agentLogs } from "@/app/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export class AgentService {
	static async getById(agentId: string) {
		return await db.query.agents.findFirst({
			where: eq(agents.id, agentId),
		});
	}

	static async getByProjectId(projectId: string) {
		return await db.query.agents.findMany({
			where: eq(agents.projectId, projectId),
			orderBy: [desc(agents.id)],
		});
	}

	static async getAll() {
		return await db.query.agents.findMany({
			orderBy: [desc(agents.id)],
		});
	}

	static async create(agentData: typeof agents.$inferInsert) {
		const [newAgent] = await db.insert(agents).values(agentData).returning();
		return newAgent;
	}

	static async updateStatus(agentId: string, status: string) {
		const [updatedAgent] = await db
			.update(agents)
			.set({ agentStatus: status })
			.where(eq(agents.id, agentId))
			.returning();
		return updatedAgent;
	}

	static async getLogs(agentId: string) {
		return await db.query.agentLogs.findMany({
			where: eq(agentLogs.agentId, agentId),
			orderBy: [desc(agentLogs.id)],
		});
	}

	static async appendLog(agentId: string, logLine: string) {
		const [newLog] = await db
			.insert(agentLogs)
			.values({
				agentId,
				logLines: logLine,
			})
			.returning();
		return newLog;
	}
}
