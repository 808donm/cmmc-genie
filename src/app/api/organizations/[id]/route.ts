import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { isMspAdmin, hasOrganizationAccess } from "@/lib/msp/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, type, parentOrganizationId } = body;

    // Check if user has access to this organization
    const isMsp = await isMspAdmin(session.user.id);
    const isSuperAdmin = session?.user.role === "SUPER_ADMIN";
    const hasAccess = await hasOrganizationAccess(session.user.id, id);

    if (!isSuperAdmin && !isMsp && !hasAccess) {
      return NextResponse.json(
        { error: "You don't have permission to edit this organization" },
        { status: 403 }
      );
    }

    // Get the current organization
    const currentOrg = await prisma.organization.findUnique({
      where: { id },
    });

    if (!currentOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check if user is admin of this organization (unless super admin or MSP admin)
    if (!isSuperAdmin && !isMsp) {
      const membership = await prisma.organizationMember.findFirst({
        where: {
          userId: session.user.id,
          organizationId: id,
          role: {
            in: ["OWNER", "ADMIN"],
          },
        },
      });

      if (!membership) {
        return NextResponse.json(
          { error: "Only admins can edit organization details" },
          { status: 403 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (name && name !== currentOrg.name) {
      // Generate new slug if name is changing
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Check if new slug already exists
      const existingOrg = await prisma.organization.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingOrg) {
        return NextResponse.json(
          { error: "An organization with this name already exists" },
          { status: 400 }
        );
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (type && type !== currentOrg.type) {
      // If changing to CLIENT, must have parent
      if (type === "CLIENT" && !parentOrganizationId) {
        return NextResponse.json(
          { error: "Client organizations must have a parent MSP organization" },
          { status: 400 }
        );
      }

      // If changing from MSP to CLIENT, check if it has client organizations
      if (currentOrg.type === "MSP" && type === "CLIENT") {
        const clientCount = await prisma.organization.count({
          where: { parentOrganizationId: id },
        });

        if (clientCount > 0) {
          return NextResponse.json(
            {
              error: `Cannot change to CLIENT type. This MSP organization manages ${clientCount} client organization(s). Please reassign clients first.`,
            },
            { status: 400 }
          );
        }
      }

      updateData.type = type;
    }

    // Handle parent organization change
    if (type === "CLIENT" || currentOrg.type === "CLIENT") {
      if (parentOrganizationId !== undefined) {
        // Validate parent organization exists and is MSP type
        if (parentOrganizationId) {
          const parentOrg = await prisma.organization.findUnique({
            where: { id: parentOrganizationId },
          });

          if (!parentOrg) {
            return NextResponse.json(
              { error: "Parent organization not found" },
              { status: 404 }
            );
          }

          if (parentOrg.type !== "MSP") {
            return NextResponse.json(
              { error: "Parent organization must be an MSP" },
              { status: 400 }
            );
          }
        }

        updateData.parentOrganizationId = parentOrganizationId || null;
      }
    } else if (type === "MSP" || currentOrg.type === "MSP") {
      // MSP organizations should not have a parent
      updateData.parentOrganizationId = null;
    }

    // Update organization
    const organization = await prisma.organization.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
        parentOrganization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}
