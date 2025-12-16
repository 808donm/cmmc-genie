import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = params;

    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if invitation is for this user's email
    if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "This invitation is for a different email address" },
        { status: 403 }
      );
    }

    // Check if invitation has already been accepted
    if (invitation.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "This invitation has already been accepted" },
        { status: 400 }
      );
    }

    // Check if invitation has expired
    if (invitation.expiresAt < new Date()) {
      // Update status to expired
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });

      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const existingMembership = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId: invitation.organizationId,
      },
    });

    if (existingMembership) {
      // Mark invitation as accepted anyway
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "You are already a member of this organization",
        organization: invitation.organization,
      });
    }

    // Create organization membership
    await prisma.organizationMember.create({
      data: {
        userId: session.user.id,
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    });

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully joined ${invitation.organization.name}`,
      organization: invitation.organization,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

// GET /api/invitations/[token] - Get invitation details
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Don't return full details if already accepted or expired
    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        {
          status: invitation.status,
          message:
            invitation.status === "ACCEPTED"
              ? "This invitation has already been accepted"
              : "This invitation is no longer valid",
        },
        { status: 400 }
      );
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        {
          status: "EXPIRED",
          message: "This invitation has expired",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      invitation: {
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        organization: invitation.organization,
        invitedBy: invitation.invitedBy,
      },
    });
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}
