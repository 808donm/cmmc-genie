// Import Prisma types for local use
import type {
  Task,
  Milestone,
  RACIRole,
  MeetingPlatform,
  AgentType,
} from "@prisma/client";

// Re-export Prisma types for convenience
export type {
  User,
  Organization,
  Project,
  Task,
  Roadmap,
  Milestone,
  TaskAssignment,
  CMMCControl,
  ControlInstance,
  Evidence,
  Meeting,
  Policy,
  Configuration,
  Audit,
  Vendor,
  Risk,
  Notification,
} from "@prisma/client";

export type {
  UserRole,
  OrgRole,
  CMMCLevel,
  ProjectStatus,
  TaskStatus,
  Priority,
  RACIRole,
  ControlStatus,
  EvidenceType,
  MeetingPlatform,
  AgentType,
  AuditType,
  RiskLevel,
} from "@prisma/client";

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
  tasks: Task[];
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
  milestones: Milestone[];
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
