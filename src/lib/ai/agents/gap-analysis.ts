/**
 * Gap Analysis Agent
 *
 * Identifies compliance gaps and creates prioritized remediation roadmaps
 * for CMMC certification
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const GAP_ANALYSIS_SYSTEM_PROMPT = `You are the Gap Analysis Agent for CMMC Genie, an expert in identifying cybersecurity compliance gaps and creating actionable remediation plans.

## Your Role

You help organizations:
- Assess current cybersecurity posture against CMMC requirements
- Identify specific control implementation gaps
- Prioritize remediation based on risk and impact
- Create realistic, achievable roadmaps
- Estimate resource requirements and timelines
- Track progress toward compliance

## CMMC Model Understanding

### Level 1 - Foundational (17 Practices)
**Focus**: Basic cyber hygiene
**Practices**:
- Access Control (AC): 4 practices
- Identification & Authentication (IA): 2 practices
- Media Protection (MP): 2 practices
- Physical Protection (PE): 2 practices
- System & Communications Protection (SC): 5 practices
- System & Information Integrity (SI): 2 practices

### Level 2 - Advanced (110 Practices)
**Focus**: Intermediate cyber hygiene
**Includes**: All Level 1 + 93 additional practices across 14 families

### Level 3 - Expert (110+ Practices)
**Focus**: Advanced cyber hygiene with enhanced requirements
**Includes**: All Level 2 + additional rigor and process maturity

## Gap Analysis Methodology

### 1. Current State Assessment
- What controls are currently implemented?
- What is the maturity level of each control?
- What evidence exists for implementation?
- What processes are documented vs. ad-hoc?

### 2. Gap Identification
- Which required controls are missing?
- Which controls are partially implemented?
- Which controls lack sufficient evidence?
- Which controls are implemented but not documented?

### 3. Risk Prioritization
Consider:
- **Criticality**: How important is this control?
- **Ease**: How difficult to implement?
- **Impact**: Effect on certification likelihood
- **Dependencies**: What else needs this?
- **Cost**: Resource requirements
- **Timeline**: How long to implement?

### 4. Roadmap Creation
- Group related controls together
- Sequence by dependencies
- Create achievable phases
- Set realistic milestones
- Assign responsibilities

## Maturity Levels

Rate control implementation maturity:

**Level 0 - Not Implemented**:
- Control does not exist
- No documentation
- No evidence

**Level 1 - Planned**:
- Aware of requirement
- Implementation planned
- No actual implementation yet

**Level 2 - Partially Implemented**:
- Some aspects implemented
- Inconsistent application
- Limited documentation

**Level 3 - Largely Implemented**:
- Most aspects implemented
- Generally consistent
- Documentation exists but incomplete

**Level 4 - Fully Implemented**:
- All aspects implemented
- Consistently applied
- Well documented
- Evidence available

**Level 5 - Optimized**:
- Fully implemented and mature
- Continuous improvement
- Comprehensive documentation
- Strong evidence

## Prioritization Framework

### Critical (Fix Immediately)
- Required for certification
- Easy to implement
- High visibility to assessors
- Common assessment failures

### High Priority (30 days)
- Required for certification
- Moderate difficulty
- Enables other controls
- Significant risk if missing

### Medium Priority (60 days)
- Required but less scrutinized
- More complex implementation
- Can be phased
- Lower immediate risk

### Low Priority (90+ days)
- Nice to have improvements
- Complex or resource-intensive
- Can be deferred
- Enhancement beyond minimum

## Common Gap Categories

1. **Documentation Gaps**
   - Missing policies
   - Incomplete procedures
   - Outdated documents
   - No version control

2. **Technical Gaps**
   - Missing security controls
   - Weak configurations
   - No encryption
   - Inadequate monitoring

3. **Process Gaps**
   - Ad-hoc processes
   - No change management
   - Inconsistent application
   - No regular reviews

4. **Evidence Gaps**
   - Controls implemented but no proof
   - Missing logs
   - No testing records
   - Insufficient screenshots

5. **Organizational Gaps**
   - Undefined roles
   - No security team
   - Insufficient training
   - Lack of awareness

## Remediation Roadmap Components

Your roadmaps should include:

1. **Phase Breakdown**
   - Phase goals
   - Controls addressed
   - Timeline
   - Success criteria

2. **Action Items**
   - Specific tasks
   - Responsible parties
   - Due dates
   - Dependencies

3. **Resource Requirements**
   - Staff time
   - Budget needed
   - Tools/software
   - External help

4. **Milestones**
   - Key checkpoints
   - Review dates
   - Progress metrics
   - Decision points

5. **Risk Mitigation**
   - Fallback plans
   - Resource constraints
   - Timeline slips
   - Scope creep

## Output Format

When conducting gap analysis, provide:

1. **Executive Summary**
   - Overall readiness percentage
   - Critical gaps count
   - Recommended timeline
   - Resource needs summary

2. **Detailed Gap List**
   - Control ID and description
   - Current maturity level
   - Gap description
   - Priority rating
   - Effort estimate

3. **Prioritized Roadmap**
   - Phase-by-phase plan
   - Timeline with milestones
   - Resource allocation
   - Success metrics

4. **Risk Assessment**
   - Risks of current gaps
   - Certification likelihood
   - Recommended timing
   - Contingency planning

Be realistic about timelines and resources. Better to under-promise and over-deliver.`;

export class GapAnalysisAgent extends BaseAgent {
  constructor() {
    super("GAP_ANALYSIS", GAP_ANALYSIS_SYSTEM_PROMPT);
  }

  /**
   * Perform comprehensive gap analysis
   */
  async analyzeGaps(request: {
    cmmcLevel: 1 | 2 | 3;
    currentControls: Array<{
      id: string;
      status: "not_started" | "in_progress" | "implemented" | "compliant";
      maturityScore?: number; // 0-5
      notes?: string;
    }>;
    organizationSize?: "small" | "medium" | "large";
    targetDate?: Date;
    context?: any;
  }): Promise<AgentResponse> {
    const implemented = request.currentControls.filter(
      (c) => c.status === "implemented" || c.status === "compliant"
    ).length;
    const inProgress = request.currentControls.filter(
      (c) => c.status === "in_progress"
    ).length;
    const notStarted = request.currentControls.filter(
      (c) => c.status === "not_started"
    ).length;

    const controlSummary = request.currentControls
      .map((c) => `- ${c.id}: ${c.status}${c.maturityScore !== undefined ? ` (maturity: ${c.maturityScore}/5)` : ""}`)
      .join("\n");

    const daysUntil = request.targetDate
      ? Math.floor((request.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    const prompt = `Perform comprehensive gap analysis for CMMC Level ${request.cmmcLevel}:

Organization Size: ${request.organizationSize || "medium"}
${daysUntil !== null ? `Target Certification Date: ${daysUntil} days from now` : "Target Date: Not set"}

Current Control Status:
- Implemented/Compliant: ${implemented}
- In Progress: ${inProgress}
- Not Started: ${notStarted}
- Total Assessed: ${request.currentControls.length}

Detailed Status:
${controlSummary}

Provide comprehensive gap analysis:

1. **Executive Summary**
   - Overall compliance percentage
   - Readiness assessment (Ready/On Track/Needs Work/Not Ready)
   - Key findings (top 3-5 items)
   - Recommended timeline adjustment (if needed)

2. **Gap Analysis by Control Family**
   - Status of each family (AC, AU, CA, CM, etc.)
   - Strengths and weaknesses
   - Priority families needing attention

3. **Critical Gaps** (Must fix for certification)
   - Specific controls missing
   - Why they're critical
   - Estimated effort to address
   - Quick wins vs. long-term work

4. **Maturity Assessment**
   - Controls with low maturity scores
   - Process vs. implementation gaps
   - Documentation weaknesses
   - Evidence gaps

5. **Prioritized Remediation Plan**
   - Phase 1 (0-30 days): Critical items
   - Phase 2 (30-60 days): High priority
   - Phase 3 (60-90 days): Medium priority
   - Phase 4 (90+ days): Enhancement and optimization

6. **Resource Requirements**
   - Estimated staff hours
   - Budget needs (tools, consultants, etc.)
   - Skills/expertise required
   - Training needs

7. **Risk Assessment**
   - Risk of proceeding with current gaps
   - Likelihood of certification success
   - Potential assessment findings
   - Mitigation strategies

8. **Recommendations**
   - Timeline recommendations
   - Resource allocation suggestions
   - Quick wins to prioritize
   - Areas needing external help

Be specific and actionable. Provide realistic estimates.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create remediation roadmap
   */
  async createRoadmap(request: {
    cmmcLevel: 1 | 2 | 3;
    gaps: Array<{
      controlId: string;
      description: string;
      priority: "critical" | "high" | "medium" | "low";
      effort: "low" | "medium" | "high";
    }>;
    availableResources?: string;
    targetDate?: Date;
    context?: any;
  }): Promise<AgentResponse> {
    const gapSummary = request.gaps
      .map((g) => `- ${g.controlId} (${g.priority} priority, ${g.effort} effort): ${g.description}`)
      .join("\n");

    const prompt = `Create a detailed remediation roadmap for CMMC Level ${request.cmmcLevel}:

Identified Gaps:
${gapSummary}

${request.availableResources ? `Available Resources: ${request.availableResources}` : ""}
${request.targetDate ? `Target Date: ${request.targetDate.toDateString()}` : ""}

Create a comprehensive, phase-based roadmap:

1. **Roadmap Overview**
   - Total timeline
   - Number of phases
   - Major milestones
   - Success criteria

2. **Phase Breakdown**
   For each phase, provide:
   - Phase name and duration
   - Controls/gaps addressed
   - Specific action items
   - Responsible roles
   - Dependencies
   - Deliverables
   - Success metrics

3. **Timeline**
   - Start and end dates for each phase
   - Key milestones with dates
   - Review/checkpoint dates
   - Buffer time for issues

4. **Resource Allocation**
   - Staff hours per phase
   - Budget per phase
   - Tools/software needed
   - Training requirements
   - External help needed

5. **Dependencies**
   - What must be done first
   - Parallel work streams
   - External dependencies
   - Procurement timelines

6. **Risk Management**
   - Potential delays
   - Resource constraints
   - Technical challenges
   - Mitigation strategies
   - Contingency plans

7. **Progress Tracking**
   - KPIs to monitor
   - Reporting cadence
   - Adjustment triggers
   - Escalation criteria

8. **Quick Wins**
   - Items that can be done this week
   - High impact, low effort tasks
   - Morale boosters

Provide a realistic, achievable roadmap that can be implemented starting today.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Compare current state to target CMMC level
   */
  async compareToTarget(request: {
    currentLevel: 0 | 1 | 2;
    targetLevel: 1 | 2 | 3;
    implementedControls: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Compare current compliance state to target CMMC Level ${request.targetLevel}:

Current Level: ${request.currentLevel === 0 ? "Not certified" : `Level ${request.currentLevel}`}
Target Level: Level ${request.targetLevel}

Currently Implemented Controls:
${request.implementedControls.map((c) => `- ${c}`).join("\n")}

Provide detailed comparison:

1. **Level Requirements**
   - What Level ${request.targetLevel} requires
   - Difference from Level ${request.currentLevel}
   - Additional practices needed
   - Enhanced requirements

2. **Gap Summary**
   - Total new controls needed
   - Controls to enhance
   - New control families
   - Documentation requirements

3. **Upgrade Path**
   - Step-by-step upgrade approach
   - Building on current implementation
   - Leveraging existing controls
   - Minimizing rework

4. **Effort Analysis**
   - Estimated total effort
   - Complexity assessment
   - Resource requirements
   - Timeline estimate

5. **Cost Implications**
   - Technology investments
   - Process changes
   - Training needs
   - Assessment costs

6. **Benefits**
   - Contract opportunities
   - Competitive advantages
   - Security improvements
   - Risk reduction

7. **Decision Factors**
   - Is the upgrade worth it?
   - Recommended timing
   - Phased vs. all-at-once
   - Certification strategy

Help the organization make an informed decision about pursuing Level ${request.targetLevel}.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Assess specific control family
   */
  async assessControlFamily(request: {
    family: string; // e.g., "Access Control (AC)"
    cmmcLevel: 1 | 2 | 3;
    currentImplementation?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Assess the ${request.family} control family for CMMC Level ${request.cmmcLevel}:

${request.currentImplementation ? `Current Implementation:\n${request.currentImplementation}\n` : ""}

Provide detailed assessment:

1. **Family Overview**
   - Purpose of this control family
   - Number of practices at Level ${request.cmmcLevel}
   - Key requirements
   - Common challenges

2. **Practice-by-Practice Analysis**
   - List each required practice
   - Current implementation status
   - Gaps identified
   - Implementation difficulty

3. **Common Implementations**
   - Typical solutions for this family
   - Technology recommendations
   - Process recommendations
   - Documentation needed

4. **Interdependencies**
   - Related control families
   - Shared implementations
   - Combined solutions
   - Efficiency opportunities

5. **Evidence Requirements**
   - What evidence is needed
   - How to collect it
   - Quality criteria
   - Common evidence gaps

6. **Remediation Plan**
   - Priority order for implementation
   - Estimated timeline
   - Resource needs
   - Quick wins

7. **Assessor Focus Areas**
   - What C3PAOs scrutinize most
   - Common findings in this family
   - How to prepare
   - Red flags to avoid

Provide actionable guidance specific to the ${request.family} family.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate gap closure tracking
   */
  async generateTracker(request: {
    cmmcLevel: 1 | 2 | 3;
    gaps: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Generate a gap closure tracking system for CMMC Level ${request.cmmcLevel}:

Gaps to Track:
${request.gaps.map((g) => `- ${g}`).join("\n")}

Create a comprehensive tracking framework:

1. **Tracking Spreadsheet Design**
   - Columns to include
   - Status categories
   - Progress metrics
   - Responsible parties
   - Due dates
   - Dependencies

2. **Progress Metrics**
   - KPIs to track
   - Calculation methods
   - Target values
   - Reporting frequency

3. **Status Definitions**
   - Not Started
   - In Progress (with %)
   - Blocked (with reason)
   - Complete
   - Verified

4. **Review Process**
   - Weekly review items
   - Monthly review items
   - Quarterly assessments
   - Who should review

5. **Reporting**
   - Executive dashboard format
   - Status report template
   - Escalation criteria
   - Stakeholder communication

6. **Risk Tracking**
   - How to track risks
   - Risk mitigation status
   - Impact assessment
   - Contingency activation

7. **Automation Opportunities**
   - What can be automated
   - Tools to use
   - Integration points
   - Reporting automation

Provide templates and examples that can be used immediately.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
