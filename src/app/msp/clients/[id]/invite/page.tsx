import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { InviteTeamMemberClient } from "@/app/msp/settings/team/invite/invite-client";

interface PageProps {
  params: { id: string };
}

export default async function ClientInvitePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get MSP organization to verify user is MSP member
  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

  // Get client organization
  const clientOrg = await prisma.organization.findUnique({
    where: { id: params.id },
  });

  if (!clientOrg) {
    redirect("/msp/clients");
  }

  // Check if user has permission to invite (must be MSP ADMIN or OWNER)
  const mspMembership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: mspOrg.id,
    },
  });

  if (!mspMembership || !["ADMIN", "OWNER"].includes(mspMembership.role)) {
    redirect(`/msp/clients/${params.id}`);
  }

  // Get pending invitations for this client
  const pendingInvitations = await prisma.invitation.findMany({
    where: {
      organizationId: clientOrg.id,
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
      organization={clientOrg}
      pendingInvitations={pendingInvitations}
      currentUserRole={mspMembership.role}
      backUrl={`/msp/clients/${params.id}`}
    />
  );
}
