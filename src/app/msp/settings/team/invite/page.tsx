import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { InviteTeamMemberClient } from "./invite-client";

export default async function MspInviteTeamMemberPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get MSP organization
  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

  // Check if user has permission to invite (must be ADMIN or OWNER)
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: mspOrg.id,
    },
  });

  if (!membership || !["ADMIN", "OWNER"].includes(membership.role)) {
    redirect("/msp/team");
  }

  // Get pending invitations
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

  return (
    <InviteTeamMemberClient
      organization={mspOrg}
      pendingInvitations={pendingInvitations}
      currentUserRole={membership.role}
      backUrl="/msp/team"
    />
  );
}
