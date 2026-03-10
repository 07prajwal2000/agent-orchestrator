"use client";

import { useState, useRef } from "react";
import { Plus, Bot } from "lucide-react";
import { useSWRConfig } from "swr";
import { useParams } from "next/navigation";

export function CreateAgentModal() {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { mutate } = useSWRConfig();
	const params = useParams();
	const projectId = params.id as string;

	const openModal = () => modalRef.current?.showModal();
	const closeModal = () => modalRef.current?.close();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			projectId,
			title: formData.get("title"),
			description: formData.get("description"),
			workDirectory: formData.get("workDirectory"),
			agentTool: formData.get("agentTool") || "gemini-cli",
		};

		try {
			const res = await fetch("/api/custom/spawn-agent", {
				method: "POST",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to spawn agent");
			}

			// Optimistically revalidate
			mutate(`/api/projects/${projectId}/agents`);
			mutate("/api/stats");
			closeModal();
			e.currentTarget.reset();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				className="btn btn-secondary shadow-md hover:-translate-y-1 transition-transform"
				onClick={openModal}
			>
				<Bot className="w-5 h-5 mr-1" /> Custom Agent
			</button>

			<dialog ref={modalRef} className="modal">
				<div className="modal-box w-11/12 max-w-3xl p-8 border border-base-300 shadow-2xl">
					<h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-secondary">
						<Bot /> Spawn Agent
					</h3>

					{error && (
						<div className="alert alert-error mb-4 shadow p-3 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label className="font-medium text-sm text-base-content/80">
								Task Title
							</label>
							<input
								type="text"
								name="title"
								placeholder="e.g. Refactor API endpoints"
								required
								className="input input-bordered w-full focus:border-secondary text-base"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label className="font-medium text-sm text-base-content/80">
								Task Description
							</label>
							<textarea
								name="description"
								placeholder="What should the agent do?"
								className="textarea textarea-bordered focus:border-secondary text-base h-20 w-full"
								required
							></textarea>
						</div>

						<div className="flex flex-col gap-2">
							<label className="font-medium text-sm text-base-content/80">
								Work Directory
							</label>
							<input
								type="text"
								name="workDirectory"
								placeholder="Relative or absolute path"
								className="input input-bordered focus:border-secondary font-mono text-base w-full"
								required
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label className="font-medium text-sm text-base-content/80">
								Agent Tool
							</label>
							<select
								name="agentTool"
								className="select select-bordered focus:border-secondary text-base w-full"
							>
								<option value="gemini-cli">Gemini CLI</option>
							</select>
						</div>

						<div className="modal-action mt-4">
							<button
								type="button"
								className="btn"
								onClick={closeModal}
								disabled={loading}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-secondary"
								disabled={loading}
							>
								{loading ? (
									<span className="loading loading-spinner"></span>
								) : (
									"Spawn Agent"
								)}
							</button>
						</div>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
