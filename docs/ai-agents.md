# AI Agents Guide

## Overview

CMMC Genie uses a sophisticated multi-agent AI system powered by OpenAI to assist with CMMC compliance. The system consists of an Orchestrator agent that routes requests to 14 specialized agents, each with expertise in specific compliance domains.

## Agent Architecture

```
User Request
     ↓
Orchestrator Agent (GPT-4o with function calling)
     ↓
Specialist Agents (OpenAI Assistants API)
     ↓
Response
```

## The Orchestrator

The Orchestrator is the entry point for all AI interactions. It:
- Analyzes user requests to understand intent
- Routes requests to appropriate specialist agents
- Coordinates multi-agent workflows
- Synthesizes responses from multiple agents

**Model**: GPT-4o
**Primary Capability**: Function calling for intelligent routing

## Specialist Agents

### 1. Policy Drafting Agent

**Purpose**: Generates and refines policy documents for CMMC compliance

**Use Cases**:
- Create new policies from templates
- Review and update existing policies
- Map policies to CMMC controls
- Ensure policy compliance with NIST SP 800-171

**Knowledge Base**:
- NIST SP 800-171 requirements
- CMMC model and practices
- Industry-standard policy templates
- Organization-specific context

**Example Prompts**:
- "Draft an access control policy for CMMC Level 2"
- "Review my incident response policy for completeness"
- "Update our password policy to meet CMMC requirements"

---

### 2. C3PAO Expert Agent

**Purpose**: Simulates C3PAO (Third-Party Assessment Organization) assessor review

**Use Cases**:
- Review artifacts before official assessment
- Identify gaps in evidence
- Suggest improvements for audit readiness
- Provide guidance on assessment process

**Knowledge Base**:
- C3PAO assessment guide
- Common audit findings
- Evidence requirements per control
- Best practices for assessment success

**Example Prompts**:
- "Review my access control evidence for CMMC Level 2"
- "What artifacts do I need for control AC.2.013?"
- "Assess our readiness for a C3PAO audit"

---

### 3. Configuration Agent

**Purpose**: Generates secure network equipment configurations

**Supported Vendors**:
- Cisco (routers, switches, firewalls)
- HP/HPE (switches, routers)
- Aruba (switches, wireless)
- Unifi (switches, wireless, gateways)
- Sonicwall (firewalls, VPNs)
- Fortinet (FortiGate firewalls)

**Use Cases**:
- Generate CMMC-compliant configurations
- Create VLAN segregation designs
- Configure access control lists (ACLs)
- Implement security hardening

**Example Prompts**:
- "Generate a Cisco ASA firewall config for CMMC Level 2"
- "Create VLAN design to separate CUI from non-CUI networks"
- "Configure Fortinet firewall with least-privilege access"

---

### 4. CUI Data Analyst Agent

**Purpose**: Analyzes Controlled Unclassified Information (CUI) flows and workforce requirements

**Use Cases**:
- Identify CUI within business processes
- Map data flows through systems
- Determine which employees need CUI access
- Design network boundaries for CUI protection

**Knowledge Base**:
- NIST SP 800-171 CUI requirements
- Data classification standards
- Workflow analysis techniques
- Network segmentation best practices

**Example Prompts**:
- "Analyze our CAD files to determine if they contain CUI"
- "Map the flow of contract data through our organization"
- "Which roles need access to CUI in a construction company?"

---

### 5. Evidence Collection Agent

**Purpose**: Assists in gathering and organizing compliance evidence

**Use Cases**:
- Identify required evidence for controls
- Create evidence collection checklists
- Assess evidence quality and completeness
- Organize artifacts for assessments

**Example Prompts**:
- "What evidence do I need for access control practices?"
- "Review my screenshot evidence for completeness"
- "Create a checklist for CMMC Level 1 evidence"

---

### 6. Gap Analysis Agent

**Purpose**: Identifies compliance gaps and prioritizes remediation

**Use Cases**:
- Assess current compliance posture
- Identify missing or incomplete controls
- Prioritize remediation based on risk
- Generate roadmap for compliance

**Example Prompts**:
- "Analyze our gaps for CMMC Level 2"
- "What are the highest priority items to address?"
- "Create a 6-month roadmap to close compliance gaps"

