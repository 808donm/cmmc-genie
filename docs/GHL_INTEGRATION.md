# GoHighLevel Integration Implementation Plan

## Overview
Complete integration with GoHighLevel (GHL) to handle all email/SMS communications while maintaining CMMC Genie as the primary user interface. Users can view all communications in CMMC Genie and click through to GHL for detailed views.

## Architecture

### Data Flow
```
CMMC Genie ←→ GHL API ←→ GoHighLevel Platform
     ↑
     └─ GHL Webhooks (Real-time events)
```

### Key Components
1. **GHL API Client** - Send emails, create contacts, manage conversations
2. **Webhook Handler** - Receive real-time events (sent, opened, clicked, bounced)
3. **Communication Dashboard** - View all communications in CMMC Genie
4. **Deep Linking** - Click through to GHL for full conversation views
5. **Contact Sync** - Bidirectional sync between CMMC Genie users and GHL contacts

---

## Database Schema

### Models Created
- **GHLContact** - Synced contacts from GHL
- **GHLCommunication** - Individual emails/SMS with tracking
- **GHLConversation** - Threaded conversations
- **GHLWebhookEvent** - Raw webhook events for processing

### Key Fields
- `ghlMessageId` - GHL's message identifier
- `ghlUrl` - Deep link to view in GHL
- `status` - Tracking states (SENT, DELIVERED, OPENED, CLICKED, BOUNCED)
- Timestamps for each event (sentAt, deliveredAt, openedAt, clickedAt)

---

## Implementation Phases

### Phase 1: Core GHL API Client (Foundation)
**Files to Create:**
- `/src/lib/ghl/client.ts` - GHL API wrapper
- `/src/lib/ghl/types.ts` - TypeScript types for GHL API
- `/src/lib/ghl/utils.ts` - Helper functions

**Features:**
- Send email via GHL
- Create/update contacts
- Get conversation history
- Error handling & rate limiting

**API Endpoints Used:**
- `POST /conversations/messages` - Send email
- `POST /contacts` - Create contact
- `GET /contacts/{id}` - Get contact details
- `GET /conversations/{id}` - Get conversation

### Phase 2: Webhook Handler (Real-time Tracking)
**Files to Create:**
- `/src/app/api/webhooks/ghl/route.ts` - Webhook endpoint
- `/src/lib/ghl/webhook-handler.ts` - Process webhook events
- `/src/lib/ghl/webhook-validator.ts` - Validate webhook signatures

**Webhook Events to Handle:**
- `MessageSent` - Email sent successfully
- `MessageDelivered` - Email delivered to inbox
- `MessageOpened` - Recipient opened email
- `MessageClicked` - Recipient clicked link
- `MessageBounced` - Email bounced
- `MessageFailed` - Send failed

**Processing Flow:**
1. Receive webhook → Validate signature
2. Store raw event in `GHLWebhookEvent`
3. Update `GHLCommunication` status
4. Create notification for user
5. Mark event as processed

### Phase 3: Communication Dashboard
**Files to Create:**
- `/src/app/(dashboard)/communications/page.tsx` - Main dashboard
- `/src/app/(dashboard)/communications/[id]/page.tsx` - Communication detail
- `/src/components/communications/communication-list.tsx` - List component
- `/src/components/communications/communication-filters.tsx` - Filters
- `/src/components/communications/communication-stats.tsx` - Stats cards

**Dashboard Features:**
- **Timeline View**: All communications in chronological order
- **Filters**: By type (email/SMS), status, date range, recipient
- **Stats Cards**:
  - Total Sent
  - Delivery Rate
  - Open Rate
  - Click Rate
- **Status Indicators**: Visual badges for each status
- **Deep Links**: "View in GHL" button on each communication
- **Search**: By recipient, subject, content

**UI Components:**
```typescript
// Communication card
- Avatar/Icon
- Subject line
- Preview text
- Timestamp
- Status badge with icon
- Engagement metrics (opens, clicks)
- "View in GHL" button → opens ghlUrl
```

