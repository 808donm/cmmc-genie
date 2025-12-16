-- Migration: Add MSP/Client organization support
-- Run this in your Neon database SQL editor

-- Create OrganizationType enum
CREATE TYPE "OrganizationType" AS ENUM ('MSP', 'CLIENT');

-- Add new columns to Organization table
ALTER TABLE "Organization"
  ADD COLUMN "type" "OrganizationType" NOT NULL DEFAULT 'CLIENT',
  ADD COLUMN "parentOrganizationId" TEXT;

-- Add foreign key constraint for parent organization
ALTER TABLE "Organization"
  ADD CONSTRAINT "Organization_parentOrganizationId_fkey"
  FOREIGN KEY ("parentOrganizationId")
  REFERENCES "Organization"("id")
  ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX "Organization_parentOrganizationId_idx" ON "Organization"("parentOrganizationId");

-- Optional: Create your MSP organization (update with your actual MSP name)
-- INSERT INTO "Organization" (id, name, slug, type, "createdAt", "updatedAt")
-- VALUES (
--   'msp_' || gen_random_uuid()::text,
--   'Your MSP Name',
--   'your-msp-slug',
--   'MSP',
--   NOW(),
--   NOW()
-- );
