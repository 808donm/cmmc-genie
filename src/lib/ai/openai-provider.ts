/**
 * OpenAI Provider Implementation
 *
 * Implements the AIProvider interface using OpenAI's API
 */

import OpenAI from "openai";
import {
  AIProvider,
  Message,
  CompletionOptions,
  CompletionResponse,
  EmbeddingOptions,
  EmbeddingResponse,
  StreamChunk,
} from "./provider";
import { AI_CONFIG } from "./config";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: AI_CONFIG.openai.apiKey,
      organization: AI_CONFIG.openai.orgId || undefined,
    });
  }

  async completion(
    messages: Message[],
    options?: CompletionOptions
  ): Promise<CompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: options?.model || AI_CONFIG.openai.model,
      messages: messages.map((msg) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
        name: msg.name,
      })),
      temperature: options?.temperature ?? AI_CONFIG.openai.temperature,
      max_tokens: options?.maxTokens ?? AI_CONFIG.openai.maxTokens,
      functions: options?.functions,
      function_call: options?.functionCall,
    });

    const choice = response.choices[0];
    const message = choice.message;

    return {
      content: message.content || "",
      functionCall: message.function_call
        ? {
            name: message.function_call.name,
            arguments: JSON.parse(message.function_call.arguments),
          }
        : undefined,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  }

  async *streamCompletion(
    messages: Message[],
    options?: CompletionOptions
  ): AsyncIterable<StreamChunk> {
    const stream = await this.client.chat.completions.create({
      model: options?.model || AI_CONFIG.openai.model,
      messages: messages.map((msg) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
      })),
      temperature: options?.temperature ?? AI_CONFIG.openai.temperature,
      max_tokens: options?.maxTokens ?? AI_CONFIG.openai.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      const content = delta?.content || "";
      const done = chunk.choices[0]?.finish_reason === "stop";

      yield { content, done };
    }
  }

  async embedding(
    text: string,
    options?: EmbeddingOptions
  ): Promise<EmbeddingResponse> {
    const response = await this.client.embeddings.create({
      model: options?.model || AI_CONFIG.openai.embeddingModel,
      input: text,
    });

    return {
      embedding: response.data[0].embedding,
      usage: {
        totalTokens: response.usage.total_tokens,
      },
    };
  }

  getName(): string {
    return "OpenAI";
  }
}
