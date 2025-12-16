import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { isMspAdmin, hasOrganizationAccess } from "@/lib/msp/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const body = await request.json();
    const { organizationId, orgRole, userRole } = body;

    // Check if current user is MSP admin
    const isMsp = await isMspAdmin(session.user.id);

    // For organization role changes
    if (organizationId && orgRole) {
      // Check if current user has access to this organization
      const hasAccess = await hasOrganizationAccess(session.user.id, organizationId);

      if (!hasAccess) {
        return NextResponse.json(
          { error: "You don't have permission to manage this organization" },
          { status: 403 }
        );
      }

      // Check if current user is admin of this organization
      const currentUserMembership = await prisma.organizationMember.findFirst({
        where: {
          userId: session.user.id,
          organizationId,
          role: {
            in: ["OWNER", "ADMIN"],
          },
        },
      });

      if (!currentUserMembership && !isMsp) {
        return NextResponse.json(
          { error: "You must be an admin to change user roles" },
          { status: 403 }
        );
      }

      // Prevent removing the last owner
      if (orgRole !== "OWNER") {
        const targetMembership = await prisma.organizationMember.findFirst({
          where: {
            userId,
            organizationId,
          },
        });

        if (targetMembership?.role === "OWNER") {
          const ownerCount = await prisma.organizationMember.count({
            where: {
              organizationId,
              role: "OWNER",
            },
          });

          if (ownerCount <= 1) {
            return NextResponse.json(
              { error: "Cannot change the role of the last owner" },
              { status: 400 }
            );
          }
        }
      }

      // Update organization role
      await prisma.organizationMember.update({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
        data: {
          role: orgRole,
        },
      });
    }

    // For user role changes (system-wide) - only MSP admins can do this
    if (userRole) {
      if (!isMsp) {
        return NextResponse.json(
          { error: "Only MSP admins can change system-wide user roles" },
          { status: 403 }
        );
      }

      await prisma.user.update({
        where: { id: userId },
        data: { role: userRole },
      });
    }

    // Fetch updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organizationMembers: {
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
    });

    return NextResponse.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
