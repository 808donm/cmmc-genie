import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.activeOrganization;

  const projects = organizationId
    ? await prisma.project.findMany({
        where: { organizationId },
        select: { id: true, name: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return NextResponse.json({ projects });
}
