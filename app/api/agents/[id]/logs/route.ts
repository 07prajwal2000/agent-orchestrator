import { NextResponse } from "next/server";
import { AgentService } from "@/app/lib/db/agent-service";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const resolvedParams = await params;
		const logs = await AgentService.getLogs(resolvedParams.id);
		return NextResponse.json(logs);
	} catch (error) {
		console.error("Error fetching agent logs", error);
		return NextResponse.json(
			{ error: "Failed to fetch logs" },
			{ status: 500 },
		);
	}
}
