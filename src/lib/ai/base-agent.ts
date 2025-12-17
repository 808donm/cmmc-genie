/**
 * AI Agent Base Class
 *
 * Provides common functionality for all AI agents in the system
 */

import { getAIProvider } from "./index";
import { Message, CompletionOptions, CompletionResponse } from "./provider";

// Define AgentType locally (matches Prisma schema enum)
export type AgentType =
  | "ORCHESTRATOR"
  | "POLICY_DRAFTING"
  | "C3PAO_EXPERT"
  | "CONFIGURATION"
  | "CUI_ANALYST"
  | "EVIDENCE_COLLECTION"
  | "GAP_ANALYSIS"
  | "TRAINING"
  | "VENDOR_ASSESSMENT"
  | "INCIDENT_RESPONSE"
  | "RISK_ASSESSMENT"
  | "AUDIT_PREP"
  | "COMPLIANCE_MONITORING"
  | "CHANGE_MANAGEMENT";

export interface AgentContext {
  organizationId?: string;
  projectId?: string;
  userId?: string;
  sessionId?: string;
}

export interface AgentRequest {
  prompt: string;
  context?: AgentContext;
  history?: Message[];
  options?: CompletionOptions;
}

export interface AgentResponse {
  content: string;
  confidence?: number;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

/**
 * Base class for all AI agents
 */
export abstract class BaseAgent {
  protected agentType: AgentType;
  protected systemPrompt: string;

  constructor(agentType: AgentType, systemPrompt: string) {
    this.agentType = agentType;
    this.systemPrompt = systemPrompt;
  }

  /**
   * Process a request and generate a response
   */
  async process(request: AgentRequest): Promise<AgentResponse> {
    const provider = getAIProvider();

    const messages: Message[] = [
      { role: "system", content: this.systemPrompt },
      ...(request.history || []),
      { role: "user", content: request.prompt },
    ];

    const response = await provider.completion(messages, request.options);

    return this.formatResponse(response);
  }

  /**
   * Stream a response in real-time
   */
  async *stream(request: AgentRequest): AsyncIterable<string> {
    const provider = getAIProvider();

    const messages: Message[] = [
      { role: "system", content: this.systemPrompt },
      ...(request.history || []),
      { role: "user", content: request.prompt },
    ];

    for await (const chunk of provider.streamCompletion(
      messages,
      request.options
    )) {
      if (chunk.content) {
        yield chunk.content;
      }
    }
  }

  /**
   * Format the provider response into an agent response
   */
  protected formatResponse(response: CompletionResponse): AgentResponse {
    return {
      content: response.content,
      metadata: {
        usage: response.usage,
      },
    };
  }

  /**
   * Get the agent type
   */
  getType(): AgentType {
    return this.agentType;
  }

  /**
   * Get the agent's system prompt
   */
  getSystemPrompt(): string {
    return this.systemPrompt;
  }
}
