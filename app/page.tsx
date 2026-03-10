import { DashboardStats } from "@/app/components/DashboardStats";
import { ProjectsList } from "@/app/components/ProjectsList";
import { CreateProjectModal } from "@/app/components/CreateProjectModal";

export default function Home() {
	return (
		<div className="flex flex-col gap-8 py-6">
			<div className="flex justify-between items-center w-full">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Dashboard Overview
					</h2>
					<p className="text-base-content/70 mt-1">
						Orchestrate, manage, and monitor your AI coding agents.
					</p>
				</div>
				<CreateProjectModal />
			</div>

			<section>
				<DashboardStats />
			</section>

			<section className="bg-base-200/50 p-6 rounded-box border border-base-200">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						Your Projects
					</h2>
				</div>
				<ProjectsList />
			</section>
		</div>
	);
}
