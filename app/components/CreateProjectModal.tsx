"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { useSWRConfig } from "swr";

export function CreateProjectModal() {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { mutate } = useSWRConfig();

	const openModal = () => modalRef.current?.showModal();
	const closeModal = () => modalRef.current?.close();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			name: formData.get("name"),
			description: formData.get("description"),
			currentDir: formData.get("currentDir"),
			codingAgentCli: formData.get("codingAgentCli") || "gemini",
			allowedEmailsModification:
				formData.get("allowedEmailsModification") || "",
		};

		try {
			const res = await fetch("/api/projects", {
				method: "POST",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to create project");
			}

			// Optimistically revalidate projects listing
			mutate("/api/projects");
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
				className="btn btn-primary shadow-lg hover:-translate-y-1 transition-transform"
				onClick={openModal}
			>
				<Plus className="w-5 h-5 mr-1" /> Create Project
			</button>

			<dialog ref={modalRef} className="modal">
				<div className="modal-box w-11/12 max-w-3xl p-8 border border-base-300 shadow-2xl">
					<h3 className="font-bold text-3xl mb-4 text-primary">New Project</h3>

					{error && (
						<div className="alert alert-error mb-4 shadow text-sm p-3">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label className="font-medium text-sm text-base-content/80">
								Project Name
							</label>
							<input
								type="text"
								name="name"
								placeholder="e.g. My Website"
								required
								className="input input-bordered w-full focus:border-primary text-base"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label className="font-medium text-sm text-base-content/80">
								Description
							</label>
							<textarea
								name="description"
								placeholder="What is this project about?"
								className="textarea textarea-bordered focus:border-primary text-base h-20 w-full"
								required
							></textarea>
						</div>

						<div className="flex flex-col gap-2">
							<label className="font-medium text-sm text-base-content/80">
								Working Directory
							</label>
							<input
								type="text"
								name="currentDir"
								placeholder="/path/to/project"
								className="input input-bordered focus:border-primary font-mono text-base w-full"
								required
							/>
						</div>

						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<label className="font-medium text-sm text-base-content/80">
									Agent CLI
								</label>
								<select
									name="codingAgentCli"
									className="select select-bordered focus:border-primary text-base w-full"
								>
									<option value="gemini">Gemini CLI</option>
								</select>
							</div>

							<div className="flex flex-col gap-2">
								<label className="font-medium text-sm text-base-content/80">
									Allowed Emails
								</label>
								<input
									type="text"
									name="allowedEmailsModification"
									placeholder="user1@a.com, user2@a.com"
									className="input input-bordered focus:border-primary text-base w-full"
								/>
							</div>
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
								className="btn btn-primary px-8"
								disabled={loading}
							>
								{loading ? (
									<span className="loading loading-spinner"></span>
								) : (
									"Create Project"
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
