import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { isMspAdmin, getAccessibleOrganizations } from "@/lib/msp/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "@/components/users/user-list";
import { InvitationsList } from "@/components/invitations/invitations-list";
import { Users, UserCheck, UserPlus } from "lucide-react";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Check if user is MSP admin
  const isMsp = await isMspAdmin(session.user.id);

  // Get organizations the user can manage
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
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="mt-2 text-slate-600">
            You must be an admin to manage users
          </p>
        </div>
      </div>
    );
  }

  // Get all users from accessible organizations
  const organizationIds = memberships.map((m) => m.organizationId);

  // If MSP admin, get all organizations
  let allOrganizationIds = organizationIds;
  if (isMsp) {
    const accessibleOrgs = await getAccessibleOrganizations(session.user.id);
    allOrganizationIds = accessibleOrgs.map((org) => org.id);
  }

  // Get all users who are members of these organizations
  const users = await prisma.user.findMany({
    where: {
      organizationMembers: {
        some: {
          organizationId: {
            in: allOrganizationIds,
          },
        },
      },
    },
    include: {
      organizationMembers: {
        where: {
          organizationId: {
            in: allOrganizationIds,
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get pending invitations for these organizations
  const pendingInvitations = await prisma.invitation.findMany({
    where: {
      organizationId: {
        in: allOrganizationIds,
      },
      status: "PENDING",
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

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.organizationMembers.length > 0).length;
  const adminUsers = users.filter((u) =>
    u.organizationMembers.some((m) => m.role === "ADMIN" || m.role === "OWNER")
  ).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="mt-2 text-slate-600">
          {isMsp
            ? "Manage users across all organizations"
            : "Manage users in your organization"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-slate-600">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-slate-600">Admins and owners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations.length}</div>
            <p className="text-xs text-slate-600">Awaiting acceptance</p>
          </CardContent>
        </Card>
      </div>

      {/* Users list */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserList
            users={users}
            isMspAdmin={isMsp}
            currentUserId={session.user.id}
          />
        </CardContent>
      </Card>

      {/* Pending invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Users who have been invited but haven&apos;t joined yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvitationsList invitations={pendingInvitations} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
