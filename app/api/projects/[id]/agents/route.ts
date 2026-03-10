import { NextResponse } from "next/server";
import { AgentService } from "@/app/lib/db/agent-service";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const resolvedParams = await params;
		const agents = await AgentService.getByProjectId(resolvedParams.id);
		return NextResponse.json(agents);
	} catch (error) {
		console.error("Error fetching project agents", error);
		return NextResponse.json(
			{ error: "Failed to fetch agents" },
			{ status: 500 },
		);
	}
}
