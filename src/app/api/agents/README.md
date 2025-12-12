# Agents API

REST API endpoints for interacting with CMMC Genie AI agents.

## Endpoints

### List All Agents

```
GET /api/agents
```

Returns metadata for all available agents, including implementation status.

**Response:**
```json
{
  "agents": [
    {
      "type": "ORCHESTRATOR",
      "name": "Orchestrator Agent",
      "description": "Routes user requests to appropriate specialist agents",
      "capabilities": [...],
      "useCases": [...],
      "category": "core",
      "implemented": true
    },
    ...
  ],
  "providerConfigured": true
}
```

### Get Specific Agent Metadata

```
GET /api/agents/[type]
```

Returns metadata for a specific agent.

**Parameters:**
- `type` - Agent type (e.g., `orchestrator`, `policy-drafting`, `c3pao-expert`)

**Response:**
```json
{
  "type": "POLICY_DRAFTING",
  "name": "Policy Drafting Agent",
  "description": "Generates and refines security policy documents",
  "capabilities": [...],
  "useCases": [...],
  "category": "operational",
  "implemented": true,
  "providerConfigured": true
}
```

### Process Request with Orchestrator

```
POST /api/agents
```

Sends a request to the orchestrator agent, which routes it to appropriate specialist agents.

**Request Body:**
```json
{
  "prompt": "Help me create an access control policy for CMMC Level 2",
  "context": {
    "organizationId": "org_123",
    "projectId": "proj_456",
    "userId": "user_789"
  },
  "options": {
    "temperature": 0.7,
    "maxTokens": 4096
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "content": "I'll help you create an access control policy...",
    "metadata": {
      "routedTo": "route_to_policy_drafting",
      "parameters": {
        "policyType": "Access Control",
        "task": "draft"
      },
      "usage": {
        "promptTokens": 150,
        "completionTokens": 800,
        "totalTokens": 950
      }
    }
  }
}
```

### Process Request with Specific Agent

```
POST /api/agents/[type]
```

Sends a request directly to a specific agent, bypassing the orchestrator.

**Parameters:**
- `type` - Agent type (e.g., `policy-drafting`, `gap-analysis`)

**Request Body:**
```json
{
  "prompt": "Draft an access control policy for CMMC Level 2",
  "context": {
    "organizationId": "org_123"
  },
  "options": {
    "temperature": 0.7
  },
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "agentType": "POLICY_DRAFTING",
  "response": {
    "content": "Here is your access control policy...",
    "metadata": {
      "usage": {
        "promptTokens": 120,
        "completionTokens": 1200,
        "totalTokens": 1320
      }
    }
  }
}
```

### Stream Response from Agent

```
POST /api/agents/[type]/stream
```

Streams real-time response from a specific agent.

**Parameters:**
- `type` - Agent type

**Request Body:**
```json
{
  "prompt": "Create a comprehensive access control policy",
  "context": {
    "organizationId": "org_123"
  }
}
```

**Response:**
Streaming text response (Content-Type: text/plain)

## Available Agent Types

### Implemented Agents

- `orchestrator` - Orchestrator Agent (routing)
- `policy-drafting` - Policy Drafting Agent
- `c3pao-expert` - C3PAO Expert Agent
- `configuration` - Configuration Agent
- `cui-analyst` - CUI Data Analyst Agent
- `evidence-collection` - Evidence Collection Agent
- `gap-analysis` - Gap Analysis Agent
- `training` - Training & Awareness Agent

### Coming Soon

- `vendor-assessment` - Vendor Assessment Agent
- `incident-response` - Incident Response Agent
- `risk-assessment` - Risk Assessment Agent
- `audit-prep` - Audit Preparation Agent
- `compliance-monitoring` - Compliance Monitoring Agent
- `change-management` - Change Management Agent

## Error Responses

### 400 Bad Request
```json
{
  "error": "Prompt is required"
}
```

### 404 Not Found
```json
{
  "error": "Unknown agent type: invalid-agent"
}
```

### 501 Not Implemented
```json
{
  "error": "Agent vendor-assessment is not yet implemented",
  "status": "coming_soon"
}
```

### 503 Service Unavailable
```json
{
  "error": "AI provider not configured. Please set OPENAI_API_KEY in environment variables."
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request",
  "details": "Error details here"
}
```

## Usage Examples

### JavaScript/TypeScript

```typescript
// List all agents
const agents = await fetch("/api/agents").then((r) => r.json());

// Process with orchestrator
const response = await fetch("/api/agents", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Help me assess my CMMC gaps",
    context: { organizationId: "org_123" },
  }),
}).then((r) => r.json());

// Use specific agent
const policyResponse = await fetch("/api/agents/policy-drafting", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Create an incident response policy",
  }),
}).then((r) => r.json());

// Stream response
const streamResponse = await fetch("/api/agents/gap-analysis/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Analyze my compliance gaps",
  }),
});

const reader = streamResponse.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  console.log(chunk);
}
```

### cURL

```bash
# List agents
curl http://localhost:3000/api/agents

# Process with orchestrator
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Help me create a security policy",
    "context": {"organizationId": "org_123"}
  }'

# Use specific agent
curl -X POST http://localhost:3000/api/agents/policy-drafting \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Draft an access control policy for CMMC Level 2"
  }'
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing:
- Per-user rate limits
- Per-organization quotas
- Token usage limits
- Cost tracking

## Authentication

Currently, no authentication is required. In production, add:
- Session-based auth (NextAuth.js)
- API key authentication
- Organization-based access control
- Role-based permissions

## Best Practices

1. **Use the Orchestrator** for general queries - it will route to the best agent
2. **Use Specific Agents** when you know exactly what you need
3. **Include Context** - organizationId, projectId, etc. for better responses
4. **Stream Long Responses** - use the `/stream` endpoint for lengthy outputs
5. **Handle Errors** - always check for error responses
6. **Track Usage** - monitor token consumption in response metadata