### Phase 4: MSP Communication Dashboard
**Files to Create:**
- `/src/app/msp/communications/page.tsx` - MSP comm dashboard
- `/src/app/msp/communications/client/[id]/page.tsx` - Per-client view
- `/src/components/msp/communication-analytics.tsx` - Analytics

**MSP-Specific Features:**
- **Cross-Client View**: See all communications across all clients
- **Client Filter**: Filter by specific client organization
- **Bulk Actions**: Send to multiple clients
- **Performance Metrics**:
  - Engagement by client
  - Response times
  - Communication volume
- **Template Management**: Reusable email templates

### Phase 5: Send Email Integration
**Files to Update:**
- `/src/app/api/invitations/route.ts` - Add GHL email sending
- `/src/app/api/communications/send/route.ts` - New API endpoint
- `/src/components/communications/compose-email.tsx` - Email composer

**Integration Points:**
1. **User Invitations** - Replace TODO with GHL send
2. **Task Assignments** - Email notification via GHL
3. **Deadline Reminders** - Automated emails
4. **Compliance Reports** - Send reports via email
5. **Custom Messages** - Ad-hoc communications

**Send Email Flow:**
```typescript
1. User composes email in CMMC Genie
2. API creates GHLContact (if doesn't exist)
3. API sends via GHL API
4. Store GHLCommunication record
5. GHL sends email
6. Webhooks update status in real-time
7. User sees status in CMMC Genie dashboard
```

### Phase 6: Contact Sync System
**Files to Create:**
- `/src/lib/ghl/sync.ts` - Sync logic
- `/src/app/api/ghl/sync/route.ts` - Manual sync trigger
- `/src/lib/cron/ghl-sync.ts` - Scheduled sync job

**Sync Features:**
- **Bidirectional Sync**: CMMC Genie ←→ GHL
- **Conflict Resolution**: Last-write-wins or manual merge
- **Scheduled Sync**: Run every hour
- **Manual Sync**: Trigger from UI
- **Sync Status**: Show last sync time

**What Gets Synced:**
- User email & phone
- Name fields
- Organization tags
- Custom fields (role, department)

### Phase 7: Embedded GHL Views (Advanced)
**Files to Create:**
- `/src/components/communications/ghl-embed.tsx` - iframe embed
- `/src/app/api/ghl/embed-token/route.ts` - Generate embed tokens

**Embedded Features:**
- **Conversation View**: Embed full GHL conversation in iframe
- **Contact Timeline**: View all contact activity
- **Quick Reply**: Reply directly from CMMC Genie
- **SSO Integration**: Seamless login to embedded GHL

---

## API Endpoints to Build

### Public API (User-Facing)
```typescript
POST   /api/communications/send          // Send email via GHL
GET    /api/communications                // List communications
GET    /api/communications/[id]           // Get communication details
GET    /api/communications/stats          // Get stats
POST   /api/ghl/contacts/sync             // Manual contact sync
GET    /api/ghl/contacts/[id]             // Get GHL contact
```

### Webhook API (GHL→CMMC Genie)
```typescript
POST   /api/webhooks/ghl                  // Receive GHL webhooks
```

### Internal API
```typescript
GET    /api/ghl/embed-token               // Generate embed token
POST   /api/ghl/sync                      // Trigger sync job
```

---

## Environment Variables

```bash
# GoHighLevel Configuration
GHL_API_KEY="your-api-key"
GHL_LOCATION_ID="your-location-id"
GHL_API_VERSION="2021-07-28"
GHL_BASE_URL="https://rest.gohighlevel.com"
GHL_WEBHOOK_SECRET="your-webhook-secret"
```

---

## GHL Setup Requirements

