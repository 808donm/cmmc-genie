import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getUserActiveOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { InviteTeamMemberClient } from "./invite-client";

export default async function InviteTeamMemberPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's active organization
  const organization = await getUserActiveOrganization(session.user.id);
  if (!organization) {
    redirect("/dashboard");
  }

  // Check if user has permission to invite (must be ADMIN or OWNER)
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: organization.id,
    },
  });

  if (!membership || !["ADMIN", "OWNER"].includes(membership.role)) {
    redirect("/settings/team");
  }

  // Get pending invitations
  const pendingInvitations = await prisma.invitation.findMany({
    where: {
      organizationId: organization.id,
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

  return (
    <InviteTeamMemberClient
      organization={organization}
      pendingInvitations={pendingInvitations}
      currentUserRole={membership.role}
    />
  );
}
