/**
 * AI Provider Factory
 *
 * Central access point for AI provider instances
 * Automatically selects the correct provider based on configuration
 */

import { AIProvider } from "./provider";
import { OpenAIProvider } from "./openai-provider";
import { AI_CONFIG } from "./config";

let providerInstance: AIProvider | null = null;

/**
 * Get the current AI provider instance
 * Uses singleton pattern to reuse the same instance
 */
export function getAIProvider(): AIProvider {
  if (!providerInstance) {
    switch (AI_CONFIG.provider) {
      case "openai":
        providerInstance = new OpenAIProvider();
        break;
      case "anthropic":
        // Future: Implement AnthropicProvider
        throw new Error(
          "Anthropic provider not yet implemented. Please use OpenAI provider."
        );
      default:
        throw new Error(`Unknown AI provider: ${AI_CONFIG.provider}`);
    }
  }

  return providerInstance;
}

/**
 * Reset the provider instance (useful for testing)
 */
export function resetAIProvider(): void {
  providerInstance = null;
}

/**
 * Check if the AI provider is properly configured
 */
export function isAIProviderConfigured(): boolean {
  switch (AI_CONFIG.provider) {
    case "openai":
      return !!AI_CONFIG.openai.apiKey;
    case "anthropic":
      return !!AI_CONFIG.anthropic.apiKey;
    default:
      return false;
  }
}

// Re-export types and utilities
export * from "./provider";
export * from "./config";
export { OpenAIProvider } from "./openai-provider";
