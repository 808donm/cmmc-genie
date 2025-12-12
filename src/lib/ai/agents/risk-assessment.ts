/**
 * Risk Assessment Agent
 *
 * Performs cybersecurity risk assessments and develops mitigation strategies
 * for CMMC compliance
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const RISK_ASSESSMENT_SYSTEM_PROMPT = `You are the Risk Assessment Agent for CMMC Genie, an expert in cybersecurity risk assessment, NIST Risk Management Framework (RMF), and CMMC risk-based approach.

## Your Role

You help organizations:
- Identify and catalog information assets
- Assess threats and vulnerabilities
- Calculate and prioritize risks
- Develop risk mitigation strategies
- Maintain risk registers
- Support risk-based decision making
- Align with CMMC risk requirements

## CMMC Risk Assessment Requirements

### RA Controls (NIST SP 800-171)

**RA.2.136**: Periodically assess the risk
**RA.2.137**: Scan for vulnerabilities
**RA.2.138**: Remediate vulnerabilities
**RA.3.139**: Perform risk assessments (enhanced for Level 3)

### Risk-Based Approach

CMMC emphasizes risk-based cybersecurity:
- Understand your assets and their value
- Identify threats to those assets
- Assess vulnerabilities
- Determine likelihood and impact
- Prioritize controls based on risk
- Accept, mitigate, transfer, or avoid risks

## Risk Assessment Methodology

### 1. Asset Identification
- Identify all information assets
- Classify by sensitivity (CUI, Proprietary, Public)
- Determine business criticality
- Map dependencies
- Identify owners

### 2. Threat Identification
Common threats:
- Nation-state actors (APT)
- Cybercriminals
- Hacktivists
- Insiders (malicious or negligent)
- Natural disasters
- System failures
- Supply chain compromises

### 3. Vulnerability Assessment
- Technical vulnerabilities (CVEs)
- Process weaknesses
- Human factors
- Physical security gaps
- Third-party risks

### 4. Likelihood Assessment
Rate probability (1-5):
1. Very Low: < 10% chance in next year
2. Low: 10-30% chance
3. Medium: 30-50% chance
4. High: 50-75% chance
5. Very High: > 75% chance

Consider:
- Threat capability and intent
- Vulnerability severity
- Existing controls
- Historical data
- Industry trends

### 5. Impact Assessment
Rate impact (1-5):
1. Minimal: Negligible impact
2. Low: Minor disruption, minimal cost
3. Medium: Moderate disruption, manageable cost
4. High: Significant disruption, substantial cost
5. Critical: Severe disruption, major cost, mission failure

Consider impact to:
- Confidentiality (data breach)
- Integrity (data modification)
- Availability (service disruption)
- Financial (direct/indirect costs)
- Reputation (customer/partner trust)
- Compliance (regulatory penalties)
- Operations (business continuity)

### 6. Risk Calculation

**Risk Score = Likelihood × Impact**

Risk Matrix:
- 1-4: Low Risk (Accept, monitor)
- 5-9: Medium Risk (Mitigate)
- 10-15: High Risk (Mitigate immediately)
- 16-25: Critical Risk (Mitigate urgently, escalate)

## Risk Treatment Options

### Accept
- Risk within acceptable tolerance
- Cost of mitigation exceeds risk
- Residual risk after controls
- Document acceptance and rationale

### Mitigate
- Implement controls to reduce likelihood
- Implement controls to reduce impact
- Defense in depth
- Most common response

### Transfer
- Cyber insurance
- Outsource to managed service
- Contractual transfer
- Doesn't eliminate risk, shares it

### Avoid
- Don't perform risky activity
- Eliminate the asset
- Change business process
- Last resort, often not practical

## Risk Register Components

For each risk, document:
- Risk ID
- Asset affected
- Threat source
- Vulnerability exploited
- Likelihood rating
- Impact rating
- Risk score
- Existing controls
- Residual risk
- Treatment decision
- Mitigation plan
- Owner
- Status
- Review date

## Qualitative vs. Quantitative

### Qualitative (Recommended for most)
- Likelihood: Very Low to Very High
- Impact: Minimal to Critical
- Risk: Low, Medium, High, Critical
- Faster, easier, sufficient for CMMC

### Quantitative (Advanced)
- Likelihood: Percentage probability
- Impact: Dollar amount (SLE - Single Loss Expectancy)
- Risk: ALE (Annual Loss Expectancy) = SLE × ARO
- More precise but requires more data

## Risk Scenarios

Common scenarios to assess:
- Ransomware attack
- Data breach / CUI exfiltration
- Insider data theft
- Phishing campaign
- DDoS attack
- Supply chain compromise
- Physical theft of devices
- Natural disaster
- System failure
- Human error (accidental)

## Risk Appetite

Define organization's risk tolerance:
- Risk appetite statement
- Acceptable risk levels
- Escalation thresholds
- Approval authority levels
- Risk acceptance criteria

## Your Output Format

When conducting risk assessments:

1. **Asset Inventory**: What we're protecting
2. **Threat Landscape**: What we're protecting against
3. **Vulnerability Analysis**: Our weaknesses
4. **Risk Calculation**: Likelihood × Impact
5. **Risk Prioritization**: What to address first
6. **Mitigation Recommendations**: How to reduce risk
7. **Residual Risk**: Remaining risk after controls
8. **Action Plan**: Who does what by when

Be practical and risk-based - perfect security is impossible, focus on managing risk to acceptable levels.`;

export class RiskAssessmentAgent extends BaseAgent {
  constructor() {
    super("RISK_ASSESSMENT", RISK_ASSESSMENT_SYSTEM_PROMPT);
  }

  /**
   * Perform comprehensive risk assessment
   */
  async performAssessment(request: {
    organizationDescription: string;
    assets?: string[];
    knownVulnerabilities?: string[];
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Perform comprehensive cybersecurity risk assessment:

Organization: ${request.organizationDescription}
Target CMMC Level: ${request.cmmcLevel}

${request.assets?.length ? `Key Assets:\n${request.assets.map((a) => `- ${a}`).join("\n")}` : ""}
${request.knownVulnerabilities?.length ? `\nKnown Vulnerabilities:\n${request.knownVulnerabilities.map((v) => `- ${v}`).join("\n")}` : ""}

Conduct comprehensive risk assessment:

1. **Assessment Overview**
   - Scope and boundaries
   - Methodology used
   - Assessment date
   - Assessor(s)
   - Next review date

2. **Asset Inventory**
   - Information assets
   - System assets
   - Physical assets
   - Personnel assets
   - Asset classification (CUI, Proprietary, Public)
   - Asset criticality (Critical, High, Medium, Low)
   - Asset owners

3. **Threat Landscape**
   - Relevant threat actors
   - Threat capabilities
   - Threat motivations
   - Recent incidents (industry)
   - Emerging threats

4. **Vulnerability Analysis**
   For each major vulnerability:
   - Vulnerability description
   - Affected assets
   - Severity rating (Critical/High/Medium/Low)
   - Exploitability
   - Existing controls (if any)

5. **Risk Scenarios** (Identify 10-15 key scenarios)
   For each scenario:
   - Risk ID
   - Scenario description
   - Asset affected
   - Threat source
   - Vulnerability exploited
   - Likelihood (1-5)
   - Impact (1-5)
   - Risk Score (Likelihood × Impact)
   - Risk Level (Critical/High/Medium/Low)

6. **Risk Prioritization**
   - Critical risks (16-25 score)
   - High risks (10-15 score)
   - Medium risks (5-9 score)
   - Low risks (1-4 score)

7. **Current Controls**
   - Existing security controls
   - Control effectiveness
   - Control gaps
   - Residual risks

8. **Mitigation Recommendations**
   For each critical/high risk:
   - Recommended controls
   - Implementation priority
   - Estimated cost
   - Estimated effort
   - Risk reduction expected
   - CMMC controls addressed

9. **Residual Risk Analysis**
   - Risks after proposed mitigations
   - Acceptable residual risks
   - Risks requiring acceptance
   - Risks requiring further action

10. **Risk Treatment Plan**
    - Risks to mitigate (with timeline)
    - Risks to accept (with justification)
    - Risks to transfer (insurance, etc.)
    - Risks to avoid (discontinue activity)

11. **Action Plan**
    - Priority 1 (0-30 days)
    - Priority 2 (30-60 days)
    - Priority 3 (60-90 days)
    - Priority 4 (90+ days)
    - Responsible parties
    - Budget requirements

12. **Risk Metrics**
    - Total risks identified
    - Risk score distribution
    - Top 10 risks
    - Risk trends
    - Control effectiveness

Provide data-driven, actionable risk assessment.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Assess specific risk scenario
   */
  async assessScenario(request: {
    scenario: string;
    assetDescription: string;
    existingControls?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Assess specific risk scenario:

Scenario: ${request.scenario}

Asset: ${request.assetDescription}

${request.existingControls ? `Existing Controls:\n${request.existingControls}` : "No controls currently in place"}

Perform detailed scenario analysis:

1. **Scenario Overview**
   - Full scenario description
   - Attack sequence
   - Threat actor profile
   - Motivation and capability

2. **Asset Analysis**
   - Asset value and criticality
   - Asset dependencies
   - Asset vulnerabilities
   - Current protections

3. **Threat Analysis**
   - Threat source characteristics
   - Threat capability assessment
   - Threat intent and motivation
   - Historical precedent

4. **Vulnerability Analysis**
   - Specific vulnerabilities that enable this scenario
   - Exploitability assessment
   - Detection difficulty
   - Time to exploit

5. **Likelihood Assessment (1-5)**
   - Probability rating
   - Justification for rating
   - Contributing factors
   - Indicators that increase/decrease likelihood

6. **Impact Assessment (1-5)**
   - Confidentiality impact
   - Integrity impact
   - Availability impact
   - Financial impact (estimated)
   - Operational impact
   - Reputational impact
   - Compliance impact
   - Overall impact rating with justification

7. **Risk Calculation**
   - Likelihood score
   - Impact score
   - Risk score (L × I)
   - Risk level (Critical/High/Medium/Low)
   - Risk tolerance assessment

8. **Existing Control Assessment**
   - Controls in place
   - Control effectiveness
   - Control gaps
   - Residual risk with current controls

9. **Mitigation Recommendations**
   - Preventive controls (reduce likelihood)
   - Detective controls (improve detection)
   - Responsive controls (reduce impact)
   - Prioritized by cost/benefit

10. **Residual Risk**
    - Risk after proposed mitigations
    - Is residual risk acceptable?
    - Additional considerations
    - Ongoing monitoring needed

11. **Implementation Plan**
    - Quick wins (immediate)
    - Short-term (30-60 days)
    - Long-term (60+ days)
    - Estimated costs
    - Resource requirements

Provide thorough analysis with specific, actionable recommendations.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create risk register
   */
  async createRiskRegister(request: {
    organizationType: string;
    cmmcLevel: 1 | 2 | 3;
    includeExamples?: boolean;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create risk register template for ${request.organizationType}:

CMMC Level: ${request.cmmcLevel}
${request.includeExamples ? "Include example risks for this organization type" : ""}

Design comprehensive risk register:

1. **Register Structure**
   - Required fields
   - Optional fields
   - Data types and formats
   - Validation rules

2. **Risk Register Fields**
   - Risk ID (auto-generated)
   - Risk Title
   - Risk Description
   - Asset Affected
   - Threat Source
   - Vulnerability
   - Likelihood (1-5)
   - Impact (1-5)
   - Risk Score
   - Risk Level (Critical/High/Medium/Low)
   - Current Controls
   - Control Effectiveness
   - Residual Risk Score
   - Treatment Decision (Mitigate/Accept/Transfer/Avoid)
   - Mitigation Plan
   - Owner
   - Status (Identified/Analyzing/Treating/Monitoring/Closed)
   - Date Identified
   - Target Closure Date
   - Last Review Date
   - Next Review Date
   - Notes

3. **Risk Classification**
   - Risk categories (Technical, Operational, Compliance, etc.)
   - CMMC control family mapping
   - Asset type tagging
   - Custom taxonomy

4. **Scoring Methodology**
   - Likelihood scale definitions
   - Impact scale definitions
   - Risk calculation formula
   - Risk level thresholds

5. **Workflow Process**
   - Risk identification
   - Risk analysis
   - Risk treatment
   - Approval process
   - Review cycle
   - Closure criteria

6. **Reporting Views**
   - By risk level
   - By owner
   - By asset
   - By control family
   - By status
   - Top 10 risks
   - Risk trends

7. **Metrics and KPIs**
   - Total active risks
   - Risk distribution (by level)
   - Average time to mitigate
   - Overdue mitigations
   - Accepted risks
   - Control effectiveness

8. **Governance**
   - Risk owner responsibilities
   - Review frequency by risk level
   - Escalation criteria
   - Approval authorities
   - Documentation requirements

${request.includeExamples ? `\n9. **Example Risks**\n   Provide 10-15 example risks relevant to ${request.organizationType}:\n   - Complete all fields\n   - Cover various risk levels\n   - Different risk categories\n   - Realistic scenarios` : ""}

10. **Implementation Guide**
    - How to populate register
    - Tools to use (spreadsheet, GRC platform)
    - Training requirements
    - Maintenance procedures

Provide ready-to-use risk register template.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Develop mitigation strategy
   */
  async developMitigation(request: {
    riskDescription: string;
    currentRiskScore: number;
    targetRiskScore: number;
    budget?: string;
    timeline?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Develop risk mitigation strategy:

Risk: ${request.riskDescription}

Current Risk Score: ${request.currentRiskScore}
Target Risk Score: ${request.targetRiskScore}
${request.budget ? `Budget: ${request.budget}` : "Budget: Not specified"}
${request.timeline ? `Timeline: ${request.timeline}` : "Timeline: Flexible"}

Create comprehensive mitigation plan:

1. **Risk Analysis**
   - Current state assessment
   - Gap to target state
   - Risk reduction needed
   - Factors to address

2. **Mitigation Strategy**
   - Overall approach
   - Risk reduction method (reduce likelihood/impact)
   - Layered defense strategy
   - Quick wins vs. long-term

3. **Control Recommendations**
   For each recommended control:
   - Control description
   - Control type (Preventive/Detective/Corrective)
   - Implementation complexity (Low/Medium/High)
   - Estimated cost
   - Risk reduction impact
   - CMMC controls addressed
   - Dependencies

4. **Prioritized Implementation Plan**
   - Phase 1 (Immediate - 0-30 days)
     - Quick wins
     - High-impact, low-effort controls
     - Actions and deliverables
   - Phase 2 (Short-term - 30-60 days)
     - Medium complexity controls
     - Foundation building
   - Phase 3 (Long-term - 60+ days)
     - Complex implementations
     - Process maturity
     - Continuous improvement

5. **Resource Requirements**
   - Staff time needed
   - Skills required
   - Tools/technology needed
   - External services (consultants, etc.)
   - Total cost estimate

6. **Implementation Steps**
   For each phase:
   - Specific tasks
   - Responsible parties
   - Dependencies
   - Success criteria
   - Verification methods

7. **Expected Risk Reduction**
   - Likelihood reduction
   - Impact reduction
   - Projected new risk score
   - Residual risk assessment

8. **Cost-Benefit Analysis**
   - Total investment
   - Risk reduction value
   - ROI calculation
   - Intangible benefits

9. **Success Metrics**
   - How to measure effectiveness
   - KPIs to track
   - Target values
   - Monitoring frequency

10. **Risks to Mitigation Plan**
    - Implementation risks
    - Resource constraints
    - Technical challenges
    - Mitigation of mitigations

11. **Alternative Approaches**
    - Other options considered
    - Pros/cons comparison
    - Why recommended approach is best

Provide actionable, realistic mitigation plan that achieves target risk reduction.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Calculate risk score
   */
  async calculateRisk(request: {
    likelihood: 1 | 2 | 3 | 4 | 5;
    impact: 1 | 2 | 3 | 4 | 5;
    riskDescription: string;
    context?: any;
  }): Promise<AgentResponse> {
    const riskScore = request.likelihood * request.impact;
    let riskLevel: string;
    if (riskScore >= 16) riskLevel = "Critical";
    else if (riskScore >= 10) riskLevel = "High";
    else if (riskScore >= 5) riskLevel = "Medium";
    else riskLevel = "Low";

    const prompt = `Analyze risk calculation:

Risk: ${request.riskDescription}

Likelihood: ${request.likelihood}/5
Impact: ${request.impact}/5
Risk Score: ${riskScore}
Risk Level: ${riskLevel}

Provide detailed risk analysis:

1. **Risk Calculation**
   - Likelihood score: ${request.likelihood}
   - Impact score: ${request.impact}
   - Risk score: ${riskScore} (Likelihood × Impact)
   - Risk level: ${riskLevel}

2. **Likelihood Justification**
   - Why ${request.likelihood}/5 rating?
   - Factors increasing likelihood
   - Factors decreasing likelihood
   - Historical precedent
   - Industry trends

3. **Impact Justification**
   - Why ${request.impact}/5 rating?
   - Potential consequences
   - Business impact areas
   - Financial impact estimate
   - Recovery time objective

4. **Risk Level Interpretation**
   - What ${riskLevel} risk means
   - Response urgency
   - Resource allocation
   - Management attention needed
   - Typical treatment approach

5. **Treatment Recommendations**
   - Recommended risk treatment (Mitigate/Accept/Transfer/Avoid)
   - Rationale for recommendation
   - Priority for action
   - Timeline for treatment
   - Success criteria

6. **Mitigation Impact**
   - How much could risk be reduced?
   - Target likelihood after controls
   - Target impact after controls
   - Target risk score
   - Target risk level

7. **Acceptance Criteria**
   - Is this risk acceptable as-is?
   - If yes, why?
   - If no, what level would be acceptable?
   - Risk appetite alignment

8. **Monitoring Requirements**
   - How to monitor this risk
   - Indicators to track
   - Review frequency
   - Escalation triggers

Provide thorough analysis of this specific risk calculation.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Review risk management program
   */
  async reviewProgram(request: {
    programDescription: string;
    riskCount?: number;
    lastAssessment?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Review risk management program:

Program Description:
${request.programDescription}

${request.riskCount ? `Total Risks in Register: ${request.riskCount}` : ""}
${request.lastAssessment ? `Last Risk Assessment: ${request.lastAssessment}` : ""}

Provide comprehensive program review:

1. **Program Maturity Assessment**
   - Maturity level (Initial/Developing/Defined/Managed/Optimizing)
   - Strengths
   - Weaknesses
   - Benchmark against best practices

2. **Process Effectiveness**
   - Risk identification process
   - Risk analysis process
   - Risk treatment process
   - Monitoring process
   - Review and update process

3. **Risk Register Quality**
   - Completeness
   - Currency (up-to-date?)
   - Risk description quality
   - Scoring consistency
   - Treatment plan adequacy

4. **Governance and Oversight**
   - Clear ownership
   - Management involvement
   - Board reporting
   - Accountability
   - Decision authority

5. **Integration with CMMC**
   - Alignment with CMMC requirements
   - Coverage of control families
   - Gap analysis
   - Evidence quality

6. **Tools and Technology**
   - Tools in use
   - Tool effectiveness
   - Automation opportunities
   - Integration gaps

7. **Metrics and Reporting**
   - KPIs tracked
   - Report quality
   - Stakeholder value
   - Trend analysis

8. **Resource Adequacy**
   - Staff expertise
   - Time allocation
   - Budget sufficiency
   - Training needs

9. **Continuous Improvement**
   - Lessons learned process
   - Program updates
   - Industry awareness
   - Emerging threats

10. **Gaps and Recommendations**
    - Critical gaps identified
    - Quick wins
    - Medium-term improvements
    - Long-term enhancements
    - Priority ranking

11. **Compliance Assessment**
    - NIST SP 800-171 RA controls
    - CMMC requirements
    - Regulatory obligations
    - Industry standards

12. **Action Plan**
    - Immediate actions (this month)
    - Short-term (this quarter)
    - Long-term (this year)
    - Responsible parties
    - Success metrics

Provide honest, constructive assessment with actionable recommendations.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
