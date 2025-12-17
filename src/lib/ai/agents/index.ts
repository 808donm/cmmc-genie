/**
 * Agent Registry and Factory
 *
 * Central access point for all AI agents in the system
 */

import { BaseAgent, AgentType } from "../base-agent";

// Import all agents
import { OrchestratorAgent } from "./orchestrator";
import { PolicyDraftingAgent } from "./policy-drafting";
import { C3PAOExpertAgent } from "./c3pao-expert";
import { ConfigurationAgent } from "./configuration";
import { CUIAnalystAgent } from "./cui-analyst";
import { EvidenceCollectionAgent } from "./evidence-collection";
import { GapAnalysisAgent } from "./gap-analysis";
import { TrainingAwarenessAgent } from "./training-awareness";
import { VendorAssessmentAgent } from "./vendor-assessment";
import { IncidentResponseAgent } from "./incident-response";
import { RiskAssessmentAgent } from "./risk-assessment";
import { AuditPrepAgent } from "./audit-prep";
import { ComplianceMonitoringAgent } from "./compliance-monitoring";
import { ChangeManagementAgent } from "./change-management";

/**
 * Agent metadata for documentation and UI
 */
export interface AgentMetadata {
  type: AgentType;
  name: string;
  description: string;
  capabilities: string[];
  useCases: string[];
  category: "core" | "analysis" | "technical" | "operational";
}

/**
 * Registry of all available agents with their metadata
 */
