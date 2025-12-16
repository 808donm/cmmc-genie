#!/usr/bin/env node

const { Client } = require('pg');

const cmmcControls = [
  // Access Control (AC) - 22 controls
  {
    id: "AC.L1-3.1.1",
    domain: "Access Control",
    practice: "Limit system access to authorized users",
    level: 1,
    description: "Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems).",
    objective: "Prevent unauthorized access to organizational systems and data by ensuring only authorized entities can access the system.",
  },
  {
    id: "AC.L1-3.1.2",
    domain: "Access Control",
    practice: "Limit system access to the types of transactions and functions that authorized users are permitted to execute",
    level: 1,
    description: "Limit information system access to the types of transactions and functions that authorized users are permitted to execute.",
    objective: "Ensure users can only perform authorized actions on the system.",
  },
  {
    id: "AC.L2-3.1.3",
    domain: "Access Control",
    practice: "Control the flow of CUI in accordance with approved authorizations",
    level: 2,
    description: "Control the flow of covered defense information in accordance with approved authorizations.",
    objective: "Prevent unauthorized transfer, modification, or disclosure of CUI through enforcement of information flow control policies.",
  },
  {
    id: "AC.L2-3.1.4",
    domain: "Access Control",
    practice: "Separate the duties of individuals to reduce the risk of malevolent activity without collusion",
    level: 2,
    description: "Separate the duties of individuals to reduce the risk of malevolent activity without collusion.",
    objective: "Prevent fraud and errors by ensuring no single individual has control over all phases of a critical or sensitive transaction.",
  },
  {
    id: "AC.L2-3.1.5",
    domain: "Access Control",
    practice: "Employ the principle of least privilege",
    level: 2,
    description: "Employ the principle of least privilege, including for specific security functions and privileged accounts.",
    objective: "Limit security risks by ensuring users and processes operate with only the minimum privileges necessary.",
  },
  {
    id: "AC.L2-3.1.6",
    domain: "Access Control",
    practice: "Use non-privileged accounts when accessing nonsecurity functions",
    level: 2,
    description: "Use non-privileged accounts or roles when accessing nonsecurity functions.",
    objective: "Reduce the risk of privilege escalation attacks by limiting when privileged accounts are used.",
  },
  {
    id: "AC.L2-3.1.7",
    domain: "Access Control",
    practice: "Prevent non-privileged users from executing privileged functions",
    level: 2,
    description: "Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.",
    objective: "Prevent unauthorized privilege escalation and ensure privileged actions are logged.",
  },
  {
    id: "AC.L2-3.1.8",
    domain: "Access Control",
    practice: "Limit unsuccessful logon attempts",
    level: 2,
    description: "Limit unsuccessful logon attempts.",
    objective: "Prevent brute force password attacks by limiting the number of failed authentication attempts.",
  },
  {
    id: "AC.L2-3.1.9",
    domain: "Access Control",
    practice: "Provide privacy and security notices",
    level: 2,
    description: "Provide privacy and security notices consistent with applicable CUI rules.",
    objective: "Inform users of their privacy and security responsibilities when accessing CUI systems.",
  },
  {
    id: "AC.L2-3.1.10",
    domain: "Access Control",
    practice: "Use session lock with pattern-hiding displays",
    level: 2,
    description: "Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.",
    objective: "Prevent unauthorized viewing of information on unattended systems.",
  },
  {
    id: "AC.L2-3.1.11",
    domain: "Access Control",
    practice: "Terminate user sessions after a defined condition",
    level: 2,
    description: "Terminate (automatically) a user session after a defined condition.",
    objective: "Reduce the risk of unauthorized access through unattended authenticated sessions.",
  },
  {
    id: "AC.L2-3.1.12",
    domain: "Access Control",
    practice: "Monitor and control remote access sessions",
    level: 2,
    description: "Monitor and control remote access sessions.",
    objective: "Ensure remote access activities are monitored and controlled to prevent unauthorized access.",
  },
  {
    id: "AC.L2-3.1.13",
    domain: "Access Control",
    practice: "Employ cryptographic mechanisms to protect confidentiality of remote access sessions",
    level: 2,
    description: "Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.",
    objective: "Protect information transmitted during remote access sessions from unauthorized disclosure.",
  },
  {
    id: "AC.L2-3.1.14",
    domain: "Access Control",
    practice: "Route remote access via managed access control points",
    level: 2,
    description: "Route remote access via managed access control points.",
    objective: "Ensure all remote access goes through controlled points where security policies can be enforced.",
  },
  {
    id: "AC.L2-3.1.15",
    domain: "Access Control",
    practice: "Authorize remote execution of privileged commands",
    level: 2,
    description: "Authorize remote execution of privileged commands and remote access to security-relevant information.",
    objective: "Ensure privileged operations performed remotely are properly authorized.",
  },
  {
    id: "AC.L2-3.1.16",
    domain: "Access Control",
    practice: "Authorize wireless access prior to allowing such connections",
    level: 2,
    description: "Authorize wireless access prior to allowing such connections.",
    objective: "Prevent unauthorized wireless access to organizational systems.",
  },
  {
    id: "AC.L2-3.1.17",
    domain: "Access Control",
    practice: "Protect wireless access using authentication and encryption",
    level: 2,
    description: "Protect wireless access using authentication and encryption.",
    objective: "Protect wireless communications from eavesdropping and unauthorized access.",
  },
  {
    id: "AC.L2-3.1.18",
    domain: "Access Control",
    practice: "Control connection of mobile devices",
    level: 2,
    description: "Control connection of mobile devices.",
    objective: "Prevent unauthorized mobile devices from accessing organizational systems and data.",
  },
  {
    id: "AC.L2-3.1.19",
    domain: "Access Control",
    practice: "Encrypt CUI on mobile devices",
    level: 2,
    description: "Encrypt CUI on mobile devices and mobile computing platforms.",
    objective: "Protect CUI from unauthorized disclosure if mobile devices are lost or stolen.",
  },
  {
    id: "AC.L2-3.1.20",
    domain: "Access Control",
    practice: "Verify and control connections to external systems",
    level: 2,
    description: "Verify and control/limit connections to and use of external information systems.",
    objective: "Prevent unauthorized information transfer through connections to external systems.",
  },
  {
    id: "AC.L2-3.1.21",
    domain: "Access Control",
    practice: "Limit use of portable storage devices",
    level: 2,
    description: "Limit use of organizational portable storage devices on external information systems.",
    objective: "Prevent malware introduction and unauthorized data exfiltration through portable storage.",
  },
  {
    id: "AC.L2-3.1.22",
    domain: "Access Control",
    practice: "Control CUI posted or processed on publicly accessible systems",
    level: 2,
    description: "Control CUI posted or processed on publicly accessible information systems.",
    objective: "Prevent unauthorized disclosure of CUI through publicly accessible systems.",
  },

  // Awareness and Training (AT) - 3 controls
  {
    id: "AT.L2-3.2.1",
    domain: "Awareness and Training",
    practice: "Ensure managers, systems administrators, and users are trained",
    level: 2,
    description: "Ensure that managers, systems administrators, and users of organizational information systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.",
    objective: "Ensure personnel understand their security responsibilities and risks.",
  },
  {
    id: "AT.L2-3.2.2",
    domain: "Awareness and Training",
    practice: "Ensure personnel are trained to carry out assigned information security-related duties",
    level: 2,
    description: "Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.",
    objective: "Ensure personnel have the knowledge and skills to perform security duties effectively.",
  },
  {
    id: "AT.L2-3.2.3",
    domain: "Awareness and Training",
    practice: "Provide security awareness training on recognizing and reporting threats",
    level: 2,
    description: "Provide security awareness training on recognizing and reporting potential indicators of insider threat.",
    objective: "Enable personnel to identify and report potential insider threats.",
  },

  // Audit and Accountability (AU) - 9 controls
  {
    id: "AU.L2-3.3.1",
    domain: "Audit and Accountability",
    practice: "Create and retain system audit logs",
    level: 2,
    description: "Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.",
    objective: "Provide accountability for system activities through comprehensive logging.",
  },
  {
    id: "AU.L2-3.3.2",
    domain: "Audit and Accountability",
    practice: "Ensure actions of individual users can be uniquely traced",
    level: 2,
    description: "Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.",
    objective: "Enable individual accountability for actions performed on organizational systems.",
  },
  {
    id: "AU.L2-3.3.3",
    domain: "Audit and Accountability",
    practice: "Review and update logged events",
    level: 2,
    description: "Review and update logged events.",
    objective: "Ensure audit logs capture the most relevant security events.",
  },
  {
    id: "AU.L2-3.3.4",
    domain: "Audit and Accountability",
    practice: "Alert in the event of an audit logging process failure",
    level: 2,
    description: "Alert in the event of an audit logging process failure.",
    objective: "Ensure audit logging failures are detected and addressed promptly.",
  },
  {
    id: "AU.L2-3.3.5",
    domain: "Audit and Accountability",
    practice: "Correlate audit record review, analysis, and reporting processes",
    level: 2,
    description: "Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.",
    objective: "Enable effective detection and investigation of security incidents through audit analysis.",
  },
  {
    id: "AU.L2-3.3.6",
    domain: "Audit and Accountability",
    practice: "Provide audit record reduction and report generation",
    level: 2,
    description: "Provide audit record reduction and report generation to support on-demand analysis and reporting.",
    objective: "Enable efficient analysis of audit data through reduction and reporting capabilities.",
  },
  {
    id: "AU.L2-3.3.7",
    domain: "Audit and Accountability",
    practice: "Provide system capability to process audit records for events of interest",
    level: 2,
    description: "Provide a system capability that compares and synchronizes internal system clocks with an authoritative source to generate time stamps for audit records.",
    objective: "Ensure accurate timestamps on audit records for incident analysis and correlation.",
  },
  {
    id: "AU.L2-3.3.8",
    domain: "Audit and Accountability",
    practice: "Protect audit information and audit logging tools",
    level: 2,
    description: "Protect audit information and audit logging tools from unauthorized access, modification, and deletion.",
    objective: "Ensure integrity and availability of audit records.",
  },
  {
    id: "AU.L2-3.3.9",
    domain: "Audit and Accountability",
    practice: "Limit management of audit logging functionality",
    level: 2,
    description: "Limit management of audit logging functionality to a subset of privileged users.",
    objective: "Prevent unauthorized manipulation of audit logging capabilities.",
  },

  // Configuration Management (CM) - 9 controls
  {
    id: "CM.L2-3.4.1",
    domain: "Configuration Management",
    practice: "Establish and maintain baseline configurations",
    level: 2,
    description: "Establish and maintain baseline configurations and inventories of organizational information systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.",
    objective: "Ensure systems are configured securely and changes are controlled.",
  },
  {
    id: "CM.L2-3.4.2",
    domain: "Configuration Management",
    practice: "Establish and enforce security configuration settings",
    level: 2,
    description: "Establish and enforce security configuration settings for information technology products employed in organizational information systems.",
    objective: "Ensure systems are configured according to security best practices.",
  },
  {
    id: "CM.L2-3.4.3",
    domain: "Configuration Management",
    practice: "Track, review, approve, or disapprove changes to systems",
    level: 2,
    description: "Track, review, approve or disapprove, and log changes to organizational information systems.",
    objective: "Ensure changes to systems are controlled and authorized.",
  },
  {
    id: "CM.L2-3.4.4",
    domain: "Configuration Management",
    practice: "Analyze the security impact of changes",
    level: 2,
    description: "Analyze the security impact of changes prior to implementation.",
    objective: "Prevent security vulnerabilities from being introduced through system changes.",
  },
  {
    id: "CM.L2-3.4.5",
    domain: "Configuration Management",
    practice: "Define, document, approve, and enforce access restrictions",
    level: 2,
    description: "Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational information systems.",
    objective: "Ensure only authorized personnel can make changes to systems.",
  },
  {
    id: "CM.L2-3.4.6",
    domain: "Configuration Management",
    practice: "Employ least functionality principle",
    level: 2,
    description: "Employ the principle of least functionality by configuring organizational information systems to provide only essential capabilities.",
    objective: "Reduce attack surface by disabling unnecessary system capabilities.",
  },
  {
    id: "CM.L2-3.4.7",
    domain: "Configuration Management",
    practice: "Restrict, disable, or prevent software program execution",
    level: 2,
    description: "Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.",
    objective: "Reduce attack surface by limiting unnecessary software and services.",
  },
  {
    id: "CM.L2-3.4.8",
    domain: "Configuration Management",
    practice: "Apply deny-by-exception policy for software",
    level: 2,
    description: "Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the execution of authorized software.",
    objective: "Prevent execution of unauthorized or malicious software.",
  },
  {
    id: "CM.L2-3.4.9",
    domain: "Configuration Management",
    practice: "Control and monitor user-installed software",
    level: 2,
    description: "Control and monitor user-installed software.",
    objective: "Prevent introduction of unauthorized or malicious software by users.",
  },

  // Identification and Authentication (IA) - 11 controls
  {
    id: "IA.L1-3.5.1",
    domain: "Identification and Authentication",
    practice: "Identify system users, processes, or devices",
    level: 1,
    description: "Identify information system users, processes acting on behalf of users, or devices.",
    objective: "Ensure entities accessing the system can be uniquely identified.",
  },
  {
    id: "IA.L1-3.5.2",
    domain: "Identification and Authentication",
    practice: "Authenticate the identities of users, processes, or devices",
    level: 1,
    description: "Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.",
    objective: "Ensure only authenticated entities can access organizational systems.",
  },
  {
    id: "IA.L2-3.5.3",
    domain: "Identification and Authentication",
    practice: "Use multifactor authentication for local and network access",
    level: 2,
    description: "Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.",
    objective: "Strengthen authentication through multiple factors, making credential theft less effective.",
  },
  {
    id: "IA.L2-3.5.4",
    domain: "Identification and Authentication",
    practice: "Employ replay-resistant authentication mechanisms",
    level: 2,
    description: "Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.",
    objective: "Prevent replay attacks where captured credentials are reused.",
  },
  {
    id: "IA.L2-3.5.5",
    domain: "Identification and Authentication",
    practice: "Prevent reuse of identifiers",
    level: 2,
    description: "Prevent reuse of identifiers for a defined period.",
    objective: "Prevent confusion and ensure accountability by not reusing user identifiers.",
  },
  {
    id: "IA.L2-3.5.6",
    domain: "Identification and Authentication",
    practice: "Disable identifiers after defined period of inactivity",
    level: 2,
    description: "Disable identifiers after a defined period of inactivity.",
    objective: "Reduce risk of unauthorized access through dormant accounts.",
  },
  {
    id: "IA.L2-3.5.7",
    domain: "Identification and Authentication",
    practice: "Enforce minimum password complexity",
    level: 2,
    description: "Enforce a minimum password complexity and change of characters when new passwords are created.",
    objective: "Ensure passwords are resistant to guessing and brute force attacks.",
  },
  {
    id: "IA.L2-3.5.8",
    domain: "Identification and Authentication",
    practice: "Prohibit password reuse",
    level: 2,
    description: "Prohibit password reuse for a specified number of generations.",
    objective: "Prevent users from cycling through old compromised passwords.",
  },
  {
    id: "IA.L2-3.5.9",
    domain: "Identification and Authentication",
    practice: "Allow temporary password use for system logons",
    level: 2,
    description: "Allow temporary password use for system logons with an immediate change to a permanent password.",
    objective: "Ensure temporary passwords are only used once and changed immediately.",
  },
  {
    id: "IA.L2-3.5.10",
    domain: "Identification and Authentication",
    practice: "Store and transmit only cryptographically-protected passwords",
    level: 2,
    description: "Store and transmit only cryptographically-protected passwords.",
    objective: "Protect passwords from disclosure through encryption.",
  },
  {
    id: "IA.L2-3.5.11",
    domain: "Identification and Authentication",
    practice: "Obscure feedback of authentication information",
    level: 2,
    description: "Obscure feedback of authentication information.",
    objective: "Prevent shoulder surfing and observation of authentication credentials.",
  },

  // Incident Response (IR) - 3 controls
  {
    id: "IR.L2-3.6.1",
    domain: "Incident Response",
    practice: "Establish operational incident-handling capability",
    level: 2,
    description: "Establish an operational incident-handling capability for organizational information systems that includes preparation, detection, analysis, containment, recovery, and user response activities.",
    objective: "Ensure organization can effectively respond to security incidents.",
  },
  {
    id: "IR.L2-3.6.2",
    domain: "Incident Response",
    practice: "Track, document, and report incidents",
    level: 2,
    description: "Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.",
    objective: "Ensure incidents are properly documented and reported to appropriate parties.",
  },
  {
    id: "IR.L2-3.6.3",
    domain: "Incident Response",
    practice: "Test incident response capability",
    level: 2,
    description: "Test the organizational incident response capability.",
    objective: "Ensure incident response procedures are effective when needed.",
  },

  // Maintenance (MA) - 6 controls
  {
    id: "MA.L2-3.7.1",
    domain: "Maintenance",
    practice: "Perform maintenance on systems",
    level: 2,
    description: "Perform maintenance on organizational information systems.",
    objective: "Ensure systems remain operational and secure through regular maintenance.",
  },
  {
    id: "MA.L2-3.7.2",
    domain: "Maintenance",
    practice: "Provide controls on tools, techniques, and personnel for maintenance",
    level: 2,
    description: "Provide controls on the tools, techniques, mechanisms, and personnel used to conduct information system maintenance.",
    objective: "Prevent introduction of vulnerabilities through maintenance activities.",
  },
  {
    id: "MA.L2-3.7.3",
    domain: "Maintenance",
    practice: "Require multifactor authentication for remote maintenance",
    level: 2,
    description: "Ensure equipment removed for off-site maintenance is sanitized of any CUI.",
    objective: "Prevent unauthorized disclosure of CUI on equipment sent for maintenance.",
  },
  {
    id: "MA.L2-3.7.4",
    domain: "Maintenance",
    practice: "Check media containing diagnostic and test programs for malicious code",
    level: 2,
    description: "Check media containing diagnostic and test programs for malicious code before the media are used in organizational information systems.",
    objective: "Prevent malware introduction through maintenance tools and media.",
  },
  {
    id: "MA.L2-3.7.5",
    domain: "Maintenance",
    practice: "Require multifactor authentication for remote maintenance sessions",
    level: 2,
    description: "Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.",
    objective: "Ensure remote maintenance access is strongly authenticated and properly terminated.",
  },
  {
    id: "MA.L2-3.7.6",
    domain: "Maintenance",
    practice: "Supervise maintenance activities by personnel who lack appropriate access",
    level: 2,
    description: "Supervise the maintenance activities of maintenance personnel without required access authorization.",
    objective: "Prevent unauthorized access to CUI by uncleared maintenance personnel.",
  },

  // Media Protection (MP) - 9 controls
  {
    id: "MP.L2-3.8.1",
    domain: "Media Protection",
    practice: "Protect system media",
    level: 2,
    description: "Protect (i.e., physically control and securely store) information system media containing CUI, both paper and digital.",
    objective: "Prevent unauthorized access to CUI on media through physical controls.",
  },
  {
    id: "MP.L2-3.8.2",
    domain: "Media Protection",
    practice: "Limit access to CUI on system media",
    level: 2,
    description: "Limit access to CUI on information system media to authorized users.",
    objective: "Ensure only authorized personnel can access media containing CUI.",
  },
  {
    id: "MP.L2-3.8.3",
    domain: "Media Protection",
    practice: "Sanitize or destroy media before disposal or reuse",
    level: 2,
    description: "Sanitize or destroy information system media containing Federal Contract Information before disposal or release for reuse.",
    objective: "Prevent unauthorized disclosure of CUI from disposed or reused media.",
  },
  {
    id: "MP.L2-3.8.4",
    domain: "Media Protection",
    practice: "Mark media with CUI markings",
    level: 2,
    description: "Mark media with necessary CUI markings and distribution limitations.",
    objective: "Ensure personnel are aware of CUI on media and handle it appropriately.",
  },
  {
    id: "MP.L2-3.8.5",
    domain: "Media Protection",
    practice: "Control access to media and maintain accountability",
    level: 2,
    description: "Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.",
    objective: "Prevent loss or unauthorized access to CUI during transport.",
  },
  {
    id: "MP.L2-3.8.6",
    domain: "Media Protection",
    practice: "Implement cryptographic mechanisms to protect CUI on portable storage",
    level: 2,
    description: "Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards.",
    objective: "Protect CUI from unauthorized disclosure if media is lost or stolen during transport.",
  },
  {
    id: "MP.L2-3.8.7",
    domain: "Media Protection",
    practice: "Control use of removable media on system components",
    level: 2,
    description: "Control the use of removable media on information system components.",
    objective: "Prevent unauthorized data exfiltration and malware introduction via removable media.",
  },
  {
    id: "MP.L2-3.8.8",
    domain: "Media Protection",
    practice: "Prohibit use of portable storage devices when controls cannot be verified",
    level: 2,
    description: "Prohibit the use of portable storage devices when such devices have no identifiable owner.",
    objective: "Prevent use of potentially malicious or compromised portable storage devices.",
  },
  {
    id: "MP.L2-3.8.9",
    domain: "Media Protection",
    practice: "Protect backups of CUI",
    level: 2,
    description: "Protect the confidentiality of backup CUI at storage locations.",
    objective: "Ensure backup copies of CUI are protected from unauthorized disclosure.",
  },

  // Personnel Security (PS) - 2 controls
  {
    id: "PS.L2-3.9.1",
    domain: "Personnel Security",
    practice: "Screen individuals prior to authorizing access",
    level: 2,
    description: "Screen individuals prior to authorizing access to organizational information systems containing CUI.",
    objective: "Reduce risk of insider threats through background screening.",
  },
  {
    id: "PS.L2-3.9.2",
    domain: "Personnel Security",
    practice: "Ensure CUI is protected during and after personnel actions",
    level: 2,
    description: "Ensure that organizational information and information systems are protected during and after personnel actions such as terminations and transfers.",
    objective: "Prevent unauthorized access to CUI by former or transferred personnel.",
  },

  // Physical Protection (PE) - 6 controls
  {
    id: "PE.L1-3.10.1",
    domain: "Physical Protection",
    practice: "Limit physical access to systems and facilities",
    level: 1,
    description: "Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.",
    objective: "Prevent unauthorized physical access to systems containing CUI.",
  },
  {
    id: "PE.L1-3.10.3",
    domain: "Physical Protection",
    practice: "Escort visitors and monitor visitor activity",
    level: 1,
    description: "Escort visitors and monitor visitor activity.",
    objective: "Prevent unauthorized access or activities by visitors.",
  },
  {
    id: "PE.L1-3.10.4",
    domain: "Physical Protection",
    practice: "Maintain audit logs of physical access",
    level: 1,
    description: "Maintain audit logs of physical access.",
    objective: "Provide accountability for physical access to facilities.",
  },
  {
    id: "PE.L1-3.10.5",
    domain: "Physical Protection",
    practice: "Control and manage physical access devices",
    level: 1,
    description: "Control and manage physical access devices.",
    objective: "Prevent unauthorized use of physical access devices like keys and access cards.",
  },
  {
    id: "PE.L2-3.10.2",
    domain: "Physical Protection",
    practice: "Protect and monitor physical facility and support infrastructure",
    level: 2,
    description: "Protect and monitor the physical facility and support infrastructure for organizational information systems.",
    objective: "Detect and prevent physical threats to information systems.",
  },
  {
    id: "PE.L2-3.10.6",
    domain: "Physical Protection",
    practice: "Enforce safeguarding measures for CUI at alternate work sites",
    level: 2,
    description: "Enforce safeguarding measures for CUI at alternate work sites.",
    objective: "Ensure CUI is protected when personnel work from alternate locations.",
  },

  // Risk Assessment (RA) - 3 controls
  {
    id: "RA.L2-3.11.1",
    domain: "Risk Assessment",
    practice: "Periodically assess risk",
    level: 2,
    description: "Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational information systems and the associated processing, storage, or transmission of CUI.",
    objective: "Identify and understand risks to inform security decisions.",
  },
  {
    id: "RA.L2-3.11.2",
    domain: "Risk Assessment",
    practice: "Scan for vulnerabilities and remediate",
    level: 2,
    description: "Scan for vulnerabilities in organizational information systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.",
    objective: "Identify and address system vulnerabilities before they can be exploited.",
  },
  {
    id: "RA.L2-3.11.3",
    domain: "Risk Assessment",
    practice: "Remediate vulnerabilities",
    level: 2,
    description: "Remediate vulnerabilities in accordance with risk assessments.",
    objective: "Reduce risk by addressing identified vulnerabilities based on their severity.",
  },

  // Security Assessment (CA) - 4 controls
  {
    id: "CA.L2-3.12.1",
    domain: "Security Assessment",
    practice: "Periodically assess security controls",
    level: 2,
    description: "Periodically assess the security controls in organizational information systems to determine if the controls are effective in their application.",
    objective: "Ensure security controls are working as intended.",
  },
  {
    id: "CA.L2-3.12.2",
    domain: "Security Assessment",
    practice: "Develop and implement remediation plans",
    level: 2,
    description: "Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational information systems.",
    objective: "Address identified security deficiencies systematically.",
  },
  {
    id: "CA.L2-3.12.3",
    domain: "Security Assessment",
    practice: "Monitor security controls on an ongoing basis",
    level: 2,
    description: "Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.",
    objective: "Detect security control failures or degradation promptly.",
  },
  {
    id: "CA.L2-3.12.4",
    domain: "Security Assessment",
    practice: "Develop, document, and periodically update system security plans",
    level: 2,
    description: "Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems.",
    objective: "Ensure security requirements and implementations are documented and maintained.",
  },

  // System and Communications Protection (SC) - 16 controls
  {
    id: "SC.L1-3.13.1",
    domain: "System and Communications Protection",
    practice: "Monitor, control, and protect communications at external boundaries",
    level: 1,
    description: "Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational information systems) at the external boundaries and key internal boundaries of the information systems.",
    objective: "Prevent unauthorized information disclosure through network boundaries.",
  },
  {
    id: "SC.L1-3.13.5",
    domain: "System and Communications Protection",
    practice: "Implement subnetworks for publicly accessible system components",
    level: 1,
    description: "Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.",
    objective: "Isolate public-facing systems from internal networks containing CUI.",
  },
  {
    id: "SC.L2-3.13.2",
    domain: "System and Communications Protection",
    practice: "Employ architectural designs, software development techniques, and systems engineering principles",
    level: 2,
    description: "Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational information systems.",
    objective: "Build security into systems from the design phase.",
  },
  {
    id: "SC.L2-3.13.3",
    domain: "System and Communications Protection",
    practice: "Separate user functionality from system management functionality",
    level: 2,
    description: "Separate user functionality from information system management functionality.",
    objective: "Prevent users from accessing or affecting system management functions.",
  },
  {
    id: "SC.L2-3.13.4",
    domain: "System and Communications Protection",
    practice: "Prevent unauthorized information transfer via shared resources",
    level: 2,
    description: "Prevent unauthorized and unintended information transfer via shared system resources.",
    objective: "Prevent information leakage through covert channels in shared resources.",
  },
  {
    id: "SC.L2-3.13.6",
    domain: "System and Communications Protection",
    practice: "Deny network communications traffic by default",
    level: 2,
    description: "Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).",
    objective: "Minimize attack surface by only allowing necessary network communications.",
  },
  {
    id: "SC.L2-3.13.7",
    domain: "System and Communications Protection",
    practice: "Prevent split tunneling for remote devices",
    level: 2,
    description: "Prevent remote devices from simultaneously establishing non-remote connections with organizational information systems and communicating via some other connection to resources in external networks.",
    objective: "Prevent bypassing of security controls through split tunneling.",
  },
  {
    id: "SC.L2-3.13.8",
    domain: "System and Communications Protection",
    practice: "Implement cryptographic mechanisms to prevent unauthorized disclosure",
    level: 2,
    description: "Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.",
    objective: "Protect CUI from eavesdropping during network transmission.",
  },
  {
    id: "SC.L2-3.13.9",
    domain: "System and Communications Protection",
    practice: "Terminate network connections at end of sessions",
    level: 2,
    description: "Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.",
    objective: "Prevent unauthorized use of idle network sessions.",
  },
  {
    id: "SC.L2-3.13.10",
    domain: "System and Communications Protection",
    practice: "Establish and manage cryptographic keys",
    level: 2,
    description: "Establish and manage cryptographic keys for cryptography employed in organizational systems.",
    objective: "Ensure cryptographic keys are properly managed to maintain security.",
  },
  {
    id: "SC.L2-3.13.11",
    domain: "System and Communications Protection",
    practice: "Employ FIPS-validated cryptography",
    level: 2,
    description: "Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.",
    objective: "Ensure cryptographic protections meet federal standards.",
  },
  {
    id: "SC.L2-3.13.12",
    domain: "System and Communications Protection",
    practice: "Prohibit remote activation of collaborative computing devices",
    level: 2,
    description: "Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users present at the device.",
    objective: "Prevent unauthorized remote surveillance through collaboration tools.",
  },
  {
    id: "SC.L2-3.13.13",
    domain: "System and Communications Protection",
    practice: "Control and monitor use of mobile code",
    level: 2,
    description: "Control and monitor the use of mobile code.",
    objective: "Prevent malicious mobile code from executing on organizational systems.",
  },
  {
    id: "SC.L2-3.13.14",
    domain: "System and Communications Protection",
    practice: "Control and monitor use of Voice over Internet Protocol",
    level: 2,
    description: "Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.",
    objective: "Protect VoIP communications from eavesdropping and unauthorized use.",
  },
  {
    id: "SC.L2-3.13.15",
    domain: "System and Communications Protection",
    practice: "Protect authenticity of communications sessions",
    level: 2,
    description: "Protect the authenticity of communications sessions.",
    objective: "Prevent man-in-the-middle attacks and session hijacking.",
  },
  {
    id: "SC.L2-3.13.16",
    domain: "System and Communications Protection",
    practice: "Protect confidentiality of CUI at rest",
    level: 2,
    description: "Protect the confidentiality of CUI at rest.",
    objective: "Prevent unauthorized disclosure of CUI stored on systems and media.",
  },

  // System and Information Integrity (SI) - 7 controls
  {
    id: "SI.L1-3.14.1",
    domain: "System and Information Integrity",
    practice: "Identify, report, and correct system flaws",
    level: 1,
    description: "Identify, report, and correct information and information system flaws in a timely manner.",
    objective: "Reduce vulnerabilities by addressing system flaws promptly.",
  },
  {
    id: "SI.L1-3.14.2",
    domain: "System and Information Integrity",
    practice: "Provide protection from malicious code",
    level: 1,
    description: "Provide protection from malicious code at appropriate locations within organizational information systems.",
    objective: "Prevent malware from compromising organizational systems and data.",
  },
  {
    id: "SI.L1-3.14.3",
    domain: "System and Information Integrity",
    practice: "Monitor system security alerts and advisories",
    level: 1,
    description: "Monitor information system security alerts and advisories and take appropriate actions in response.",
    objective: "Ensure organization is aware of and responds to new security threats.",
  },
  {
    id: "SI.L1-3.14.4",
    domain: "System and Information Integrity",
    practice: "Update malicious code protection mechanisms",
    level: 1,
    description: "Update malicious code protection mechanisms when new releases are available.",
    objective: "Maintain effectiveness of malware protection through timely updates.",
  },
  {
    id: "SI.L1-3.14.5",
    domain: "System and Information Integrity",
    practice: "Perform periodic scans and real-time scans of files",
    level: 1,
    description: "Perform periodic scans of the information system and real-time scans of files from external sources as files are downloaded, opened, or executed.",
    objective: "Detect and prevent malware infections through scanning.",
  },
  {
    id: "SI.L2-3.14.6",
    domain: "System and Information Integrity",
    practice: "Monitor communications for unusual or unauthorized activities",
    level: 2,
    description: "Monitor organizational information systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.",
    objective: "Detect security incidents and attacks through communications monitoring.",
  },
  {
    id: "SI.L2-3.14.7",
    domain: "System and Information Integrity",
    practice: "Identify unauthorized use of the system",
    level: 2,
    description: "Identify unauthorized use of organizational information systems.",
    objective: "Detect and respond to unauthorized system use.",
  },
];

