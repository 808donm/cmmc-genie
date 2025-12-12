/**
 * C3PAO Expert Agent
 *
 * Simulates a C3PAO (Certified Third Party Assessment Organization) assessor
 * to help organizations prepare for official CMMC assessments
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const C3PAO_EXPERT_SYSTEM_PROMPT = `You are the C3PAO Expert Agent for CMMC Genie, simulating an experienced CMMC assessor from a Certified Third Party Assessment Organization (C3PAO).

## Your Role

You help organizations prepare for official CMMC assessments by:
- Reviewing evidence and artifacts with an assessor's eye
- Identifying gaps that would be caught during an assessment
- Providing guidance on what assessors look for
- Helping organizations understand the assessment process
- Suggesting improvements to increase likelihood of certification

## Assessment Approach

You evaluate organizations using the CMMC Assessment Guide methodology:
1. **Evidence Review**: Examine documentation, policies, configurations, logs, etc.
2. **Gap Identification**: Identify missing or insufficient evidence
3. **Practice Verification**: Confirm security practices are implemented as documented
4. **Maturity Assessment**: Evaluate the maturity of control implementation
5. **Risk Analysis**: Identify areas of highest concern

## CMMC Levels Understanding

**Level 1 - Foundational**:
- 17 practices across 17 controls
- Focus: Basic cyber hygiene
- Assessment: Annual self-assessment

**Level 2 - Advanced**:
- 110 practices across 110 controls
- Focus: Intermediate cyber hygiene
- Assessment: Triennial C3PAO assessment

**Level 3 - Expert**:
- 110+ practices (includes Level 2 + additional)
- Focus: Advanced/progressive cyber hygiene
- Assessment: Triennial C3PAO assessment with enhanced rigor

## Common Assessment Findings

Based on real-world C3PAO assessments, common issues include:

1. **Incomplete Documentation**
   - Policies don't cover all required controls
   - Procedures missing implementation details
   - Outdated or version-less documents

2. **Insufficient Evidence**
   - Screenshots without context or timestamps
   - Logs that don't prove continuous monitoring
   - Training records without completion tracking

3. **Implementation Gaps**
   - Controls documented but not actually implemented
   - Inconsistent application of security practices
   - Lack of segregation between CUI and non-CUI environments

4. **Scope Issues**
   - Unclear or incorrect identification of CUI assets
   - Missing systems from the assessment scope
   - Inadequate network boundary definition

5. **Process Immaturity**
   - Ad-hoc rather than documented processes
   - Lack of regular review and updates
   - No evidence of continuous improvement

## Evidence Quality Criteria

When reviewing evidence, you assess:

**Strong Evidence**:
- ✅ Clearly demonstrates the control is implemented
- ✅ Shows consistency over time
- ✅ Includes relevant metadata (dates, responsible parties)
- ✅ Covers all aspects of the control requirement
- ✅ Is current (not outdated)

**Weak Evidence**:
- ⚠️ Partial coverage of control requirements
- ⚠️ Single point-in-time proof (not continuous)
- ⚠️ Missing context or unclear what it proves
- ⚠️ Outdated or not recent

**Insufficient Evidence**:
- ❌ Doesn't actually prove control implementation
- ❌ Too old or irrelevant
- ❌ Covers wrong scope or wrong control
- ❌ No evidence at all

## Your Assessment Output

When reviewing artifacts, always provide:

1. **Overall Readiness**: Ready, Nearly Ready, Needs Work, or Not Ready
2. **Control-by-Control Assessment**: Status of each relevant control
3. **Critical Findings**: Issues that would fail certification
4. **Recommendations**: Specific steps to address each finding
5. **Evidence Gaps**: What additional evidence is needed
6. **Best Practices**: Suggestions to strengthen the security posture

## Professional Tone

- Be constructive, not punitive
- Explain WHY something is required, not just THAT it's required
- Provide clear, actionable guidance
- Acknowledge what's done well
- Be realistic about implementation timelines and resources

Remember: You're here to help organizations succeed in their compliance journey, not to set them up for failure.`;

export class C3PAOExpertAgent extends BaseAgent {
  constructor() {
    super("C3PAO_EXPERT", C3PAO_EXPERT_SYSTEM_PROMPT);
  }

  /**
   * Assess overall audit readiness
   */
  async assessReadiness(request: {
    cmmcLevel: 1 | 2 | 3;
    completedControls: number;
    totalControls: number;
    evidenceCount: number;
    gaps?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const completionRate = (request.completedControls / request.totalControls) * 100;

    const prompt = `Assess the audit readiness of an organization pursuing CMMC Level ${request.cmmcLevel}:

Current Status:
- Controls Implemented: ${request.completedControls} of ${request.totalControls} (${completionRate.toFixed(1)}%)
- Evidence Artifacts: ${request.evidenceCount}
${request.gaps?.length ? `- Known Gaps: ${request.gaps.join(", ")}` : ""}

Please provide:
1. Overall readiness assessment (Ready/Nearly Ready/Needs Work/Not Ready)
2. Critical blockers that must be addressed before assessment
3. Timeline recommendation for scheduling C3PAO assessment
4. Priority actions for next 30/60/90 days
5. Risk areas that need immediate attention
6. Estimated probability of certification success`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Review specific evidence for a control
   */
  async reviewEvidence(request: {
    controlId: string;
    controlDescription: string;
    evidenceProvided: string;
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Review evidence for CMMC control ${request.controlId}:

Control: ${request.controlDescription}
Target Level: ${request.cmmcLevel}

Evidence Provided:
${request.evidenceProvided}

As a C3PAO assessor, evaluate:
1. Is this evidence sufficient to demonstrate control implementation? (Yes/No/Partial)
2. What specific aspects of the control does this evidence address?
3. What aspects of the control are NOT adequately demonstrated?
4. What additional evidence would strengthen this control?
5. What would you look for during an interview about this control?
6. Evidence quality rating (Strong/Adequate/Weak/Insufficient)
7. Specific recommendations for improvement`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Perform mock assessment interview
   */
  async mockInterview(request: {
    role: string;
    controlDomain: string;
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Conduct a mock C3PAO assessment interview for:

Role Being Interviewed: ${request.role}
Control Domain: ${request.controlDomain}
CMMC Level: ${request.cmmcLevel}

Please provide:
1. 10 typical questions an assessor would ask this role about ${request.controlDomain}
2. What answers would demonstrate strong control implementation
3. Red flags in answers that would concern an assessor
4. Follow-up questions typically asked
5. Tips for the interviewee to prepare
6. Common mistakes to avoid during interviews`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Identify gaps in current implementation
   */
  async identifyGaps(request: {
    cmmcLevel: 1 | 2 | 3;
    implementedControls: string[];
    availableEvidence: string[];
    systemDescription?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Perform gap analysis for CMMC Level ${request.cmmcLevel} certification:

Implemented Controls: ${request.implementedControls.join(", ")}
Available Evidence Types: ${request.availableEvidence.join(", ")}
${request.systemDescription ? `System Context: ${request.systemDescription}` : ""}

As a C3PAO assessor, identify:
1. Missing controls that must be implemented
2. Controls with weak or insufficient evidence
3. Common assessment failures in this configuration
4. Scope definition issues (if any)
5. CUI handling concerns
6. Network architecture concerns
7. Documentation gaps
8. Prioritized remediation roadmap (what to fix first)
9. Estimated timeline to address all gaps
10. Quick wins that can be achieved in 30 days`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate assessment preparation checklist
   */
  async preparationChecklist(request: {
    cmmcLevel: 1 | 2 | 3;
    assessmentDate?: Date;
    context?: any;
  }): Promise<AgentResponse> {
    const daysUntil = request.assessmentDate
      ? Math.floor(
          (request.assessmentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      : null;

    const prompt = `Generate a comprehensive C3PAO assessment preparation checklist for CMMC Level ${request.cmmcLevel}:

${daysUntil ? `Assessment scheduled in: ${daysUntil} days` : "Assessment not yet scheduled"}

Provide a detailed checklist covering:
1. **Documentation Review** (60 days before)
   - What documents to have ready
   - Version control and approval requirements
   - Where to store for assessor access

2. **Evidence Organization** (45 days before)
   - Evidence to collect for each control domain
   - How to organize and label evidence
   - Gap filling priorities

3. **System Preparation** (30 days before)
   - Configuration reviews
   - Log collection setup
   - Demonstration scenarios

4. **Personnel Preparation** (21 days before)
   - Who will be interviewed
   - Interview preparation materials
   - Knowledge areas to review

5. **Final Walkthrough** (7 days before)
   - Pre-assessment self-audit
   - Last-minute evidence collection
   - Facility and access preparation

6. **Assessment Day** (Day 0)
   - Schedule and logistics
   - Materials to have available
   - Do's and don'ts

7. **Post-Assessment** (After)
   - How to handle findings
   - Corrective action plans
   - POA&M management

Make the checklist specific and actionable.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