export const AGENT_REGISTRY: Record<AgentType, AgentMetadata> = {
  ORCHESTRATOR: {
    type: "ORCHESTRATOR",
    name: "Orchestrator Agent",
    description:
      "Routes user requests to appropriate specialist agents using intelligent function calling",
    capabilities: [
      "Intent recognition",
      "Multi-agent coordination",
      "Response synthesis",
      "Context management",
    ],
    useCases: [
      "General CMMC questions",
      "Complex multi-step requests",
      "Coordinating multiple specialist agents",
    ],
    category: "core",
  },

  POLICY_DRAFTING: {
    type: "POLICY_DRAFTING",
    name: "Policy Drafting Agent",
    description:
      "Generates and refines security policy documents aligned with CMMC requirements",
    capabilities: [
      "Draft policies from templates",
      "Review existing policies",
      "Map policies to CMMC controls",
      "Customize for organization context",
    ],
    useCases: [
      "Create new security policies",
      "Review policies for compliance",
      "Update policies for new CMMC levels",
      "Map policies to controls",
    ],
    category: "operational",
  },

  C3PAO_EXPERT: {
    type: "C3PAO_EXPERT",
    name: "C3PAO Expert Agent",
    description:
      "Simulates C3PAO assessor review to help prepare for official assessments",
    capabilities: [
      "Artifact review",
      "Gap identification",
      "Audit readiness assessment",
      "Mock interviews",
      "Evidence quality evaluation",
    ],
    useCases: [
      "Prepare for C3PAO assessment",
      "Review evidence quality",
      "Identify assessment gaps",
      "Practice assessor interviews",
    ],
    category: "analysis",
  },

  CONFIGURATION: {
    type: "CONFIGURATION",
    name: "Configuration Agent",
    description:
      "Generates CMMC-compliant network equipment configurations for various vendors",
    capabilities: [
      "Generate firewall configurations",
      "Create VLAN designs",
      "Configure wireless security",
      "Design VPNs",
      "Review existing configurations",
    ],
    useCases: [
      "Configure firewalls (Cisco, Fortinet, Sonicwall)",
      "Set up network segmentation",
      "Design secure wireless networks",
      "Review configurations for compliance",
    ],
    category: "technical",
  },

  CUI_ANALYST: {
    type: "CUI_ANALYST",
    name: "CUI Data Analyst Agent",
    description:
      "Analyzes CUI data flows, classification, and workforce access requirements",
    capabilities: [
      "Identify CUI in data/processes",
      "Map data flows",
      "Determine workforce access needs",
      "Define CMMC scope",
      "Analyze industry-specific CUI handling",
    ],
    useCases: [
      "Identify what data is CUI",
      "Map CUI through business processes",
      "Determine who needs CUI access",
      "Define assessment scope boundaries",
    ],
    category: "analysis",
  },

  EVIDENCE_COLLECTION: {
    type: "EVIDENCE_COLLECTION",
    name: "Evidence Collection Agent",
    description:
      "Assists in identifying, gathering, and organizing compliance evidence",
    capabilities: [
      "Generate evidence checklists",
      "Review evidence completeness",
      "Suggest evidence for controls",
      "Create collection automation",
      "Organize evidence packages",
    ],
    useCases: [
      "Create evidence collection checklists",
      "Review evidence quality",
      "Automate evidence gathering",
      "Prepare for assessment",
    ],
    category: "operational",
  },

  GAP_ANALYSIS: {
    type: "GAP_ANALYSIS",
    name: "Gap Analysis Agent",
    description:
      "Identifies compliance gaps and creates prioritized remediation roadmaps",
    capabilities: [
      "Assess current compliance posture",
      "Identify implementation gaps",
      "Prioritize remediation",
      "Create roadmaps",
      "Track gap closure",
    ],
    useCases: [
      "Assess compliance readiness",
      "Identify what's missing",
      "Create remediation roadmap",
      "Track progress to compliance",
    ],
    category: "analysis",
  },

  TRAINING: {
    type: "TRAINING",
    name: "Training & Awareness Agent",
    description:
      "Generates security awareness training content and tracks employee certification",
    capabilities: [
      "Create training modules",
      "Generate quizzes",
      "Design phishing simulations",
      "Create role-based plans",
      "Evaluate training effectiveness",
    ],
    useCases: [
      "Create security awareness training",
      "Develop CUI handling training",
      "Design phishing simulation campaigns",
      "Evaluate training effectiveness",
    ],
    category: "operational",
  },

  // Placeholder entries for agents to be implemented
  VENDOR_ASSESSMENT: {
    type: "VENDOR_ASSESSMENT",
    name: "Vendor Assessment Agent",
    description: "Evaluates third-party vendors for CMMC compliance",
    capabilities: [
      "Generate vendor questionnaires",
      "Assess vendor risk",
      "Review compliance documentation",
      "Recommend contract clauses",
    ],
    useCases: [
      "Assess vendor security posture",
      "Create vendor questionnaires",
      "Review vendor compliance",
    ],
    category: "analysis",
  },

  INCIDENT_RESPONSE: {
    type: "INCIDENT_RESPONSE",
    name: "Incident Response Agent",
    description: "Assists with incident response planning and execution",
    capabilities: [
      "Create IR plans",
      "Generate playbooks",
      "Document incidents",
      "Post-incident analysis",
    ],
    useCases: [
      "Create incident response plan",
      "Develop IR playbooks",
      "Document security incidents",
    ],
    category: "operational",
  },

  RISK_ASSESSMENT: {
    type: "RISK_ASSESSMENT",
    name: "Risk Assessment Agent",
    description: "Performs risk analysis and mitigation planning",
    capabilities: [
      "Identify assets and threats",
      "Calculate risk scores",
      "Recommend mitigations",
      "Manage risk register",
    ],
    useCases: [
      "Perform risk assessments",
      "Calculate risk scores",
      "Develop mitigation strategies",
    ],
    category: "analysis",
  },

  AUDIT_PREP: {
    type: "AUDIT_PREP",
    name: "Audit Preparation Agent",
    description: "Prepares organizations for C3PAO assessments",
    capabilities: [
      "Generate audit checklists",
      "Organize documentation",
      "Prepare interview guidance",
      "Create presentations",
    ],
    useCases: [
      "Prepare for audit",
      "Organize documentation packages",
      "Practice audit interviews",
    ],
    category: "operational",
  },

  COMPLIANCE_MONITORING: {
    type: "COMPLIANCE_MONITORING",
    name: "Compliance Monitoring Agent",
    description: "Provides continuous compliance monitoring",
    capabilities: [
      "Monitor configuration drift",
      "Check control effectiveness",
      "Identify violations",
      "Generate reports",
    ],
    useCases: [
      "Monitor ongoing compliance",
      "Detect configuration drift",
      "Generate compliance reports",
    ],
    category: "operational",
  },

  CHANGE_MANAGEMENT: {
    type: "CHANGE_MANAGEMENT",
    name: "Change Management Agent",
    description: "Manages changes while maintaining compliance",
    capabilities: [
      "Analyze change impact",
      "Generate change documentation",
      "Assess compliance implications",
      "Track implementation",
    ],
    useCases: [
      "Assess change impact on compliance",
      "Document changes",
      "Track change implementation",
    ],
    category: "operational",
  },
};

/**
 * Agent factory - creates and caches agent instances
 */
class AgentFactory {
  private agents: Map<AgentType, BaseAgent> = new Map();

