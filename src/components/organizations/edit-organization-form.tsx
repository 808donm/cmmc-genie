"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, X, AlertTriangle } from "lucide-react";

interface EditOrganizationFormProps {
  organization: {
    id: string;
    name: string;
    type: "MSP" | "CLIENT";
    parentOrganization?: {
      id: string;
      name: string;
    } | null;
  };
  mspOrganizations: Array<{ id: string; name: string }>;
  onClose: () => void;
}

export function EditOrganizationForm({
  organization,
  mspOrganizations,
  onClose,
}: EditOrganizationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: organization.name,
    type: organization.type as "MSP" | "CLIENT",
    parentOrganizationId: organization.parentOrganization?.id || "",
  });

  const typeChanged = formData.type !== organization.type;
  const nameChanged = formData.name !== organization.name;
  const parentChanged =
    formData.parentOrganizationId !== (organization.parentOrganization?.id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update organization");
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              Edit Organization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {typeChanged && (
          <div className="mb-4 flex gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Warning: Changing organization type</p>
              <p className="mt-1 text-xs">
                This may affect access permissions and parent-child relationships.
                {organization.type === "MSP" && formData.type === "CLIENT" && (
                  <> Ensure this MSP has no client organizations before proceeding.</>
                )}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Organization Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Acme Corporation"
            />
            {nameChanged && (
              <p className="mt-1 text-xs text-slate-500">
                Previous name: {organization.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-slate-700"
            >
              Organization Type
            </label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "MSP" | "CLIENT",
                  parentOrganizationId:
                    e.target.value === "MSP" ? "" : formData.parentOrganizationId,
                })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="CLIENT">Client Organization</option>
              <option value="MSP">MSP (Managed Service Provider)</option>
            </select>
            {typeChanged && (
              <p className="mt-1 text-xs text-slate-500">
                Previous type: {organization.type}
              </p>
            )}
          </div>

          {formData.type === "CLIENT" && (
            <div>
              <label
                htmlFor="parentOrganization"
                className="block text-sm font-medium text-slate-700"
              >
                Parent MSP Organization
              </label>
              <select
                id="parentOrganization"
                required
                value={formData.parentOrganizationId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentOrganizationId: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select MSP organization...</option>
                {mspOrganizations
                  .filter((org) => org.id !== organization.id)
                  .map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
              </select>
              {parentChanged && organization.parentOrganization && (
                <p className="mt-1 text-xs text-slate-500">
                  Previous parent: {organization.parentOrganization.name}
                </p>
              )}
              {mspOrganizations.length === 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  No MSP organizations available. Create an MSP organization first.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!nameChanged && !typeChanged && !parentChanged)}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
