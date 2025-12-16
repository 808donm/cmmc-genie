# MSP (Managed Service Provider) Setup Guide

This guide explains how to set up and use the MSP multi-tenant architecture in CMMC Genie.

## Overview

The MSP architecture allows a Managed Service Provider to manage CMMC compliance for multiple client organizations from a single account. MSP admins have access to all client organizations and can switch between them seamlessly.

## Architecture

### Organization Types

1. **MSP Organization**: The parent organization that manages multiple clients
   - Type: `MSP`
   - Has access to all child (client) organizations
   - MSP staff members can view and manage all clients

2. **Client Organization**: Individual customer organizations
   - Type: `CLIENT`
   - Linked to a parent MSP via `parentOrganizationId`
   - Regular users only see their own organization

### User Access Levels

- **MSP Admins** (role: ADMIN/OWNER in MSP org): Full access to all client organizations
- **MSP Members**: Access to MSP org only (configurable)
- **Client Users**: Access to their own organization only

## Database Setup

### Step 1: Run the Migration

Execute the migration SQL in your Neon database:

```bash
# The migration file is located at:
migrations/add-msp-support.sql
```

This adds:
- `OrganizationType` enum (MSP, CLIENT)
- `type` column to Organization table
- `parentOrganizationId` column for client-MSP relationship
- Indexes for performance

### Step 2: Create Your MSP Organization

Run this SQL in Neon (replace with your MSP details):

```sql
-- Create MSP organization
INSERT INTO "Organization" (
  id,
  name,
  slug,
  type,
  "subscriptionTier",
  "createdAt",
  "updatedAt"
)
VALUES (
  'clxxxxxxxxxxxxxxxxxxxxxxxx',  -- Generate a cuid
  'Your MSP Company Name',
  'your-msp-company',
  'MSP',
  'enterprise',
  NOW(),
  NOW()
);

-- Add yourself as an admin of the MSP
INSERT INTO "OrganizationMember" (
  id,
  "organizationId",
  "userId",
  role,
  "joinedAt"
)
VALUES (
  'clxxxxxxxxxxxxxxxxxxxxxxxx',  -- Generate a cuid
  'clxxxxxxxxxxxxxxxxxxxxxxxx',  -- MSP org ID from above
  'your-user-id-here',           -- Your user ID (find in User table)
  'ADMIN',
  NOW()
);
```

### Step 3: Link Existing Client Organizations

If you have existing client organizations, link them to your MSP:

```sql
UPDATE "Organization"
SET
  "type" = 'CLIENT',
  "parentOrganizationId" = 'your-msp-org-id-here'
WHERE id IN (
  'client-org-id-1',
  'client-org-id-2'
  -- Add more client org IDs
);
```

## Using MSP Features in Code

### Check if User is MSP Admin

```typescript
import { isMspAdmin } from "@/lib/msp/utils";

const isAdmin = await isMspAdmin(userId);
```

### Get Accessible Organizations

```typescript
import { getAccessibleOrganizations } from "@/lib/msp/utils";

// Returns MSP org + all clients for MSP admins
// Returns only user's org(s) for regular users
const orgs = await getAccessibleOrganizations(userId);
```

### Check Organization Access

```typescript
import { hasOrganizationAccess } from "@/lib/msp/utils";

const hasAccess = await hasOrganizationAccess(userId, organizationId);
```

### Get MSP Clients

```typescript
import { getMspClients } from "@/lib/msp/utils";

const clients = await getMspClients(mspOrganizationId);
```

## UI Components

### Organization Switcher

Add the organization switcher to your dashboard layout for MSP admins:

```typescript
import { OrganizationSwitcher } from "@/components/msp/organization-switcher";
import { getAccessibleOrganizations } from "@/lib/msp/utils";

// In your component
const organizations = await getAccessibleOrganizations(userId);

<OrganizationSwitcher
  organizations={organizations}
  currentOrganizationId={currentOrgId}
  onOrganizationChange={(orgId) => {
    // Handle organization switch
    // Store in cookies/session or update URL
  }}
/>
```

## Implementation Checklist

- [x] Database schema updated with MSP support
- [x] Migration SQL created
- [x] MSP utility functions created
- [x] Organization switcher component created
- [ ] Update dashboard layout to show organization switcher
- [ ] Add organization context/state management
- [ ] Update all queries to respect current organization
- [ ] Add MSP admin dashboard showing all clients
- [ ] Add client creation form for MSP admins

## Next Steps

1. **Run the migration** in your Neon database
2. **Create your MSP organization** using the SQL above
3. **Link existing clients** to your MSP
4. **Add MSP staff** as members of the MSP organization
5. **Integrate organization switcher** into the dashboard layout
6. **Update queries** to use the current organization context

## Security Considerations

- MSP admins have full access to client data - ensure proper authentication
- Consider audit logging for MSP actions on client organizations
- Implement organization-level permissions and access controls
- Client data is isolated - no cross-client access for non-MSP users

## Support

For questions or issues with MSP setup, please refer to the main documentation or create an issue in the repository.
