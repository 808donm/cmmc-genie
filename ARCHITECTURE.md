# CMMC Genie - System Architecture

## Overview
CMMC Genie is a comprehensive compliance tracking application designed to help organizations navigate their CMMC (Cybersecurity Maturity Model Certification) journey with AI-powered assistance, project management tools, and integrated collaboration features.

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand / React Query
- **Charts/Visualization**:
  - Recharts (dashboard metrics)
  - react-beautiful-dnd (Kanban)
  - DHTMLX Gantt or Frappe Gantt (GANTT charts)
  - Custom RACI matrix component

### Backend
- **Runtime**: Node.js 20+
- **API**: Next.js API Routes / tRPC
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Real-time**: Socket.io or Pusher
- **File Storage**: AWS S3 or Cloudflare R2

### Authentication & Authorization
- **Auth Framework**: NextAuth.js v5
- **Providers**:
  - Microsoft Entra ID (Azure AD)
  - Google OAuth
  - Zoom OAuth
  - Email/Password (backup)
- **Session Management**: JWT + Database sessions
- **RBAC**: Role-Based Access Control (Admin, Manager, User, Auditor)

### AI & Agents
- **LLM Provider**: OpenAI API (primary), Anthropic Claude (optional fallback)
- **Agent Framework**: OpenAI Assistants API with custom orchestration
- **Vector Database**: Pinecone or pgvector for RAG
- **Document Processing**: LangChain document loaders
- **Provider Abstraction**: Custom provider layer for easy switching between OpenAI/Anthropic

### External Integrations
- **Calendar & Meetings**:
  - Microsoft Graph API (Teams, Outlook)
  - Google Calendar API
  - Zoom API
- **Transcription**:
  - Azure Speech Services
  - AssemblyAI
  - Zoom native transcripts
- **Email**: SendGrid or Resend
- **Notifications**: Push (OneSignal), Email, In-app

### DevOps & Infrastructure
- **Hosting**: Vercel (frontend), Railway/AWS (backend services)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Vercel Analytics
- **Logging**: Winston, Better-Stack

## Database Schema Overview

### Core Entities
- **Users**: Authentication, profiles, roles
- **Organizations**: Multi-tenant support
- **Projects**: CMMC compliance projects
- **Roadmaps**: Compliance roadmap templates and instances
- **Tasks**: Actionable items with assignments
- **Controls**: CMMC controls and practices
- **Evidence**: Documentation and artifacts
- **Meetings**: Calendar events, transcripts, agendas
- **Policies**: Generated policy documents
- **Configurations**: Network equipment configs
- **Audits**: C3PAO assessment tracking

### Relationships
- Organizations have many Users (team members)
- Projects belong to Organizations
- Roadmaps belong to Projects
- Tasks belong to Roadmaps
- Evidence links to Controls and Tasks
- RACI assignments link Users to Tasks

## AI Agent Architecture

### Agent Framework Design
```
┌─────────────────────────────────────┐
│      Orchestrator Agent             │
│  (OpenAI GPT-4o with function calls)│
│  Routes requests to specialists     │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌─────▼──────┐
│ Specialist │   │ Specialist │
│  Agents    │   │   Agents   │
│ (OpenAI    │   │ Assistants │
│ Assistants)│   │    API)    │
└────────────┘   └────────────┘
```

### OpenAI Implementation Strategy
- **Orchestrator**: GPT-4o with function calling to route to specialist agents
- **Specialist Agents**: OpenAI Assistants API with custom instructions and tools
- **Knowledge Base**: Vector store integration for RAG (Retrieval Augmented Generation)
- **Provider Abstraction**: Interface layer allowing easy switch to Anthropic or other providers
- **Streaming**: Support for real-time streaming responses
- **Function Calling**: Structured outputs and tool use for reliable agent interactions

### Proposed AI Agents

#### 1. **Orchestrator Agent** (Required)
- **Purpose**: Routes user requests to appropriate specialist agents
- **Capabilities**:
  - Intent recognition
  - Multi-agent coordination
  - Response synthesis
  - Context management
- **Knowledge Base**: Overview of all CMMC domains

#### 2. **Policy Drafting Agent** (Requested)
- **Purpose**: Generates and refines policy documents
- **Capabilities**:
  - Draft policies from templates
  - Customize for organization context
  - Version control and change tracking
  - Compliance mapping to CMMC controls
- **Knowledge Base**: NIST SP 800-171, CMMC model, policy templates

#### 3. **C3PAO Expert Agent** (Requested)
- **Purpose**: Simulates C3PAO assessor review
- **Capabilities**:
  - Artifact review and gap identification
  - Audit readiness assessment
  - Evidence sufficiency analysis
  - Recommendation generation
- **Knowledge Base**: C3PAO assessment guide, common findings, best practices

