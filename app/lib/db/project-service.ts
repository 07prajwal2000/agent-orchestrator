import { db } from "@/app/lib/db";
import { projects } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";

export class ProjectService {
	/**
	 * Fetch a project by its UUID from the database.
	 */
	static async getById(projectId: string) {
		return await db.query.projects.findFirst({
			where: eq(projects.id, projectId),
		});
	}

	static async getAll() {
		return await db.query.projects.findMany();
	}

	static async create(projectData: typeof projects.$inferInsert) {
		const [newProject] = await db
			.insert(projects)
			.values(projectData)
			.returning();
		return newProject;
	}

	static async update(
		projectId: string,
		projectData: Partial<typeof projects.$inferInsert>,
	) {
		const [updatedProject] = await db
			.update(projects)
			.set(projectData)
			.where(eq(projects.id, projectId))
			.returning();
		return updatedProject;
	}

	static async getDashboardStats() {
		// Calculate total projects
		const allProjects = await db.query.projects.findMany();
		const totalProjects = allProjects.length;

		// Calculate total agents (active vs error)
		// Assuming 'active' agents are 'started' or 'pending', and 'error' agents are 'error'
		const allAgents = await db.query.agents.findMany();
		const activeAgents = allAgents.filter(
			(a) => a.agentStatus === "started" || a.agentStatus === "pending",
		).length;
		const errorAgents = allAgents.filter(
			(a) => a.agentStatus === "error",
		).length;

		return {
			totalProjects,
			activeAgents,
			errorAgents,
		};
	}

	/**
	 * Verify if any of the provided identifiers (email or login)
	 * exist in the project's allowed modification list.
	 */
	static isModifierAllowed(
		project: { allowedEmailsModification: string },
		identifiers: (string | undefined | null)[],
	): boolean {
		if (!project.allowedEmailsModification) return false;

		const allowedEmails = project.allowedEmailsModification
			.split(",")
			.map((email) => email.trim());

		return identifiers.some((id) => id && allowedEmails.includes(id));
	}
}
