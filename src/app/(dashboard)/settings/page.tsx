import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Shield } from "lucide-react";
import { EditButton } from "@/components/settings/edit-button";
import { OrganizationSettingsSection } from "@/components/settings/organization-settings-section";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get user's organization
  const orgMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // Get all MSP organizations for the dropdown
  const mspOrganizations = await prisma.organization.findMany({
    where: { type: "MSP" },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">
          Manage your account and organization settings
        </p>
      </div>

      {/* Settings sections */}
      <div className="grid gap-6">
        {/* Profile settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>Manage your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <p className="mt-1 text-sm text-slate-900">{session.user.name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <p className="mt-1 text-sm text-slate-900">{session.user.email || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Role</label>
                <p className="mt-1 text-sm text-slate-900">{orgMembership?.role || "N/A"}</p>
              </div>
            </div>
            <EditButton label="Edit Profile" feature="Profile editing" variant="outline" />
          </CardContent>
        </Card>

        {/* Organization settings */}
        <OrganizationSettingsSection
          orgMembership={orgMembership}
          mspOrganizations={mspOrganizations}
        />

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Task Assignments</p>
                  <p className="text-sm text-slate-600">Get notified when tasks are assigned to you</p>
                </div>
                <EditButton label="Enable" feature="Task assignment notifications" size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Meeting Reminders</p>
                  <p className="text-sm text-slate-600">Receive reminders for upcoming meetings</p>
                </div>
                <EditButton label="Enable" feature="Meeting reminder notifications" size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Compliance Updates</p>
                  <p className="text-sm text-slate-600">Get updates on compliance status changes</p>
                </div>
                <EditButton label="Enable" feature="Compliance update notifications" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                </div>
                <EditButton label="Configure" feature="Two-factor authentication" size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Active Sessions</p>
                  <p className="text-sm text-slate-600">Manage devices where you&apos;re signed in</p>
                </div>
                <EditButton label="View" feature="Active sessions management" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
