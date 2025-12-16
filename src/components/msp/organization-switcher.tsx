"use client";

import { Building2 } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  type: "MSP" | "CLIENT";
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
  currentOrganizationId: string;
  onOrganizationChange: (organizationId: string) => void;
}

export function OrganizationSwitcher({
  organizations,
  currentOrganizationId,
  onOrganizationChange,
}: OrganizationSwitcherProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
      <Building2 className="h-4 w-4 text-slate-600" />
      <select
        value={currentOrganizationId}
        onChange={(e) => onOrganizationChange(e.target.value)}
        className="flex-1 border-none bg-transparent text-sm outline-none focus:ring-0"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name} {org.type === "MSP" ? "(MSP)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
