import { Activity } from "lucide-react";
import Link from "next/link";

export function Navbar() {
	return (
		<div className="navbar bg-base-200 shadow-sm border-b border-base-300 px-4">
			<div className="flex-1">
				<Link
					href="/"
					className="btn btn-ghost hover:bg-base-300 text-2xl font-extrabold tracking-tight flex items-center gap-2"
				>
					<Activity className="w-6 h-6 text-primary" />
					<span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
						Agent Command Center
					</span>
				</Link>
			</div>
		</div>
	);
}
