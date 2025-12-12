/**
 * Agents API Route
 *
 * GET  /api/agents - List all available agents
 * POST /api/agents - Process request with orchestrator
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrchestrator, AGENT_REGISTRY, agentFactory } from "@/lib/ai/agents";
import { isAIProviderConfigured } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/agents
 * Returns list of all available agents with metadata
 */
export async function GET() {
  try {
    const agents = Object.values(AGENT_REGISTRY).map((metadata) => ({
      ...metadata,
      implemented: agentFactory.isImplemented(metadata.type),
    }));

    return NextResponse.json({
      agents,
      providerConfigured: isAIProviderConfigured(),
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents
 * Processes a request through the orchestrator agent
 */
export async function POST(request: NextRequest) {
  try {
    // Check if AI provider is configured
    if (!isAIProviderConfigured()) {
      return NextResponse.json(
        {
          error:
            "AI provider not configured. Please set OPENAI_API_KEY in environment variables.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { prompt, context, options } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Get orchestrator agent
    const orchestrator = getOrchestrator();

    // Process request
    const response = await orchestrator.process({
      prompt,
      context,
      options,
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Error processing agent request:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
