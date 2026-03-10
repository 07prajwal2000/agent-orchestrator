"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Terminal } from "lucide-react";

interface Agent {
	id: string;
	projectId: string;
	currentDir: string;
	systemPrompt: string;
	agentStatus: "pending" | "started" | "finished" | "error";
}

interface AgentLog {
	id: number;
	agentId: string;
	logLines: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AgentInformationPage() {
	const params = useParams();
	const agentId = params.id as string;

	const {
		data: agent,
		error: agentError,
		isLoading: agentLoading,
	} = useSWR<Agent>(`/api/agents/${agentId}`, fetcher);

	const { data: logs, isLoading: logsLoading } = useSWR<AgentLog[]>(
		`/api/agents/${agentId}/logs`,
		fetcher,
		{ refreshInterval: 3000 }, // Auto-refresh logs every 3 seconds
	);

	if (agentError)
		return <div className="alert alert-error">Failed to load agent</div>;
	if (agentLoading) return <div className="skeleton w-full h-screen"></div>;
	if (!agent) return <div className="alert alert-warning">Agent not found</div>;

	return (
		<div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-4">
			{/* Breadcrumbs */}
			<div className="flex items-center text-sm breadcrumbs mb-4 text-base-content/70">
				<ul>
					<li>
						<Link href="/">
							<ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
						</Link>
					</li>
					<li>
						<Link href={`/projects/${agent.projectId}`}>Project</Link>
					</li>
					<li>Agent {agent.id.slice(0, 8)}...</li>
				</ul>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Agent Info Sidebar */}
				<div className="col-span-1 flex flex-col gap-6">
					<div className="card bg-base-100 shadow-sm border border-base-200">
						<div className="card-body">
							<h2 className="card-title text-primary text-xl">Agent Info</h2>

							<div className="divider my-0"></div>

							<div className="flex flex-col gap-4 mt-2">
								<div>
									<span className="text-xs font-semibold text-base-content/60 uppercase">
										Status
									</span>
									<div className="mt-1">
										<span
											className={`badge badge-outline ${
												agent.agentStatus === "error"
													? "badge-error"
													: agent.agentStatus === "finished"
														? "badge-success"
														: agent.agentStatus === "started"
															? "badge-info animate-pulse"
															: "badge-warning"
											}`}
										>
											{agent.agentStatus}
										</span>
									</div>
								</div>

								<div>
									<span className="text-xs font-semibold text-base-content/60 uppercase">
										Agent ID
									</span>
									<p className="font-mono text-xs opacity-80 mt-1 break-all bg-base-200 p-2 rounded">
										{agent.id}
									</p>
								</div>

								<div>
									<span className="text-xs font-semibold text-base-content/60 uppercase">
										Working Dir
									</span>
									<p className="font-mono text-xs opacity-80 mt-1 break-all">
										{agent.currentDir}
									</p>
								</div>

								<div>
									<span className="text-xs font-semibold text-base-content/60 uppercase">
										System Prompt
									</span>
									<div className="mt-1 bg-base-200 p-3 rounded-md text-xs font-mono max-h-48 overflow-y-auto w-full wrap-break-word">
										{agent.systemPrompt}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Agent Log Stream */}
				<div className="col-span-1 lg:col-span-3">
					<div className="card bg-base-100 border border-base-300 h-[600px] flex flex-col rounded-xl overflow-hidden shadow-2xl">
						<div className="bg-neutral text-neutral-content px-4 py-3 flex items-center justify-between border-b border-black">
							<div className="flex items-center gap-2 font-mono text-sm">
								<Terminal className="w-4 h-4" />
								Terminal Output
								{agent.agentStatus === "started" && (
									<span className="flex items-center h-2 w-2 relative ml-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
									</span>
								)}
							</div>
						</div>

						<div className="bg-black text-gray-300 p-4 font-mono text-xs overflow-y-auto grow h-full leading-5">
							{logsLoading && !logs?.length && (
								<div className="opacity-50 flex items-center gap-2">
									Connecting to log stream...{" "}
									<span className="loading loading-dots loading-xs"></span>
								</div>
							)}

							{!logsLoading && logs?.length === 0 && (
								<div className="opacity-50">
									No logs generated yet. Agent is pending or starting...
								</div>
							)}

							{logs?.map((log) => (
								<div
									key={log.id}
									className="whitespace-pre-wrap mb-2 border-b border-gray-800 pb-2"
								>
									{log.logLines}
								</div>
							))}

							{agent.agentStatus === "started" && logs?.length !== 0 && (
								<div className="animate-pulse mt-2 text-primary">_</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
