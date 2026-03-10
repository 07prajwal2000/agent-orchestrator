import { NextResponse } from "next/server";
import { ProjectService } from "@/app/lib/db/project-service";
import { createProjectSchema } from "@/app/lib/schemas";

export async function GET() {
	try {
		const projects = await ProjectService.getAll();
		return NextResponse.json(projects);
	} catch (error) {
		console.error("Error fetching projects", error);
		return NextResponse.json(
			{ error: "Failed to fetch projects" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const parsed = createProjectSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid data", details: parsed.error.issues },
				{ status: 400 },
			);
		}

		// crypto.randomUUID is natively available in Node.js runtime for Next.js
		const projectData = {
			...parsed.data,
			id: parsed.data.id || crypto.randomUUID(),
		};

		const project = await ProjectService.create(projectData);
		return NextResponse.json(project);
	} catch (error) {
		console.error("Error creating project", error);
		return NextResponse.json(
			{ error: "Failed to create project" },
			{ status: 500 },
		);
	}
}
