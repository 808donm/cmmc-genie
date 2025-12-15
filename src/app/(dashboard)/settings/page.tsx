import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Bell, Shield, AlertCircle } from "lucide-react";
import { EditButton } from "@/components/settings/edit-button";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get user's organization
  const orgMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Organization Settings</CardTitle>
            </div>
            <CardDescription>Manage your organization details and members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orgMembership ? (
              <>
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
                          <EditButton
                            label="Set Organization Name"
                            feature="Organization name editing"
                            variant="default"
                            size="sm"
                          />
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
                    <label className="text-sm font-medium text-slate-700">Subscription Tier</label>
                    <p className="mt-1 text-sm text-slate-900 capitalize">
                      {orgMembership.organization.subscriptionTier}
                    </p>
                  </div>
                </div>
                <EditButton label="Manage Organization" feature="Organization management" variant="outline" />
              </>
            ) : (
              <p className="text-sm text-slate-600">No organization membership found.</p>
            )}
          </CardContent>
        </Card>

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
