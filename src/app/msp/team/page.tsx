import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { PendingInvitationsCard } from "./pending-invitations-card";
import { TeamMembersCard } from "./team-members-card";

export default async function MspTeamPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

  // Get current user's role in the organization
  const currentUserMembership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: mspOrg.id,
    },
  });

  // Fetch team members
  const teamMembers = await prisma.organizationMember.findMany({
    where: {
      organizationId: mspOrg.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  // Fetch pending invitations
  const pendingInvitations = await prisma.invitation.findMany({
    where: {
      organizationId: mspOrg.id,
      status: "PENDING",
    },
    include: {
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

  type TeamMember = typeof teamMembers[number];

  const totalMembers = teamMembers.length;
  const adminCount = teamMembers.filter((m: TeamMember) => m.role === "ADMIN" || m.role === "OWNER").length;
  const memberCount = teamMembers.filter((m: TeamMember) => m.role === "MEMBER").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">MSP Team</h1>
          <p className="mt-2 text-slate-600">
            Manage your MSP staff and team members
          </p>
        </div>
        <Button asChild>
          <Link href="/msp/settings/team/invite">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Team Member
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              Admin & Owner roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberCount}</div>
            <p className="text-xs text-muted-foreground">
              Standard members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting acceptance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team members list */}
      <TeamMembersCard
        members={teamMembers}
        organizationId={mspOrg.id}
        currentUserId={session.user.id}
        currentUserRole={currentUserMembership?.role || "MEMBER"}
      />

      {/* Pending invitations */}
      <PendingInvitationsCard
        invitations={pendingInvitations}
      />
    </div>
  );
}
