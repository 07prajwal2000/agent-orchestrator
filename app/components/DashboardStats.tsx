"use client";

import useSWR from "swr";
import { FolderGit2, Play, AlertTriangle } from "lucide-react";

interface Stats {
	totalProjects: number;
	activeAgents: number;
	errorAgents: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardStats() {
	const { data, error, isLoading } = useSWR<Stats>("/api/stats", fetcher);

	if (error)
		return <div className="alert alert-error">Failed to load stats</div>;
	if (isLoading) return <div className="skeleton h-32 w-full"></div>;

	return (
		<div className="stats shadow w-full bg-base-100">
			<div className="stat">
				<div className="stat-figure text-primary">
					<FolderGit2 className="w-8 h-8" />
				</div>
				<div className="stat-title">Total Projects</div>
				<div className="stat-value text-primary">
					{data?.totalProjects || 0}
				</div>
				<div className="stat-desc">Managed repositories</div>
			</div>

			<div className="stat">
				<div className="stat-figure text-secondary">
					<Play className="w-8 h-8" />
				</div>
				<div className="stat-title">Active Agents</div>
				<div className="stat-value text-secondary">
					{data?.activeAgents || 0}
				</div>
				<div className="stat-desc">Currently running tasks</div>
			</div>

			<div className="stat">
				<div className="stat-figure text-error">
					<AlertTriangle className="w-8 h-8" />
				</div>
				<div className="stat-title">Error Agents</div>
				<div className="stat-value text-error">{data?.errorAgents || 0}</div>
				<div className="stat-desc">Requires attention</div>
			</div>
		</div>
	);
}
