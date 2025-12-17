import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Users, Shield, Bell, Palette } from "lucide-react";
import Link from "next/link";

export default async function MspSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

  // Get user's membership to check role
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: mspOrg.id,
    },
  });

  const isAdmin = membership?.role === "ADMIN" || membership?.role === "OWNER";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">MSP Settings</h1>
        <p className="mt-2 text-slate-600">
          Manage your MSP organization settings and preferences
        </p>
      </div>

      {/* Organization Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-slate-600" />
            <CardTitle>Organization Information</CardTitle>
          </div>
          <CardDescription>
            Your MSP organization details and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Organization Name</label>
            <Input
              type="text"
              defaultValue={mspOrg.name}
              className="mt-1"
              disabled={!isAdmin}
            />
            {!isAdmin && (
              <p className="mt-1 text-xs text-amber-600">
                Only admins can edit organization settings
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Organization Type</label>
            <Input
              type="text"
              value="Managed Service Provider (MSP)"
              className="mt-1"
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Created</label>
            <Input
              type="text"
              value={new Date(mspOrg.createdAt).toLocaleDateString()}
              className="mt-1"
              disabled
            />
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team & Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            <CardTitle>Team & Access</CardTitle>
          </div>
          <CardDescription>
            Manage team members and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">Team Members</h3>
              <p className="text-sm text-slate-600">
                Invite and manage MSP team members
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/msp/team">
                Manage Team
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">User Roles</h3>
              <p className="text-sm text-slate-600">
                Configure role permissions and access levels
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure email and in-app notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Project Updates</h3>
              <p className="text-sm text-slate-600">
                Get notified about project status changes
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Task Assignments</h3>
              <p className="text-sm text-slate-600">
                Notifications when tasks are assigned to you
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Client Activity</h3>
              <p className="text-sm text-slate-600">
                Updates on client organization activities
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Deadline Reminders</h3>
              <p className="text-sm text-slate-600">
                Alerts for upcoming project and task deadlines
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-slate-600" />
            <CardTitle>Integrations</CardTitle>
          </div>
          <CardDescription>
            Connect external tools and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">Calendar Integration</h3>
              <p className="text-sm text-slate-600">
                Sync with Google Calendar, Outlook, or other calendars
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">Email Integration</h3>
              <p className="text-sm text-slate-600">
                Configure email settings and templates
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">API Access</h3>
              <p className="text-sm text-slate-600">
                Generate API keys for custom integrations
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-600" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Security settings and audit logs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-600">
                Require 2FA for all team members
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">Audit Logs</h3>
              <p className="text-sm text-slate-600">
                View security and activity audit logs
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium text-slate-900">Session Management</h3>
              <p className="text-sm text-slate-600">
                Manage active sessions and session timeout
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {isAdmin && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
              <div>
                <h3 className="font-medium text-red-900">Delete Organization</h3>
                <p className="text-sm text-red-700">
                  Permanently delete this MSP organization and all associated data
                </p>
              </div>
              <Button variant="destructive" disabled>
                Delete Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
