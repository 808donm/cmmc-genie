// Define enum types locally (these match Prisma schema but aren't exported)
export type RACIRole = "RESPONSIBLE" | "ACCOUNTABLE" | "CONSULTED" | "INFORMED";
export type MeetingPlatform = "TEAMS" | "ZOOM" | "GOOGLE_MEET" | "OTHER";

// Import AgentType from where it's defined
import type { AgentType } from "@/lib/ai/base-agent";

// Note: Prisma model and enum types are not re-exported here due to export limitations
// Import them directly from "@prisma/client" where needed

// Re-export the locally defined/imported enum types
export type { AgentType };

// Custom types
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingMeetings: number;
  complianceScore: number;
  activeProjects: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: any[]; // Task model type not exported from Prisma
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: string[];
  assignee?: string;
}

export interface RACIMatrix {
  tasks: string[];
  members: string[];
  assignments: Record<string, Record<string, RACIRole | null>>;
}

export interface ComplianceRoadmap {
  phase: number;
  name: string;
  milestones: any[]; // Milestone model type not exported from Prisma
  progress: number;
  startDate: Date;
  endDate: Date;
}

export interface AIAgentResponse {
  agentType: AgentType;
  content: string;
  suggestions?: string[];
  confidence?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  platform?: MeetingPlatform;
  attendees: string[];
}
