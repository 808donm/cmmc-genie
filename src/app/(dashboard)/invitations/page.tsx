import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getAccessibleOrganizations, isMspAdmin } from "@/lib/msp/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InviteUserForm } from "@/components/invitations/invite-user-form";
import { InvitationsList } from "@/components/invitations/invitations-list";
import { UserPlus, Mail } from "lucide-react";

export default async function InvitationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Check if user is MSP admin or organization admin
  const isMsp = await isMspAdmin(session.user.id);
  const organizations = await getAccessibleOrganizations(session.user.id);

  // Get user's memberships to check if they're admin
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId: session.user.id,
      role: {
        in: ["OWNER", "ADMIN"],
      },
    },
    include: {
      organization: true,
    },
  });

  if (memberships.length === 0 && !isMsp) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invitations</h1>
          <p className="mt-2 text-slate-600">
            You must be an admin to manage invitations
          </p>
        </div>
      </div>
    );
  }

  // Get all invitations for organizations the user can manage
  const organizationIds = memberships.map((m) => m.organizationId);

  const invitations = await prisma.invitation.findMany({
    where: {
      organizationId: {
        in: organizationIds,
      },
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      invitedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = invitations.filter((i) => i.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Invitations</h1>
        <p className="mt-2 text-slate-600">
          {isMsp
            ? "Invite users to join your client organizations"
            : "Invite users to join your organization"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invitations.length}</div>
            <p className="text-xs text-slate-600">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-slate-600">Awaiting acceptance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invitations.filter((i) => i.status === "ACCEPTED").length}
            </div>
            <p className="text-xs text-slate-600">Successfully joined</p>
          </CardContent>
        </Card>
      </div>

      {/* Invite form */}
      <Card>
        <CardHeader>
          <CardTitle>Invite New User</CardTitle>
          <CardDescription>
            Send an invitation to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteUserForm organizations={organizations} />
        </CardContent>
      </Card>

      {/* Invitations list */}
      <Card>
        <CardHeader>
          <CardTitle>All Invitations</CardTitle>
          <CardDescription>
            View and manage all sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvitationsList invitations={invitations} />
        </CardContent>
      </Card>
    </div>
  );
}
