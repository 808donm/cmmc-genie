/**
 * CUI Data Analyst Agent
 *
 * Analyzes Controlled Unclassified Information (CUI) flows,
 * data classification, and workforce access requirements
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const CUI_ANALYST_SYSTEM_PROMPT = `You are the CUI Data Analyst Agent for CMMC Genie, an expert in Controlled Unclassified Information (CUI) identification, classification, and protection requirements.

## Your Expertise

You specialize in:
- Identifying CUI within business processes and data
- Mapping data flows through systems and networks
- Determining workforce access requirements
- Designing appropriate security boundaries
- Analyzing data classification schemes
- Assessing CMMC scope and boundaries

## CUI Understanding

### What is CUI?

Controlled Unclassified Information is information that requires safeguarding or dissemination controls pursuant to laws, regulations, or government-wide policies. For defense contractors, this primarily includes:

**Common CUI Types in Defense Contracting**:
1. **Federal Contract Information (FCI)**: Information provided by or generated for the government under a contract
2. **Covered Defense Information (CDI)**: Unclassified information that requires protection
3. **Technical Data**: Drawings, plans, specifications, blueprints
4. **Export Controlled Information**: ITAR, EAR controlled data
5. **Proprietary Information**: Related to government contracts

### CUI Indicators

Information is likely CUI if it:
- Was provided by the government as part of a contract
- Contains technical specifications for defense systems
- Includes performance characteristics of defense items
- Contains source code or software for government systems
- Includes blueprints, schematics, or design drawings for defense items
- Has export control markings (ITAR, EAR)
- Contains information about vulnerabilities or security of government systems

### CUI Markings

Properly marked CUI includes:
- CUI banner/footer markings
- CUI dissemination controls
- Category markings (CUI//SP-CTI, CUI//SP-EXPT, etc.)
- Decontrol dates or events

## NIST SP 800-171 Requirements

Your analysis must consider these CUI protection requirements:

1. **Access Control**: Only authorized users can access CUI
2. **Awareness and Training**: Personnel trained on CUI handling
3. **Audit and Accountability**: Track CUI access and use
4. **Configuration Management**: Control CUI system configurations
5. **Identification and Authentication**: Verify user identities
6. **Incident Response**: Respond to CUI security incidents
7. **Maintenance**: Maintain CUI systems securely
8. **Media Protection**: Protect and sanitize CUI media
9. **Personnel Security**: Screen personnel with CUI access
10. **Physical Protection**: Physically protect CUI systems
11. **Risk Assessment**: Assess risks to CUI
12. **Security Assessment**: Assess security controls for CUI
13. **System and Communications Protection**: Protect CUI in transit and at rest
14. **System and Information Integrity**: Monitor and protect CUI integrity

## Data Flow Analysis

When analyzing data flows, consider:

1. **Data Creation**: Where does CUI originate?
2. **Data Storage**: Where is CUI stored (databases, file servers, cloud)?
3. **Data Processing**: What systems process CUI?
4. **Data Transmission**: How does CUI move between systems/users?
5. **Data Usage**: Who needs to access CUI and why?
6. **Data Sharing**: Is CUI shared externally? With whom?
7. **Data Disposal**: How is CUI destroyed at end of life?

## Workforce Segregation

### Roles Typically Needing CUI Access:
- Program Managers on government contracts
- Engineers working on defense designs
- Proposal teams accessing government RFPs
- IT administrators managing CUI systems
- Security personnel monitoring CUI environments
- Contracts personnel handling CDI

### Roles Typically NOT Needing CUI Access:
- HR personnel (unless processing clearance info)
- Accounting/Finance (unless processing government invoices)
- Marketing teams
- General administrative staff
- Facilities management
- Most sales personnel

## Network Boundary Design

Your analysis should help define:

1. **CUI Environment**: Systems that store, process, or transmit CUI
2. **Non-CUI Environment**: Systems that never handle CUI
3. **Boundary Protections**: Firewalls, network segmentation
4. **Access Controls**: Who can access what from where
5. **Data Flows**: Permitted and denied data transfers

## Analysis Output Format

When analyzing CUI, provide:

1. **CUI Identification**:
   - What information is CUI?
   - Why is it CUI?
   - CUI categories and markings

2. **Data Flow Map**:
   - Where CUI exists
   - How it moves
   - Who accesses it
   - Risk points

3. **Access Requirements**:
   - Roles needing access
   - Justification for access
   - Roles that don't need access

4. **Boundary Definition**:
   - Systems in CUI scope
   - Systems out of scope
   - Network segments
   - Security controls needed

5. **Recommendations**:
   - Scope reduction opportunities
   - Access control improvements
   - Segregation strategies
   - Risk mitigation

Be practical and business-aware - the goal is appropriate protection, not making everything CUI or blocking all business operations.`;

export class CUIAnalystAgent extends BaseAgent {
  constructor() {
    super("CUI_ANALYST", CUI_ANALYST_SYSTEM_PROMPT);
  }

  /**
   * Identify if data/documents contain CUI
   */
  async identifyCUI(request: {
    dataDescription: string;
    businessContext?: string;
    source?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Analyze whether the following data contains Controlled Unclassified Information (CUI):

Data Description:
${request.dataDescription}

${request.businessContext ? `Business Context: ${request.businessContext}` : ""}
${request.source ? `Source: ${request.source}` : ""}

Please determine:
1. Does this data contain CUI? (Yes/No/Possibly)
2. If yes, what type of CUI? (FCI, CDI, Technical Data, Export Controlled, etc.)
3. What specific elements make it CUI?
4. What CUI markings should be applied?
5. What protection requirements apply?
6. How should this data be handled?
7. Who should have access?
8. How long should it be retained?

If uncertain, explain what additional information is needed to make a determination.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Map data flows in the organization
   */
  async mapDataFlows(request: {
    businessProcess: string;
    systemsInvolved: string[];
    dataTypes: string[];
    externalSharing?: boolean;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Map the data flows for the following business process:

Process: ${request.businessProcess}

Systems Involved:
${request.systemsInvolved.map((s) => `- ${s}`).join("\n")}

Data Types:
${request.dataTypes.map((d) => `- ${d}`).join("\n")}

${request.externalSharing ? "Note: This process involves external data sharing" : ""}

Please provide:
1. **Data Flow Diagram** (text-based)
   - Where does data originate?
   - What systems does it flow through?
   - Where is it stored?
   - Where does it end up?

2. **CUI Assessment**
   - Which data flows contain CUI?
   - Where is CUI most at risk?
   - Are there unnecessary CUI exposures?

3. **Access Analysis**
   - Who needs access at each stage?
   - Are access controls appropriate?
   - Any excessive permissions?

4. **Protection Points**
   - Where should encryption be applied?
   - Where should access controls be strengthened?
   - Where should audit logging be enhanced?

5. **Recommendations**
   - Opportunities to reduce CUI scope
   - Ways to simplify data flows
   - Security improvements needed
   - Compliance gaps to address`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Determine workforce access requirements
   */
  async analyzeWorkforceAccess(request: {
    organizationType: string;
    roles: Array<{
      title: string;
      responsibilities: string;
      systemsUsed?: string[];
    }>;
    context?: any;
  }): Promise<AgentResponse> {
    const roleDetails = request.roles
      .map(
        (r) =>
          `- ${r.title}: ${r.responsibilities}${r.systemsUsed?.length ? ` (Uses: ${r.systemsUsed.join(", ")})` : ""}`
      )
      .join("\n");

    const prompt = `Analyze workforce CUI access requirements for a ${request.organizationType}:

Roles:
${roleDetails}

For each role, determine:
1. **CUI Access Need**: Does this role need CUI access? (Yes/No/Sometimes)
2. **Justification**: Why or why not?
3. **CUI Types**: What types of CUI (if any)?
4. **Access Level**: Read-only, Read-write, Admin?
5. **Systems**: Which CUI systems should they access?
6. **Restrictions**: Any access restrictions needed?
7. **Training**: Special CUI training requirements?
8. **Monitoring**: Enhanced monitoring needed?

Then provide:
- **Summary**: X% of workforce needs CUI access
- **Segregation Strategy**: How to separate CUI and non-CUI workers
- **Network Design**: Implications for network segmentation
- **Access Control**: Recommended access control model
- **Scope Reduction**: Ways to minimize CUI access needs
- **Cost Impact**: How this affects CMMC scope and cost`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Define CMMC assessment scope
   */
  async defineScope(request: {
    organizationDescription: string;
    systems: Array<{
      name: string;
      purpose: string;
      dataTypes?: string[];
      users?: string[];
    }>;
    contracts?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const systemDetails = request.systems
      .map(
        (s) =>
          `- ${s.name}: ${s.purpose}${s.dataTypes?.length ? `\n  Data: ${s.dataTypes.join(", ")}` : ""}${s.users?.length ? `\n  Users: ${s.users.join(", ")}` : ""}`
      )
      .join("\n");

    const prompt = `Define the CMMC assessment scope for:

Organization: ${request.organizationDescription}

${request.contracts?.length ? `Active Government Contracts:\n${request.contracts.map((c) => `- ${c}`).join("\n")}` : ""}

Systems:
${systemDetails}

Please determine:
1. **In-Scope Systems**: Which systems must be in CMMC scope?
   - Why are they in scope?
   - What CUI do they handle?

2. **Out-of-Scope Systems**: Which systems can be excluded?
   - Why can they be excluded?
   - Any isolation required?

3. **Boundary Definition**:
   - Network boundaries
   - Physical boundaries
   - Organizational boundaries
   - Logical boundaries

4. **Data Flows**:
   - CUI flows between systems
   - CUI flows to/from external parties
   - Potential scope creep points

5. **Access Paths**:
   - How do users access CUI systems?
   - Remote access considerations
   - Bring-your-own-device (BYOD) impact

6. **Scope Optimization**:
   - Opportunities to reduce scope
   - Systems that could be decommissioned
   - Data that could be declassified
   - Processes that could be restructured

7. **Assessment Impact**:
   - Number of assets in scope
   - Estimated assessment duration
   - Complexity level (Low/Medium/High)
   - Cost implications

Provide specific, actionable recommendations for scope definition.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Analyze CUI handling in specific industry
   */
  async industryAnalysis(request: {
    industry: string;
    businessProcesses: string[];
    commonDataTypes: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Analyze CUI handling for organizations in the ${request.industry} industry:

Typical Business Processes:
${request.businessProcesses.map((p) => `- ${p}`).join("\n")}

Common Data Types:
${request.commonDataTypes.map((d) => `- ${d}`).join("\n")}

Please provide industry-specific guidance on:

1. **CUI Identification**:
   - What data typically is CUI in this industry?
   - What data typically is NOT CUI?
   - Common misidentifications?

2. **Typical Scope**:
   - Systems commonly in scope
   - Employees commonly needing access
   - Network architecture patterns

3. **Common Challenges**:
   - Industry-specific compliance issues
   - Integration challenges
   - Resource constraints

4. **Best Practices**:
   - How successful companies handle CUI
   - Scope reduction strategies
   - Cost-effective implementations

5. **Role-Specific Needs**:
   - Which roles typically need CUI access
   - Which roles typically don't
   - How to segregate effectively

6. **Recommendations**:
   - Tailored advice for this industry
   - Realistic implementation strategies
   - Common pitfalls to avoid`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Review CUI handling procedures
   */
  async reviewProcedures(request: {
    currentProcedure: string;
    processType: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Review the following CUI handling procedure for ${request.processType}:

${request.currentProcedure}

Evaluate:
1. **Completeness**: Does it cover all CUI lifecycle stages?
   - Creation/Receipt
   - Storage
   - Transmission
   - Use
   - Destruction

2. **Compliance**: Does it meet NIST SP 800-171 requirements?
   - Specific controls addressed
   - Controls missing or weak

3. **Practicality**: Is it realistic and implementable?
   - Overly burdensome steps?
   - Missing practical guidance?
   - Clear responsibilities?

4. **Security**: Does it adequately protect CUI?
   - Vulnerability points
   - Risk areas
   - Control gaps

5. **Improvements**:
   - Specific recommendations
   - Priority ranking
   - Implementation guidance

Provide actionable feedback to strengthen CUI protection while maintaining operational efficiency.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
