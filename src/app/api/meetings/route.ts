import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { projectId, title, description, startTime, endTime, platform, meetingUrl } = body;

    if (!projectId || !title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "projectId, title, startTime, and endTime are required" },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.meeting.create({
      data: {
        projectId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        platform,
        meetingUrl,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating meeting", error);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}
