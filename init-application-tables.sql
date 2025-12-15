-- ============================================
-- CMMC Genie - Application Tables
-- Run this after the authentication tables are set up
-- ============================================

-- Create ENUM types for application tables
CREATE TYPE "CMMCLevel" AS ENUM ('LEVEL_1', 'LEVEL_2', 'LEVEL_3');
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
CREATE TYPE "MilestoneStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED');
CREATE TYPE "TaskStatus" AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE');
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "RACIRole" AS ENUM ('RESPONSIBLE', 'ACCOUNTABLE', 'CONSULTED', 'INFORMED');
CREATE TYPE "DependencyType" AS ENUM ('FINISH_TO_START', 'START_TO_START', 'FINISH_TO_FINISH', 'START_TO_FINISH');
CREATE TYPE "ControlStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'IMPLEMENTED', 'TESTING', 'COMPLIANT', 'NON_COMPLIANT');
CREATE TYPE "EvidenceType" AS ENUM ('POLICY', 'PROCEDURE', 'SCREENSHOT', 'CONFIGURATION', 'LOG', 'CERTIFICATE', 'TRAINING_RECORD', 'ASSESSMENT_REPORT', 'DIAGRAM', 'OTHER');
CREATE TYPE "EvidenceStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED');
CREATE TYPE "MeetingPlatform" AS ENUM ('TEAMS', 'ZOOM', 'GOOGLE_MEET', 'OTHER');
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "AttendeeStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED', 'TENTATIVE', 'ATTENDED', 'NO_SHOW');
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "EquipmentType" AS ENUM ('ROUTER', 'SWITCH', 'FIREWALL', 'WIRELESS_AP', 'WIRELESS_CONTROLLER', 'VPN_GATEWAY', 'IDS_IPS', 'OTHER');
CREATE TYPE "ConfigVendor" AS ENUM ('CISCO', 'HP', 'ARUBA', 'UNIFI', 'SONICWALL', 'FORTINET', 'PALO_ALTO', 'JUNIPER', 'OTHER');
CREATE TYPE "ConfigStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'APPLIED', 'ARCHIVED');
CREATE TYPE "AgentType" AS ENUM ('ORCHESTRATOR', 'POLICY_DRAFTING', 'C3PAO_EXPERT', 'CONFIGURATION', 'CUI_ANALYST', 'EVIDENCE_COLLECTION', 'GAP_ANALYSIS', 'TRAINING', 'VENDOR_ASSESSMENT', 'INCIDENT_RESPONSE', 'RISK_ASSESSMENT', 'AUDIT_PREP', 'COMPLIANCE_MONITORING', 'CHANGE_MANAGEMENT');
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'APPLIED');
CREATE TYPE "AuditType" AS ENUM ('C3PAO', 'INTERNAL', 'GAP_ASSESSMENT', 'PRE_ASSESSMENT');
CREATE TYPE "AuditStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "FindingSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');
CREATE TYPE "FindingStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'ACCEPTED_RISK', 'FALSE_POSITIVE');
CREATE TYPE "RiskLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "VendorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_REVIEW', 'REJECTED');
CREATE TYPE "RiskStatus" AS ENUM ('IDENTIFIED', 'ANALYZING', 'MITIGATING', 'MONITORING', 'RESOLVED', 'ACCEPTED');
CREATE TYPE "IncidentStatus" AS ENUM ('NEW', 'INVESTIGATING', 'CONTAINED', 'ERADICATING', 'RECOVERING', 'RESOLVED', 'CLOSED');
CREATE TYPE "NotificationType" AS ENUM ('TASK_ASSIGNED', 'TASK_DUE', 'MEETING_SCHEDULED', 'EVIDENCE_NEEDED', 'POLICY_APPROVAL', 'AUDIT_SCHEDULED', 'FINDING_ASSIGNED', 'MENTION', 'SYSTEM');

-- ============================================
-- Project & Roadmap Management
-- ============================================

CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetCMMCLevel" "CMMCLevel" NOT NULL DEFAULT 'LEVEL_1',
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "spentBudget" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX "Project_organizationId_idx" ON "Project"("organizationId");
CREATE INDEX "Project_status_idx" ON "Project"("status");

CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phase" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Roadmap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Roadmap_projectId_idx" ON "Roadmap"("projectId");

CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roadmapId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "MilestoneStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "Milestone_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id")
);

CREATE INDEX "Milestone_projectId_idx" ON "Milestone"("projectId");
CREATE INDEX "Milestone_roadmapId_idx" ON "Milestone"("roadmapId");

-- ============================================
-- Task Management (Kanban)
-- ============================================

CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roadmapId" TEXT,
    "milestoneId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'BACKLOG',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "tags" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "Task_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id"),
    CONSTRAINT "Task_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id"),
    CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id"),
    CONSTRAINT "Task_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id")
);

CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Task_roadmapId_idx" ON "Task"("roadmapId");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

CREATE TABLE "TaskAssignment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RACIRole" NOT NULL DEFAULT 'RESPONSIBLE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE,
    CONSTRAINT "TaskAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "TaskAssignment_taskId_userId_role_key" ON "TaskAssignment"("taskId", "userId", "role");
CREATE INDEX "TaskAssignment_taskId_idx" ON "TaskAssignment"("taskId");
CREATE INDEX "TaskAssignment_userId_idx" ON "TaskAssignment"("userId");

CREATE TABLE "TaskDependency" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,
    "dependencyType" "DependencyType" NOT NULL DEFAULT 'FINISH_TO_START',
    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE,
    CONSTRAINT "TaskDependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "Task"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "TaskDependency_taskId_dependsOnId_key" ON "TaskDependency"("taskId", "dependsOnId");
CREATE INDEX "TaskDependency_taskId_idx" ON "TaskDependency"("taskId");
CREATE INDEX "TaskDependency_dependsOnId_idx" ON "TaskDependency"("dependsOnId");

CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- ============================================
-- CMMC Controls & Practices
-- ============================================

CREATE TABLE "CMMCControl" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "practice" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "objective" TEXT,
    CONSTRAINT "CMMCControl_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CMMCControl_domain_idx" ON "CMMCControl"("domain");
CREATE INDEX "CMMCControl_level_idx" ON "CMMCControl"("level");

CREATE TABLE "ControlInstance" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "taskId" TEXT,
    "status" "ControlStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "maturityScore" INTEGER DEFAULT 0,
    "implementationNotes" TEXT,
    "gapDescription" TEXT,
    "remediationPlan" TEXT,
    "assessedAt" TIMESTAMP(3),
    "assessedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ControlInstance_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ControlInstance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "ControlInstance_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "CMMCControl"("id"),
    CONSTRAINT "ControlInstance_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id")
);

CREATE UNIQUE INDEX "ControlInstance_projectId_controlId_key" ON "ControlInstance"("projectId", "controlId");
CREATE INDEX "ControlInstance_projectId_idx" ON "ControlInstance"("projectId");
CREATE INDEX "ControlInstance_controlId_idx" ON "ControlInstance"("controlId");
CREATE INDEX "ControlInstance_status_idx" ON "ControlInstance"("status");

-- ============================================
-- Evidence & Documentation
-- ============================================

CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "controlId" TEXT,
    "taskId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EvidenceType" NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "collectedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" TIMESTAMP(3),
    "status" "EvidenceStatus" NOT NULL DEFAULT 'DRAFT',
    "uploadedBy" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Evidence_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "Evidence_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "ControlInstance"("id"),
    CONSTRAINT "Evidence_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id")
);

CREATE INDEX "Evidence_projectId_idx" ON "Evidence"("projectId");
CREATE INDEX "Evidence_controlId_idx" ON "Evidence"("controlId");
CREATE INDEX "Evidence_type_idx" ON "Evidence"("type");
CREATE INDEX "Evidence_status_idx" ON "Evidence"("status");

-- ============================================
-- Meeting Management
-- ============================================

CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "meetingUrl" TEXT,
    "platform" "MeetingPlatform",
    "externalId" TEXT,
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "agenda" TEXT,
    "transcript" TEXT,
    "transcriptUrl" TEXT,
    "recordingUrl" TEXT,
    "aiSummary" TEXT,
    "actionItems" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Meeting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Meeting_projectId_idx" ON "Meeting"("projectId");
CREATE INDEX "Meeting_startTime_idx" ON "Meeting"("startTime");
CREATE INDEX "Meeting_platform_idx" ON "Meeting"("platform");

CREATE TABLE "MeetingAttendee" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AttendeeStatus" NOT NULL DEFAULT 'INVITED',
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    CONSTRAINT "MeetingAttendee_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MeetingAttendee_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE,
    CONSTRAINT "MeetingAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "MeetingAttendee_meetingId_userId_key" ON "MeetingAttendee"("meetingId", "userId");
CREATE INDEX "MeetingAttendee_meetingId_idx" ON "MeetingAttendee"("meetingId");
CREATE INDEX "MeetingAttendee_userId_idx" ON "MeetingAttendee"("userId");

-- ============================================
-- Policy Management
-- ============================================

CREATE TABLE "PolicyTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "cmmcLevel" INTEGER,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PolicyTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "category" TEXT,
    "tags" TEXT[],
    "effectiveDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "templateId" TEXT,
    "fileUrl" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Policy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
    CONSTRAINT "Policy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id"),
    CONSTRAINT "Policy_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id"),
    CONSTRAINT "Policy_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PolicyTemplate"("id")
);

CREATE INDEX "Policy_organizationId_idx" ON "Policy"("organizationId");
CREATE INDEX "Policy_projectId_idx" ON "Policy"("projectId");
CREATE INDEX "Policy_status_idx" ON "Policy"("status");

CREATE TABLE "PolicyVersion" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "changes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PolicyVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PolicyVersion_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE CASCADE
);

CREATE INDEX "PolicyVersion_policyId_idx" ON "PolicyVersion"("policyId");

-- ============================================
-- Network Configuration Management
-- ============================================

CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "equipmentType" "EquipmentType" NOT NULL,
    "vendor" "ConfigVendor" NOT NULL,
    "model" TEXT,
    "purpose" TEXT,
    "config" TEXT NOT NULL,
    "configHash" TEXT,
    "status" "ConfigStatus" NOT NULL DEFAULT 'DRAFT',
    "appliedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Configuration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX "Configuration_organizationId_idx" ON "Configuration"("organizationId");
CREATE INDEX "Configuration_equipmentType_idx" ON "Configuration"("equipmentType");
CREATE INDEX "Configuration_vendor_idx" ON "Configuration"("vendor");

CREATE TABLE "ConfigurationVersion" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "config" TEXT NOT NULL,
    "changes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConfigurationVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ConfigurationVersion_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE CASCADE
);

CREATE INDEX "ConfigurationVersion_configurationId_idx" ON "ConfigurationVersion"("configurationId");

-- ============================================
-- AI Agents & Suggestions
-- ============================================

CREATE TABLE "AIAgentSuggestion" (
    "id" TEXT NOT NULL,
    "agentType" "AgentType" NOT NULL,
    "taskId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIAgentSuggestion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AIAgentSuggestion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE
);

CREATE INDEX "AIAgentSuggestion_agentType_idx" ON "AIAgentSuggestion"("agentType");
CREATE INDEX "AIAgentSuggestion_status_idx" ON "AIAgentSuggestion"("status");
CREATE INDEX "AIAgentSuggestion_taskId_idx" ON "AIAgentSuggestion"("taskId");

-- ============================================
-- Audits & Assessments
-- ============================================

CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "AuditType" NOT NULL DEFAULT 'C3PAO',
    "status" "AuditStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "auditorName" TEXT,
    "auditorOrg" TEXT,
    "findingsSummary" TEXT,
    "score" DOUBLE PRECISION,
    "recommendations" TEXT,
    "reportUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Audit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Audit_projectId_idx" ON "Audit"("projectId");