  /**
   * Get an agent instance by type
   */
  getAgent(type: AgentType): BaseAgent {
    // Return cached instance if exists
    if (this.agents.has(type)) {
      return this.agents.get(type)!;
    }

    // Create new instance
    let agent: BaseAgent;

    switch (type) {
      case "ORCHESTRATOR":
        agent = new OrchestratorAgent();
        break;

      case "POLICY_DRAFTING":
        agent = new PolicyDraftingAgent();
        break;

      case "C3PAO_EXPERT":
        agent = new C3PAOExpertAgent();
        break;

      case "CONFIGURATION":
        agent = new ConfigurationAgent();
        break;

      case "CUI_ANALYST":
        agent = new CUIAnalystAgent();
        break;

      case "EVIDENCE_COLLECTION":
        agent = new EvidenceCollectionAgent();
        break;

      case "GAP_ANALYSIS":
        agent = new GapAnalysisAgent();
        break;

      case "TRAINING":
        agent = new TrainingAwarenessAgent();
        break;

      case "VENDOR_ASSESSMENT":
        agent = new VendorAssessmentAgent();
        break;

      case "INCIDENT_RESPONSE":
        agent = new IncidentResponseAgent();
        break;

      case "RISK_ASSESSMENT":
        agent = new RiskAssessmentAgent();
        break;

      case "AUDIT_PREP":
        agent = new AuditPrepAgent();
        break;

      case "COMPLIANCE_MONITORING":
        agent = new ComplianceMonitoringAgent();
        break;

      case "CHANGE_MANAGEMENT":
        agent = new ChangeManagementAgent();
        break;

      default:
        throw new Error(`Unknown agent type: ${type}`);
    }

    // Cache and return
    this.agents.set(type, agent);
    return agent;
  }

  /**
   * Get metadata for an agent
   */
  getMetadata(type: AgentType): AgentMetadata {
    return AGENT_REGISTRY[type];
  }

  /**
   * Get all implemented agents
   */
  getImplementedAgents(): AgentType[] {
    return [
      "ORCHESTRATOR",
      "POLICY_DRAFTING",
      "C3PAO_EXPERT",
      "CONFIGURATION",
      "CUI_ANALYST",
      "EVIDENCE_COLLECTION",
      "GAP_ANALYSIS",
      "TRAINING",
      "VENDOR_ASSESSMENT",
      "INCIDENT_RESPONSE",
      "RISK_ASSESSMENT",
      "AUDIT_PREP",
      "COMPLIANCE_MONITORING",
      "CHANGE_MANAGEMENT",
    ];
  }

  /**
   * Get all agents (including not yet implemented)
   */
  getAllAgents(): AgentType[] {
    return Object.keys(AGENT_REGISTRY) as AgentType[];
  }

  /**
   * Get agents by category
   */
  getAgentsByCategory(
    category: "core" | "analysis" | "technical" | "operational"
  ): AgentType[] {
    return Object.entries(AGENT_REGISTRY)
      .filter(([_, metadata]) => metadata.category === category)
      .map(([type]) => type as AgentType);
  }

  /**
   * Check if an agent is implemented
   */
  isImplemented(type: AgentType): boolean {
    return this.getImplementedAgents().includes(type);
  }

  /**
   * Clear agent cache (useful for testing)
   */
  clearCache(): void {
    this.agents.clear();
  }
}

// Export singleton instance
export const agentFactory = new AgentFactory();

/**
 * Convenience function to get an agent
 */
export function getAgent(type: AgentType): BaseAgent {
  return agentFactory.getAgent(type);
}

/**
 * Convenience function to get agent metadata
 */
export function getAgentMetadata(type: AgentType): AgentMetadata {
  return agentFactory.getMetadata(type);
}

/**
 * Get the orchestrator agent (most commonly used entry point)
 */
export function getOrchestrator(): OrchestratorAgent {
  return agentFactory.getAgent("ORCHESTRATOR") as OrchestratorAgent;
}

// Re-export types
export type { AgentType } from "../base-agent";

// Re-export agent classes for direct use
export { OrchestratorAgent } from "./orchestrator";
export { PolicyDraftingAgent } from "./policy-drafting";
export { C3PAOExpertAgent } from "./c3pao-expert";
export { ConfigurationAgent } from "./configuration";
export { CUIAnalystAgent } from "./cui-analyst";
export { EvidenceCollectionAgent } from "./evidence-collection";
export { GapAnalysisAgent } from "./gap-analysis";
export { TrainingAwarenessAgent } from "./training-awareness";
export { VendorAssessmentAgent } from "./vendor-assessment";
export { IncidentResponseAgent } from "./incident-response";
export { RiskAssessmentAgent } from "./risk-assessment";
export { AuditPrepAgent } from "./audit-prep";
export { ComplianceMonitoringAgent } from "./compliance-monitoring";
export { ChangeManagementAgent } from "./change-management";
