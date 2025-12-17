import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

// DELETE /api/invitations/[id] - Delete an invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get the invitation to check permissions
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        organization: {
          include: {
            members: {
              where: {
                userId: session.user.id,
              },
            },
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

    // Check if user has permission to delete (must be ADMIN or OWNER)
    const membership = invitation.organization.members[0];
    if (!membership || !["ADMIN", "OWNER"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Only admins and owners can delete invitations" },
        { status: 403 }
      );
    }

    // Delete the invitation
    await prisma.invitation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Invitation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { error: "Failed to delete invitation" },
      { status: 500 }
    );
  }
}
