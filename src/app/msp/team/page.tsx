import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Mail, Shield, Crown } from "lucide-react";
import Link from "next/link";
import { PendingInvitationsCard } from "./pending-invitations-card";

export default async function MspTeamPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

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
  type Invitation = typeof pendingInvitations[number];

  const totalMembers = teamMembers.length;
  const adminCount = teamMembers.filter((m: TeamMember) => m.role === "ADMIN" || m.role === "OWNER").length;
  const memberCount = teamMembers.filter((m: TeamMember) => m.role === "MEMBER").length;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-amber-600" />;
      case "ADMIN":
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-slate-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-amber-100 text-amber-700";
      case "ADMIN":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

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
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            All active members of your MSP organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member: TeamMember) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center gap-4">
                  {member.user.image ? (
                    <img
                      src={member.user.image}
                      alt={member.user.name || "User"}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                      <Users className="h-5 w-5 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900">
                        {member.user.name || "Unnamed User"}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-slate-500">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending invitations */}
      <PendingInvitationsCard
        invitations={pendingInvitations}
        getRoleBadgeColor={getRoleBadgeColor}
        getRoleIcon={getRoleIcon}
      />
    </div>
  );
}
