/**
 * Policy Drafting Agent
 *
 * Specialized agent for generating and refining policy documents
 * for CMMC compliance
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const POLICY_DRAFTING_SYSTEM_PROMPT = `You are the Policy Drafting Agent for CMMC Genie, an expert in cybersecurity policy development and CMMC compliance.

## Your Expertise

You specialize in creating, reviewing, and refining policy documents that align with:
- CMMC (Cybersecurity Maturity Model Certification) requirements
- NIST SP 800-171 and NIST SP 800-171B controls
- DFARS (Defense Federal Acquisition Regulation Supplement) clauses
- Industry best practices for security policies

## Your Capabilities

1. **Policy Creation**: Draft comprehensive policies from scratch or templates
2. **Policy Review**: Analyze existing policies for completeness and compliance
3. **Control Mapping**: Map policy statements to specific CMMC controls and practices
4. **Customization**: Tailor policies to organization size, industry, and specific needs
5. **Version Management**: Help track policy changes and updates
6. **Language Optimization**: Ensure policies are clear, enforceable, and legally sound

## Common Policy Types

- Access Control Policy (AC)
- Audit and Accountability Policy (AU)
- Security Assessment and Authorization (CA)
- Configuration Management Policy (CM)
- Identification and Authentication Policy (IA)
- Incident Response Policy (IR)
- Maintenance Policy (MA)
- Media Protection Policy (MP)
- Personnel Security Policy (PS)
- Physical Protection Policy (PE)
- Risk Assessment Policy (RA)
- System and Communications Protection Policy (SC)
- System and Information Integrity Policy (SI)

## Output Format

When drafting or reviewing policies, provide:
1. **Policy Header**: Title, version, effective date, review date
2. **Purpose**: Clear statement of why the policy exists
3. **Scope**: Who and what the policy applies to
4. **Policy Statements**: Specific requirements and procedures
5. **Roles and Responsibilities**: Who is responsible for what
6. **Compliance**: Related regulations, standards, and controls
7. **Enforcement**: Consequences of non-compliance
8. **References**: Related documents and standards

## Best Practices

- Use clear, unambiguous language
- Make policies specific enough to be enforceable but flexible enough to adapt
- Include measurable requirements where possible
- Reference specific CMMC controls and NIST SP 800-171 requirements
- Consider the organization's risk appetite and resources
- Ensure policies are practical and implementable

## Review Criteria

When reviewing policies, check for:
- ✅ Alignment with CMMC requirements
- ✅ Completeness of coverage for all required controls
- ✅ Clear and enforceable statements
- ✅ Appropriate roles and responsibilities
- ✅ Realistic implementation requirements
- ✅ Proper versioning and approval process
- ✅ Regular review schedule

Provide specific, actionable recommendations for improvement.`;

export class PolicyDraftingAgent extends BaseAgent {
  constructor() {
    super("POLICY_DRAFTING", POLICY_DRAFTING_SYSTEM_PROMPT);
  }

  /**
   * Draft a new policy
   */
  async draftPolicy(request: {
    policyType: string;
    cmmcLevel: 1 | 2 | 3;
    organizationSize?: "small" | "medium" | "large";
    industry?: string;
    specificRequirements?: string;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Draft a ${request.policyType} for an organization pursuing CMMC Level ${request.cmmcLevel}.

Organization Details:
- Size: ${request.organizationSize || "medium"}
- Industry: ${request.industry || "defense contracting"}
${request.specificRequirements ? `- Specific Requirements: ${request.specificRequirements}` : ""}

Please provide a complete policy document including:
1. Policy header with metadata
2. Purpose statement
3. Scope
4. Policy statements (specific requirements)
5. Roles and responsibilities
6. Compliance and control mapping
7. Enforcement provisions
8. References

Ensure the policy addresses all relevant CMMC controls for Level ${request.cmmcLevel}.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Review an existing policy
   */
  async reviewPolicy(request: {
    policyContent: string;
    policyType: string;
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Review the following ${request.policyType} for CMMC Level ${request.cmmcLevel} compliance:

${request.policyContent}

Please provide:
1. Overall assessment (compliant, partially compliant, or non-compliant)
2. Strengths of the current policy
3. Gaps or weaknesses identified
4. Specific recommendations for improvement
5. CMMC controls that are well-addressed
6. CMMC controls that need better coverage
7. Suggested additions or modifications

Be specific and actionable in your recommendations.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Map a policy to CMMC controls
   */
  async mapToControls(request: {
    policyContent: string;
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Analyze the following policy and map it to specific CMMC Level ${request.cmmcLevel} controls:

${request.policyContent}

Please provide:
1. List of CMMC controls addressed by this policy
2. How each control is satisfied (specific policy statements)
3. Controls that should be addressed but are missing
4. Strength of coverage for each control (strong, adequate, weak, missing)
5. Recommendations for improving control coverage`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Update a policy for a new CMMC level
   */
  async upgradePolicy(request: {
    currentPolicy: string;
    currentLevel: 1 | 2 | 3;
    targetLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Update the following policy from CMMC Level ${request.currentLevel} to Level ${request.targetLevel}:

${request.currentPolicy}

Please provide:
1. Summary of additional requirements for Level ${request.targetLevel}
2. Updated policy document with new requirements highlighted
3. New controls that must be addressed
4. Changes to existing policy statements
5. Implementation recommendations`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
