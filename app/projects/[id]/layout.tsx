import { ProjectService } from "@/app/lib/db/project-service";
import { redirect } from "next/navigation";
import { ProjectTabs } from "@/app/components/ProjectTabs";

export default async function ProjectLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;
	const projectId = resolvedParams.id;

	// Server-side validation: ensure project exists
	const project = await ProjectService.getById(projectId);

	if (!project) {
		redirect("/");
	}

	return (
		<div className="flex flex-col gap-6">
			<ProjectTabs projectId={projectId} />
			<div className="bg-base-100 min-h-[60vh] rounded-box border border-base-300 shadow-sm p-6">
				{children}
			</div>
		</div>
	);
}