CREATE INDEX "Audit_type_idx" ON "Audit"("type");
CREATE INDEX "Audit_status_idx" ON "Audit"("status");

CREATE TABLE "AuditFinding" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "controlId" TEXT,
    "severity" "FindingSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "remediation" TEXT,
    "status" "FindingStatus" NOT NULL DEFAULT 'OPEN',
    "dueDate" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditFinding_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuditFinding_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE
);

CREATE INDEX "AuditFinding_auditId_idx" ON "AuditFinding"("auditId");
CREATE INDEX "AuditFinding_severity_idx" ON "AuditFinding"("severity");
CREATE INDEX "AuditFinding_status_idx" ON "AuditFinding"("status");

-- ============================================
-- Vendor Management
-- ============================================

CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "services" TEXT[],
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "assessmentScore" DOUBLE PRECISION,
    "lastAssessment" TIMESTAMP(3),
    "nextAssessment" TIMESTAMP(3),
    "status" "VendorStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Vendor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX "Vendor_organizationId_idx" ON "Vendor"("organizationId");
CREATE INDEX "Vendor_riskLevel_idx" ON "Vendor"("riskLevel");
CREATE INDEX "Vendor_status_idx" ON "Vendor"("status");

CREATE TABLE "VendorAssessment" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "assessedBy" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "questionnaire" JSONB,
    "findings" TEXT,
    "recommendations" TEXT,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VendorAssessment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "VendorAssessment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE
);

CREATE INDEX "VendorAssessment_vendorId_idx" ON "VendorAssessment"("vendorId");

-- ============================================
-- Training & Awareness
-- ============================================

CREATE TABLE "TrainingProgram" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "duration" INTEGER,
    "requiredFor" TEXT[],
    "cmmcLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrainingProgram_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TrainingProgram_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX "TrainingProgram_organizationId_idx" ON "TrainingProgram"("organizationId");

CREATE TABLE "TrainingCompletion" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION,
    "certificate" TEXT,
    CONSTRAINT "TrainingCompletion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TrainingCompletion_programId_fkey" FOREIGN KEY ("programId") REFERENCES "TrainingProgram"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "TrainingCompletion_programId_userId_key" ON "TrainingCompletion"("programId", "userId");
CREATE INDEX "TrainingCompletion_programId_idx" ON "TrainingCompletion"("programId");
CREATE INDEX "TrainingCompletion_userId_idx" ON "TrainingCompletion"("userId");

-- ============================================
-- Risk Management
-- ============================================

CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "methodology" TEXT,
    "assessedBy" TEXT,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReview" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "RiskAssessment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
    CONSTRAINT "RiskAssessment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id")
);

CREATE INDEX "RiskAssessment_organizationId_idx" ON "RiskAssessment"("organizationId");
CREATE INDEX "RiskAssessment_projectId_idx" ON "RiskAssessment"("projectId");

CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "likelihood" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "mitigation" TEXT,
    "owner" TEXT,
    "status" "RiskStatus" NOT NULL DEFAULT 'IDENTIFIED',
    "dueDate" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Risk_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "RiskAssessment"("id") ON DELETE CASCADE
);

CREATE INDEX "Risk_assessmentId_idx" ON "Risk"("assessmentId");
CREATE INDEX "Risk_status_idx" ON "Risk"("status");
CREATE INDEX "Risk_riskScore_idx" ON "Risk"("riskScore");

-- ============================================
-- Incident Response
-- ============================================

CREATE TABLE "IncidentResponse" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "FindingSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'NEW',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "containedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "rootCause" TEXT,
    "remediation" TEXT,
    "lessonsLearned" TEXT,
    "reportUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IncidentResponse_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "IncidentResponse_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX "IncidentResponse_organizationId_idx" ON "IncidentResponse"("organizationId");
CREATE INDEX "IncidentResponse_severity_idx" ON "IncidentResponse"("severity");
CREATE INDEX "IncidentResponse_status_idx" ON "IncidentResponse"("status");

-- ============================================
-- Notifications & Activity
-- ============================================

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
);

CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
