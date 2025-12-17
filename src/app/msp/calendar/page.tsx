import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { CalendarView } from "@/components/calendar/calendar-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Video, Users } from "lucide-react";
import Link from "next/link";

export default async function MspCalendarPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

  // Fetch all meetings from client projects managed by this MSP
  const meetings = await prisma.meeting.findMany({
    where: {
      project: {
        // Get meetings from client projects
        organization: {
          type: "CLIENT",
          mspClientProjects: {
            some: {
              mspOrganizationId: mspOrg.id,
            },
          },
        },
      },
    },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // Separate upcoming and past meetings
  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.startTime) >= now);
  const pastMeetings = meetings.filter((m) => new Date(m.startTime) < now);

  type MeetingWithDetails = typeof meetings[number];

  // Transform to calendar events
  const events = meetings.map((meeting: MeetingWithDetails) => ({
    id: meeting.id,
    title: `${meeting.project.organization.name} - ${meeting.title}`,
    start: meeting.startTime,
    end: meeting.endTime,
    description: meeting.agenda || undefined,
    attendees: meeting.attendees.map((a) => a.user.name).filter(Boolean) as string[],
    platform: meeting.platform,
    meetingUrl: meeting.meetingUrl,
  }));

  // Calculate statistics
  const totalMeetings = meetings.length;
  const uniqueClients = new Set(meetings.map((m) => m.project.organization.id)).size;
  const meetingsThisWeek = meetings.filter((m) => {
    const meetingDate = new Date(m.startTime);
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return meetingDate >= now && meetingDate <= weekFromNow;
  }).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Client Meetings Calendar</h1>
          <p className="mt-2 text-slate-600">
            View and manage meetings across all client organizations
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingMeetings.length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClients}</div>
            <p className="text-xs text-muted-foreground">
              With scheduled meetings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Distribution</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {["TEAMS", "ZOOM", "GOOGLE_MEET", "OTHER"].map((platform) => {
                const count = meetings.filter((m) => m.platform === platform).length;
                if (count === 0) return null;
                return (
                  <div key={platform} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{platform}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar view */}
      <CalendarView events={events} />

      {/* Upcoming meetings list */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>
            Next meetings scheduled with clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No upcoming meetings scheduled
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.slice(0, 5).map((meeting: MeetingWithDetails) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">
                      {meeting.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                      <span>{meeting.project.organization.name}</span>
                      <span>•</span>
                      <span>{new Date(meeting.startTime).toLocaleString()}</span>
                      <span>•</span>
                      <span>{meeting.attendees.length} attendees</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.meetingUrl && (
                      <Button asChild variant="outline" size="sm">
                        <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/meetings/${meeting.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length > 5 && (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/meetings">
                    View all {upcomingMeetings.length} upcoming meetings
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
