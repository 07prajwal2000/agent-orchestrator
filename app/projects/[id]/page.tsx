"use client";

import useSWR from "swr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CreateAgentModal } from "@/app/components/CreateAgentModal";
import {
	Bot,
	Terminal,
	RefreshCw,
	AlertCircle,
	CheckCircle,
} from "lucide-react";

interface Agent {
	id: string;
	currentDir: string;
	projectId: string;
	systemPrompt: string;
	agentStatus: "pending" | "started" | "finished" | "error";
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function StatusBadge({ status }: { status: Agent["agentStatus"] }) {
	const variants = {
		pending: "badge-warning",
		started: "badge-info",
		finished: "badge-success",
		error: "badge-error",
	};
	const icons = {
		pending: <RefreshCw className="w-3 h-3 mr-1 animate-spin" />,
		started: <RefreshCw className="w-3 h-3 mr-1 animate-spin" />,
		finished: <CheckCircle className="w-3 h-3 mr-1" />,
		error: <AlertCircle className="w-3 h-3 mr-1" />,
	};
	return (
		<span className={`badge ${variants[status]} gap-1`}>
			{icons[status] || null}
			{status}
		</span>
	);
}

export default function ProjectHomePage() {
	const params = useParams();
	const projectId = params.id as string;
	const [showInactive, setShowInactive] = useState(false);

	const {
		data: agents,
		error,
		isLoading,
	} = useSWR<Agent[]>(`/api/projects/${projectId}/agents`, fetcher);

	if (error)
		return <div className="alert alert-error">Failed to load agents</div>;
	if (isLoading) return <div className="skeleton w-full h-64"></div>;

	const filteredAgents =
		agents?.filter((a) => {
			if (showInactive) return true;
			return a.agentStatus === "started" || a.agentStatus === "pending";
		}) || [];

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<Bot className="text-secondary" /> Project Agents
					</h2>
					<p className="text-base-content/70">
						Manage and monitor running agents.
					</p>
				</div>
				<div className="flex items-center gap-4">
					<label className="label cursor-pointer gap-2">
						<span className="label-text">Show Inactive</span>
						<input
							type="checkbox"
							className="toggle toggle-primary"
							checked={showInactive}
							onChange={(e) => setShowInactive(e.target.checked)}
						/>
					</label>
					<CreateAgentModal />
				</div>
			</div>

			{filteredAgents.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 bg-base-200 rounded-box border border-base-300 border-dashed">
					<Terminal className="w-16 h-16 text-base-content/30 mb-4" />
					<h3 className="text-xl font-bold mb-2">No agents found</h3>
					<p className="text-base-content/60 text-center">
						{showInactive
							? "No agents have been created for this project yet."
							: "No active agents found. Toggle 'Show Inactive' or spawn a new agent."}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredAgents.map((agent) => (
						<div
							key={agent.id}
							className="card bg-base-100 shadow-md border border-base-200"
						>
							<div className="card-body">
								<div className="flex justify-between items-start mb-2">
									<h3 className="font-mono text-sm opacity-60 truncate pr-4">
										{agent.id}
									</h3>
									<StatusBadge status={agent.agentStatus} />
								</div>

								<div className="bg-base-200 p-3 rounded-md mb-4 h-24 overflow-hidden relative">
									<div className="text-xs font-mono opacity-80 line-clamp-4">
										{agent.systemPrompt}
									</div>
									<div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-base-200 to-transparent"></div>
								</div>

								<div className="text-xs opacity-60 truncate mb-4">
									dir: <span className="font-mono">{agent.currentDir}</span>
								</div>

								<div className="card-actions justify-end mt-auto">
									<Link
										href={`/agents/${agent.id}`}
										className="btn btn-outline btn-sm w-full"
									>
										View Logs
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
