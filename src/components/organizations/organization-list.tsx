"use client";

import { useState } from "react";
import { Building2, Users, Building, UserPlus, Plus } from "lucide-react";
import { CreateOrganizationForm } from "./create-organization-form";
import { InviteToOrganizationForm } from "./invite-to-organization-form";

interface Organization {
  id: string;
  name: string;
  type: "MSP" | "CLIENT";
  _count: {
    members: number;
    projects: number;
  };
  parentOrganization?: {
    id: string;
    name: string;
  } | null;
}

interface OrganizationListProps {
  organizations: Organization[];
  canCreateOrganizations: boolean;
}

export function OrganizationList({
  organizations,
  canCreateOrganizations,
}: OrganizationListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [inviteToOrgId, setInviteToOrgId] = useState<string | null>(null);

  const mspOrganizations = organizations.filter((org) => org.type === "MSP");
  const selectedOrganization = organizations.find((org) => org.id === inviteToOrgId);

  return (
    <>
      <div className="space-y-4">
        {/* Create Organization Button */}
        {canCreateOrganizations && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Organization
            </button>
          </div>
        )}

        {/* Organizations Grid */}
        <div className="space-y-3">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{org.name}</h3>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        org.type === "MSP"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {org.type}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{org._count.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5" />
                      <span>{org._count.projects} projects</span>
                    </div>
                  </div>
                  {org.parentOrganization && (
                    <div className="mt-1 text-xs text-slate-500">
                      Managed by: {org.parentOrganization.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInviteToOrgId(org.id)}
                  className="flex items-center gap-1.5 rounded-md border border-blue-600 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite User
                </button>
              </div>
            </div>
          ))}

          {organizations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No organizations found
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {canCreateOrganizations
                  ? "Create your first organization to get started"
                  : "You don't belong to any organizations yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Organization Modal */}
      {showCreateForm && (
        <CreateOrganizationForm
          mspOrganizations={mspOrganizations}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Invite User Modal */}
      {inviteToOrgId && selectedOrganization && (
        <InviteToOrganizationForm
          organization={selectedOrganization}
          onClose={() => setInviteToOrgId(null)}
        />
      )}
    </>
  );
}
