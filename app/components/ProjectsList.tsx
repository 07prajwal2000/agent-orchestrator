"use client";

import useSWR from "swr";
import Link from "next/link";
import { FolderGit2, ArrowRight } from "lucide-react";

interface Project {
	id: string;
	name: string;
	description: string;
	currentDir: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProjectsList() {
	const { data, error, isLoading } = useSWR<Project[]>(
		"/api/projects",
		fetcher,
	);

	if (error)
		return <div className="alert alert-error">Failed to load projects</div>;
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="skeleton h-48 w-full"></div>
				))}
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 bg-base-200 rounded-box border border-base-300 border-dashed">
				<FolderGit2 className="w-16 h-16 text-base-content/30 mb-4" />
				<h3 className="text-xl font-bold mb-2">No projects found</h3>
				<p className="text-base-content/60 text-center">
					Get started by creating your first project below.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{data.map((project) => (
				<Link
					key={project.id}
					href={`/projects/${project.id}`}
					className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200 hover:-translate-y-1"
				>
					<div className="card-body">
						<h2 className="card-title text-primary flex items-center gap-2">
							<FolderGit2 className="w-5 h-5" />
							{project.name}
						</h2>
						<p className="text-sm opacity-80 h-10 overflow-hidden text-ellipsis line-clamp-2">
							{project.description}
						</p>
						<div className="text-xs opacity-60 font-mono bg-base-200 p-2 rounded-md mt-2 truncate">
							{project.currentDir}
						</div>
						<div className="card-actions justify-end mt-4">
							<span className="btn btn-primary btn-sm btn-outline">
								View <ArrowRight className="w-4 h-4 ml-1" />
							</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
