import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { CalendarView } from "@/components/calendar/calendar-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Meeting, MeetingAttendee, User } from "@prisma/client";

export default async function CalendarPage() {
  const session = await auth();
  const organizationId = session?.user.activeOrganization;

  // Fetch meetings for the calendar (through projects)
  const meetings = await prisma.meeting.findMany({
    where: {
      project: {
        organizationId: organizationId || "",
      },
    },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // Convert to calendar events
  const events = meetings.map((meeting: Meeting & { attendees: (MeetingAttendee & { user: User })[] }) => ({
    id: meeting.id,
    title: meeting.title,
    start: meeting.startTime,
    end: meeting.endTime,
    description: meeting.agenda || undefined,
    attendees: meeting.attendees.map((a) => a.user.name).filter(Boolean) as string[],
    platform: meeting.platform,
    meetingUrl: meeting.meetingUrl,
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="mt-2 text-slate-600">
            Schedule and manage compliance meetings
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Link>
        </Button>
      </div>

      {/* Integration status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Microsoft Teams</CardTitle>
            <svg className="h-6 w-6" viewBox="0 0 23 23">
              <path fill="#5059c9" d="M0 0h23v23H0z" />
              <path fill="#fff" d="M4 4h11v11H4z" opacity=".1" />
              <path fill="#fff" d="M5 5h9v9H5z" opacity=".2" />
              <path fill="#fff" d="M6 6h7v7H6z" opacity=".3" />
              <path fill="#fff" d="M7 7h5v5H7z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Connect to sync Teams meetings
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Connect
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zoom</CardTitle>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#2D8CFF">
              <path d="M4.115 4.115c-.8 0-1.448.648-1.448 1.448v8.158c0 .8.648 1.448 1.448 1.448h8.158c.8 0 1.448-.648 1.448-1.448V5.563c0-.8-.648-1.448-1.448-1.448H4.115zm11.61 2.068v8.157a.724.724 0 001.237.513l4.795-4.795a.725.725 0 000-1.025l-4.795-4.795a.724.724 0 00-1.237.513v1.432z"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Connect to sync Zoom meetings
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Connect
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Calendar</CardTitle>
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path fill="#1a73e8" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
              <path fill="#ea4335" d="M7 12h5v5H7z"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Connect to sync Google Calendar
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Connect
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Calendar view */}
      <CalendarView events={events} />
    </div>
  );
}