#### 4. **Configuration Agent** (Requested)
- **Purpose**: Generates network equipment configurations
- **Capabilities**:
  - Generate configs for: Cisco, HP, Aruba, Unifi, Sonicwall, Fortinet
  - VLAN design and segregation
  - Access control lists (ACLs)
  - Security hardening configs
  - Compliance-aligned settings
- **Knowledge Base**: Vendor documentation, CIS benchmarks, CMMC technical requirements

#### 5. **CUI Data Analyst Agent** (Requested)
- **Purpose**: Analyzes data flows and workforce segregation
- **Capabilities**:
  - Data flow mapping
  - CUI identification and classification
  - Role-based access requirements
  - Workforce segregation analysis
  - Network boundary definition
- **Knowledge Base**: NIST SP 800-171 CUI requirements, data classification standards

#### 6. **Evidence Collection Agent** (Recommended)
- **Purpose**: Assists in gathering and organizing compliance evidence
- **Capabilities**:
  - Evidence gap identification
  - Document collection workflows
  - Screenshot and artifact capture
  - Evidence linking to controls
  - Artifact quality assessment
- **Knowledge Base**: Required evidence types per CMMC level

#### 7. **Gap Analysis Agent** (Recommended)
- **Purpose**: Identifies compliance gaps and prioritizes remediation
- **Capabilities**:
  - Current state assessment
  - Control maturity scoring
  - Gap prioritization (risk-based)
  - Remediation roadmap generation
  - Progress tracking
- **Knowledge Base**: CMMC model, assessment procedures

#### 8. **Training & Awareness Agent** (Recommended)
- **Purpose**: Generates training content and tracks completion
- **Capabilities**:
  - Role-based training material generation
  - Quiz and assessment creation
  - Certification tracking
  - Awareness campaign planning
  - Training effectiveness analysis
- **Knowledge Base**: Security awareness content, CMMC training requirements

#### 9. **Vendor Assessment Agent** (Recommended)
- **Purpose**: Evaluates third-party vendor compliance
- **Capabilities**:
  - Vendor questionnaire generation
  - Risk scoring
  - Contract clause recommendations
  - Supply chain risk analysis
  - Vendor portfolio management
- **Knowledge Base**: DFARS clauses, vendor assessment frameworks

#### 10. **Incident Response Agent** (Recommended)
- **Purpose**: Assists with IR planning and execution
- **Capabilities**:
  - IR plan generation
  - Playbook creation
  - Incident documentation
  - Post-incident analysis
  - Tabletop exercise scenarios
- **Knowledge Base**: NIST IR framework, IR best practices

#### 11. **Risk Assessment Agent** (Recommended)
- **Purpose**: Performs risk analysis and mitigation planning
- **Capabilities**:
  - Asset identification
  - Threat modeling
  - Risk scoring (likelihood × impact)
  - Mitigation strategy recommendations
  - Risk register management
- **Knowledge Base**: NIST RMF, risk assessment methodologies

#### 12. **Audit Preparation Agent** (Recommended)
- **Purpose**: Prepares for C3PAO assessments
- **Capabilities**:
  - Audit checklist generation
  - Documentation package assembly
  - Mock interview preparation
  - Evidence presentation optimization
  - Finding remediation tracking
- **Knowledge Base**: C3PAO assessment process, common audit findings

#### 13. **Compliance Monitoring Agent** (Additional Suggestion)
- **Purpose**: Continuous compliance monitoring
- **Capabilities**:
  - Configuration drift detection
  - Control effectiveness monitoring
  - Automated evidence collection
  - Compliance dashboard updates
  - Alert generation for violations
- **Knowledge Base**: CMMC controls, monitoring best practices

#### 14. **Change Management Agent** (Additional Suggestion)
- **Purpose**: Manages changes to compliance posture
- **Capabilities**:
  - Change impact analysis
  - Approval workflow automation
  - Configuration baseline management
  - Rollback procedures
  - Change documentation
- **Knowledge Base**: ITIL change management, compliance change procedures

## Application Features

### 1. Dashboard
- Compliance posture overview
- Progress metrics and KPIs
- Upcoming tasks and deadlines
- Responsible party assignments
- Recent activity feed
- Meeting schedule integration
- Risk heatmap
- Control maturity visualization

### 2. Roadmap Management
- CMMC level selection (1-3)
- Phased implementation planning
- Milestone tracking
- Dependency management
- Critical path visualization
- Timeline adjustments
- Resource allocation

### 3. Kanban Board
- Swimlanes: Backlog, To Do, In Progress, Review, Done
- Task cards with: assignee, due date, priority, tags
- Drag-and-drop functionality
- Filtering and search
- Sprint planning view
- Burndown charts

### 4. GANTT Chart
- Project timeline visualization
- Task dependencies
- Resource allocation
- Critical path highlighting
- Baseline comparison
- Export to PDF/PNG