### In GoHighLevel Account:
1. **API Access**: Generate API key in Settings → Integrations
2. **Location ID**: Copy from Settings → Business Profile
3. **Webhook Configuration**:
   - URL: `https://your-domain.com/api/webhooks/ghl`
   - Events to subscribe:
     - Message Sent
     - Message Delivered
     - Message Opened
     - Message Clicked
     - Message Bounced
     - Message Failed
   - Generate webhook secret
4. **Custom Fields** (Optional):
   - `cmmc_user_id` - Link to CMMC Genie user
   - `cmmc_org_id` - Link to organization
   - `compliance_status` - Current compliance %

---

## Security Considerations

1. **Webhook Validation**: Verify all webhooks using signature
2. **API Key Storage**: Store in environment variables, never in code
3. **Rate Limiting**: Respect GHL rate limits (100 req/min)
4. **Data Privacy**: Only sync necessary fields
5. **Access Control**: Users can only see their org's communications
6. **Audit Logging**: Log all GHL API calls

---

## Testing Strategy

### Unit Tests
- GHL client API calls
- Webhook signature validation
- Contact sync logic

### Integration Tests
- End-to-end email send flow
- Webhook event processing
- Contact sync with GHL sandbox

### Manual Testing Checklist
- [ ] Send email via GHL API
- [ ] Receive webhook events
- [ ] View communication in dashboard
- [ ] Click "View in GHL" deep link
- [ ] Sync contact from CMMC Genie → GHL
- [ ] Update contact in GHL → syncs to CMMC Genie
- [ ] Send invitation email via GHL
- [ ] Track email opens/clicks in dashboard

---

## Migration Plan

### Step 1: Add GHL to Existing Invitation Flow
- Update `/src/app/api/invitations/route.ts`
- Replace TODO with GHL send function
- Test with real GHL account

### Step 2: Build Communication Dashboard
- Create basic dashboard
- Show sent emails from database
- Add deep links to GHL

### Step 3: Enable Webhooks
- Deploy webhook endpoint
- Configure in GHL
- Test event processing

### Step 4: Rollout to MSP Portal
- Add MSP communication dashboard
- Enable for all MSP users
- Monitor usage and engagement

---

## Success Metrics

- **Email Delivery Rate**: >95%
- **Open Rate**: Track industry benchmarks
- **Click Rate**: Track engagement
- **Sync Success Rate**: >99%
- **Webhook Processing Time**: <2 seconds
- **User Adoption**: % of users using communication dashboard

---

## Future Enhancements

1. **SMS Support**: Send SMS via GHL
2. **Two-Way SMS**: Reply to SMS in CMMC Genie
3. **Email Templates**: Visual email builder
4. **A/B Testing**: Test email subject lines
5. **Scheduled Sends**: Schedule emails for future
6. **Drip Campaigns**: Automated email sequences
7. **Analytics Dashboard**: Advanced engagement analytics
8. **WhatsApp Integration**: Send via WhatsApp Business
9. **Call Logging**: Track phone calls via GHL
10. **Reputation Monitoring**: Track sender reputation

---

## Implementation Timeline

**Week 1: Foundation**
- Set up GHL client
- Database migrations
- Basic API endpoints

**Week 2: Core Features**
- Send email integration
- Webhook handler
- Communication dashboard

**Week 3: MSP Features**
- MSP communication dashboard
- Cross-client views
- Analytics

**Week 4: Polish & Testing**
- Contact sync
- Deep linking
- Testing & bug fixes

**Total: 4 weeks for MVP**

---

## Next Steps

1. ✅ Database schema created
2. ✅ Environment variables configured
3. ⏳ Run database migration
4. ⏳ Create GHL API client
5. ⏳ Build webhook handler
6. ⏳ Implement communication dashboard
7. ⏳ Integrate with invitation flow
8. ⏳ Deploy and test

---

## Support & Resources

- **GHL API Docs**: https://highlevel.stoplight.io/
- **GHL Community**: https://community.gohighlevel.com/
- **Webhook Testing**: Use ngrok for local testing
- **GHL Support**: support@gohighlevel.com
