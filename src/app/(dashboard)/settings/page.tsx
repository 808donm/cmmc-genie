import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, User, Bell, Shield } from "lucide-react";

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
            <Button variant="outline">Edit Profile</Button>
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Organization Name</label>
                    <p className="mt-1 text-sm text-slate-900">{orgMembership.organization.name}</p>
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
                <Button variant="outline">Manage Organization</Button>
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
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Meeting Reminders</p>
                  <p className="text-sm text-slate-600">Receive reminders for upcoming meetings</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Compliance Updates</p>
                  <p className="text-sm text-slate-600">Get updates on compliance status changes</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
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
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Active Sessions</p>
                  <p className="text-sm text-slate-600">Manage devices where you're signed in</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
