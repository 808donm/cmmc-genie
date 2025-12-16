-- ============================================
-- MSP Project Management Schema Migration
-- Run this in your Neon SQL console
-- Uses Msp prefix to avoid conflicts with existing compliance models
-- ============================================

-- Create enums only if they don't exist
DO $$ BEGIN
    CREATE TYPE "MspProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'AT_RISK', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MspTaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'BLOCKED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MspPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MspRACIRole" AS ENUM ('RESPONSIBLE', 'ACCOUNTABLE', 'CONSULTED', 'INFORMED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MspDependencyType" AS ENUM ('FINISH_TO_START', 'START_TO_START', 'FINISH_TO_FINISH', 'START_TO_FINISH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create MspProject table
CREATE TABLE IF NOT EXISTS "MspProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "mspOrganizationId" TEXT NOT NULL,
    "status" "MspProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "priority" "MspPriority" NOT NULL DEFAULT 'MEDIUM',
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MspProject_pkey" PRIMARY KEY ("id")
);

-- Create MspTask table
CREATE TABLE IF NOT EXISTS "MspTask" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "MspTaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "MspPriority" NOT NULL DEFAULT 'MEDIUM',
    "column" TEXT NOT NULL DEFAULT 'todo',
    "position" INTEGER NOT NULL DEFAULT 0,
    "assigneeId" TEXT,
    "controlId" TEXT,
    "dueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "estimatedHours" INTEGER,
    "actualHours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MspTask_pkey" PRIMARY KEY ("id")
);

-- Create MspMilestone table
CREATE TABLE IF NOT EXISTS "MspMilestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MspMilestone_pkey" PRIMARY KEY ("id")
);

-- Create MspRACIEntry table
CREATE TABLE IF NOT EXISTS "MspRACIEntry" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "taskId" TEXT,
    "userId" TEXT NOT NULL,
    "role" "MspRACIRole" NOT NULL,
    "controlId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MspRACIEntry_pkey" PRIMARY KEY ("id")
);

-- Create MspTaskDependency table
CREATE TABLE IF NOT EXISTS "MspTaskDependency" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dependsOnTaskId" TEXT NOT NULL,
    "type" "MspDependencyType" NOT NULL DEFAULT 'FINISH_TO_START',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MspTaskDependency_pkey" PRIMARY KEY ("id")
);

-- Create indexes
DO $$ BEGIN CREATE INDEX "MspProject_clientId_idx" ON "MspProject"("clientId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspProject_mspOrganizationId_idx" ON "MspProject"("mspOrganizationId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspProject_status_idx" ON "MspProject"("status"); EXCEPTION WHEN duplicate_table THEN null; END $$;

DO $$ BEGIN CREATE INDEX "MspTask_projectId_idx" ON "MspTask"("projectId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspTask_assigneeId_idx" ON "MspTask"("assigneeId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspTask_controlId_idx" ON "MspTask"("controlId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspTask_status_idx" ON "MspTask"("status"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspTask_column_position_idx" ON "MspTask"("column", "position"); EXCEPTION WHEN duplicate_table THEN null; END $$;

DO $$ BEGIN CREATE INDEX "MspMilestone_projectId_idx" ON "MspMilestone"("projectId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspMilestone_dueDate_idx" ON "MspMilestone"("dueDate"); EXCEPTION WHEN duplicate_table THEN null; END $$;

DO $$ BEGIN CREATE INDEX "MspRACIEntry_projectId_idx" ON "MspRACIEntry"("projectId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspRACIEntry_taskId_idx" ON "MspRACIEntry"("taskId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspRACIEntry_userId_idx" ON "MspRACIEntry"("userId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspRACIEntry_controlId_idx" ON "MspRACIEntry"("controlId"); EXCEPTION WHEN duplicate_table THEN null; END $$;

DO $$ BEGIN CREATE INDEX "MspTaskDependency_taskId_idx" ON "MspTaskDependency"("taskId"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE INDEX "MspTaskDependency_dependsOnTaskId_idx" ON "MspTaskDependency"("dependsOnTaskId"); EXCEPTION WHEN duplicate_table THEN null; END $$;

-- Create unique constraints
DO $$ BEGIN CREATE UNIQUE INDEX "MspRACIEntry_projectId_taskId_userId_role_key" ON "MspRACIEntry"("projectId", "taskId", "userId", "role"); EXCEPTION WHEN duplicate_table THEN null; END $$;
DO $$ BEGIN CREATE UNIQUE INDEX "MspTaskDependency_taskId_dependsOnTaskId_key" ON "MspTaskDependency"("taskId", "dependsOnTaskId"); EXCEPTION WHEN duplicate_table THEN null; END $$;

-- Add foreign key constraints
DO $$ BEGIN ALTER TABLE "MspProject" ADD CONSTRAINT "MspProject_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "MspProject" ADD CONSTRAINT "MspProject_mspOrganizationId_fkey" FOREIGN KEY ("mspOrganizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN ALTER TABLE "MspTask" ADD CONSTRAINT "MspTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MspProject"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "MspTask" ADD CONSTRAINT "MspTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "MspTask" ADD CONSTRAINT "MspTask_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "CMMCControl"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN ALTER TABLE "MspMilestone" ADD CONSTRAINT "MspMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MspProject"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN ALTER TABLE "MspRACIEntry" ADD CONSTRAINT "MspRACIEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MspProject"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "MspRACIEntry" ADD CONSTRAINT "MspRACIEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "MspTask"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "MspRACIEntry" ADD CONSTRAINT "MspRACIEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "MspRACIEntry" ADD CONSTRAINT "MspRACIEntry_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "CMMCControl"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN ALTER TABLE "MspTaskDependency" ADD CONSTRAINT "MspTaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "MspTask"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "MspTaskDependency" ADD CONSTRAINT "MspTaskDependency_dependsOnTaskId_fkey" FOREIGN KEY ("dependsOnTaskId") REFERENCES "MspTask"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Success message
DO $$ BEGIN RAISE NOTICE '✅ MSP Project Management migration completed successfully!'; END $$;
