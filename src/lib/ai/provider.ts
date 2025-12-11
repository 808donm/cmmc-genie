/**
 * AI Provider Interface
 *
 * Defines a common interface for all AI providers (OpenAI, Anthropic, etc.)
 * This allows easy switching between providers without changing application code.
 */

export interface Message {
  role: "system" | "user" | "assistant" | "function";
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface CompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  functions?: FunctionDefinition[];
  functionCall?: "auto" | "none" | { name: string };
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface CompletionResponse {
  content: string;
  functionCall?: {
    name: string;
    arguments: Record<string, any>;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface EmbeddingOptions {
  model?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  usage?: {
    totalTokens: number;
  };
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

/**
 * Base interface that all AI providers must implement
 */
export interface AIProvider {
  /**
   * Generate a completion from messages
   */
  completion(
    messages: Message[],
    options?: CompletionOptions
  ): Promise<CompletionResponse>;

  /**
   * Generate a streaming completion
   */
  streamCompletion(
    messages: Message[],
    options?: CompletionOptions
  ): AsyncIterable<StreamChunk>;

  /**
   * Generate embeddings for text
   */
  embedding(text: string, options?: EmbeddingOptions): Promise<EmbeddingResponse>;

  /**
   * Get the provider name
   */
  getName(): string;
}
