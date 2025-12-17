/**
 * Specific Agent API Route
 *
 * POST /api/agents/[type] - Send request to a specific agent
 * GET  /api/agents/[type] - Get metadata for a specific agent
 */

import { NextRequest, NextResponse } from "next/server";
import { getAgent, getAgentMetadata, agentFactory } from "@/lib/ai/agents";
import { isAIProviderConfigured } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    type: string;
  };
}

/**
 * GET /api/agents/[type]
 * Returns metadata for a specific agent
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const agentType = params.type.toUpperCase() as any;

    // Validate agent type
    if (!AGENT_REGISTRY[agentType]) {
      return NextResponse.json(
        { error: `Unknown agent type: ${params.type}` },
        { status: 404 }
      );
    }

    const metadata = getAgentMetadata(agentType);
    const implemented = agentFactory.isImplemented(agentType);

    return NextResponse.json({
      ...metadata,
      implemented,
      providerConfigured: isAIProviderConfigured(),
    });
  } catch (error) {
    console.error("Error fetching agent metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent metadata" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents/[type]
 * Processes a request with a specific agent
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const agentType = params.type.toUpperCase().replace(/-/g, "_") as any;

    // Validate agent type
    if (!AGENT_REGISTRY[agentType]) {
      return NextResponse.json(
        { error: `Unknown agent type: ${params.type}` },
        { status: 404 }
      );
    }

    // Check if agent is implemented
    if (!agentFactory.isImplemented(agentType)) {
      return NextResponse.json(
        {
          error: `Agent ${params.type} is not yet implemented`,
          status: "coming_soon",
        },
        { status: 501 }
      );
    }

    const body = await request.json();
    const { prompt, context, options, history } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Get the specific agent
    const agent = getAgent(agentType);

    // Process request
    const response = await agent.process({
      prompt,
      context,
      options,
      history,
    });

    return NextResponse.json({
      success: true,
      agentType,
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

// Import the type export to fix the build
import { AGENT_REGISTRY } from "@/lib/ai/agents";
