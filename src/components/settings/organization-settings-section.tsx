"use client";

import { useState } from "react";
import { Building2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditOrganizationDialog } from "@/components/organizations/edit-organization-dialog";

interface Organization {
  id: string;
  name: string;
  type: "MSP" | "CLIENT";
  parentOrganizationId: string | null;
  industry: string | null;
  size: string | null;
  website: string | null;
  description: string | null;
  subscriptionTier: string;
}

interface OrganizationMembership {
  role: string;
  organization: Organization;
}

interface OrganizationSettingsSectionProps {
  orgMembership: OrganizationMembership | null;
  mspOrganizations: Array<{ id: string; name: string }>;
}

export function OrganizationSettingsSection({
  orgMembership,
  mspOrganizations,
}: OrganizationSettingsSectionProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!orgMembership) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle>Organization Settings</CardTitle>
          </div>
          <CardDescription>Manage your organization details and members</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">No organization membership found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle>Organization Settings</CardTitle>
          </div>
          <CardDescription>Manage your organization details and members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(!orgMembership.organization.name || orgMembership.organization.name === "") && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-900">Organization Name Not Set</h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    Please set your organization name to continue. This will be used throughout the application.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => setShowEditDialog(true)}
                      className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700"
                    >
                      Set Organization Name
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Organization Name</label>
              <p className="mt-1 text-sm text-slate-900">
                {orgMembership.organization.name || (
                  <span className="text-slate-400 italic">Not set</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Organization Type</label>
              <p className="mt-1 text-sm text-slate-900">
                {orgMembership.organization.type === "MSP"
                  ? "MSP (Managed Service Provider)"
                  : "Client Organization"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Industry</label>
              <p className="mt-1 text-sm text-slate-900">
                {orgMembership.organization.industry || "Not set"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Organization Size</label>
              <p className="mt-1 text-sm text-slate-900">
                {orgMembership.organization.size || "Not set"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Website</label>
              <p className="mt-1 text-sm text-slate-900">
                {orgMembership.organization.website ? (
                  <a
                    href={orgMembership.organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {orgMembership.organization.website}
                  </a>
                ) : (
                  "Not set"
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Subscription Tier</label>
              <p className="mt-1 text-sm text-slate-900 capitalize">
                {orgMembership.organization.subscriptionTier}
              </p>
            </div>
            {orgMembership.organization.description && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <p className="mt-1 text-sm text-slate-900">
                  {orgMembership.organization.description}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowEditDialog(true)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit Organization
          </button>
        </CardContent>
      </Card>

      {showEditDialog && (
        <EditOrganizationDialog
          organization={orgMembership.organization}
          mspOrganizations={mspOrganizations}
          onClose={() => setShowEditDialog(false)}
        />
      )}
    </>
  );
}
