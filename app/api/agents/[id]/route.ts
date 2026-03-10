import { NextResponse } from "next/server";
import { AgentService } from "@/app/lib/db/agent-service";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const resolvedParams = await params;
		const agent = await AgentService.getById(resolvedParams.id);
		if (!agent) {
			return NextResponse.json({ error: "Agent not found" }, { status: 404 });
		}
		return NextResponse.json(agent);
	} catch (error) {
		console.error("Error fetching agent", error);
		return NextResponse.json(
			{ error: "Failed to fetch agent" },
			{ status: 500 },
		);
	}
}