### 5. RACI Matrix
- Responsible, Accountable, Consulted, Informed assignments
- Per-task and per-control views
- Team member workload visualization
- Role-based filters
- Export capabilities

### 6. Meeting Management
- Calendar integration (Teams, Zoom, Google)
- Meeting scheduling with CMMC context
- Automated agenda generation
- Real-time transcription
- Searchable transcript archive
- Action item extraction
- Meeting analytics (attendance, duration)

### 7. Policy Management
- Template library
- AI-assisted drafting
- Version control
- Approval workflows
- Digital signatures
- Policy distribution tracking
- Attestation management

### 8. Evidence Vault
- Secure document storage
- Artifact tagging and categorization
- Control mapping
- Version history
- Access controls
- Search and retrieval
- Audit trail

### 9. Network Configuration Manager
- Equipment inventory
- Configuration templates
- Generated config download
- Change history
- Compliance validation
- Diagram generation

### 10. Reporting & Analytics
- Compliance status reports
- Progress dashboards
- Custom report builder
- Export to PDF/Excel
- Executive summaries
- Trend analysis

## Security Considerations

### Data Protection
- Encryption at rest (database, file storage)
- Encryption in transit (TLS 1.3)
- Secrets management (Vault or AWS Secrets Manager)
- Regular security audits

### Access Control
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Principle of least privilege
- Session management
- API rate limiting

### Compliance
- SOC 2 Type II preparation
- GDPR compliance (data privacy)
- CCPA compliance
- Audit logging
- Data retention policies

### AI Security
- Prompt injection prevention
- API key rotation
- Usage monitoring and limits
- Data sanitization
- Model output validation

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- [ ] Project setup and infrastructure
- [ ] Database schema design
- [ ] Authentication system
- [ ] Base UI components
- [ ] Dashboard skeleton

### Phase 2: Core Features (Weeks 5-10)
- [ ] Roadmap management
- [ ] Task management
- [ ] Kanban board
- [ ] RACI matrix
- [ ] Basic reporting

### Phase 3: Advanced PM Tools (Weeks 11-14)
- [ ] GANTT chart
- [ ] Calendar integration
- [ ] Meeting management
- [ ] Evidence vault

### Phase 4: AI Agents (Weeks 15-20)
- [ ] Agent framework
- [ ] Orchestrator agent
- [ ] Policy drafting agent
- [ ] C3PAO agent
- [ ] Configuration agent
- [ ] CUI analyst agent

### Phase 5: Additional Agents (Weeks 21-24)
- [ ] Evidence collection agent
- [ ] Gap analysis agent
- [ ] Training agent
- [ ] Vendor assessment agent

### Phase 6: Polish & Launch (Weeks 25-28)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] User testing
- [ ] Documentation
- [ ] Deployment

## Development Priorities

### Must Have (MVP)
1. Authentication
2. Dashboard
3. Roadmap management
4. Kanban board
5. Orchestrator + Policy agent
6. Basic calendar integration

### Should Have
1. RACI matrix
2. GANTT chart
3. C3PAO agent
4. Configuration agent
5. Evidence vault
6. Meeting transcripts

### Nice to Have
1. All additional agents
2. Advanced analytics
3. Mobile app
4. API for integrations
5. Marketplace for templates

## Scalability Considerations

- Multi-tenant architecture (organization-level isolation)
- Database connection pooling
- Caching strategy (Redis)
- CDN for static assets
- Horizontal scaling for API servers
- Queue system for background jobs (BullMQ)
- Load balancing

## Cost Estimates (Monthly, Production)

- **Hosting**: $100-500 (Vercel Pro + database)
- **Database**: $50-200 (managed PostgreSQL)
- **AI APIs (OpenAI)**: $500-5000 (usage-dependent)
  - GPT-4o: ~$2.50/1M input tokens, ~$10/1M output tokens
  - GPT-4 Turbo: ~$10/1M input tokens, ~$30/1M output tokens
  - GPT-3.5 Turbo: ~$0.50/1M input tokens, ~$1.50/1M output tokens
  - Embeddings (text-embedding-3-small): ~$0.02/1M tokens
  - Assistants API: Same as base model + $0.20/GB/day storage
  - Estimated: 10M tokens/month ≈ $125-400/month
- **External APIs**: $100-300 (calendar, transcription)
- **Storage**: $50-200 (S3/R2)
- **Monitoring**: $50-100 (Sentry, logging)

**Total**: ~$850-$6300/month depending on usage
**Typical Medium Organization**: ~$1500-2500/month

## Next Steps

1. Initialize Next.js project with TypeScript
2. Set up Prisma with PostgreSQL
3. Implement authentication with NextAuth.js
4. Create base UI components with shadcn/ui
5. Design and implement database schema
6. Build dashboard foundation
7. Implement first AI agent (Orchestrator)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-11
**Author**: CMMC Genie Development Team
