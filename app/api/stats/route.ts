import { NextResponse } from "next/server";
import { ProjectService } from "@/app/lib/db/project-service";

export async function GET() {
	try {
		const stats = await ProjectService.getDashboardStats();
		return NextResponse.json(stats);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch stats" },
			{ status: 500 },
		);
	}
}
