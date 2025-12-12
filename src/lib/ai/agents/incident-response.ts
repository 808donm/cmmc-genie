/**
 * Incident Response Agent
 *
 * Assists with incident response planning, execution, and post-incident activities
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const INCIDENT_RESPONSE_SYSTEM_PROMPT = `You are the Incident Response Agent for CMMC Genie, an expert in cybersecurity incident response, CMMC incident handling requirements, and DoD incident reporting.

## Your Role

You help organizations:
- Create incident response plans and playbooks
- Guide incident response execution
- Document incidents for compliance
- Conduct post-incident analysis
- Meet DoD incident reporting requirements
- Improve IR capabilities through lessons learned

## CMMC Incident Response Requirements

### IR Controls (NIST SP 800-171)

**IR.2.092**: Establish an operational incident-handling capability
**IR.2.093**: Track, document, and report incidents
**IR.2.094**: Test the organizational incident response capability
**IR.2.096**: Develop and implement responses to declared incidents

### DFARS Incident Reporting

Organizations must report cyber incidents to DoD within **72 hours** if:
- Affects covered defense information (CDI)
- Affects ability to perform contract
- Occurs on contractor systems processing/storing CDI

**Report to**: DoD at https://dibnet.dod.mil

**Information Required**:
- Contract information
- Incident description
- Impact assessment
- Affected systems
- Data potentially compromised
- Response actions taken

## Incident Response Lifecycle

### 1. Preparation
- IR plan and procedures
- Team roles and responsibilities
- Tools and resources
- Training and exercises
- Communication plans
- Evidence collection procedures

### 2. Detection and Analysis
- Incident identification
- Scope determination
- Severity assessment
- Initial triage
- Evidence preservation
- Stakeholder notification

### 3. Containment
- Short-term containment
- Long-term containment
- System isolation
- Evidence collection
- Communication management

### 4. Eradication
- Remove threat actor
- Delete malware
- Close vulnerabilities
- Verify removal
- Document actions

### 5. Recovery
- Restore operations
- Monitor for recurrence
- Validate restoration
- Return to normal
- Continued monitoring

### 6. Post-Incident Activity
- Lessons learned
- Documentation
- Process improvements
- Training updates
- Metrics collection

## Incident Severity Levels

### Critical (P1)
- Active data exfiltration
- Ransomware encryption
- CUI compromise confirmed
- Contract performance impacted
- Mission-critical systems down
- **Response Time**: Immediate
- **Notification**: Executive, DoD (if CUI)

### High (P2)
- Suspected CUI access
- Widespread malware
- Key system compromise
- Persistent threat detected
- **Response Time**: Within 1 hour
- **Notification**: Management, Security team

### Medium (P3)
- Isolated infections
- Failed attack attempts
- Suspicious activity
- Policy violations
- **Response Time**: Within 4 hours
- **Notification**: Security team

### Low (P4)
- Minor policy violations
- Unsuccessful attacks
- False positives confirmed
- **Response Time**: Next business day
- **Notification**: Security team (logged only)

## Incident Types

### Malware
- Ransomware
- Trojans
- Viruses/Worms
- Rootkits
- Spyware

### Unauthorized Access
- Account compromise
- Privilege escalation
- Insider threat
- Physical breach

### Data Breach
- CUI exfiltration
- Data theft
- Accidental disclosure
- Lost devices

### Denial of Service
- DDoS attacks
- Service disruption
- Resource exhaustion

### Other
- Social engineering
- Supply chain compromise
- Zero-day exploits
- Advanced persistent threats (APT)

## IR Team Roles

### Incident Commander
- Overall incident leadership
- Decision authority
- Resource allocation
- Stakeholder communication

### Technical Lead
- Technical investigation
- Containment actions
- System restoration
- Evidence collection

### Communications Lead
- Internal communications
- External notifications
- DoD reporting
- Media relations (if needed)

### Legal/Compliance
- Legal implications
- Regulatory requirements
- Evidence handling
- Breach notifications

### Documentation Lead
- Incident timeline
- Actions log
- Evidence inventory
- Final report

## Evidence Collection

Critical evidence to preserve:
- System logs (before rotation)
- Network traffic captures
- Memory dumps
- Disk images
- Email communications
- Access logs
- Configuration files
- Malware samples

Evidence handling:
- Chain of custody
- Write-protected copies
- Hash verification
- Secure storage
- Access logging

## DoD Reporting Template

**Required Information**:
1. Contract number and organization
2. Incident discovery date/time
3. Incident description
4. Systems affected
5. CDI potentially compromised
6. Safeguarding measures in place
7. Response actions taken
8. Contact information
9. Preliminary impact assessment

## Lessons Learned Process

Post-incident review should address:
- What happened?
- When was it detected?
- How well did we respond?
- What should we do differently?
- What process/tool/training gaps exist?
- How can we prevent recurrence?
- What worked well?

## Your Output Format

When providing incident response guidance:

1. **Assessment**: Severity, scope, urgency
2. **Immediate Actions**: What to do right now
3. **Investigation Steps**: How to determine what happened
4. **Containment Strategy**: How to stop the spread
5. **Communication Plan**: Who to notify and when
6. **Documentation Requirements**: What to record
7. **Recovery Steps**: How to restore operations
8. **Lessons Learned**: Improvements to make

Be clear, concise, and actionable - incidents are high-stress situations requiring decisive action.`;

export class IncidentResponseAgent extends BaseAgent {
  constructor() {
    super("INCIDENT_RESPONSE", INCIDENT_RESPONSE_SYSTEM_PROMPT);
  }

  /**
   * Create incident response plan
   */
  async createIRPlan(request: {
    organizationSize: "small" | "medium" | "large";
    industry?: string;
    cuiHandling: boolean;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create a comprehensive incident response plan for:

Organization Size: ${request.organizationSize}
${request.industry ? `Industry: ${request.industry}` : ""}
Handles CUI: ${request.cuiHandling ? "Yes - Must report to DoD" : "No"}

Generate complete IR plan:

1. **Plan Overview**
   - Purpose and scope
   - Authority and governance
   - Plan maintenance schedule
   - Distribution list

2. **IR Team Structure**
   - Team composition
   - Roles and responsibilities
   - Contact information (24/7)
   - Escalation procedures
   - Backup personnel

3. **Incident Classification**
   - Severity definitions (P1-P4)
   - Incident types
   - Classification criteria
   - Response time requirements

4. **Detection and Reporting**
   - How incidents are detected
   - Who can report incidents
   - Reporting procedures
   - Initial triage process

5. **Response Procedures by Severity**
   For each level (P1-P4):
   - Response timeline
   - Team activation
   - Initial actions
   - Escalation triggers
   - Notification requirements

6. **Containment Strategies**
   - Network isolation procedures
   - Account disablement
   - System shutdown criteria
   - Evidence preservation
   - Backup activation

7. **Communication Plan**
   - Internal communications
   - Executive notifications
   - DoD reporting (if CUI involved)
   - Customer notifications
   - Law enforcement contact

8. **DoD Reporting Procedures** (if CUI handling)
   - When to report (72-hour rule)
   - How to report (DIBNet)
   - What to report
   - Follow-up requirements
   - Evidence preservation

9. **Evidence Handling**
   - Collection procedures
   - Chain of custody
   - Storage requirements
   - Analysis tools
   - Legal considerations

10. **Recovery Procedures**
    - System restoration
    - Validation testing
    - Monitoring requirements
    - Return to normal operations

11. **Post-Incident Activities**
    - Lessons learned template
    - Report requirements
    - Process improvements
    - Training updates

12. **Tools and Resources**
    - IR toolkit
    - Forensics tools
    - Communication platforms
    - Documentation templates
    - Contact lists

13. **Training and Exercises**
    - IR team training schedule
    - Tabletop exercise frequency
    - Simulation scenarios
    - Skills assessment

Provide a ready-to-implement plan suitable for ${request.organizationSize} organization.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate incident playbook
   */
  async generatePlaybook(request: {
    incidentType:
      | "ransomware"
      | "data_breach"
      | "malware"
      | "unauthorized_access"
      | "ddos"
      | "insider_threat";
    cuiInvolved: boolean;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create a detailed incident response playbook for ${request.incidentType}:

CUI Potentially Involved: ${request.cuiInvolved ? "Yes" : "No"}

Generate step-by-step playbook:

1. **Playbook Overview**
   - Incident type description
   - Common indicators
   - Typical severity
   - Prerequisites for use

2. **Initial Response (First 15 minutes)**
   - Verify incident is real
   - Classify severity
   - Activate IR team
   - Preserve evidence
   - Document timeline

3. **Containment (First hour)**
   - Immediate containment actions
   - Network isolation steps
   - System shutdown criteria
   - Backup verification
   - Threat actor actions to block

4. **Investigation (Hours 1-4)**
   - Log analysis procedures
   - System examination
   - Scope determination
   - Data impact assessment
   - Attack vector identification

5. **Communication (Ongoing)**
   - Who to notify and when
   - Message templates
   - DoD reporting (if CUI)
   - Customer communications
   - Status updates

6. **Eradication (Hours 4-24)**
   - Remove threat actor access
   - Delete malware
   - Patch vulnerabilities
   - Reset credentials
   - Verify removal

7. **Recovery (Days 1-7)**
   - System restoration priority
   - Validation procedures
   - Monitoring for reinfection
   - Service restoration
   - Normal operations resumption

8. **Post-Incident (Week 1-2)**
   - Evidence analysis
   - Lessons learned session
   - Documentation finalization
   - Process improvements
   - Training updates

9. **Specific Considerations for ${request.incidentType}**
   - Unique characteristics
   - Common mistakes to avoid
   - Tools needed
   - Expert resources
   - Recovery time estimates

10. **Decision Trees**
    - Key decision points
    - If/then scenarios
    - Escalation triggers
    - Go/no-go criteria

11. **Commands and Procedures**
    - Specific commands to run
    - Configuration changes
    - Evidence collection scripts
    - Analysis procedures

12. **Checklists**
    - Containment checklist
    - Evidence collection checklist
    - Communication checklist
    - Recovery checklist

Provide actionable, step-by-step procedures that can be followed under pressure.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Guide active incident response
   */
  async guideResponse(request: {
    incidentDescription: string;
    currentStatus: string;
    cuiInvolved?: boolean;
    urgency: "critical" | "high" | "medium" | "low";
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Provide incident response guidance for active incident:

Incident Description:
${request.incidentDescription}

Current Status:
${request.currentStatus}

${request.cuiInvolved !== undefined ? `CUI Involved: ${request.cuiInvolved ? "Yes" : "No"}` : "CUI Status: Unknown"}
Urgency: ${request.urgency}

Provide immediate response guidance:

1. **Situation Assessment**
   - Severity classification
   - Immediate risks
   - Potential impact
   - Time sensitivity

2. **Immediate Actions (Next 15 minutes)**
   - Critical first steps
   - What to do RIGHT NOW
   - Who to contact
   - What NOT to do

3. **Containment Strategy**
   - How to stop the spread
   - Systems to isolate
   - Accounts to disable
   - Network segments to protect

4. **Evidence Preservation**
   - Critical evidence to collect NOW
   - Systems to snapshot
   - Logs to preserve
   - Don't destroy evidence

5. **Investigation Priorities**
   - What to investigate first
   - Key questions to answer
   - Data sources to check
   - Timeline to establish

6. **Communication Requirements**
   - Who must be notified
   - Notification timeline
   - DoD reporting needed? (if CUI)
   - Message templates

7. **Resource Needs**
   - Team members needed
   - Tools required
   - External help needed?
   - Budget authority

8. **Next 4 Hours**
   - Detailed action plan
   - Milestones to achieve
   - Decision points
   - Status update schedule

9. **Risk Mitigation**
   - Risks of current approach
   - Fallback options
   - When to escalate
   - What could go wrong

10. **Documentation**
    - What to document
    - How to document
    - Evidence chain of custody
    - Legal considerations

Provide clear, prioritized, actionable guidance for THIS specific incident.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create DoD incident report
   */
  async createDoDReport(request: {
    contractNumber: string;
    incidentDate: string;
    incidentDescription: string;
    systemsAffected: string;
    cuiCompromised?: string;
    responseActions: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Generate DoD cyber incident report (DFARS 252.204-7012):

Contract Number: ${request.contractNumber}
Incident Date: ${request.incidentDate}
Systems Affected: ${request.systemsAffected}
${request.cuiCompromised ? `CUI Potentially Compromised: ${request.cuiCompromised}` : ""}

Incident Description:
${request.incidentDescription}

Response Actions Taken:
${request.responseActions}

Create complete DoD incident report:

1. **Report Header**
   - Report date/time
   - Organization information
   - Point of contact (24/7 reachable)
   - Contract details

2. **Incident Summary**
   - When incident discovered
   - When incident occurred (if different)
   - How incident was detected
   - Current incident status

3. **Incident Description**
   - What happened
   - Attack vector
   - Indicators of compromise
   - Threat actor information (if known)

4. **Affected Systems**
   - System names and types
   - System locations
   - Business functions
   - CDI on these systems

5. **Data Impact Assessment**
   - Types of CDI potentially affected
   - Volume of data potentially compromised
   - Data classification
   - Confirmed vs. suspected compromise

6. **Safeguarding Measures**
   - Security controls in place at time of incident
   - NIST SP 800-171 implementation status
   - Protective measures that worked
   - Controls that failed

7. **Response Actions**
   - Immediate containment actions
   - Investigation activities
   - Eradication steps
   - Recovery procedures
   - Ongoing monitoring

8. **Impact to Contract Performance**
   - Can contract obligations be met?
   - Service disruptions
   - Timeline for restoration
   - Alternative arrangements

9. **Evidence Preservation**
   - Data preserved
   - Images/snapshots taken
   - Chain of custody
   - Storage location
   - Access controls

10. **Preliminary Root Cause**
    - How incident occurred
    - Vulnerabilities exploited
    - Human factors involved
    - Process failures

11. **Remediation Plan**
    - Short-term fixes
    - Long-term improvements
    - Timeline for completion
    - Verification methods

12. **Follow-up Information**
    - Additional reporting planned
    - Investigation status
    - External assistance engaged
    - Expected completion date

Format report for submission to DoD DIBNet portal. Include all required fields and supporting information.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Conduct post-incident review
   */
  async postIncidentReview(request: {
    incidentSummary: string;
    responseActions: string;
    outcome: string;
    duration?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Conduct post-incident review:

Incident Summary:
${request.incidentSummary}

Response Actions Taken:
${request.responseActions}

Outcome:
${request.outcome}

${request.duration ? `Total Duration: ${request.duration}` : ""}

Generate comprehensive lessons learned analysis:

1. **Executive Summary**
   - Incident overview
   - Response effectiveness
   - Business impact
   - Key lessons
   - Priority improvements

2. **Timeline Analysis**
   - Incident timeline
   - Detection time
   - Response time
   - Resolution time
   - Gaps in timeline

3. **What Went Well**
   - Effective procedures
   - Good decisions made
   - Tools that worked
   - Team performance
   - Successful outcomes

4. **What Went Poorly**
   - Missed opportunities
   - Delayed responses
   - Process failures
   - Tool limitations
   - Communication issues

5. **Root Cause Analysis**
   - How did this happen?
   - Why did controls fail?
   - Human factors involved
   - Process gaps
   - Technology limitations

6. **Detection Analysis**
   - How was incident discovered?
   - How long before detection?
   - Why wasn't it detected sooner?
   - What could improve detection?

7. **Response Effectiveness**
   - Did playbook work?
   - Were procedures followed?
   - Team preparedness
   - Tool effectiveness
   - Communication quality

8. **Business Impact**
   - Operations disrupted
   - Financial impact
   - Data compromised
   - Customer impact
   - Reputation damage

9. **Improvements Needed**
   For each finding:
   - What to improve
   - Why it matters
   - How to implement
   - Who is responsible
   - Timeline for completion
   - Success metrics

10. **Action Items**
    - Immediate fixes (this week)
    - Short-term (this month)
    - Long-term (this quarter)
    - Responsible parties
    - Verification methods

11. **Process Updates**
    - IR plan changes
    - Playbook updates
    - Procedure modifications
    - Tool additions
    - Training needs

12. **Training and Exercises**
    - Skills gaps identified
    - Training recommendations
    - Exercise scenarios
    - Schedule for drills

13. **Metrics and Trends**
    - Key metrics from incident
    - Comparison to past incidents
    - Trends observed
    - Improvement opportunities

Provide honest, constructive analysis focused on continuous improvement.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Design tabletop exercise
   */
  async designTabletop(request: {
    scenarioType:
      | "ransomware"
      | "data_breach"
      | "insider_threat"
      | "supply_chain"
      | "apt";
    participantRoles: string[];
    duration: number; // minutes
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Design tabletop exercise for incident response:

Scenario Type: ${request.scenarioType}
Participants: ${request.participantRoles.join(", ")}
Duration: ${request.duration} minutes

Create complete tabletop exercise:

1. **Exercise Overview**
   - Learning objectives
   - Participant roles
   - Exercise duration and schedule
   - Prerequisites

2. **Scenario Background**
   - Organization context
   - Initial situation
   - Business environment
   - Recent events leading to incident

3. **Scenario Injects** (timeline-based)
   For each inject:
   - Time marker (T+0, T+15min, T+1hr, etc.)
   - New information revealed
   - Decisions required
   - Actions to consider
   - Complications introduced

4. **Facilitator Guide**
   - Setup instructions
   - Timing guide
   - Discussion prompts
   - Key teaching points
   - Common mistakes to surface

5. **Participant Materials**
   - Role descriptions
   - Background reading
   - Reference materials
   - Decision worksheets

6. **Decision Points**
   - Critical decisions to discuss
   - Options to consider
   - Pros/cons of choices
   - Best practices

7. **Evaluation Criteria**
   - What to assess
   - Performance indicators
   - Success metrics
   - Gap identification

8. **Debrief Guide**
   - Discussion questions
   - Lessons to emphasize
   - Improvements to identify
   - Action items to capture

9. **Realistic Elements**
   - Authentic indicators
   - Real tool outputs
   - Actual procedures to reference
   - Time pressure simulation

10. **Expected Outcomes**
    - Skills demonstrated
    - Gaps revealed
    - Process validations
    - Team dynamics observed

Make scenario realistic, challenging, and educational for ${request.duration} minute exercise.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
