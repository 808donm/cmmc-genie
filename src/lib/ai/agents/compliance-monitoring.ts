/**
 * Compliance Monitoring Agent
 *
 * Provides continuous compliance monitoring and drift detection
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const COMPLIANCE_MONITORING_SYSTEM_PROMPT = `You are the Compliance Monitoring Agent for CMMC Genie, an expert in continuous compliance monitoring, configuration drift detection, and ongoing CMMC maintenance.

## Your Role

You help organizations:
- Monitor ongoing CMMC compliance
- Detect configuration drift
- Identify control effectiveness degradation
- Track compliance metrics
- Generate compliance reports
- Alert on compliance violations
- Maintain certification status

## Continuous Monitoring Philosophy

CMMC compliance is not one-time - it requires continuous:
- **Monitoring**: Track control implementation
- **Testing**: Verify controls work as intended
- **Validation**: Confirm continued effectiveness
- **Reporting**: Document compliance status
- **Improvement**: Address issues promptly

### Why Continuous Monitoring?

1. **Maintain Certification**: CMMC certs expire, must maintain compliance
2. **Detect Drift**: Configurations change, controls weaken
3. **Identify Threats**: New vulnerabilities emerge
4. **Prove Compliance**: Demonstrate ongoing adherence
5. **Enable Improvement**: Identify optimization opportunities

## Monitoring Areas

### 1. Technical Controls
- **Configuration Management**
  - Baseline deviations
  - Unauthorized changes
  - Security settings drift
  - Patch status

- **Access Control**
  - User account changes
  - Permission modifications
  - Failed login attempts
  - Privilege escalations

- **Network Security**
  - Firewall rule changes
  - Port scan detections
  - Traffic anomalies
  - Boundary violations

- **Vulnerability Management**
  - Scan results
  - Patch levels
  - Missing updates
  - Emerging CVEs

### 2. Operational Controls
- **Training & Awareness**
  - Training completion rates
  - Phishing simulation results
  - Knowledge gaps
  - Certification status

- **Incident Response**
  - Incident frequency
  - Response times
  - Lessons learned implementation
  - Drill completion

- **Physical Security**
  - Access log reviews
  - Visitor management
  - Badge compliance
  - Facility changes

### 3. Documentation Controls
- **Policy & Procedure Updates**
  - Review dates
  - Version currency
  - Approval status
  - Distribution tracking

- **Evidence Collection**
  - Evidence freshness
  - Gap identification
  - Archive management
  - Audit trails

### 4. Compliance Metrics
- **Control Effectiveness**
  - Implementation level
  - Testing results
  - Issue counts
  - Trend analysis

- **Risk Posture**
  - Risk score changes
  - New risks
  - Mitigation status
  - Residual risk levels

## Monitoring Frequencies

### Continuous (Automated)
- Log monitoring
- Intrusion detection
- Configuration scanning
- Vulnerability scanning
- Access monitoring

### Daily
- Alert review
- Incident triage
- Critical system checks
- Backup verification

### Weekly
- Vulnerability reports
- Access reviews
- Change logs
- Compliance dashboards

### Monthly
- Control testing
- Policy reviews
- Training status
- Metric reporting

### Quarterly
- Comprehensive assessments
- Executive reporting
- Program reviews
- Certification preparation

### Annually
- Full risk assessments
- Policy updates
- Program audits
- Certification renewal

## Configuration Drift Detection

### What is Configuration Drift?
Gradual deviation from security baselines due to:
- Manual changes
- Software updates
- Hardware replacements
- Personnel turnover
- Process creep

### Detection Methods
- Automated scanning against baselines
- Configuration management tools
- Change tracking
- Alert on deviations
- Regular audits

### Common Drift Areas
- Firewall rules (accumulation)
- User accounts (orphaned)
- Patches (missing)
- Logging (disabled)
- Encryption (weakened)

## Compliance Dashboards

### Executive Dashboard
- Overall compliance score
- Trend indicators
- Top risks
- Recent incidents
- Upcoming milestones

### Operational Dashboard
- Control status by family
- Open issues
- Testing schedule
- Training completion
- Evidence gaps

### Technical Dashboard
- System health
- Vulnerability status
- Patch compliance
- Configuration drift
- Security alerts

## Alerting and Escalation

### Alert Severity Levels

**Critical**:
- Control failure
- Major drift detected
- CUI at risk
- Compliance violation
- **Response**: Immediate action

**High**:
- Control degradation
- Significant drift
- Policy violation
- Test failure
- **Response**: Within 4 hours

**Medium**:
- Minor drift
- Approaching thresholds
- Overdue reviews
- Training gaps
- **Response**: Within 24 hours

**Low**:
- Informational
- Trend indicators
- Scheduled reviews
- Best practice suggestions
- **Response**: Next business day

### Escalation Procedures
- Define stakeholders
- Notification methods
- Response timelines
- Escalation triggers
- Resolution tracking

## Reporting

### Weekly Status Report
- New issues
- Resolved issues
- Control testing results
- Compliance metrics
- Upcoming activities

### Monthly Compliance Report
- Overall status
- Metric trends
- Risk updates
- Incident summary
- Recommendations

### Quarterly Executive Report
- Certification status
- Program effectiveness
- Strategic initiatives
- Resource needs
- Future planning

### Annual Assessment Report
- Comprehensive review
- Year-over-year comparison
- Maturity assessment
- Investment ROI
- Next year priorities

## Your Output Format

When providing monitoring guidance:

1. **Monitoring Plan**: What to monitor and how
2. **Metrics Definition**: KPIs and measurement methods
3. **Alert Criteria**: When to alert and who
4. **Dashboard Design**: What to display
5. **Reporting Schedule**: When and to whom
6. **Issue Response**: How to handle findings
7. **Continuous Improvement**: How to get better

Be specific about automation opportunities - manual monitoring doesn't scale.`;

export class ComplianceMonitoringAgent extends BaseAgent {
  constructor() {
    super("COMPLIANCE_MONITORING", COMPLIANCE_MONITORING_SYSTEM_PROMPT);
  }

  /**
   * Create monitoring program
   */
  async createMonitoringProgram(request: {
    cmmcLevel: 1 | 2 | 3;
    organizationSize: "small" | "medium" | "large";
    existingTools?: string[];
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create comprehensive compliance monitoring program:

CMMC Level: ${request.cmmcLevel}
Organization Size: ${request.organizationSize}
${request.existingTools?.length ? `Existing Tools: ${request.existingTools.join(", ")}` : ""}

Design complete monitoring program:

1. **Program Overview**
   - Objectives
   - Scope
   - Approach
   - Governance

2. **Monitoring Framework**
   - Control families to monitor
   - Monitoring frequencies
   - Responsible parties
   - Escalation procedures

3. **Technical Monitoring**
   - Configuration drift detection
   - Vulnerability management
   - Access control monitoring
   - Network security monitoring
   - Log analysis
   - Tools and automation

4. **Operational Monitoring**
   - Policy compliance
   - Training effectiveness
   - Incident metrics
   - Change tracking
   - Physical security

5. **Metrics and KPIs**
   For each control family:
   - Key metrics to track
   - Target values
   - Alert thresholds
   - Trend analysis

6. **Automated Monitoring**
   - What can be automated
   - Tools required
   - Alert configuration
   - Integration points

7. **Manual Reviews**
   - What requires human review
   - Review frequency
   - Review procedures
   - Documentation requirements

8. **Dashboard Design**
   - Executive dashboard
   - Operational dashboard
   - Technical dashboard
   - Widget specifications

9. **Alerting Strategy**
   - Alert definitions
   - Severity levels
   - Notification methods
   - Response procedures

10. **Reporting Schedule**
    - Weekly reports
    - Monthly reports
    - Quarterly reports
    - Annual assessments
    - Ad-hoc reporting

11. **Issue Management**
    - Issue identification
    - Severity classification
    - Assignment process
    - Tracking system
    - Resolution verification

12. **Continuous Improvement**
    - Metric review process
    - Program effectiveness assessment
    - Optimization opportunities
    - Best practice integration

13. **Tool Requirements**
    - Recommended tools by function
    - Integration requirements
    - Budget estimates
    - Implementation timeline

14. **Implementation Roadmap**
    - Phase 1: Critical monitoring
    - Phase 2: Expanded coverage
    - Phase 3: Automation
    - Phase 4: Optimization

Provide practical program sized for ${request.organizationSize} organization.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Detect configuration drift
   */
  async detectDrift(request: {
    system: string;
    currentConfig: string;
    baselineConfig: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Analyze configuration drift:

System: ${request.system}

Baseline Configuration:
${request.baselineConfig}

Current Configuration:
${request.currentConfig}

Perform drift analysis:

1. **Drift Summary**
   - Drift detected? (Yes/No)
   - Severity (Critical/High/Medium/Low/None)
   - Number of changes
   - Risk assessment

2. **Changes Identified**
   For each change:
   - Setting changed
   - Baseline value
   - Current value
   - Change type (Addition/Deletion/Modification)
   - When changed (if known)

3. **Security Impact Analysis**
   For each change:
   - Security impact (Critical/High/Medium/Low/None)
   - Why it matters
   - CMMC controls affected
   - Risk introduced

4. **Unauthorized Changes**
   - Changes not documented
   - Changes not approved
   - Potential policy violations
   - Investigation needed

5. **Compliance Impact**
   - CMMC compliance affected? (Yes/No)
   - Which controls compromised
   - Certification risk
   - Immediate actions required

6. **Remediation Recommendations**
   For each significant change:
   - Should it be reverted?
   - Should baseline be updated?
   - Approval required?
   - Implementation steps

7. **Root Cause Analysis**
   - Why did drift occur?
   - Process gap
   - Tool limitation
   - Human error
   - Prevention strategy

8. **Prevention Measures**
   - How to prevent recurrence
   - Monitoring improvements
   - Process changes
   - Tool enhancements

9. **Priority Actions**
   - Immediate (within 24 hours)
   - Short-term (this week)
   - Long-term (this month)

10. **Baseline Update Decision**
    - Should baseline be updated?
    - Justification
    - Approval process
    - Documentation requirements

Provide detailed drift analysis with clear remediation guidance.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate compliance report
   */
  async generateReport(request: {
    reportType: "weekly" | "monthly" | "quarterly" | "annual";
    cmmcLevel: 1 | 2 | 3;
    metrics?: Record<string, number>;
    incidents?: number;
    context?: any;
  }): Promise<AgentResponse> {
    const metricsDisplay = request.metrics
      ? Object.entries(request.metrics)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join("\n")
      : "Not provided";

    const prompt = `Generate ${request.reportType} compliance report:

CMMC Level: ${request.cmmcLevel}
${request.incidents !== undefined ? `Incidents This Period: ${request.incidents}` : ""}

Metrics:
${metricsDisplay}

Create comprehensive ${request.reportType} report:

1. **Executive Summary**
   - Overall compliance status
   - Key achievements
   - Significant issues
   - Trend indicators
   - Recommendations

2. **Compliance Posture**
   - Overall score/percentage
   - Change from last period
   - By control family
   - Risk level distribution

3. **Control Status**
   For each CMMC family:
   - Implementation status
   - Testing results
   - Issues identified
   - Remediation status

4. **Metrics and Trends**
   - Key performance indicators
   - Period-over-period comparison
   - Trend analysis
   - Projections

5. **Issues and Findings**
   - New issues this period
   - Resolved issues
   - Open issues (by age)
   - Critical issues requiring attention

6. **Incidents and Events**
   - Incident summary
   - Impact assessment
   - Response effectiveness
   - Lessons learned

7. **Testing and Validation**
   - Tests completed
   - Test results
   - Failures and remediation
   - Upcoming tests

8. **Training and Awareness**
   - Completion rates
   - Phishing results
   - Knowledge gaps
   - Upcoming training

9. **Risk Management**
   - New risks identified
   - Risk score changes
   - Mitigations completed
   - Residual risk

10. **Change Management**
    - Changes implemented
    - Change impact
    - Compliance maintained
    - Issues from changes

11. **Upcoming Activities**
    - Scheduled assessments
    - Policy reviews
    - Training sessions
    - Major initiatives

12. **Resource Needs**
    - Budget requests
    - Staffing needs
    - Tool requirements
    - External support

13. **Recommendations**
    - Process improvements
    - Tool additions
    - Training needs
    - Policy updates

${request.reportType === "quarterly" || request.reportType === "annual" ? `\n14. **Strategic Initiatives**\n    - Major accomplishments\n    - Program maturity growth\n    - Future planning\n    - Investment ROI` : ""}

${request.reportType === "annual" ? `\n15. **Year in Review**\n    - Annual highlights\n    - Year-over-year comparison\n    - Lessons learned\n    - Next year priorities` : ""}

Provide professional, data-driven report suitable for ${request.reportType} cadence.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Design compliance dashboard
   */
  async designDashboard(request: {
    dashboardType: "executive" | "operational" | "technical";
    cmmcLevel: 1 | 2 | 3;
    updateFrequency?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Design ${request.dashboardType} compliance dashboard:

CMMC Level: ${request.cmmcLevel}
${request.updateFrequency ? `Update Frequency: ${request.updateFrequency}` : ""}

Create comprehensive dashboard design:

1. **Dashboard Overview**
   - Purpose and audience
   - Update frequency
   - Data sources
   - Access control

2. **Layout and Structure**
   - Dashboard sections
   - Widget placement
   - Visual hierarchy
   - Navigation

3. **Key Metrics (Widgets)**
   For each metric:
   - Metric name
   - Calculation method
   - Visualization type (gauge, chart, table, etc.)
   - Color coding (red/yellow/green thresholds)
   - Data source
   - Update frequency

4. **${request.dashboardType === "executive" ? "Executive Widgets" : request.dashboardType === "operational" ? "Operational Widgets" : "Technical Widgets"}**

   ${
     request.dashboardType === "executive"
       ? `- Overall Compliance Score (0-100%)
   - Compliance Trend (last 6 months)
   - Control Family Status (pie chart)
   - Top 5 Risks (table)
   - Recent Incidents (summary)
   - Certification Status (indicator)
   - Budget vs. Actual (chart)
   - Upcoming Milestones (calendar)`
       : request.dashboardType === "operational"
         ? `- Control Implementation Status (by family)
   - Open Issues (by severity)
   - Testing Schedule (calendar)
   - Training Completion (by role)
   - Evidence Collection Status (%)
   - Recent Changes (table)
   - Overdue Items (list)
   - This Week's Priorities (checklist)`
         : `- System Health (status indicators)
   - Vulnerability Counts (by severity)
   - Patch Compliance (%)
   - Configuration Drift (alerts)
   - Failed Login Attempts (chart)
   - Security Alerts (last 24h)
   - Backup Status (pass/fail)
   - Network Traffic Anomalies (chart)`
   }

5. **Drill-Down Capabilities**
   - What users can click for details
   - Detail view specifications
   - Filtering options
   - Export capabilities

6. **Alerting and Notifications**
   - Alert indicators on dashboard
   - Notification methods
   - Alert acknowledgment
   - Alert history

7. **Data Integration**
   - Systems to integrate
   - API requirements
   - Data refresh schedule
   - Error handling

8. **Color Coding Standard**
   - Green: Compliant/Good
   - Yellow: Warning/Attention needed
   - Red: Non-compliant/Critical
   - Gray: Not applicable/No data

9. **User Experience**
   - Load time expectations
   - Mobile responsiveness
   - Print capability
   - Accessibility

10. **Implementation**
    - Recommended platforms/tools
    - Development effort
    - Data pipeline setup
    - Testing requirements

11. **Mockup/Wireframe**
    Text-based representation of dashboard layout

12. **Metrics Definitions**
    Detailed calculation for each metric

Provide detailed specifications for implementable ${request.dashboardType} dashboard.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Define monitoring metrics
   */
  async defineMetrics(request: {
    cmmcLevel: 1 | 2 | 3;
    controlFamily?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const scope = request.controlFamily
      ? `for ${request.controlFamily} control family`
      : `for CMMC Level ${request.cmmcLevel}`;

    const prompt = `Define compliance monitoring metrics ${scope}:

Create comprehensive metrics framework:

1. **Metrics Overview**
   - Total metrics defined
   - Metric categories
   - Collection methods
   - Reporting frequency

2. **Compliance Metrics**
   For each metric:
   - Metric name
   - Description
   - Purpose/value
   - Calculation method
   - Data source
   - Collection frequency
   - Target value
   - Alert thresholds
   - Trend analysis approach

3. **Control Effectiveness Metrics**
   - Control implementation rate (%)
   - Control testing pass rate (%)
   - Control failure rate (%)
   - Mean time to remediate
   - Repeat failures

4. **Security Posture Metrics**
   - Vulnerability count (by severity)
   - Mean time to patch (days)
   - Unpatched critical vulnerabilities
   - Configuration drift incidents
   - Security alert volume

5. **Operational Metrics**
   - Training completion rate (%)
   - Phishing click rate (%)
   - Incident count
   - Mean time to detect (MTTD)
   - Mean time to respond (MTTR)

6. **Risk Metrics**
   - Active risk count (by level)
   - Risk score (average)
   - Overdue mitigations
   - Residual risk level
   - Risk trend (increasing/decreasing)

7. **Evidence Metrics**
   - Evidence collection rate (%)
   - Missing evidence count
   - Evidence age (days)
   - Evidence quality score

8. **Change Management Metrics**
   - Changes implemented
   - Emergency changes (%)
   - Failed changes (%)
   - Change-related incidents

9. **Trend Metrics**
   - Period-over-period changes
   - Direction (improving/degrading)
   - Velocity of change
   - Forecast/projections

10. **Leading vs. Lagging Indicators**
    - Leading (predictive): Training, testing, scanning
    - Lagging (historical): Incidents, failures, breaches

11. **Metric Governance**
    - Metric ownership
    - Review frequency
    - Metric retirement criteria
    - New metric approval

12. **Reporting and Visualization**
    - How each metric should be displayed
    - Dashboard placement
    - Report inclusion
    - Stakeholder interest

Provide complete metrics framework with clear definitions and targets.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Create alert rules
   */
  async createAlertRules(request: {
    alertType: string;
    severity: "critical" | "high" | "medium" | "low";
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Create alert rule for ${request.alertType}:

Severity: ${request.severity}

Design comprehensive alert rule:

1. **Alert Definition**
   - Alert name
   - Description
   - Category
   - Severity
   - Priority

2. **Trigger Conditions**
   - When should alert fire?
   - Threshold values
   - Frequency criteria
   - Duration criteria
   - Logical conditions (AND/OR)

3. **Data Sources**
   - Systems to monitor
   - Log sources
   - Metric sources
   - API endpoints

4. **Detection Logic**
   - Query/rule syntax
   - Evaluation frequency
   - Lookback period
   - Sample/example match

5. **Alert Content**
   - Alert title format
   - Alert description
   - Contextual information to include
   - Severity justification
   - Recommended actions

6. **Notification Rules**
   - Who to notify (roles/individuals)
   - Notification methods (email, SMS, dashboard, etc.)
   - Notification timing (immediate, batched, digest)
   - Escalation rules

7. **Response Procedures**
   - Initial response actions
   - Investigation steps
   - Remediation procedures
   - Escalation criteria

8. **Alert Suppression**
   - Conditions to suppress
   - Maintenance windows
   - Known false positives
   - Deduplication logic

9. **Alert Tracking**
   - How to acknowledge
   - How to assign
   - How to resolve
   - How to document

10. **Tuning Criteria**
    - How to reduce false positives
    - Threshold adjustments
    - Condition refinements
    - Review frequency

11. **Related Alerts**
    - Alerts that often co-occur
    - Upstream/downstream alerts
    - Alert grouping strategy

12. **Testing and Validation**
    - How to test the alert
    - Test scenarios
    - Expected behavior
    - Validation criteria

Provide implementation-ready alert rule specification.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
