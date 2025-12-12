/**
 * Evidence Collection Agent
 *
 * Assists in identifying, gathering, and organizing compliance evidence
 * for CMMC assessments
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const EVIDENCE_COLLECTION_SYSTEM_PROMPT = `You are the Evidence Collection Agent for CMMC Genie, an expert in identifying and organizing compliance evidence for CMMC assessments.

## Your Role

You help organizations:
- Identify required evidence for each CMMC control
- Create evidence collection checklists
- Organize and categorize evidence
- Assess evidence quality and completeness
- Prepare evidence packages for C3PAO assessments
- Track evidence gaps and remediation

## Evidence Types

### Documentation Evidence
1. **Policies and Procedures**
   - Security policies
   - Standard operating procedures
   - Incident response plans
   - Business continuity plans
   - Acceptable use policies

2. **System Documentation**
   - Network diagrams
   - System architecture documents
   - Data flow diagrams
   - Asset inventories
   - System security plans (SSP)

3. **Administrative Records**
   - Training completion records
   - Background check documentation
   - Signed acknowledgments
   - Access authorization forms
   - Termination checklists

### Technical Evidence
1. **Configuration Evidence**
   - Firewall rule sets
   - Router/switch configurations
   - Group policy settings
   - Security baselines
   - Patch management reports

2. **Log Evidence**
   - Access logs
   - Authentication logs
   - Audit logs
   - Firewall logs
   - Security event logs

3. **Screenshots**
   - System settings
   - Security controls in action
   - User interface configurations
   - Access control matrices
   - Monitoring dashboards

4. **Scan Results**
   - Vulnerability scans
   - Compliance scans
   - Penetration test results
   - Security assessments
   - Configuration audits

### Operational Evidence
1. **Continuous Monitoring**
   - Regular vulnerability scans
   - Patch status reports
   - Backup verification logs
   - Incident reports
   - Change management tickets

2. **Testing Evidence**
   - Tabletop exercise results
   - Disaster recovery tests
   - Incident response drills
   - Access control testing
   - Backup restoration tests

## Evidence Quality Criteria

### Strong Evidence
- ✅ Clearly demonstrates control implementation
- ✅ Recent (within assessment period)
- ✅ Includes relevant metadata (dates, names, systems)
- ✅ Shows consistency over time
- ✅ Covers all aspects of the control
- ✅ Authentic and verifiable
- ✅ Well-organized and labeled

### Weak Evidence
- ⚠️ Outdated or not recent
- ⚠️ Missing context or metadata
- ⚠️ Partial coverage only
- ⚠️ Single point-in-time (not continuous)
- ⚠️ Unclear what it proves
- ⚠️ Poorly organized

### Insufficient Evidence
- ❌ Doesn't actually prove the control
- ❌ Too old to be relevant
- ❌ Wrong control or wrong scope
- ❌ No evidence at all
- ❌ Cannot be verified

## Evidence Collection Best Practices

1. **Start Early**: Begin collecting evidence now, not right before assessment
2. **Automate**: Use scripts and tools to automatically collect evidence
3. **Organize**: Use consistent naming and folder structures
4. **Version**: Track evidence versions and collection dates
5. **Metadata**: Include who, what, when, where, why for each artifact
6. **Protect**: Secure evidence from tampering; maintain chain of custody
7. **Regular**: Collect on a regular schedule, not just once
8. **Backup**: Keep backups of all evidence

## Evidence Naming Convention

Recommend this format:
\`[ControlID]_[EvidenceType]_[SystemName]_[Date]_[Version]\`

Example: \`AC.1.001_Screenshot_Firewall_2024-01-15_v1.png\`

## Evidence Organization

Suggest organizing by:
1. **By Control Family** (AC, AU, CA, CM, etc.)
2. **By Control ID** (AC.1.001, AC.1.002, etc.)
3. **By Evidence Type** (Policies, Configs, Screenshots, Logs)
4. **By System** (Firewall, File Server, Workstations, etc.)

## Assessment Preparation

For C3PAO assessments, evidence should be:
- Indexed with a master evidence list
- Cross-referenced to controls
- Stored in a secure, accessible location
- Reviewed for completeness before assessment
- Ready to present or share with assessors

## Your Output Format

When providing evidence guidance, include:

1. **Evidence Requirements**:
   - What evidence is needed
   - Why it's needed
   - What it should demonstrate

2. **Collection Methods**:
   - How to collect the evidence
   - Tools or commands to use
   - Frequency of collection

3. **Organization**:
   - How to name files
   - Where to store them
   - How to index them

4. **Quality Check**:
   - How to verify completeness
   - What makes good vs. poor evidence
   - Common mistakes to avoid

5. **Gap Analysis**:
   - What's missing
   - Priority of collection
   - Timeline for gathering

Be specific and actionable in your recommendations.`;

export class EvidenceCollectionAgent extends BaseAgent {
  constructor() {
    super("EVIDENCE_COLLECTION", EVIDENCE_COLLECTION_SYSTEM_PROMPT);
  }

  /**
   * Generate evidence collection checklist
   */
  async generateChecklist(request: {
    cmmcLevel: 1 | 2 | 3;
    controlFamily?: string; // AC, AU, etc.
    specificControls?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    let scope = `CMMC Level ${request.cmmcLevel}`;
    if (request.controlFamily) scope += ` - ${request.controlFamily} family`;
    if (request.specificControls?.length)
      scope += ` - Controls: ${request.specificControls.join(", ")}`;

    const prompt = `Generate a comprehensive evidence collection checklist for ${scope}.

For each control, provide:
1. **Control ID and Description**
2. **Required Evidence Types**:
   - What documents are needed
   - What technical evidence is needed
   - What operational evidence is needed
3. **Collection Methods**:
   - How to collect each type
   - Tools or commands to use
   - Frequency (one-time, monthly, quarterly, continuous)
4. **Evidence Quality Criteria**:
   - What makes evidence sufficient
   - Common mistakes to avoid
5. **Storage and Naming**:
   - Recommended file naming
   - Where to store

Organize the checklist in a table or structured format that can be easily followed.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Review evidence for completeness
   */
  async reviewEvidence(request: {
    controlId: string;
    controlDescription: string;
    evidenceList: Array<{
      name: string;
      type: string;
      date?: string;
      description?: string;
    }>;
    context?: any;
  }): Promise<AgentResponse> {
    const evidenceDetails = request.evidenceList
      .map(
        (e) =>
          `- ${e.name} (${e.type})${e.date ? ` - ${e.date}` : ""}${e.description ? `\n  ${e.description}` : ""}`
      )
      .join("\n");

    const prompt = `Review evidence completeness for control ${request.controlId}:

Control: ${request.controlDescription}

Evidence Provided:
${evidenceDetails}

Assess:
1. **Completeness**: Does the evidence fully demonstrate control implementation? (Complete/Partial/Insufficient)
2. **Coverage**: What aspects of the control are well-evidenced?
3. **Gaps**: What aspects are missing or weak evidence?
4. **Quality**: Rate each evidence item (Strong/Adequate/Weak)
5. **Improvements**: What additional evidence would strengthen this control?
6. **Priority**: Which gaps are most critical to address?
7. **Timeline**: How quickly should gaps be filled?
8. **Recommendations**: Specific next steps for evidence collection

Provide actionable guidance for improving evidence quality and completeness.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Suggest evidence for a specific control
   */
  async suggestEvidence(request: {
    controlId: string;
    controlDescription: string;
    systemContext?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Suggest appropriate evidence for control ${request.controlId}:

Control: ${request.controlDescription}
${request.systemContext ? `System Context: ${request.systemContext}` : ""}

Provide detailed recommendations for:

1. **Documentation Evidence**:
   - What policies/procedures should exist
   - What administrative records are needed
   - Sample templates or examples

2. **Technical Evidence**:
   - What configurations to capture
   - What logs to collect
   - What screenshots to take
   - Specific commands or tools to use

3. **Operational Evidence**:
   - What ongoing activities to document
   - What test results to maintain
   - What monitoring to implement

4. **Collection Instructions**:
   - Step-by-step collection procedures
   - Frequency of collection
   - Who should collect
   - Where to store

5. **Quality Examples**:
   - What good evidence looks like
   - Common mistakes to avoid
   - Red flags that indicate poor evidence

6. **Effort Estimate**:
   - How long will collection take?
   - What resources are needed?
   - Any tools or automation opportunities?

Be specific and practical in your recommendations.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create evidence collection automation script
   */
  async generateCollectionScript(request: {
    evidenceType: string;
    system: string;
    platform?: string; // Windows, Linux, Network, Cloud
    controlIds?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create an automated evidence collection script for:

Evidence Type: ${request.evidenceType}
System: ${request.system}
${request.platform ? `Platform: ${request.platform}` : ""}
${request.controlIds?.length ? `Controls: ${request.controlIds.join(", ")}` : ""}

Provide:
1. **Script/Command**:
   - Complete, ready-to-use script
   - Comments explaining each section
   - Error handling included

2. **Prerequisites**:
   - Required permissions
   - Software dependencies
   - Configuration needs

3. **Usage Instructions**:
   - How to run the script
   - Parameters to customize
   - Expected output

4. **Scheduling**:
   - Recommended collection frequency
   - How to automate (cron, Task Scheduler, etc.)
   - Storage location for output

5. **Output Format**:
   - What the collected evidence will look like
   - File naming convention
   - Metadata included

6. **Verification**:
   - How to verify collection worked
   - What to check in the output
   - Troubleshooting common issues

Provide production-ready automation that can be implemented immediately.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Organize evidence package for assessment
   */
  async organizeEvidencePackage(request: {
    cmmcLevel: 1 | 2 | 3;
    availableEvidence: string[];
    assessmentDate?: Date;
    context?: any;
  }): Promise<AgentResponse> {
    const daysUntil = request.assessmentDate
      ? Math.floor(
          (request.assessmentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      : null;

    const prompt = `Create an evidence organization plan for CMMC Level ${request.cmmcLevel} assessment:

Available Evidence:
${request.availableEvidence.map((e) => `- ${e}`).join("\n")}

${daysUntil !== null ? `Assessment in: ${daysUntil} days` : "Assessment date: TBD"}

Provide:
1. **Folder Structure**:
   - Recommended directory hierarchy
   - Naming conventions
   - Control mapping

2. **Evidence Index**:
   - Master spreadsheet/list format
   - Columns to include
   - Cross-reference to controls

3. **Packaging Instructions**:
   - How to organize for assessor access
   - Format (USB drive, secure cloud, etc.)
   - Access controls and permissions

4. **Quality Review**:
   - Checklist for evidence review
   - Common issues to look for
   - Improvement priorities

5. **Presentation**:
   - How to present to assessors
   - Evidence walk-through plan
   - Interview preparation

6. **Missing Evidence**:
   - Critical gaps to fill
   - Quick wins (easy evidence to collect now)
   - Timeline for gap remediation

7. **Backup Plan**:
   - Evidence backup strategy
   - Contingency if evidence is questioned
   - Additional proof sources

Provide a detailed, actionable plan for evidence organization.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Assess evidence gaps across all controls
   */
  async assessGaps(request: {
    cmmcLevel: 1 | 2 | 3;
    collectedEvidence: Record<string, string[]>; // controlId -> evidence list
    context?: any;
  }): Promise<AgentResponse> {
    const evidenceStatus = Object.entries(request.collectedEvidence)
      .map(([control, evidence]) => `- ${control}: ${evidence.length} items`)
      .join("\n");

    const prompt = `Assess evidence gaps for CMMC Level ${request.cmmcLevel}:

Current Evidence Status:
${evidenceStatus}

Analyze:
1. **Overall Status**:
   - Percentage of controls with evidence
   - Percentage with complete evidence
   - Percentage with partial evidence
   - Percentage with no evidence

2. **Gap Analysis by Control Family**:
   - Which families are well-evidenced
   - Which families need work
   - Priority ranking

3. **Critical Gaps**:
   - Controls with no evidence at all
   - Controls with insufficient evidence
   - Impact on certification likelihood

4. **Quick Wins**:
   - Easy evidence to collect now
   - Low-effort, high-impact items
   - Can be done this week

5. **Long-Term Gaps**:
   - Evidence requiring significant work
   - Implementation needed before evidence
   - Process/procedure development needs

6. **Resource Requirements**:
   - Estimated hours to fill gaps
   - Skills/tools needed
   - Budget implications

7. **Prioritized Action Plan**:
   - 30-day priorities
   - 60-day priorities
   - 90-day priorities

8. **Risk Assessment**:
   - Risk of proceeding with current evidence
   - Recommendation for assessment timing
   - Fallback strategies

Provide a comprehensive gap analysis with actionable remediation plan.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
