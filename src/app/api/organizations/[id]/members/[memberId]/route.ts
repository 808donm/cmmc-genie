import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

// DELETE /api/organizations/[id]/members/[memberId] - Remove a member from organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: organizationId, memberId } = params;

    // Check if current user is admin or owner of the organization
    const currentUserMembership = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
        role: { in: ["ADMIN", "OWNER"] },
      },
    });

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: "You must be an admin or owner to remove members" },
        { status: 403 }
      );
    }

    // Get the member to be removed
    const memberToRemove = await prisma.organizationMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });

    if (!memberToRemove || memberToRemove.organizationId !== organizationId) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Prevent removing yourself
    if (memberToRemove.userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the organization" },
        { status: 400 }
      );
    }

    // Prevent admins from removing owners
    if (
      currentUserMembership.role === "ADMIN" &&
      memberToRemove.role === "OWNER"
    ) {
      return NextResponse.json(
        { error: "Admins cannot remove owners" },
        { status: 403 }
      );
    }

    // Check if this is the last owner
    if (memberToRemove.role === "OWNER") {
      const ownerCount = await prisma.organizationMember.count({
        where: {
          organizationId,
          role: "OWNER",
        },
      });

      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last owner of the organization" },
          { status: 400 }
        );
      }
    }

    // Remove the member from the organization
    await prisma.organizationMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json({
      success: true,
      message: `${memberToRemove.user.name || memberToRemove.user.email} has been removed from the organization`,
    });
  } catch (error) {
    console.error("Error removing organization member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
