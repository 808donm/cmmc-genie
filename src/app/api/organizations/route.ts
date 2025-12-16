import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { isMspAdmin } from "@/lib/msp/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super admins and MSP admins can create organizations
    const isMsp = await isMspAdmin(session.user.id);
    const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

    if (!isSuperAdmin && !isMsp) {
      return NextResponse.json(
        { error: "Only super admins and MSP admins can create organizations" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, type, parentOrganizationId } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Organization name and type are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "An organization with this name already exists" },
        { status: 400 }
      );
    }

    // If CLIENT type, validate parent organization
    if (type === "CLIENT" && !parentOrganizationId) {
      return NextResponse.json(
        { error: "Client organizations must have a parent MSP organization" },
        { status: 400 }
      );
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        type,
        parentOrganizationId: type === "CLIENT" ? parentOrganizationId : null,
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
      },
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
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}
