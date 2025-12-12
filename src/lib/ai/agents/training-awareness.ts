/**
 * Training & Awareness Agent
 *
 * Generates security awareness training content and tracks employee certification
 * for CMMC compliance
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const TRAINING_AWARENESS_SYSTEM_PROMPT = `You are the Training & Awareness Agent for CMMC Genie, an expert in cybersecurity awareness training and CMMC compliance education.

## Your Role

You help organizations:
- Create role-based security awareness training
- Generate CMMC-specific training content
- Design quizzes and assessments
- Plan training campaigns and schedules
- Track training completion and certification
- Develop ongoing awareness programs
- Create engaging, effective training materials

## CMMC Training Requirements

### Personnel Security (PS) Requirements
- **PS.2.127**: Screen personnel prior to authorizing access to CUI
- **PS.2.128**: Ensure personnel training on security awareness and CUI handling
- **PS.2.129**: Formally sanction personnel failing to comply

### Awareness and Training (AT) Requirements
- **AT.2.056**: Ensure managers understand security responsibilities
- **AT.2.057**: Ensure personnel understand cybersecurity practices
- **AT.2.058**: Provide security awareness training on recognizing threats
- **AT.2.059**: Provide training on malicious code
- **AT.2.060**: Provide training on insider threats
- **AT.2.061**: Update training content for new security requirements

## Training Content Areas

### 1. Basic Security Awareness (All Personnel)
- Password security and management
- Physical security practices
- Social engineering and phishing
- Acceptable use of IT systems
- Clean desk/clear screen policies
- Mobile device security
- Incident reporting procedures

### 2. CUI Handling (Personnel with CUI Access)
- What is CUI?
- Identifying CUI
- Marking CUI properly
- Storing CUI securely
- Transmitting CUI safely
- Disposing of CUI properly
- Reporting CUI incidents
- Legal/contractual obligations

### 3. Role-Specific Training

**System Administrators:**
- Secure configuration management
- Patch management
- Log review and monitoring
- Incident response procedures
- Backup and recovery
- Access control management

**Developers:**
- Secure coding practices
- Code review procedures
- Configuration management
- Testing requirements
- Change control

**Managers:**
- Security responsibilities
- Risk management
- Compliance obligations
- Resource allocation
- Personnel security

**General Users:**
- Day-to-day security practices
- CUI handling (if applicable)
- Recognizing threats
- Reporting procedures

### 4. Threat-Specific Training
- Phishing and email security
- Ransomware awareness
- Insider threat indicators
- Physical security threats
- Supply chain risks
- Social engineering tactics

## Training Delivery Methods

1. **Computer-Based Training (CBT)**
   - Self-paced modules
   - Videos and interactive content
   - Embedded quizzes
   - Progress tracking

2. **Instructor-Led Training**
   - In-person sessions
   - Virtual webinars
   - Q&A opportunities
   - Hands-on exercises

3. **Phishing Simulations**
   - Realistic attack scenarios
   - Immediate feedback
   - Progressive difficulty
   - Performance tracking

4. **Security Reminders**
   - Email tips
   - Posters and signage
   - Screensavers
   - Intranet articles

5. **Tabletop Exercises**
   - Scenario-based learning
   - Team collaboration
   - Incident response practice
   - Lessons learned

## Training Program Elements

### Effective Training Includes:
- ✅ Clear learning objectives
- ✅ Relevant, practical content
- ✅ Engaging delivery
- ✅ Real-world examples
- ✅ Knowledge assessments
- ✅ Completion tracking
- ✅ Refresher schedule
- ✅ Effectiveness measurement

### Poor Training Characteristics:
- ❌ Generic, one-size-fits-all
- ❌ Too long and boring
- ❌ Technical jargon without explanation
- ❌ No assessment of learning
- ❌ No tracking
- ❌ Annual only (too infrequent)
- ❌ No relevance to job roles

## Assessment and Certification

### Training Assessment Should:
1. Test comprehension, not memorization
2. Use scenario-based questions
3. Require passing score (typically 80%+)
4. Allow retakes with different questions
5. Track scores and attempts
6. Generate certificates upon passing

### Certification Tracking Must Include:
- Employee name and ID
- Training module completed
- Completion date
- Score achieved
- Certificate issued
- Next due date
- Acknowledgment signed

## Training Schedule

**Initial Training**: Upon hire or before CUI access
**Refresher Training**: At least annually
**Update Training**: When threats or requirements change
**Remedial Training**: After security violations

## Effectiveness Measurement

Track these metrics:
- Completion rates
- Time to complete
- Assessment scores
- Phishing simulation click rates
- Security incident trends
- User feedback/satisfaction
- Behavior change indicators

## Content Tone and Style

Training should be:
- **Practical**: Focus on what employees actually need to do
- **Relevant**: Tied to their specific roles and systems
- **Engaging**: Use stories, examples, and scenarios
- **Positive**: Empower rather than scare
- **Clear**: Avoid jargon and complexity
- **Concise**: Respect people's time
- **Actionable**: Provide clear dos and don'ts

## Your Output Format

When creating training content, provide:

1. **Learning Objectives**
   - What learners will know
   - What learners will be able to do
   - How it relates to their role

2. **Content Outline**
   - Module structure
   - Topics covered
   - Estimated duration
   - Delivery method

3. **Training Materials**
   - Slide content or script
   - Examples and scenarios
   - Visual aids
   - Reference materials

4. **Assessment Questions**
   - Multiple choice, true/false, scenario-based
   - Correct answers indicated
   - Explanations for answers
   - Difficulty level noted

5. **Implementation Guide**
   - How to deliver
   - Who should attend
   - Prerequisites
   - Follow-up activities

Create training that actually changes behavior, not just checks a compliance box.`;

export class TrainingAwarenessAgent extends BaseAgent {
  constructor() {
    super("TRAINING", TRAINING_AWARENESS_SYSTEM_PROMPT);
  }

  /**
   * Generate training module content
   */
  async generateTrainingModule(request: {
    topic: string;
    audience: string;
    duration: number; // minutes
    cmmcLevel: 1 | 2 | 3;
    deliveryMethod?: "cbt" | "instructor-led" | "both";
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create a comprehensive training module on ${request.topic} for ${request.audience}:

Duration: ${request.duration} minutes
CMMC Level: ${request.cmmcLevel}
Delivery Method: ${request.deliveryMethod || "cbt"}

Provide complete training module including:

1. **Module Overview**
   - Learning objectives (3-5 specific goals)
   - Target audience description
   - Prerequisites
   - CMMC controls addressed

2. **Content Outline**
   - Section-by-section breakdown
   - Topics covered in each section
   - Time allocation per section
   - Key points to emphasize

3. **Detailed Content** (for each section)
   - Main content/script
   - Examples relevant to ${request.audience}
   - Stories or scenarios
   - Visual suggestions (diagrams, screenshots, etc.)
   - Discussion points (if instructor-led)

4. **Activities/Interactions**
   - Interactive elements
   - Discussion questions
   - Hands-on exercises
   - Group activities (if applicable)

5. **Knowledge Check Questions** (10-15 questions)
   - Mix of multiple choice, true/false, and scenario-based
   - Questions testing comprehension of key concepts
   - Correct answers indicated
   - Explanations for correct/incorrect answers

6. **Summary and Takeaways**
   - Key points recap
   - Action items for learners
   - Reference materials
   - Where to get help

7. **Implementation Guide**
   - Instructor notes (if applicable)
   - Technical requirements
   - Materials needed
   - Preparation checklist

8. **Follow-up**
   - Reinforcement activities
   - Job aids or quick reference guides
   - Next training in series (if applicable)

Make the content engaging, practical, and specific to ${request.audience}.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create security awareness quiz
   */
  async createQuiz(request: {
    topic: string;
    difficulty: "basic" | "intermediate" | "advanced";
    questionCount: number;
    questionTypes?: string[]; // multiple-choice, true-false, scenario
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create a security awareness quiz on ${request.topic}:

Difficulty Level: ${request.difficulty}
Number of Questions: ${request.questionCount}
${request.questionTypes?.length ? `Question Types: ${request.questionTypes.join(", ")}` : "Question Types: Mix of multiple-choice, true/false, and scenario-based"}

Generate quiz with:

1. **Quiz Metadata**
   - Topic and subtopics covered
   - Difficulty level
   - Passing score recommendation
   - Estimated completion time
   - Learning objectives assessed

2. **Questions** (for each question, provide):
   - Question number
   - Question type
   - Question text
   - Answer options (for multiple choice)
   - Correct answer
   - Explanation of why the answer is correct
   - Explanation of why other options are wrong
   - CMMC control(s) related to this question

3. **Answer Key**
   - Quick reference of correct answers
   - Scoring guide
   - Interpretation of scores

4. **Quiz Administration Guidelines**
   - Time limit recommendation
   - Retake policy suggestion
   - Proctoring requirements (if any)
   - Accommodations for accessibility

5. **Remediation Guidance**
   - If score < 70%: Retake training and quiz
   - If score 70-79%: Review specific topics and retake
   - If score 80-89%: Pass, review missed topics
   - If score 90-100%: Pass with distinction

Ensure questions are fair, clear, and test understanding (not just memorization).`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Design phishing simulation campaign
   */
  async designPhishingSimulation(request: {
    organizationSize: "small" | "medium" | "large";
    sophisticationLevel: "basic" | "moderate" | "advanced";
    frequency?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Design a phishing simulation campaign for a ${request.organizationSize} organization:

Sophistication Level: ${request.sophisticationLevel}
${request.frequency ? `Frequency: ${request.frequency}` : "Frequency: Monthly"}

Create comprehensive phishing simulation plan:

1. **Campaign Overview**
   - Goals and objectives
   - Success metrics
   - Timeline
   - Reporting structure

2. **Simulation Scenarios** (provide 5-7 scenarios)
   For each scenario:
   - Scenario name and description
   - Attack vector (email, SMS, phone, etc.)
   - Sophistication indicators
   - Target audience
   - Sample email content/template
   - Expected behaviors (click, download, report, ignore)
   - Learning points

3. **Progressive Difficulty**
   - Month 1-2: Basic simulations
   - Month 3-4: Moderate complexity
   - Month 5-6: Advanced tactics
   - Ongoing: Mix based on performance

4. **Immediate Feedback**
   - Landing page content for users who click
   - Educational messaging
   - Remedial training assignment
   - Positive reinforcement for reporters

5. **Metrics and Reporting**
   - Click-through rate
   - Credential entry rate
   - Reporting rate
   - Time to report
   - Repeat clickers
   - Trend analysis

6. **Response Protocols**
   - Who gets notified of results
   - Follow-up actions for clickers
   - Remedial training process
   - Manager notifications
   - Repeat offender handling

7. **Best Practices**
   - Avoid embarrassment/punishment
   - Focus on education
   - Celebrate reporters
   - Vary timing and themes
   - Make realistic but safe

8. **Sample Phishing Emails**
   Provide 3-5 complete email templates including:
   - Subject line
   - From address (spoofed)
   - Email body
   - Call to action
   - Red flags to spot

Design simulations that educate and improve behavior without creating fear or resentment.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create role-based training plan
   */
  async createRoleBasedPlan(request: {
    role: string;
    responsibilities: string;
    cuiAccess: boolean;
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create a comprehensive training plan for the ${request.role} role:

Responsibilities: ${request.responsibilities}
CUI Access: ${request.cuiAccess ? "Yes" : "No"}
CMMC Level: ${request.cmmcLevel}

Develop complete training curriculum:

1. **Initial Training** (Before system access)
   - Required modules
   - Estimated total duration
   - Completion criteria
   - Testing requirements

2. **Training Modules**
   For each required module:
   - Module name and description
   - Learning objectives
   - Duration
   - Delivery method
   - Assessment type
   - CMMC controls addressed

3. **Annual Refresher Training**
   - Topics to review
   - Duration
   - Updates from initial training
   - Assessment requirements

4. **Just-in-Time Training**
   - When new systems are introduced
   - When procedures change
   - After security incidents
   - Before handling new CUI types

5. **Training Schedule**
   - Day 1: Orientation modules
   - Week 1: Core security training
   - Month 1: Role-specific training
   - Ongoing: Refreshers and updates
   - Annual: Comprehensive review

6. **Competency Verification**
   - How to assess competency
   - Practical demonstrations needed
   - Passing criteria
   - Retraining triggers

7. **Training Materials Needed**
   - CBT modules to create/purchase
   - Instructor guides
   - Job aids and quick references
   - System-specific documentation

8. **Documentation Requirements**
   - Training records to maintain
   - Certificates to issue
   - Acknowledgments to collect
   - Evidence for assessors

Ensure training is appropriate for role responsibilities and CUI access level.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate awareness campaign
   */
  async generateAwarenessCampaign(request: {
    theme: string; // e.g., "Password Security", "Social Engineering"
    duration: string; // e.g., "1 month", "1 quarter"
    deliveryChannels?: string[]; // email, posters, screensavers, etc.
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create a security awareness campaign on ${request.theme}:

Campaign Duration: ${request.duration}
${request.deliveryChannels?.length ? `Delivery Channels: ${request.deliveryChannels.join(", ")}` : "Delivery Channels: Email, posters, intranet"}

Design comprehensive awareness campaign:

1. **Campaign Overview**
   - Theme and key messages
   - Target behaviors to change
   - Success metrics
   - Timeline and milestones

2. **Week-by-Week Plan**
   For each week of the campaign:
   - Weekly theme/focus
   - Key message
   - Activities and deliverables
   - Channels used

3. **Email Communications** (provide 4-6 emails)
   For each email:
   - Subject line
   - Email content (engaging, brief)
   - Call to action
   - Sending schedule

4. **Visual Materials**
   Provide concepts for:
   - Posters (design description, headline, body copy)
   - Digital signage slides
   - Screensaver messages
   - Intranet banner ads
   - Social media posts (if applicable)

5. **Interactive Elements**
   - Quiz or challenge
   - Contest or gamification
   - Reporting mechanism
   - Feedback collection

6. **Engagement Tactics**
   - Incentives for participation
   - Leadership involvement
   - Department challenges
   - Recognition for compliance

7. **Measurement Plan**
   - Awareness metrics (surveys, recalls)
   - Behavior metrics (phishing clicks, password changes)
   - Participation rates
   - Feedback scores

8. **Follow-up and Reinforcement**
   - Post-campaign survey
   - Ongoing reminders
   - Integration into regular training
   - Continuous improvement

Create engaging, memorable campaign that drives real behavior change around ${request.theme}.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Evaluate training effectiveness
   */
  async evaluateEffectiveness(request: {
    trainingProgram: string;
    metrics: {
      completionRate?: number;
      averageScore?: number;
      phishingClickRate?: number;
      incidentCount?: number;
      feedback?: string;
    };
    context?: any;
  }): Promise<AgentResponse> {
    const metricsDisplay = Object.entries(request.metrics)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join("\n");

    const prompt = `Evaluate the effectiveness of the ${request.trainingProgram} training program:

Current Metrics:
${metricsDisplay}

Provide comprehensive effectiveness analysis:

1. **Overall Assessment**
   - Effectiveness rating (Highly Effective / Effective / Needs Improvement / Ineffective)
   - Key strengths
   - Major weaknesses
   - Overall recommendation

2. **Metric Analysis**
   For each metric provided:
   - What it tells us
   - How it compares to benchmarks
   - Trend implications
   - Action items

3. **Completion Rate Analysis**
   - Is completion rate acceptable? (target: >95%)
   - Barriers to completion
   - Strategies to improve
   - Follow-up for non-completers

4. **Learning Effectiveness**
   - Are scores indicating comprehension? (target: avg >85%)
   - Are assessments too easy or too hard?
   - Knowledge gaps identified
   - Content improvement recommendations

5. **Behavior Change Evidence**
   - Are trained behaviors evident?
   - Reduction in security incidents?
   - Improvement in simulations?
   - Anecdotal evidence

6. **Learner Feedback Analysis**
   - What do learners say?
   - Common complaints or praise
   - Suggested improvements
   - Engagement indicators

7. **ROI Analysis**
   - Cost of training
   - Value delivered
   - Incident reduction impact
   - Compliance value
   - Overall ROI assessment

8. **Recommendations**
   - Continue as-is / Modify / Replace
   - Specific improvements to make
   - New content to add
   - Delivery method changes
   - Assessment revisions
   - Schedule adjustments

9. **Action Plan**
   - Immediate changes (this month)
   - Short-term improvements (next quarter)
   - Long-term enhancements (next year)
   - Success metrics for improvements

Provide data-driven recommendations for improving training effectiveness.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
