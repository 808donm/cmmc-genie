"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProjectOption {
  id: string;
  name: string;
}

export default function NewMeetingPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("TEAMS");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects/summary")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
        if (data.projects?.length) {
          setProjectId(data.projects[0].id);
        }
      })
      .catch(() => setError("Unable to load projects"));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, title, description, platform, meetingUrl, startTime, endTime }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to schedule meeting");
      }

      router.push("/meetings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule meeting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Schedule Meeting</h1>
        <p className="mt-2 text-slate-600">Book a Teams, Zoom, or Google Meet session with your project team.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
          <CardDescription>Select a project and fill in the meeting details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEAMS">Microsoft Teams</SelectItem>
                    <SelectItem value="GOOGLE_MEET">Google Meet</SelectItem>
                    <SelectItem value="ZOOM">Zoom</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. POA&M review" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agenda, participants, and objectives"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meeting Link (optional)</Label>
              <Input
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://teams.microsoft.com/..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !projectId}>
                {submitting ? "Scheduling..." : "Schedule"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