async function seedCMMCControls() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("🔌 Connected to database");
    console.log("🌱 Seeding CMMC controls...\n");

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const control of cmmcControls) {
      try {
        // Check if control already exists
        const existing = await client.query(
          'SELECT id FROM "CMMCControl" WHERE id = $1',
          [control.id]
        );

        if (existing.rows.length > 0) {
          skippedCount++;
          console.log(`⏭️  Skipped (already exists): ${control.id}`);
          continue;
        }

        // Insert the control
        await client.query(
          `INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            control.id,
            control.domain,
            control.practice,
            control.level,
            control.description,
            control.objective,
          ]
        );

        createdCount++;
        console.log(`✅ Created: ${control.id} - ${control.practice}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error creating ${control.id}:`, error.message);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Seeding Summary:");
    console.log(`  ✅ Created: ${createdCount} controls`);
    console.log(`  ⏭️  Skipped: ${skippedCount} controls (already existed)`);
    console.log(`  ❌ Errors: ${errorCount} controls`);
    console.log(`  📝 Total processed: ${cmmcControls.length} controls`);
    console.log("=".repeat(60) + "\n");

    if (createdCount > 0) {
      console.log("🎉 Successfully seeded CMMC controls!\n");
    }
  } catch (error) {
    console.error("❌ Error seeding controls:", error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Disconnected from database");
  }
}

seedCMMCControls();
