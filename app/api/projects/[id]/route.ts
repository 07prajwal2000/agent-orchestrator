import { NextResponse } from "next/server";
import { ProjectService } from "@/app/lib/db/project-service";
import { updateProjectSchema } from "@/app/lib/schemas";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const resolvedParams = await params;
		const project = await ProjectService.getById(resolvedParams.id);
		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}
		return NextResponse.json(project);
	} catch (error) {
		console.error("Error fetching project", error);
		return NextResponse.json(
			{ error: "Failed to fetch project" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const resolvedParams = await params;
		const body = await req.json();
		const parsed = updateProjectSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid data", details: parsed.error.issues },
				{ status: 400 },
			);
		}

		const project = await ProjectService.update(resolvedParams.id, parsed.data);
		return NextResponse.json(project);
	} catch (error) {
		console.error("Error updating project", error);
		return NextResponse.json(
			{ error: "Failed to update project" },
			{ status: 500 },
		);
	}
}
