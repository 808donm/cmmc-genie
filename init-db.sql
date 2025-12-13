-- CMMC Genie Database Initialization
-- Run this in Supabase SQL Editor

-- Note: This is a simplified version. Run "npx prisma db push" locally for full schema.
-- For now, we'll create just the essential tables for authentication.

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Accounts table
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");

-- Sessions table
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");

-- Verification tokens
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Organizations table
CREATE TABLE IF NOT EXISTS "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "industry" TEXT,
    "size" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "subscriptionEndsAt" TIMESTAMP(3),
    "complianceTargetDate" TIMESTAMP(3),
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Organization_slug_key" ON "Organization"("slug");

-- Organization members
CREATE TABLE IF NOT EXISTS "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "title" TEXT,
    "department" TEXT,
    "needsCUI" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");
CREATE INDEX IF NOT EXISTS "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");
CREATE INDEX IF NOT EXISTS "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

COMMENT ON DATABASE postgres IS 'CMMC Genie - Initialized';
