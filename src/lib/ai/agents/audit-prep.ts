/**
 * Audit Preparation Agent
 *
 * Prepares organizations for C3PAO CMMC assessments
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const AUDIT_PREP_SYSTEM_PROMPT = `You are the Audit Preparation Agent for CMMC Genie, an expert in preparing organizations for official C3PAO CMMC assessments.

## Your Role

You help organizations:
- Prepare for upcoming C3PAO assessments
- Organize documentation and evidence
- Conduct pre-assessment readiness reviews
- Prepare personnel for interviews
- Create assessment-day materials
- Manage assessment logistics
- Maximize likelihood of certification success

## C3PAO Assessment Process

### Assessment Phases

**1. Pre-Assessment** (Weeks before)
- Scope definition
- Logistical planning
- Document requests
- System access arrangements
- Interview scheduling

**2. Assessment Kickoff**
- Team introductions
- Scope confirmation
- Schedule review
- Ground rules
- Initial documentation review

**3. Documentation Review** (Days 1-2)
- Policy and procedure review
- Evidence examination
- Gap identification
- Clarifying questions

**4. Technical Assessment** (Days 2-3)
- System examinations
- Configuration reviews
- Security control testing
- Vulnerability scanning
- Penetration testing (if applicable)

**5. Interviews** (Throughout)
- Executive leadership
- IT/Security staff
- End users
- Contractors (if relevant)

**6. Findings Review**
- Preliminary findings presentation
- Discussion and clarification
- Evidence supplementation opportunity

**7. Report Issuance** (2-4 weeks post)
- Official assessment report
- Certification recommendation
- POA&M for any deficiencies

## Preparation Timeline

### 90 Days Before
- Conduct gap analysis
- Develop remediation plan
- Begin evidence collection
- Update documentation
- Schedule mock assessment

### 60 Days Before
- Complete critical remediation
- Organize evidence packages
- Conduct internal audit
- Train interview participants
- Refine documentation

### 30 Days Before
- Final gap closure
- Evidence package finalization
- Interview rehearsals
- Logistics confirmation
- Pre-assessment checklist

### 7 Days Before
- Final readiness review
- Last-minute evidence collection
- Interview preparation refresher
- Facility preparation
- Team briefings

### Assessment Week
- Daily team huddles
- Real-time issue response
- Evidence supplementation
- Stakeholder updates
- Findings management

## Critical Success Factors

### Documentation Excellence
- Complete and current
- Well-organized
- Cross-referenced
- Version controlled
- Easily accessible

### Evidence Quality
- Sufficient quantity
- Appropriate type
- Recent and relevant
- Properly formatted
- Clearly labeled

### Personnel Readiness
- Knowledgeable about roles
- Confident in responses
- Consistent messaging
- Professional demeanor
- Evidence familiarity

### Technical Preparation
- Systems accessible
- Demonstrations ready
- Backups current
- Monitoring active
- Issues addressed

### Logistics Excellence
- Rooms reserved
- Equipment ready
- Access provided
- Schedule published
- Support available

## Common Assessment Pitfalls

### Documentation Issues
- ❌ Outdated policies
- ❌ Missing procedures
- ❌ Inconsistent versions
- ❌ Poor organization
- ❌ Lack of evidence

### Technical Gaps
- ❌ Controls not implemented as documented
- ❌ Configuration drift
- ❌ Unpatched systems
- ❌ Weak passwords
- ❌ Inadequate logging

### Interview Problems
- ❌ Inconsistent responses
- ❌ Lack of knowledge
- ❌ Defensive attitude
- ❌ Contradicting documentation
- ❌ Over-sharing weaknesses

### Logistical Failures
- ❌ Access issues
- ❌ Missing people
- ❌ Technology problems
- ❌ Scheduling conflicts
- ❌ Poor communication

## Interview Preparation

### Key Interview Tips
- Answer the question asked (don't over-elaborate)
- Be honest (don't exaggerate or lie)
- If you don't know, say so (and offer to find out)
- Refer to documentation when appropriate
- Stay calm and professional
- Focus on what you DO, not what you plan to do

### Common Interview Questions by Role

**For Executives:**
- Security program oversight
- Resource allocation
- Risk tolerance
- Incident escalation
- Strategic direction

**For IT/Security Staff:**
- Technical implementations
- Day-to-day operations
- Incident handling
- Change management
- Monitoring procedures

**For End Users:**
- Security awareness
- CUI handling
- Reporting procedures
- Password practices
- Physical security

## Evidence Organization

### Recommended Structure
```
/Assessment_Evidence/
  /01_Policies/
    /Access_Control/
    /Incident_Response/
    ...
  /02_Procedures/
  /03_Technical_Evidence/
    /Configurations/
    /Logs/
    /Screenshots/
  /04_Operational_Evidence/
    /Training_Records/
    /Background_Checks/
    /Audit_Reports/
  /05_Control_Matrix/
  /06_System_Diagrams/
```

### Evidence Index
Create master spreadsheet mapping:
- Control ID
- Control description
- Evidence file(s)
- Location
- Date collected
- Owner

## Your Output Format

When providing audit preparation guidance:

1. **Readiness Assessment**: Current state vs. ready state
2. **Gap Analysis**: What's missing or weak
3. **Preparation Plan**: Timeline and action items
4. **Evidence Checklist**: What to collect and organize
5. **Interview Guide**: Who will be interviewed, sample questions
6. **Logistics Plan**: Schedule, rooms, access, etc.
7. **Day-of Guidance**: What to expect and how to respond
8. **Risk Mitigation**: Backup plans for potential issues

Be thorough, specific, and confidence-building - assessments are stressful, help them succeed.`;

export class AuditPrepAgent extends BaseAgent {
  constructor() {
    super("AUDIT_PREP", AUDIT_PREP_SYSTEM_PROMPT);
  }

  /**
   * Create comprehensive assessment preparation plan
   */
  async createPrepPlan(request: {
    cmmcLevel: 1 | 2 | 3;
    assessmentDate?: Date;
    currentReadiness?: string;
    knownGaps?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const daysUntil = request.assessmentDate
      ? Math.floor((request.assessmentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    const prompt = `Create comprehensive C3PAO assessment preparation plan:

CMMC Level: ${request.cmmcLevel}
${daysUntil !== null ? `Days Until Assessment: ${daysUntil}` : "Assessment Date: Not scheduled"}

${request.currentReadiness ? `Current Readiness:\n${request.currentReadiness}\n` : ""}
${request.knownGaps?.length ? `Known Gaps:\n${request.knownGaps.map((g) => `- ${g}`).join("\n")}` : ""}

Generate detailed preparation plan:

1. **Readiness Assessment**
   - Current state summary
   - Assessment-ready criteria
   - Gap to ready state
   - Overall readiness score (%)
   - Recommended assessment timing

2. **Preparation Timeline**
   ${daysUntil !== null && daysUntil < 90 ? `⚠️ Limited time available (${daysUntil} days)` : ""}

   **Immediate (0-7 days):**
   - Critical action items
   - Quick wins
   - Risk mitigation

   **Short-term (7-30 days):**
   - Gap remediation
   - Evidence collection
   - Documentation updates

   **Medium-term (30-60 days):**
   - Process improvements
   - Training completion
   - Mock assessments

   **Final prep (60-90 days):**
   - Evidence organization
   - Interview preparation
   - Logistics finalization

3. **Gap Remediation Plan**
   For each gap:
   - Gap description
   - Priority (Critical/High/Medium/Low)
   - Remediation steps
   - Responsible party
   - Target completion date
   - Verification method

4. **Evidence Collection Checklist**
   By control family:
   - Evidence needed
   - Collection method
   - Current status
   - Target completion

5. **Documentation Preparation**
   - Policies to update/create
   - Procedures to document
   - Diagrams to create
   - Version control cleanup

6. **Technical Preparation**
   - Systems to remediate
   - Configurations to review
   - Patches to apply
   - Logging to enable
   - Demonstrations to prepare

7. **Personnel Preparation**
   - Interview participants
   - Training needs
   - Rehearsal schedule
   - Knowledge gaps to address

8. **Logistics Planning**
   - Facility requirements
   - Room reservations
   - Equipment needs
   - Access arrangements
   - Support staff

9. **Mock Assessment Schedule**
   - Internal audit date
   - Scope and approach
   - Participants
   - Expected outputs

10. **Risk Management**
    - Assessment risks
    - Mitigation strategies
    - Contingency plans
    - Escalation procedures

11. **Weekly Milestones**
    Week-by-week breakdown of what should be accomplished

12. **Success Metrics**
    - Readiness indicators
    - Progress tracking
    - Go/no-go criteria

Provide actionable plan tailored to ${daysUntil ? `${daysUntil}-day` : "flexible"} timeline.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Prepare interview guides
   */
  async prepareInterviews(request: {
    cmmcLevel: 1 | 2 | 3;
    roles: Array<{
      title: string;
      responsibilities: string;
    }>;
    context?: any;
  }): Promise<AgentResponse> {
    const roleList = request.roles
      .map((r) => `- ${r.title}: ${r.responsibilities}`)
      .join("\n");

    const prompt = `Prepare interview guides for C3PAO assessment:

CMMC Level: ${request.cmmcLevel}

Roles to Interview:
${roleList}

Create comprehensive interview preparation:

1. **Interview Overview**
   - Purpose of interviews
   - Interview format
   - Duration expectations
   - Assessor approach

2. **General Interview Tips**
   - Do's and don'ts
   - How to answer questions
   - What to avoid saying
   - Body language tips
   - Staying on message

For each role:

3. **${request.roles[0]?.title || "Role"} Interview Guide**

   **Likely Questions (10-15 questions):**
   - Question text
   - What assessor is looking for
   - Good answer example
   - Red flag responses to avoid
   - Evidence to reference

   **Knowledge Areas to Review:**
   - Topics to brush up on
   - Policies/procedures to know
   - Systems to be familiar with
   - Processes to understand

   **Control Family Focus:**
   - Which CMMC domains most relevant
   - Key practices to discuss
   - Evidence to mention

   **Preparation Checklist:**
   - Materials to review
   - Practice questions
   - Mock interview recommendations

[Repeat for each role]

4. **Consistency Talking Points**
   - Key messages everyone should know
   - Consistent terminology
   - Company security posture summary
   - Incident response capabilities

5. **Difficult Question Handling**
   - How to handle "gotcha" questions
   - When to defer to colleagues
   - How to admit knowledge gaps
   - How to correct misstatements

6. **Mock Interview Scenarios**
   - Scenario descriptions
   - Practice questions
   - Feedback criteria
   - Improvement areas

7. **Day-of Reminders**
   - Arrive early
   - Dress professionally
   - Bring documentation
   - Stay calm
   - Listen carefully

Provide role-specific, actionable interview preparation.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Organize evidence package
   */
  async organizeEvidence(request: {
    cmmcLevel: 1 | 2 | 3;
    availableEvidence: Record<string, string[]>; // controlId -> evidence files
    context?: any;
  }): Promise<AgentResponse> {
    const evidenceSummary = Object.entries(request.availableEvidence)
      .map(([control, files]) => `${control}: ${files.length} items`)
      .join(", ");

    const prompt = `Organize evidence package for C3PAO assessment:

CMMC Level: ${request.cmmcLevel}
Evidence Summary: ${evidenceSummary}

Create complete evidence organization plan:

1. **Evidence Package Overview**
   - Total evidence items
   - Organization structure
   - Access method (portal, USB, shared drive)
   - Indexing approach

2. **Folder Structure**
   Recommended directory hierarchy:
   - Top-level organization
   - Subfolder breakdown
   - Naming conventions
   - README files

3. **Evidence Index Spreadsheet**
   Columns to include:
   - Control ID
   - Control description
   - Evidence type
   - File name(s)
   - File location
   - Date collected
   - Owner/POC
   - Notes

4. **Control-by-Control Evidence Map**
   For each CMMC control:
   - Control ID and description
   - Required evidence types
   - Evidence provided
   - Evidence location
   - Sufficiency assessment
   - Gaps (if any)

5. **Evidence Quality Review**
   - Strong evidence (ready)
   - Adequate evidence (acceptable)
   - Weak evidence (needs improvement)
   - Missing evidence (critical gap)

6. **Organization Priority**
   Controls to organize first:
   - High-scrutiny controls
   - Complex implementations
   - Multi-evidence controls
   - Gap areas

7. **Evidence Naming Convention**
   Standard format:
   - [ControlID]_[EvidenceType]_[System]_[Date]_[Version]
   - Examples for each type
   - Consistency guidelines

8. **Cross-References**
   - Evidence used for multiple controls
   - Related evidence groupings
   - Dependency mapping

9. **Assessor Access**
   - How will assessors access evidence?
   - Permissions and security
   - Search and navigation
   - Support during assessment

10. **Quality Assurance**
    - Evidence review checklist
    - Spot-check procedure
    - Version verification
    - Completeness validation

11. **Last-Minute Evidence**
    - Process for late additions
    - How to integrate
    - Version control
    - Assessor notification

12. **Backup and Contingency**
    - Evidence backup location
    - Alternative access methods
    - Contingency for tech issues
    - Paper backup (if needed)

Provide detailed organization plan that makes evidence easily accessible and professional.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create assessment-day playbook
   */
  async createAssessmentPlaybook(request: {
    cmmcLevel: 1 | 2 | 3;
    assessmentDuration: number; // days
    teamSize?: number;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create assessment-day playbook:

CMMC Level: ${request.cmmcLevel}
Assessment Duration: ${request.assessmentDuration} days
${request.teamSize ? `Internal Team Size: ${request.teamSize}` : ""}

Generate comprehensive day-of playbook:

1. **Pre-Assessment Day Checklist** (Day before)
   - Facility preparation
   - Equipment setup
   - Evidence final check
   - Team briefing
   - Materials ready
   - Contacts confirmed

2. **Assessment Day Schedule Template**
   For each day:
   - Expected activities
   - Participants needed
   - Locations
   - Break times
   - Evening wrap-up

3. **Kickoff Meeting Guide** (Day 1 morning)
   - Agenda
   - Introductions
   - Scope confirmation
   - Schedule review
   - Logistics overview
   - Questions to ask

4. **Daily Team Huddles**
   - Morning briefing agenda
   - Evening debrief agenda
   - Issue tracking
   - Next-day preparation

5. **Interview Support**
   - Interview schedule tracking
   - Pre-interview briefings
   - Post-interview debriefs
   - Consistency checking

6. **Real-Time Issue Response**
   - Issue identification process
   - Evidence supplementation procedure
   - Technical demonstration setup
   - Escalation protocol

7. **Evidence Access Support**
   - Who manages evidence access
   - How to provide additional evidence
   - Documentation of requests
   - Response SLA

8. **Communication Protocol**
   - Internal team communication
   - Assessor communication
   - Management updates
   - Issue escalation

9. **Do's and Don'ts**

   **Do:**
   - Be professional and courteous
   - Answer questions directly
   - Admit when you don't know
   - Reference documentation
   - Stay positive

   **Don't:**
   - Volunteer negative information
   - Speculate or guess
   - Contradict documentation
   - Over-explain
   - Get defensive

10. **Common Scenarios and Responses**
    - "Show me how you do X"
    - "Where is the evidence for Y?"
    - "This doesn't match the documentation"
    - "Can you explain this finding?"
    - "We need additional information"

11. **Issue Log Template**
    - Issue description
    - Severity
    - Response needed
    - Owner
    - Status
    - Resolution

12. **Contingency Plans**
    - Key person unavailable
    - System unavailable
    - Evidence not accessible
    - Schedule conflicts
    - Technical failures

13. **Daily Checklist**
    Day 1:
    - [ ] Kickoff completed
    - [ ] Documentation review started
    - [ ] Initial questions answered
    - [ ] Tomorrow prepared

    Day 2:
    - [ ] Technical reviews
    - [ ] Interviews conducted
    - [ ] Evidence supplemented
    - [ ] Issues tracked

    [Continue for each day]

14. **Closing Meeting Preparation**
    - Preliminary findings review
    - Clarification questions
    - POA&M discussion
    - Next steps
    - Timeline

15. **Post-Assessment Immediately After**
    - Team debrief
    - Lessons learned capture
    - Outstanding items tracking
    - Follow-up scheduling

Provide day-by-day, hour-by-hour guidance for assessment week.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Conduct mock assessment
   */
  async conductMockAssessment(request: {
    cmmcLevel: 1 | 2 | 3;
    focusAreas?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Design mock C3PAO assessment:

CMMC Level: ${request.cmmcLevel}
${request.focusAreas?.length ? `Focus Areas: ${request.focusAreas.join(", ")}` : "Full scope"}

Create mock assessment guide:

1. **Mock Assessment Overview**
   - Purpose and objectives
   - Scope and approach
   - Duration
   - Participants
   - Success criteria

2. **Preparation for Mock**
   - What team should prepare
   - Evidence to have ready
   - People to involve
   - Systems to access

3. **Mock Assessment Schedule**
   - Session-by-session breakdown
   - Time allocations
   - Participants per session
   - Deliverables

4. **Documentation Review Simulation**
   - Policies to review
   - Questions to ask
   - Gaps to identify
   - Improvement areas

5. **Technical Review Simulation**
   - Systems to examine
   - Configurations to check
   - Tests to perform
   - Issues to identify

6. **Interview Simulations**
   - Roles to interview
   - Questions to ask
   - Response evaluation
   - Feedback provision

7. **Evidence Evaluation**
   - Evidence to review
   - Sufficiency assessment
   - Quality evaluation
   - Gap identification

8. **Findings and Feedback**
   - Finding categories
   - Severity levels
   - Feedback format
   - Improvement recommendations

9. **Scoring Methodology**
   - How to score responses
   - Control implementation levels
   - Evidence adequacy ratings
   - Overall readiness score

10. **Mock Assessor Checklist**
    - What to look for
    - Red flags
    - Best practices
    - Common mistakes

11. **Debrief Session**
    - Findings presentation
    - Discussion and clarification
    - Prioritization
    - Action planning

12. **Gap Remediation Plan**
    - Gaps identified
    - Remediation actions
    - Responsible parties
    - Timeline
    - Verification method

13. **Mock to Real Assessment Improvements**
    - What to improve
    - How to improve
    - Timeline for changes
    - Re-mock if needed?

Provide complete mock assessment that realistically simulates actual C3PAO assessment.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Handle assessment findings
   */
  async handleFindings(request: {
    findings: Array<{
      controlId: string;
      issue: string;
      severity: string;
    }>;
    context?: any;
  }): Promise<AgentResponse> {
    const findingsList = request.findings
      .map((f) => `- ${f.controlId} (${f.severity}): ${f.issue}`)
      .join("\n");

    const prompt = `Develop response plan for assessment findings:

Findings:
${findingsList}

Create comprehensive findings response:

1. **Findings Summary**
   - Total findings
   - Breakdown by severity
   - Breakdown by control family
   - Assessment impact

2. **Finding-by-Finding Analysis**
   For each finding:
   - Finding description
   - Root cause
   - Why it matters
   - Immediate response
   - Long-term solution

3. **Certification Impact**
   - Will findings prevent certification?
   - POA&M eligibility
   - Timeline implications
   - Risks

4. **Immediate Response (48 hours)**
   - Critical findings to address
   - Quick remediation
   - Evidence to provide
   - Clarifications needed

5. **POA&M Development**
   (Plan of Action & Milestones)

   For each finding:
   - POA&M item description
   - Remediation plan
   - Resources required
   - Milestone dates
   - Completion date
   - Responsible party

6. **Remediation Priority**
   - Must fix before certification
   - Must fix within POA&M timeline
   - Should fix (best practice)
   - Nice to have

7. **Resource Requirements**
   - Staff time
   - Budget
   - Tools/technology
   - External help

8. **Communication Plan**
   - Internal stakeholders
   - Assessor communication
   - Management updates
   - Timeline communication

9. **Evidence Collection**
   - Additional evidence needed
   - How to collect
   - Format and timing
   - Submission process

10. **Verification Process**
    - How to verify remediation
    - Testing procedures
    - Evidence of fix
    - Re-assessment needs

11. **Lessons Learned**
    - Why did these findings occur?
    - What to change
    - Process improvements
    - Training needs

12. **Prevention Strategy**
    - How to prevent recurrence
    - Monitoring approach
    - Review frequency
    - Continuous improvement

Provide actionable plan to address all findings and achieve certification.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
