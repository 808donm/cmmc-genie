import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { hasOrganizationAccess } from "@/lib/msp/utils";

// POST /api/invitations - Create a new invitation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, organizationId, role = "MEMBER" } = body;

    if (!email || !organizationId) {
      return NextResponse.json(
        { error: "Email and organization ID are required" },
        { status: 400 }
      );
    }

    // Check if user has access to invite to this organization
    const hasAccess = await hasOrganizationAccess(session.user.id, organizationId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "You do not have permission to invite users to this organization" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
    });

    // Check user's role - must be ADMIN or OWNER to invite
    if (existingMember && !["ADMIN", "OWNER"].includes(existingMember.role)) {
      return NextResponse.json(
        { error: "Only admins and owners can send invitations" },
        { status: 403 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        organizationId,
        status: "PENDING",
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this email" },
        { status: 400 }
      );
    }

    // Create the invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.invitation.create({
      data: {
        email,
        organizationId,
        invitedById: session.user.id,
        role,
        expiresAt,
      },
      include: {
        organization: true,
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Send invitation email
    // In a production app, you would send an email here with:
    // - Link: `${process.env.NEXTAUTH_URL}/auth/signin?invitation=${invitation.token}`
    // - Organization name
    // - Inviter name

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
        inviteLink: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/signin?invitation=${invitation.token}`,
      },
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}

// GET /api/invitations - Get all invitations for organizations the user has access to
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization memberships
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId: session.user.id,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
      select: {
        organizationId: true,
      },
    });

    const organizationIds = memberships.map((m) => m.organizationId);

    // Get invitations for these organizations
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

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}
