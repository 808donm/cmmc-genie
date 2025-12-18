"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, AlertCircle } from "lucide-react";

type ProjectRequestFormProps = {
  organizationId: string;
  mspOrganizationId: string | null;
  userId: string;
};

export function ProjectRequestForm({
  organizationId,
  mspOrganizationId,
  userId,
}: ProjectRequestFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cmmcLevel: "",
    priority: "MEDIUM",
    targetDate: "",
    objectives: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mspOrganizationId) {
      alert("No MSP organization found. Cannot create project.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/client-portal/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          clientId: organizationId,
          mspOrganizationId,
        }),
      });

      if (response.ok) {
        alert("Project request submitted successfully!");
        router.push("/client-portal/projects");
      } else {
        const error = await response.json();
        alert(`Failed to submit project: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Project Details
        </h2>

        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., CMMC Level 2 Certification"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the project goals and requirements..."
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* CMMC Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target CMMC Level <span className="text-red-500">*</span>
            </label>
            <select
              name="cmmcLevel"
              value={formData.cmmcLevel}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select CMMC Level...</option>
              <option value="LEVEL_1">Level 1 - Foundational</option>
              <option value="LEVEL_2">Level 2 - Advanced</option>
              <option value="LEVEL_3">Level 3 - Expert</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Choose the CMMC maturity level you&apos;re targeting for certification
            </p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target Completion Date
            </label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1 text-xs text-slate-500">
              When do you need to achieve compliance?
            </p>
          </div>

          {/* Project Objectives */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Objectives
            </label>
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              rows={3}
              placeholder="List specific goals and deliverables for this project..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Project Request Process</p>
          <p className="mt-1">
            Your MSP will review this request and create a detailed project plan.
            You&apos;ll be notified once the project is created and ready for collaboration.
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitting ? "Submitting..." : "Submit Project Request"}
        </button>
      </div>
    </form>
  );
}
