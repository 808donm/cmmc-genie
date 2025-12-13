import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Video, FileText, Users, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default async function MeetingsPage() {
  const session = await auth();
  const organizationId = session?.user.activeOrganization;

  // Fetch meetings (through projects)
  const [upcomingMeetings, pastMeetings] = await Promise.all([
    prisma.meeting.findMany({
      where: {
        project: {
          organizationId: organizationId || "",
        },
        startTime: { gte: new Date() },
      },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
      take: 10,
    }),
    prisma.meeting.findMany({
      where: {
        project: {
          organizationId: organizationId || "",
        },
        startTime: { lt: new Date() },
      },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
      take: 10,
    }),
  ]);

  const platformBadgeColors = {
    TEAMS: "bg-purple-100 text-purple-700",
    ZOOM: "bg-blue-100 text-blue-700",
    GOOGLE_MEET: "bg-green-100 text-green-700",
    OTHER: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
          <p className="mt-2 text-slate-600">
            Manage compliance meetings, transcripts, and agendas
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Meetings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastMeetings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingMeetings.reduce((acc, m) => acc + m.attendees.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transcripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pastMeetings.filter((m) => m.transcript).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>Your scheduled compliance meetings</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">No upcoming meetings</p>
              <Button asChild className="mt-4">
                <Link href="/meetings/new">Schedule your first meeting</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    {meeting.platform && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                        <Video className="h-6 w-6 text-slate-600" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        {meeting.platform && (
                          <Badge
                            variant="outline"
                            className={platformBadgeColors[meeting.platform]}
                          >
                            {meeting.platform.replace("_", " ")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(meeting.startTime)} ·{" "}
                        {meeting.attendees.length} attendees
                      </p>
                      {meeting.agenda && (
                        <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                          {meeting.agenda}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {meeting.meetingUrl && (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={meeting.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Join
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/meetings/${meeting.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Past Meetings</CardTitle>
          <CardDescription>Meeting history with transcripts and notes</CardDescription>
        </CardHeader>
        <CardContent>
          {pastMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">No past meetings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{meeting.title}</h4>
                        {meeting.transcript && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <FileText className="mr-1 h-3 w-3" />
                            Transcript
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(meeting.startTime)}
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/meetings/${meeting.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
