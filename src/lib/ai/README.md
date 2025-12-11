# AI Provider Abstraction Layer

This directory contains the AI provider abstraction layer for CMMC Genie, designed to work with multiple LLM providers (currently OpenAI, with Anthropic support planned).

## Architecture

### Provider Interface

The `AIProvider` interface defines a common contract that all providers must implement:

```typescript
interface AIProvider {
  completion(messages: Message[], options?: CompletionOptions): Promise<CompletionResponse>;
  streamCompletion(messages: Message[], options?: CompletionOptions): AsyncIterable<StreamChunk>;
  embedding(text: string, options?: EmbeddingOptions): Promise<EmbeddingResponse>;
  getName(): string;
}
```

### Current Providers

- **OpenAI Provider** (`openai-provider.ts`): Fully implemented using OpenAI's API
- **Anthropic Provider**: Planned for future implementation

### Base Agent Class

All AI agents extend the `BaseAgent` class, which provides:
- Common processing logic
- Streaming support
- Context management
- Response formatting

## Usage

### Getting the AI Provider

```typescript
import { getAIProvider } from "@/lib/ai";

const provider = getAIProvider();
const response = await provider.completion([
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: "Hello!" }
]);
```

### Creating a Custom Agent

```typescript
import { BaseAgent, AgentRequest, AgentResponse } from "@/lib/ai/base-agent";

export class MyCustomAgent extends BaseAgent {
  constructor() {
    super("MY_AGENT_TYPE", "Your system prompt here");
  }

  // Optionally override process() for custom logic
}
```

### Using an Agent

```typescript
import { OrchestratorAgent } from "@/lib/ai/agents/orchestrator";

const agent = new OrchestratorAgent();
const response = await agent.process({
  prompt: "Help me create an access control policy",
  context: {
    organizationId: "org_123",
    projectId: "proj_456",
  },
});

console.log(response.content);
```

### Streaming Responses

```typescript
const agent = new OrchestratorAgent();

for await (const chunk of agent.stream({ prompt: "Your question" })) {
  process.stdout.write(chunk);
}
```

## Configuration

Set up your environment variables:

```env
# Primary provider
AI_PROVIDER="openai"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"

# Anthropic (optional, for future use)
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"
```

## Available Agents

### 1. Orchestrator Agent
Routes requests to specialist agents using function calling.

```typescript
import { OrchestratorAgent } from "@/lib/ai/agents/orchestrator";
```

### 2-14. Specialist Agents
(To be implemented)

- Policy Drafting Agent
- C3PAO Expert Agent
- Configuration Agent
- CUI Data Analyst Agent
- Evidence Collection Agent
- Gap Analysis Agent
- Training & Awareness Agent
- Vendor Assessment Agent
- Incident Response Agent
- Risk Assessment Agent
- Audit Preparation Agent
- Compliance Monitoring Agent
- Change Management Agent

## Switching Providers

To switch from OpenAI to another provider:

1. Set `AI_PROVIDER=anthropic` in your environment
2. Provide the necessary API keys
3. The system will automatically use the new provider

The abstraction layer ensures your application code remains unchanged.

## Future Enhancements

- [ ] Implement Anthropic provider
- [ ] Add provider-specific optimizations
- [ ] Implement token counting and cost tracking
- [ ] Add request/response caching
- [ ] Implement retry logic with exponential backoff
- [ ] Add support for multimodal inputs (images, documents)
- [ ] Implement agent-to-agent communication
- [ ] Add telemetry and monitoring

## Testing

```typescript
import { resetAIProvider, isAIProviderConfigured } from "@/lib/ai";

// Check if provider is configured
if (!isAIProviderConfigured()) {
  throw new Error("AI provider not configured");
}

// Reset for testing
resetAIProvider();
```

## Error Handling

The provider automatically handles common errors:
- API rate limits
- Network timeouts
- Invalid API keys
- Token limit exceeded

Errors are thrown as standard JavaScript errors with descriptive messages.
