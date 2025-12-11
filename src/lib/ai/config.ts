/**
 * AI Provider Configuration
 *
 * This file contains the configuration for AI providers (OpenAI, Anthropic, etc.)
 * and provides a unified interface for switching between them.
 */

export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER || "openai") as "openai" | "anthropic",

  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    orgId: process.env.OPENAI_ORG_ID || "",
    model: process.env.OPENAI_MODEL || "gpt-4o",
    embeddingModel: "text-embedding-3-small",
    maxTokens: 4096,
    temperature: 0.7,
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
    maxTokens: 4096,
    temperature: 0.7,
  },
} as const;

export const AGENT_MODELS = {
  orchestrator: "gpt-4o",
  policyDrafting: "gpt-4o",
  c3pao: "gpt-4o",
  configuration: "gpt-4o",
  cuiAnalyst: "gpt-4o",
  evidenceCollection: "gpt-4o",
  gapAnalysis: "gpt-4o",
  training: "gpt-4o",
  vendorAssessment: "gpt-4o",
  incidentResponse: "gpt-4o",
  riskAssessment: "gpt-4o",
  auditPrep: "gpt-4o",
  complianceMonitoring: "gpt-4o",
  changeManagement: "gpt-4o",
} as const;

export type AgentType = keyof typeof AGENT_MODELS;
