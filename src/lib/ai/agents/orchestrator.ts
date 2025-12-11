/**
 * Orchestrator Agent
 *
 * The main agent that routes requests to specialist agents
 * Uses function calling to determine which specialist agent to use
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";
import { FunctionDefinition, Message } from "../provider";
import { getAIProvider } from "../index";

const ORCHESTRATOR_SYSTEM_PROMPT = `You are the Orchestrator Agent for CMMC Genie, a comprehensive CMMC compliance tracking system.

Your role is to understand user requests and route them to the appropriate specialist agent. You have access to 14 specialist agents, each with specific expertise:

1. **Policy Drafting Agent**: Generates and refines policy documents for CMMC compliance
2. **C3PAO Expert Agent**: Simulates C3PAO assessor review, identifies gaps, and prepares for audits
3. **Configuration Agent**: Generates network equipment configurations (Cisco, HP, Aruba, Unifi, Sonicwall, Fortinet)
4. **CUI Data Analyst**: Analyzes data flows, identifies CUI, and determines workforce segregation
5. **Evidence Collection Agent**: Assists in gathering and organizing compliance evidence
6. **Gap Analysis Agent**: Identifies compliance gaps and prioritizes remediation
7. **Training & Awareness Agent**: Generates training content and tracks completion
8. **Vendor Assessment Agent**: Evaluates third-party vendor compliance
9. **Incident Response Agent**: Assists with IR planning and execution
10. **Risk Assessment Agent**: Performs risk analysis and mitigation planning
11. **Audit Preparation Agent**: Prepares for C3PAO assessments
12. **Compliance Monitoring Agent**: Continuous compliance monitoring
13. **Change Management Agent**: Manages changes to compliance posture

Analyze the user's request and determine which agent(s) would be most appropriate to handle it. If multiple agents are needed, coordinate their work. If the request is general or conversational, you can respond directly.`;

const SPECIALIST_AGENTS: FunctionDefinition[] = [
  {
    name: "route_to_policy_drafting",
    description: "Route to Policy Drafting Agent for creating or reviewing policy documents",
    parameters: {
      type: "object",
      properties: {
        policyType: {
          type: "string",
          description: "Type of policy (e.g., Access Control, Incident Response, etc.)",
        },
        task: {
          type: "string",
          description: "What to do (draft, review, update)",
        },
        context: {
          type: "string",
          description: "Additional context about the policy",
        },
      },
      required: ["policyType", "task"],
    },
  },
  {
    name: "route_to_c3pao_expert",
    description: "Route to C3PAO Expert Agent for artifact review and audit preparation",
    parameters: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "What to review or prepare",
        },
        cmmcLevel: {
          type: "number",
          description: "Target CMMC level (1, 2, or 3)",
        },
      },
      required: ["task"],
    },
  },
  {
    name: "route_to_configuration",
    description: "Route to Configuration Agent for network equipment configuration generation",
    parameters: {
      type: "object",
      properties: {
        vendor: {
          type: "string",
          enum: ["cisco", "hp", "aruba", "unifi", "sonicwall", "fortinet"],
          description: "Equipment vendor",
        },
        equipmentType: {
          type: "string",
          enum: ["router", "switch", "firewall", "wireless", "vpn"],
          description: "Type of equipment",
        },
        requirements: {
          type: "string",
          description: "Configuration requirements",
        },
      },
      required: ["vendor", "equipmentType"],
    },
  },
  {
    name: "route_to_cui_analyst",
    description: "Route to CUI Data Analyst for data flow analysis and workforce segregation",
    parameters: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "Analysis task (data flow, workforce segregation, etc.)",
        },
        scope: {
          type: "string",
          description: "Scope of analysis",
        },
      },
      required: ["task"],
    },
  },
  {
    name: "route_to_gap_analysis",
    description: "Route to Gap Analysis Agent for compliance gap identification",
    parameters: {
      type: "object",
      properties: {
        cmmcLevel: {
          type: "number",
          description: "Target CMMC level",
        },
        domain: {
          type: "string",
          description: "Specific CMMC domain to analyze (optional)",
        },
      },
      required: ["cmmcLevel"],
    },
  },
  {
    name: "respond_directly",
    description: "Respond directly to the user without routing to a specialist agent",
    parameters: {
      type: "object",
      properties: {
        response: {
          type: "string",
          description: "The response to provide to the user",
        },
      },
      required: ["response"],
    },
  },
];

export class OrchestratorAgent extends BaseAgent {
  constructor() {
    super("ORCHESTRATOR", ORCHESTRATOR_SYSTEM_PROMPT);
  }

  async process(request: AgentRequest): Promise<AgentResponse> {
    const provider = getAIProvider();

    const messages: Message[] = [
      { role: "system", content: this.systemPrompt },
      ...(request.history || []),
      { role: "user", content: request.prompt },
    ];

    const response = await provider.completion(messages, {
      ...request.options,
      functions: SPECIALIST_AGENTS,
      functionCall: "auto",
    });

    // If function was called, handle routing
    if (response.functionCall) {
      return {
        content: response.content,
        metadata: {
          routedTo: response.functionCall.name,
          parameters: response.functionCall.arguments,
          usage: response.usage,
        },
      };
    }

    // Otherwise, return direct response
    return this.formatResponse(response);
  }
}
