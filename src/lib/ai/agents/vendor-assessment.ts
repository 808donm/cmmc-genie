/**
 * Vendor Assessment Agent
 *
 * Evaluates third-party vendors for CMMC compliance and supply chain security
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const VENDOR_ASSESSMENT_SYSTEM_PROMPT = `You are the Vendor Assessment Agent for CMMC Genie, an expert in third-party vendor risk assessment and supply chain security for CMMC compliance.

## Your Role

You help organizations:
- Assess vendor security posture and CMMC compliance
- Generate vendor security questionnaires
- Evaluate vendor risk levels
- Create vendor management programs
- Draft contract security requirements
- Track vendor compliance status
- Manage supply chain risk

## CMMC Vendor Requirements

Organizations pursuing CMMC certification must:
- Flow down DFARS 252.204-7012 to subcontractors handling CUI
- Assess and monitor contractor compliance
- Include security requirements in contracts
- Verify vendor implementations
- Maintain vendor risk assessments
- Document vendor relationships

### Key DFARS Clauses

**DFARS 252.204-7012**: Safeguarding Covered Defense Information and Cyber Incident Reporting
- Contractors must implement NIST SP 800-171
- Must report cyber incidents within 72 hours
- Must preserve and protect incident data
- Flows down to subcontractors

**DFARS 252.204-7019**: Notice of NIST SP 800-171 DoD Assessment Requirements
- Notification of upcoming DoD assessments
- Requirement to have assessment completed
- Subject to CMMC assessments

**DFARS 252.204-7020**: NIST SP 800-171 DoD Assessment Requirements
- Submit assessment scores to DoD
- Medium and high assessments by DoD or C3PAO
- Self-assessments for basic level

## Vendor Risk Levels

### Critical Risk
- Direct access to CUI
- Processes or stores CDI
- Part of Federal Contract Information system
- Significant integration with systems
- High dependency for operations

### High Risk
- Limited CUI access
- Processes non-CUI contract data
- Moderate system integration
- Important but not critical vendor
- Financial services access

### Medium Risk
- No CUI access
- Standard commercial services
- Limited system access
- Easily replaceable
- Low data sensitivity

### Low Risk
- No data access
- Physical goods only
- No system connectivity
- Commodity suppliers
- Minimal business impact

## Vendor Assessment Areas

### 1. Security Posture
- CMMC certification status
- NIST SP 800-171 compliance
- Security certifications (ISO 27001, SOC 2)
- Incident history
- Security program maturity

### 2. Technical Controls
- Access controls
- Encryption practices
- Network security
- Endpoint protection
- Vulnerability management
- Patch management

### 3. Operational Security
- Background checks
- Security training
- Incident response capability
- Business continuity
- Disaster recovery
- Change management

### 4. Compliance & Legal
- Regulatory compliance
- Contract terms review
- Insurance coverage
- Data ownership
- Subcontractor management
- Right to audit

### 5. Supply Chain
- Subcontractor vetting
- Geographic considerations
- Component sourcing
- Vendor dependencies
- Continuity planning

## Vendor Questionnaire Types

### Basic Security Questionnaire (Low/Medium Risk)
- 20-30 questions
- Yes/No with comments
- Focus on basics
- Self-attested
- Annual review

### Comprehensive Assessment (High/Critical Risk)
- 100+ questions
- Detailed evidence required
- Technical validation
- On-site assessment option
- Quarterly reviews

### CMMC-Specific Questionnaire
- All 110 practices (Level 2)
- Evidence requirements
- Implementation details
- Assessment scores
- Certification status

## Contract Security Requirements

Include in vendor contracts:
- **Security Requirements**: Specific controls to implement
- **Compliance Obligations**: CMMC, NIST SP 800-171
- **Incident Reporting**: Timeframes and procedures
- **Right to Audit**: Access for compliance verification
- **Data Handling**: Storage, transmission, disposal
- **Subcontractor Flow-Down**: Requirements for subs
- **Insurance**: Cyber liability coverage
- **Indemnification**: Liability for breaches
- **Termination Rights**: For security violations

## Vendor Monitoring

### Continuous Monitoring Activities:
- Quarterly compliance reviews
- Annual security assessments
- Incident tracking and reporting
- Contract compliance verification
- Risk score updates
- Performance metrics
- Relationship health checks

### Red Flags:
- ⚠️ No CMMC certification (if required)
- ⚠️ Recent security incidents
- ⚠️ Poor incident response
- ⚠️ Lack of documentation
- ⚠️ Resistance to audits
- ⚠️ Inadequate insurance
- ⚠️ Unstable financials
- ⚠️ High employee turnover

## Your Output Format

When assessing vendors, provide:

1. **Risk Classification**: Critical/High/Medium/Low
2. **Security Posture Summary**: Overall assessment
3. **Strengths**: What they do well
4. **Weaknesses**: Areas of concern
5. **Gaps**: Missing controls or documentation
6. **Recommendations**: Specific improvements needed
7. **Contract Requirements**: What to include in contracts
8. **Monitoring Plan**: Ongoing oversight activities
9. **Approval Recommendation**: Approve/Conditional/Reject

Be thorough but practical - perfect security is impossible, focus on risk-appropriate controls.`;

export class VendorAssessmentAgent extends BaseAgent {
  constructor() {
    super("VENDOR_ASSESSMENT", VENDOR_ASSESSMENT_SYSTEM_PROMPT);
  }

  /**
   * Generate vendor security questionnaire
   */
  async generateQuestionnaire(request: {
    vendorType: string;
    riskLevel: "critical" | "high" | "medium" | "low";
    cuiAccess: boolean;
    cmmcLevel?: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Generate a vendor security questionnaire for:

Vendor Type: ${request.vendorType}
Risk Level: ${request.riskLevel}
CUI Access: ${request.cuiAccess ? "Yes" : "No"}
${request.cmmcLevel ? `CMMC Level Required: ${request.cmmcLevel}` : ""}

Create a comprehensive questionnaire including:

1. **Questionnaire Overview**
   - Purpose and scope
   - Completion instructions
   - Scoring methodology
   - Required evidence

2. **Company Information Section** (5-10 questions)
   - Basic company details
   - Certifications held
   - Customer references
   - Years in business
   - Employee count

3. **Security Program Section** (10-20 questions)
   - Security policies
   - Security team structure
   - Training programs
   - Incident history
   - Audit results

4. **Technical Controls Section** (20-40 questions based on risk)
   - Access control
   - Encryption
   - Network security
   - Endpoint protection
   - Logging and monitoring
   - Vulnerability management

5. **CMMC/NIST SP 800-171 Section** (if CUI access)
   - Certification status
   - Assessment scores
   - Implementation timeline
   - Evidence requirements

6. **Operational Security Section** (15-25 questions)
   - Background checks
   - Physical security
   - Business continuity
   - Disaster recovery
   - Change management

7. **Compliance Section** (10-15 questions)
   - Regulatory compliance
   - Data privacy
   - Subcontractor management
   - Insurance coverage

8. **Scoring Guide**
   - How to score responses
   - Weighting by category
   - Pass/fail thresholds
   - Risk calculation

For each question, provide:
- Question text
- Answer format (Yes/No, Multiple choice, Descriptive)
- Evidence required
- Scoring criteria
- Why it matters

Tailor complexity to the ${request.riskLevel} risk level.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Assess vendor responses
   */
  async assessVendor(request: {
    vendorName: string;
    vendorType: string;
    questionnaireResponses: string;
    riskLevel: "critical" | "high" | "medium" | "low";
    cuiAccess: boolean;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Assess the following vendor:

Vendor: ${request.vendorName}
Type: ${request.vendorType}
Risk Level: ${request.riskLevel}
CUI Access: ${request.cuiAccess ? "Yes" : "No"}

Questionnaire Responses:
${request.questionnaireResponses}

Provide comprehensive vendor assessment:

1. **Executive Summary**
   - Overall risk rating (Acceptable/Concerning/Unacceptable)
   - Key findings (top 3 strengths, top 3 concerns)
   - Recommendation (Approve/Conditional Approval/Reject)

2. **Detailed Analysis**
   - Security posture evaluation
   - CMMC compliance status (if applicable)
   - Technical controls assessment
   - Operational maturity
   - Compliance standing

3. **Strengths**
   - What the vendor does well
   - Positive indicators
   - Competitive advantages

4. **Weaknesses and Gaps**
   - Areas of concern
   - Missing controls
   - Documentation gaps
   - Implementation issues

5. **Risk Assessment**
   - Specific risks identified
   - Likelihood and impact
   - Residual risk after mitigations
   - Acceptable risk level?

6. **Requirements for Approval** (if conditional)
   - Must-have improvements
   - Timeline for remediation
   - Evidence needed
   - Re-assessment criteria

7. **Contract Requirements**
   - Security clauses to include
   - Performance metrics
   - Audit rights
   - Incident reporting obligations

8. **Monitoring Plan**
   - Review frequency
   - Metrics to track
   - Escalation triggers
   - Re-assessment schedule

9. **Alternative Considerations**
   - Should we find another vendor?
   - Can we mitigate risks?
   - Cost vs. risk trade-off

Provide specific, actionable recommendations.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate contract security requirements
   */
  async generateContractRequirements(request: {
    vendorType: string;
    cuiHandling: boolean;
    riskLevel: "critical" | "high" | "medium" | "low";
    specificNeeds?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Generate contract security requirements for:

Vendor Type: ${request.vendorType}
Handles CUI: ${request.cuiHandling ? "Yes" : "No"}
Risk Level: ${request.riskLevel}
${request.specificNeeds ? `Specific Needs: ${request.specificNeeds}` : ""}

Create comprehensive contract security clauses:

1. **Security Requirements Section**
   - Specific controls vendor must implement
   - Standards to comply with (CMMC, NIST SP 800-171)
   - Security program requirements
   - Training obligations

2. **Data Protection Section**
   - Data handling requirements
   - Encryption requirements
   - Storage limitations
   - Transmission security
   - Data retention and disposal

3. **Access Control Section**
   - Who can access systems/data
   - Authentication requirements
   - Monitoring and logging
   - Access termination

4. **Incident Response Section**
   - Incident definition
   - Notification timeframes (recommend 24-72 hours)
   - Response obligations
   - Investigation cooperation
   - Remediation requirements

5. **Compliance and Audit Section**
   - Right to audit clause
   - Frequency of audits
   - Access to records
   - Certification requirements
   - Self-assessment obligations

6. **Subcontractor Management Section**
   - Flow-down requirements
   - Prior approval needed
   - Same security standards
   - Liability for subcontractors

7. **Insurance Section**
   - Cyber liability insurance
   - Coverage amounts (recommend $2-5M for critical vendors)
   - Certificate of insurance
   - Update notifications

8. **Breach and Liability Section**
   - Definition of breach
   - Liability limits
   - Indemnification
   - Costs allocation

9. **Termination Section**
   - Termination for security violations
   - Data return/destruction
   - Transition assistance
   - Ongoing obligations

10. **DFARS Flow-Down** (if handling CUI)
    - Complete DFARS 252.204-7012 text
    - Compliance certification
    - Reporting requirements

Provide ready-to-use contract language with explanations.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create vendor risk management program
   */
  async createVendorProgram(request: {
    organizationSize: "small" | "medium" | "large";
    vendorCount?: number;
    industryType?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create a vendor risk management program for:

Organization Size: ${request.organizationSize}
${request.vendorCount ? `Estimated Vendors: ${request.vendorCount}` : ""}
${request.industryType ? `Industry: ${request.industryType}` : ""}

Design comprehensive vendor management program:

1. **Program Overview**
   - Purpose and objectives
   - Scope and applicability
   - Roles and responsibilities
   - Governance structure

2. **Vendor Classification Framework**
   - Risk level criteria
   - Classification methodology
   - Review frequency by tier
   - Assessment depth by tier

3. **Vendor Onboarding Process**
   - Initial risk assessment
   - Security questionnaire
   - Contract negotiation
   - Approval workflow
   - Onboarding checklist

4. **Assessment Procedures**
   - Questionnaire templates (by risk level)
   - Scoring methodology
   - Evidence evaluation
   - On-site assessment criteria
   - Third-party validation

5. **Contract Management**
   - Standard security clauses
   - Insurance requirements
   - Audit rights
   - Performance metrics
   - Renewal process

6. **Ongoing Monitoring**
   - Continuous monitoring activities
   - Performance metrics
   - Incident tracking
   - Compliance verification
   - Relationship reviews

7. **Vendor Lifecycle**
   - Onboarding
   - Active management
   - Performance reviews
   - Contract renewals
   - Offboarding procedures

8. **Documentation Requirements**
   - Vendor inventory
   - Risk assessments
   - Questionnaire responses
   - Audit reports
   - Incident records
   - Performance metrics

9. **Metrics and Reporting**
   - Key metrics to track
   - Reporting dashboards
   - Executive reporting
   - Trend analysis

10. **Remediation and Escalation**
    - Issue identification
    - Remediation plans
    - Escalation triggers
    - Termination criteria

Provide practical, implementable program suitable for ${request.organizationSize} organization.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Evaluate vendor incident
   */
  async evaluateIncident(request: {
    vendorName: string;
    incidentDescription: string;
    cuiImpacted: boolean;
    vendorResponse?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Evaluate vendor security incident:

Vendor: ${request.vendorName}
CUI Impacted: ${request.cuiImpacted ? "Yes" : "No"}

Incident Description:
${request.incidentDescription}

${request.vendorResponse ? `Vendor Response:\n${request.vendorResponse}` : ""}

Provide incident evaluation:

1. **Incident Severity Assessment**
   - Severity level (Critical/High/Medium/Low)
   - Scope of impact
   - Data potentially compromised
   - Systems affected

2. **Vendor Response Evaluation**
   - Timeliness of notification
   - Completeness of information
   - Response actions taken
   - Transparency and cooperation

3. **Root Cause Analysis**
   - What happened
   - How it happened
   - Why controls failed
   - Preventability assessment

4. **Impact to Our Organization**
   - Direct impact
   - Downstream risks
   - Regulatory implications
   - Reputational concerns

5. **Required Actions**
   - Immediate actions
   - Investigation needs
   - Notification obligations (DoD, customers)
   - Evidence preservation

6. **Vendor Accountability**
   - Contract obligations met?
   - Insurance claims
   - Liability assessment
   - Financial impact

7. **Remediation Requirements**
   - What vendor must do
   - Timeline for remediation
   - Verification needed
   - Corrective action plan

8. **Relationship Assessment**
   - Continue relationship?
   - Increase monitoring?
   - Reduce dependency?
   - Find alternative vendor?

9. **Lessons Learned**
   - What to change in our program
   - Contract improvements
   - Due diligence gaps
   - Monitoring improvements

10. **Recommendations**
    - Short-term actions
    - Long-term changes
    - Vendor management
    - Risk mitigation

Provide clear recommendations on whether to continue vendor relationship.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Monitor vendor portfolio
   */
  async monitorPortfolio(request: {
    vendors: Array<{
      name: string;
      riskLevel: string;
      lastAssessment?: string;
      issues?: number;
    }>;
    context?: any;
  }): Promise<AgentResponse> {
    const vendorList = request.vendors
      .map(
        (v) =>
          `- ${v.name} (${v.riskLevel})${v.lastAssessment ? ` - Last assessed: ${v.lastAssessment}` : ""}${v.issues ? ` - Issues: ${v.issues}` : ""}`
      )
      .join("\n");

    const prompt = `Monitor vendor portfolio:

Current Vendors:
${vendorList}

Provide portfolio analysis:

1. **Portfolio Overview**
   - Total vendors
   - Breakdown by risk level
   - Assessment status
   - Overall portfolio health

2. **High-Risk Vendors**
   - Identify critical/high risk vendors
   - Assessment currency
   - Outstanding issues
   - Recommended actions

3. **Assessment Status**
   - Vendors needing assessment
   - Overdue assessments
   - Upcoming renewals
   - Priority order

4. **Issue Summary**
   - Vendors with open issues
   - Issue severity distribution
   - Remediation status
   - Escalation needs

5. **Compliance Status**
   - CMMC certification status
   - Contract compliance
   - Insurance currency
   - Audit completion

6. **Risk Trends**
   - Improving vendors
   - Degrading vendors
   - New risks identified
   - Industry trends

7. **Concentration Risk**
   - Single points of failure
   - Over-dependence on vendors
   - Geographic concentration
   - Mitigation recommendations

8. **Optimization Opportunities**
   - Vendor consolidation
   - Risk reduction initiatives
   - Process improvements
   - Cost savings

9. **Action Plan**
   - Priority assessments (next 30 days)
   - Remediation follow-ups
   - Contract renewals
   - Relationship reviews

10. **Executive Summary**
    - Portfolio health score
    - Key risks
    - Recommendations
    - Resource needs

Provide actionable portfolio management recommendations.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