---

### 7. Training & Awareness Agent

**Purpose**: Generates training content and tracks employee certification

**Use Cases**:
- Create role-based training materials
- Generate security awareness content
- Design quizzes and assessments
- Plan training campaigns

**Example Prompts**:
- "Create a phishing awareness training module"
- "Generate a quiz on password security"
- "Design training for employees handling CUI"

---

### 8. Vendor Assessment Agent

**Purpose**: Evaluates third-party vendors for CMMC compliance

**Use Cases**:
- Generate vendor questionnaires
- Assess vendor risk levels
- Review vendor compliance documentation
- Recommend contract language

**Example Prompts**:
- "Create a CMMC vendor assessment questionnaire"
- "Evaluate this vendor's security posture"
- "What contract clauses should we require for CUI sharing?"

---

### 9. Incident Response Agent

**Purpose**: Assists with incident response planning and execution

**Use Cases**:
- Create incident response plans
- Generate playbooks for common incidents
- Document incidents for compliance
- Conduct post-incident analysis

**Example Prompts**:
- "Draft an incident response plan for data breach"
- "Create a playbook for ransomware incident"
- "Help me document this security incident"

---

### 10. Risk Assessment Agent

**Purpose**: Performs risk analysis and mitigation planning

**Use Cases**:
- Identify and catalog assets
- Assess threats and vulnerabilities
- Calculate risk scores
- Recommend mitigation strategies

**Example Prompts**:
- "Perform a risk assessment for our file server"
- "What are the top 10 risks for CMMC compliance?"
- "Recommend mitigations for high-risk findings"

---

### 11. Audit Preparation Agent

**Purpose**: Prepares organizations for C3PAO assessments

**Use Cases**:
- Generate audit checklists
- Organize documentation packages
- Prepare for assessor interviews
- Create presentation materials

**Example Prompts**:
- "Create a checklist for CMMC Level 2 audit"
- "Organize our evidence for the upcoming assessment"
- "Prepare talking points for assessor interview"

---

### 12. Compliance Monitoring Agent

**Purpose**: Provides continuous compliance monitoring

**Use Cases**:
- Monitor configuration drift
- Check control effectiveness
- Identify compliance violations
- Generate alerts and reports

**Example Prompts**:
- "Check our firewall config for unauthorized changes"
- "Monitor effectiveness of access controls"
- "Generate weekly compliance status report"

---

### 13. Change Management Agent

**Purpose**: Manages changes while maintaining compliance

**Use Cases**:
- Analyze impact of proposed changes
- Generate change documentation
- Assess compliance implications
- Track change implementation

**Example Prompts**:
- "Assess impact of migrating to cloud infrastructure"
- "Document change to our authentication system"
- "Will this change affect our CMMC compliance?"

---

## Using the Agents

### Via API

```typescript
import { OrchestratorAgent } from "@/lib/ai/agents/orchestrator";

const orchestrator = new OrchestratorAgent();
const response = await orchestrator.process({
  prompt: "Help me create an access control policy for CMMC Level 2",
  context: {
    organizationId: "org_123",
    projectId: "proj_456",
  },
});
```

### Via UI

The agents are accessible through the CMMC Genie dashboard:
1. Navigate to AI Assistant
2. Type your question or request
3. The Orchestrator will route to appropriate agent(s)
4. Review and apply recommendations

## Best Practices

1. **Be Specific**: Provide context about your organization, target CMMC level, and specific requirements
2. **Review Outputs**: Always review AI-generated content before using in production
3. **Iterate**: Refine prompts based on responses to get better results
4. **Combine Agents**: Use multiple agents for complex tasks (e.g., Gap Analysis → Policy Drafting → Evidence Collection)
5. **Provide Feedback**: Rate responses to improve agent performance

## Limitations

- Agents provide guidance and recommendations, not legal or official certification advice
- All outputs should be reviewed by qualified personnel
- Agents are updated regularly but may not reflect the latest CMMC updates immediately
- Not a replacement for qualified security professionals or C3PAOs

## Future Enhancements

- Custom agent training with organization-specific data
- Multi-agent collaboration workflows
- Integration with external compliance frameworks
- Real-time document analysis
- Automated evidence collection from systems
