# CMMC Genie 🧞

> Your AI-powered companion for CMMC compliance journey

## Overview

CMMC Genie is a comprehensive compliance tracking application designed to help organizations navigate their CMMC (Cybersecurity Maturity Model Certification) journey. The application combines project management tools, AI-powered assistance, and integrated collaboration features to streamline the compliance process.

## Key Features

### 🎯 Project Management
- **Kanban Boards**: Visual task management with drag-and-drop
- **GANTT Charts**: Timeline visualization with dependencies
- **RACI Matrix**: Clear responsibility assignments
- **Roadmap Planning**: Phased compliance implementation

### 🤖 AI Agents
- **Orchestrator Agent**: Intelligent request routing
- **Policy Drafting Agent**: Automated policy generation
- **C3PAO Expert Agent**: Artifact review and audit preparation
- **Configuration Agent**: Network equipment configuration generation
- **CUI Data Analyst**: Data flow and workforce segregation analysis
- **+ 9 additional specialized agents** (see ARCHITECTURE.md)

### 📊 Dashboard & Analytics
- Real-time compliance posture overview
- Progress tracking and KPIs
- Risk visualization
- Upcoming tasks and deadlines
- Responsible party assignments

### 📅 Meeting Management
- Calendar integration (Teams, Zoom, Google)
- Automated meeting transcription
- AI-generated agendas
- Action item extraction
- Searchable transcript archive

### 🔐 Authentication & Security
- Single Sign-On (Microsoft, Google, Zoom)
- Multi-factor authentication
- Role-based access control
- Encrypted data storage

### 📁 Evidence Management
- Secure document vault
- Control mapping
- Version control
- Audit trail

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI API (GPT-4o, Assistants API)
- **Auth**: NextAuth.js
- **Integrations**: Microsoft Graph, Google Calendar, Zoom APIs

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cmmc-genie.git
cd cmmc-genie

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
cmmc-genie/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   ├── agents/          # AI agent implementations
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript type definitions
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── docs/                # Documentation
```

## Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [AI Agents Guide](./docs/agents.md) (coming soon)
- [API Documentation](./docs/api.md) (coming soon)
- [Deployment Guide](./docs/deployment.md) (coming soon)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ZOOM_CLIENT_ID="..."
ZOOM_CLIENT_SECRET="..."

# AI APIs
ANTHROPIC_API_KEY="..."
OPENAI_API_KEY="..."

# External Services
SENDGRID_API_KEY="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

## Development Roadmap

### Phase 1: Foundation ✅ (Current)
- [x] Project architecture
- [ ] Next.js setup
- [ ] Database schema
- [ ] Authentication
- [ ] Base UI components

### Phase 2: Core Features
- [ ] Dashboard
- [ ] Roadmap management
- [ ] Kanban board
- [ ] RACI matrix
- [ ] Task management

### Phase 3: Advanced Tools
- [ ] GANTT chart
- [ ] Calendar integration
- [ ] Meeting management
- [ ] Evidence vault

### Phase 4: AI Agents
- [ ] Agent framework
- [ ] Orchestrator
- [ ] Policy drafting
- [ ] C3PAO expert
- [ ] Configuration generator
- [ ] CUI analyst

### Phase 5: Polish
- [ ] Performance optimization
- [ ] Security hardening
- [ ] User testing
- [ ] Documentation

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@cmmcgenie.com
- 💬 Discord: [Join our community](https://discord.gg/cmmcgenie)
- 📚 Documentation: [docs.cmmcgenie.com](https://docs.cmmcgenie.com)

## Acknowledgments

- CMMC model by the Office of the Under Secretary of Defense for Acquisition & Sustainment
- Built with [Next.js](https://nextjs.org/), [Anthropic Claude](https://anthropic.com/), and many other amazing open-source projects

---

**Built with ❤️ for the defense industrial base community**
