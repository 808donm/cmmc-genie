/**
 * Agent Streaming API Route
 *
 * POST /api/agents/[type]/stream - Stream response from a specific agent
 */

import { NextRequest, NextResponse } from "next/server";
import { getAgent, agentFactory, AGENT_REGISTRY } from "@/lib/ai/agents";
import { isAIProviderConfigured } from "@/lib/ai";
import { AgentType } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    type: string;
  };
}

/**
 * POST /api/agents/[type]/stream
 * Streams a response from a specific agent
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

    const agentType = params.type.toUpperCase().replace(/-/g, "_") as AgentType;

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

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream response from agent
          for await (const chunk of agent.stream({
            prompt,
            context,
            options,
            history,
          })) {
            controller.enqueue(encoder.encode(chunk));
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error setting up stream:", error);
    return NextResponse.json(
      {
        error: "Failed to set up stream",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
