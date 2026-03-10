"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import { Save, AlertCircle } from "lucide-react";

interface Project {
	id: string;
	name: string;
	description: string;
	currentDir: string;
	codingAgentCli: string;
	allowedEmailsModification: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProjectSettingsPage() {
	const params = useParams();
	const projectId = params.id as string;
	const { mutate } = useSWRConfig();

	const {
		data: project,
		error,
		isLoading,
	} = useSWR<Project>(`/api/projects/${projectId}`, fetcher);

	const [formData, setFormData] = useState<Partial<Project>>({});
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saveSuccess, setSaveSuccess] = useState(false);

	useEffect(() => {
		if (project) setFormData(project);
	}, [project]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		setSaveSuccess(false);
		setSaveError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setSaveError("");
		setSaveSuccess(false);

		try {
			const res = await fetch(`/api/projects/${projectId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name,
					description: formData.description,
					currentDir: formData.currentDir,
					codingAgentCli: formData.codingAgentCli,
					allowedEmailsModification: formData.allowedEmailsModification,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to update project");
			}

			mutate(`/api/projects/${projectId}`);
			setSaveSuccess(true);
		} catch (err: any) {
			setSaveError(err.message);
		} finally {
			setSaving(false);
		}
	};

	if (error)
		return (
			<div className="alert alert-error">Failed to load project settings</div>
		);
	if (isLoading) return <div className="skeleton w-full h-96"></div>;
	if (!project) return null;

	return (
		<div className="flex flex-col gap-6 max-w-3xl border-l-4 border-primary pl-6">
			<div>
				<h2 className="text-2xl font-bold mb-2">Project Information</h2>
				<p className="text-base-content/70 text-sm">
					Update your project details and configurations.
				</p>
			</div>

			{saveError && (
				<div className="alert alert-error shadow-sm text-sm">
					<AlertCircle className="w-4 h-4" /> {saveError}
				</div>
			)}
			{saveSuccess && (
				<div className="alert alert-success shadow-sm text-sm">
					Project successfully updated.
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label className="font-medium text-sm text-base-content/80">
						Project ID
					</label>
					<input
						type="text"
						value={project.id}
						disabled
						className="input input-bordered opacity-70 bg-base-200 cursor-not-allowed font-mono text-base shadow-sm w-full"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="font-medium text-sm text-base-content/80">
						Project Name
					</label>
					<input
						type="text"
						name="name"
						value={formData.name || ""}
						onChange={handleChange}
						className="input input-bordered shadow-sm focus:border-primary transition-colors text-base w-full"
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="font-medium text-sm text-base-content/80">
						Description
					</label>
					<textarea
						name="description"
						value={formData.description || ""}
						onChange={handleChange}
						className="textarea textarea-bordered shadow-sm focus:border-primary transition-colors text-base h-20 w-full"
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
						value={formData.currentDir || ""}
						onChange={handleChange}
						className="input input-bordered shadow-sm focus:border-primary transition-colors font-mono text-base w-full"
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="font-medium text-sm text-base-content/80">
						Agent CLI
					</label>
					<select
						name="codingAgentCli"
						value={formData.codingAgentCli || "gemini"}
						onChange={handleChange}
						className="select select-bordered shadow-sm focus:border-primary transition-colors text-base w-full"
					>
						<option value="gemini">Gemini CLI</option>
					</select>
				</div>

				<div className="flex flex-col gap-2">
					<label className="font-medium text-sm text-base-content/80">
						Allowed Emails (Modification)
					</label>
					<input
						type="text"
						name="allowedEmailsModification"
						value={formData.allowedEmailsModification || ""}
						onChange={handleChange}
						className="input input-bordered shadow-sm focus:border-primary transition-colors text-base w-full"
						placeholder="admin@example.com, john@example.com"
					/>
					<div className="text-xs opacity-70 mt-1">
						Comma separated list of emails.
					</div>
				</div>

				<div className="mt-4 border-t border-base-200 pt-6">
					<button type="submit" className="btn btn-primary" disabled={saving}>
						{saving ? (
							<span className="loading loading-spinner"></span>
						) : (
							<Save className="w-5 h-5 mr-1" />
						)}
						Save Settings
					</button>
				</div>
			</form>
		</div>
	);
}
