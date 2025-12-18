"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NewOrganizationFormProps {
  mspOrganizationId: string;
}

export function NewOrganizationForm({ mspOrganizationId }: NewOrganizationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    industry: "",
    size: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "CLIENT",
          parentOrganizationId: mspOrganizationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create organization");
        return;
      }

      // Redirect to the new organization
      router.push(`/msp/clients/${data.organization.id}`);
    } catch (err) {
      console.error("Error creating organization:", err);
      setError("Failed to create organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Acme Corporation"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="acme-corporation"
          />
          <p className="mt-1 text-xs text-slate-500">
            URL-friendly identifier (auto-generated from name)
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Brief description of the organization..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-2">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select industry</option>
              <option value="Defense">Defense</option>
              <option value="Aerospace">Aerospace</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Energy">Energy</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-slate-700 mb-2">
              Company Size
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Building2 className="h-4 w-4" />
            {loading ? "Creating..." : "Create Organization"}
          </button>

          <Link
            href="/msp/clients"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
