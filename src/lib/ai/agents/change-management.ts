/**
 * Change Management Agent
 *
 * Manages changes to systems and processes while maintaining CMMC compliance
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const CHANGE_MANAGEMENT_SYSTEM_PROMPT = `You are the Change Management Agent for CMMC Genie, an expert in IT change management, configuration management, and maintaining compliance during changes.

## Your Role

You help organizations:
- Assess impact of proposed changes on CMMC compliance
- Develop change implementation plans
- Maintain compliance during changes
- Document changes for audit trail
- Roll back changes if needed
- Track change effectiveness

## CMMC Change Management Requirements

### CM Controls (NIST SP 800-171)

**CM.2.061**: Establish and maintain baseline configurations
**CM.2.062**: Employ least functionality principle
**CM.2.063**: Control and monitor user-installed software
**CM.2.064**: Establish and enforce security configuration settings
**CM.2.065**: Track, review, approve/disapprove, and audit changes
**CM.2.066**: Analyze impact of changes before implementation
**CM.2.067**: Establish and enforce access restrictions for changes
**CM.3.068**: Restrict, disable, or prevent use of unnecessary functions/ports/protocols
**CM.3.069**: Apply deny-by-exception policy

## Change Management Framework

### Change Categories

**Standard Changes**:
- Pre-approved
- Low risk
- Well understood
- Documented procedure
- No approval needed
- Examples: Patch installation, password resets, approved software updates

**Normal Changes**:
- Follow standard change process
- Risk assessment required
- Change Advisory Board (CAB) approval
- Impact analysis needed
- Testing required

**Emergency Changes**:
- Address critical issues
- Expedited process
- Post-implementation review
- Limited pre-approval
- Examples: Security patches, incident response, critical bug fixes

**Major Changes**:
- High risk/impact
- Senior management approval
- Extensive planning
- Communication to stakeholders
- Examples: System migrations, architecture changes, major upgrades

## Change Process Steps

### 1. Request
- What needs to change?
- Why is change needed?
- Business justification
- Urgency/priority

### 2. Assessment
- Risk analysis
- Impact analysis
- Resource requirements
- Compliance implications
- Dependencies

### 3. Approval
- Risk acceptance
- Resource allocation
- Schedule approval
- Stakeholder sign-off

### 4. Planning
- Implementation plan
- Rollback plan
- Communication plan
- Testing strategy
- Success criteria

### 5. Implementation
- Execute change
- Monitor progress
- Address issues
- Document actions
- Communicate status

### 6. Verification
- Test results
- Compliance check
- Performance validation
- User acceptance

### 7. Review
- Lessons learned
- Process improvement
- Documentation update
- Metrics collection

## Compliance Impact Assessment

Changes can affect compliance by:

**Positive Impact**:
- Strengthen security controls
- Reduce vulnerabilities
- Improve configurations
- Close compliance gaps

**Negative Impact**:
- Weaken security controls
- Introduce vulnerabilities
- Cause configuration drift
- Create new compliance gaps

**Neutral Impact**:
- No security change
- Cosmetic changes
- Performance optimization
- Non-security features

### Assessment Questions

1. **Security Impact**:
   - Does this change affect security controls?
   - Which CMMC controls are impacted?
   - Is impact positive, negative, or neutral?
   - How is impact mitigated?

2. **Configuration Impact**:
   - Does this change baseline configurations?
   - Is configuration management updated?
   - How is drift prevented?

3. **Access Impact**:
   - Does this change access controls?
   - Are permissions modified?
   - Is least privilege maintained?

4. **Data Impact**:
   - Does this affect CUI handling?
   - Is encryption impacted?
   - Are data flows changed?

5. **Audit Impact**:
   - Does this affect logging?
   - Is auditability maintained?
   - Are audit trails preserved?

## Risk Assessment

Rate change risk:

**Critical Risk**:
- CUI confidentiality/integrity at risk
- Major compliance impact
- No rollback capability
- Broad system impact
- **Approval**: Senior management + CAB

**High Risk**:
- Potential compliance impact
- Complex implementation
- Difficult rollback
- Multiple systems affected
- **Approval**: CAB + affected managers

**Medium Risk**:
- Limited compliance impact
- Standard implementation
- Rollback available
- Single system
- **Approval**: CAB or delegate

**Low Risk**:
- No compliance impact
- Simple implementation
- Easy rollback
- Isolated scope
- **Approval**: Manager or pre-approved

## Rollback Planning

Every change needs a rollback plan:

**Rollback Triggers**:
- Critical functionality broken
- Security controls compromised
- Compliance violations introduced
- Performance degradation
- User acceptance failure

**Rollback Plan Includes**:
- Decision criteria
- Rollback procedure
- Time to rollback
- Data considerations
- Communication plan
- Verification steps

## Change Documentation

Document:
- Change request
- Impact assessment
- Approval records
- Implementation steps
- Test results
- Issues encountered
- Resolution actions
- Verification evidence
- Lessons learned

## Your Output Format

When analyzing changes:

1. **Change Summary**: What's changing and why
2. **Compliance Impact**: How CMMC is affected
3. **Risk Assessment**: Level and mitigation
4. **Implementation Plan**: How to execute safely
5. **Rollback Plan**: How to undo if needed
6. **Verification**: How to confirm success
7. **Documentation**: What to record

Be thorough but practical - balance risk management with business agility.`;

export class ChangeManagementAgent extends BaseAgent {
  constructor() {
    super("CHANGE_MANAGEMENT", CHANGE_MANAGEMENT_SYSTEM_PROMPT);
  }

  /**
   * Assess change impact
   */
  async assessChange(request: {
    changeDescription: string;
    changeType: "standard" | "normal" | "emergency" | "major";
    affectedSystems: string[];
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Assess impact of proposed change:

Change Description:
${request.changeDescription}

Change Type: ${request.changeType}
Affected Systems: ${request.affectedSystems.join(", ")}
CMMC Level: ${request.cmmcLevel}

Perform comprehensive impact analysis:

1. **Change Overview**
   - Change summary
   - Business justification
   - Urgency/priority
   - Category classification

2. **Compliance Impact Analysis**
   - CMMC controls affected
   - Impact type (Positive/Negative/Neutral)
   - Severity of impact
   - Controls requiring re-verification

3. **Security Impact**
   - Confidentiality impact
   - Integrity impact
   - Availability impact
   - New vulnerabilities introduced?
   - Security controls strengthened/weakened?

4. **Technical Impact**
   - System performance
   - Dependencies affected
   - Integration points
   - Compatibility concerns
   - Infrastructure changes

5. **Operational Impact**
   - Business processes affected
   - User impact
   - Downtime required
   - Service degradation
   - Training needed

6. **Risk Assessment**
   - Risk level (Critical/High/Medium/Low)
   - Likelihood of issues
   - Impact if problems occur
   - Risk mitigation strategies
   - Residual risk

7. **Configuration Management**
   - Baseline changes required
   - Configuration items affected
   - Documentation updates needed
   - Version control implications

8. **Compliance Requirements**
   - Re-testing needed
   - Evidence collection required
   - Policy updates needed
   - Audit trail documentation

9. **Stakeholder Impact**
   - Who is affected
   - Notification requirements
   - Approval needed from
   - Communication plan

10. **Dependencies and Constraints**
    - Prerequisites
    - Dependencies on other changes
    - Resource requirements
    - Schedule constraints

11. **Go/No-Go Recommendation**
    - Proceed, Modify, or Reject
    - Justification
    - Conditions for approval
    - Required mitigations

Provide thorough analysis to support change decision.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create implementation plan
   */
  async createImplementationPlan(request: {
    changeDescription: string;
    approvalDate?: string;
    implementationWindow?: string;
    riskLevel: "critical" | "high" | "medium" | "low";
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create implementation plan for approved change:

Change: ${request.changeDescription}
${request.approvalDate ? `Approved: ${request.approvalDate}` : ""}
${request.implementationWindow ? `Implementation Window: ${request.implementationWindow}` : ""}
Risk Level: ${request.riskLevel}

Develop detailed implementation plan:

1. **Implementation Overview**
   - Objectives
   - Scope
   - Success criteria
   - Timeline

2. **Pre-Implementation Checklist**
   - Prerequisites verified
   - Backups completed
   - Approvals obtained
   - Resources confirmed
   - Communication sent
   - Documentation prepared

3. **Step-by-Step Implementation**
   For each step:
   - Step number and description
   - Responsible party
   - Estimated duration
   - Commands/procedures
   - Success indicators
   - Rollback point

4. **Risk Mitigation**
   - Identified risks
   - Mitigation actions
   - Monitoring during change
   - Decision points
   - Escalation triggers

5. **Communication Plan**
   - Pre-implementation notifications
   - Status updates during change
   - Completion notification
   - Issue escalation
   - Stakeholder updates

6. **Testing and Verification**
   - What to test
   - How to test
   - Pass/fail criteria
   - Who performs testing
   - Test documentation

7. **Compliance Verification**
   - Controls to re-verify
   - Evidence to collect
   - Compliance checks
   - Configuration baseline update

8. **Rollback Plan**
   - Rollback triggers
   - Rollback procedure (step-by-step)
   - Rollback timeline
   - Rollback verification
   - Rollback communication

9. **Post-Implementation Activities**
   - Documentation updates
   - Configuration management updates
   - Lessons learned
   - Metrics collection
   - Stakeholder notification

10. **Timeline**
    - Detailed schedule
    - Dependencies
    - Milestones
    - Buffer time
    - Contingency time

11. **Resource Requirements**
    - Personnel needed
    - Tools required
    - Access requirements
    - Budget/costs

12. **Success Criteria**
    - Technical success metrics
    - Business success metrics
    - Compliance maintained
    - No degradation
    - User acceptance

Provide implementation-ready plan with clear procedures.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create rollback plan
   */
  async createRollbackPlan(request: {
    changeDescription: string;
    implementation: string;
    riskLevel: "critical" | "high" | "medium" | "low";
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create rollback plan for change:

Change: ${request.changeDescription}

Implementation Approach:
${request.implementation}

Risk Level: ${request.riskLevel}

Develop comprehensive rollback plan:

1. **Rollback Overview**
   - Purpose
   - When to use
   - Decision authority
   - Communication requirements

2. **Rollback Triggers**
   - Automatic triggers
   - Manual decision criteria
   - Severity thresholds
   - Time-based triggers
   - Who can call rollback

3. **Rollback Decision Matrix**
   If [condition], then [rollback/continue/modify]
   - Critical failures
   - Performance degradation
   - Security issues
   - Compliance violations
   - User acceptance issues

4. **Pre-Rollback Actions**
   - Assess current state
   - Notify stakeholders
   - Preserve evidence
   - Document issues
   - Get approval (if needed)

5. **Step-by-Step Rollback**
   For each step:
   - Rollback action
   - Responsible party
   - Expected duration
   - Verification method
   - Dependencies

6. **Data Considerations**
   - Data created during change
   - Data modified during change
   - Data backup strategy
   - Data restoration procedure
   - Data integrity verification

7. **Configuration Restoration**
   - Restore from baseline
   - Configuration files to revert
   - Settings to change back
   - Verification procedures

8. **Verification After Rollback**
   - Functionality tests
   - Security control checks
   - Compliance verification
   - Performance validation
   - User access testing

9. **Communication Plan**
   - Rollback announcement
   - Status updates
   - Completion notification
   - Post-mortem scheduling
   - Lessons learned

10. **Rollback Risks**
    - What could go wrong during rollback
    - Mitigation strategies
    - Partial rollback scenarios
    - Point of no return

11. **Post-Rollback Activities**
    - Root cause analysis
    - Documentation updates
    - Revised change plan (if re-attempting)
    - Stakeholder debrief
    - Metrics collection

12. **Estimated Times**
    - Time to decide on rollback
    - Time to execute rollback
    - Time to verify rollback
    - Time to full restoration

Provide clear, actionable rollback procedures.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Review change effectiveness
   */
  async reviewChange(request: {
    changeDescription: string;
    implementationDate: string;
    outcomeDescription: string;
    issuesEncountered?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Review completed change:

Change: ${request.changeDescription}
Implementation Date: ${request.implementationDate}

Outcome:
${request.outcomeDescription}

${request.issuesEncountered?.length ? `Issues Encountered:\n${request.issuesEncountered.map((i) => `- ${i}`).join("\n")}` : "No issues reported"}

Conduct post-implementation review:

1. **Change Success Assessment**
   - Objectives achieved? (Yes/Partial/No)
   - Success criteria met?
   - Intended outcomes realized?
   - Overall success rating

2. **Technical Assessment**
   - Systems functioning as expected?
   - Performance acceptable?
   - Integration working?
   - No degradation?

3. **Compliance Assessment**
   - CMMC controls still compliant?
   - New evidence collected?
   - Documentation updated?
   - Baseline updated?
   - Audit trail complete?

4. **Security Assessment**
   - No new vulnerabilities introduced?
   - Security controls functioning?
   - Access controls appropriate?
   - Encryption maintained?

5. **Issue Analysis**
   For each issue encountered:
   - Issue description
   - Impact
   - Root cause
   - Resolution
   - Prevention for future

6. **Timeline Analysis**
   - Planned vs. actual duration
   - Delays and causes
   - Efficiency opportunities
   - Resource utilization

7. **Risk Analysis**
   - Risks that materialized
   - Risks that didn't occur
   - Risk mitigation effectiveness
   - Unforeseen risks

8. **Process Effectiveness**
   - Change process followed?
   - Approval process adequate?
   - Communication effective?
   - Documentation sufficient?
   - Testing adequate?

9. **Lessons Learned**
   - What went well
   - What went poorly
   - Unexpected outcomes
   - Knowledge gained
   - Best practices identified

10. **Improvement Recommendations**
    - Process improvements
    - Documentation updates
    - Tool enhancements
    - Training needs
    - Template updates

11. **Follow-up Actions**
    - Outstanding issues
    - Additional testing needed
    - Documentation to complete
    - Training to conduct
    - Monitoring to continue

12. **Metrics**
    - Downtime
    - Issues count
    - Rollback needed? (Yes/No)
    - Budget variance
    - User satisfaction

Provide honest, constructive review focused on continuous improvement.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create change management program
   */
  async createProgram(request: {
    organizationSize: "small" | "medium" | "large";
    changeVolume?: "low" | "medium" | "high";
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create change management program:

Organization Size: ${request.organizationSize}
${request.changeVolume ? `Change Volume: ${request.changeVolume}` : ""}
CMMC Level: ${request.cmmcLevel}

Design comprehensive change management program:

1. **Program Overview**
   - Purpose and objectives
   - Scope and applicability
   - Governance structure
   - Roles and responsibilities

2. **Change Categories**
   - Standard changes (pre-approved)
   - Normal changes
   - Emergency changes
   - Major changes
   - Criteria for each category

3. **Change Process**
   - Request submission
   - Impact assessment
   - Risk evaluation
   - Approval workflow
   - Implementation
   - Verification
   - Review

4. **Roles and Responsibilities**
   - Change requestor
   - Change manager
   - Change Advisory Board (CAB)
   - Technical reviewers
   - Approvers
   - Implementers

5. **Change Advisory Board (CAB)**
   - Membership
   - Meeting frequency
   - Decision criteria
   - Escalation process
   - Emergency CAB (ECAB)

6. **Risk Assessment Framework**
   - Risk factors to consider
   - Risk scoring method
   - Risk levels and responses
   - Risk acceptance criteria

7. **Compliance Integration**
   - CMMC control mapping
   - Compliance checkpoints
   - Evidence collection
   - Documentation requirements
   - Audit trail maintenance

8. **Tools and Technology**
   - Change tracking system
   - Approval workflow tool
   - Documentation repository
   - Communication platform
   - Integration with ITSM

9. **Standard Change Catalog**
   - Pre-approved standard changes
   - Procedures for each
   - Approval requirements
   - Frequency limits
   - Review schedule

10. **Communication Plan**
    - Stakeholder identification
    - Notification requirements
    - Status updates
    - Schedule publication
    - Post-change communication

11. **Metrics and Reporting**
    - Changes by category
    - Success/failure rate
    - Average implementation time
    - Rollback rate
    - Compliance impact

12. **Training and Awareness**
    - Training for requestors
    - Training for implementers
    - Training for approvers
    - Awareness campaigns
    - Documentation

13. **Continuous Improvement**
    - Program reviews
    - Process optimization
    - Lessons learned integration
    - Best practice adoption
    - Metric-driven improvement

14. **Integration Points**
    - Incident management
    - Problem management
    - Configuration management
    - Release management
    - Compliance monitoring

15. **Implementation Roadmap**
    - Phase 1: Basic process
    - Phase 2: Workflow automation
    - Phase 3: Integration
    - Phase 4: Optimization

Provide practical program sized for ${request.organizationSize} organization.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Handle emergency change
   */
  async handleEmergencyChange(request: {
    emergencyDescription: string;
    urgency: string;
    proposedSolution: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Handle emergency change request:

Emergency: ${request.emergencyDescription}
Urgency: ${request.urgency}

Proposed Solution:
${request.proposedSolution}

Provide emergency change guidance:

1. **Emergency Validation**
   - Is this truly an emergency?
   - Can it wait for normal process?
   - Risk of not implementing immediately?
   - Justification for emergency status?

2. **Rapid Impact Assessment**
   - Immediate risks
   - Quick compliance check
   - Critical dependencies
   - Potential for making things worse

3. **Expedited Approval Process**
   - Who must approve (minimum required)
   - How to contact approvers
   - Documentation minimum
   - Post-implementation approval (if needed)

4. **Rapid Implementation Plan**
   - Immediate actions (first 15 minutes)
   - Quick testing approach
   - Minimal viable implementation
   - Monitoring during change

5. **Emergency Rollback**
   - Quick rollback procedure
   - Rollback decision criteria
   - Who can call rollback
   - Estimated rollback time

6. **Communication**
   - Who to notify immediately
   - Status updates frequency
   - Escalation contacts
   - Post-change notification

7. **Compliance Considerations**
   - CMMC controls affected
   - Minimum documentation needed
   - Evidence to collect
   - Post-implementation compliance check

8. **Risk Acceptance**
   - Risks being accepted
   - Who accepts the risk
   - Documentation of acceptance
   - Mitigation plans

9. **Post-Implementation Requirements**
   - Full documentation (within 24-48 hours)
   - Proper approval process (retroactive)
   - Lessons learned
   - Process improvement
   - CAB review

10. **Emergency Change Review**
    - Was emergency status justified?
    - Could it have been prevented?
    - Process improvements needed?
    - Future prevention strategy?

Provide rapid but safe guidance for emergency change handling.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
