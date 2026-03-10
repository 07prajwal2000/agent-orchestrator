"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings } from "lucide-react";

export function ProjectTabs({ projectId }: { projectId: string }) {
	const pathname = usePathname();
	const basePath = `/projects/${projectId}`;
	return (
		<div className="tabs tabs-boxed bg-base-200 p-2 shadow-sm rounded-box inline-flex w-fit">
			<Link
				href={basePath}
				className={`tab tab-lg gap-2 font-medium ${
					pathname === basePath
						? "tab-active text-primary-content! bg-primary!"
						: "text-base-content/70 hover:text-base-content"
				}`}
			>
				<LayoutDashboard className="w-5 h-5" /> Agents
			</Link>
			<Link
				href={`${basePath}/settings`}
				className={`tab tab-lg gap-2 font-medium ${
					pathname === `${basePath}/settings`
						? "tab-active text-primary-content! bg-primary!"
						: "text-base-content/70 hover:text-base-content"
				}`}
			>
				<Settings className="w-5 h-5" /> Settings
			</Link>
		</div>
	);
}
