-- CMMC 2.0 Controls - All 110 Controls
-- Run this SQL in your Neon console to seed the database

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L1-3.1.1', 'Access Control', 'Limit system access to authorized users', 1, 'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems).', 'Prevent unauthorized access to organizational systems and data by ensuring only authorized entities can access the system.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L1-3.1.2', 'Access Control', 'Limit system access to the types of transactions and functions that authorized users are permitted to execute', 1, 'Limit information system access to the types of transactions and functions that authorized users are permitted to execute.', 'Ensure users can only perform authorized actions on the system.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.3', 'Access Control', 'Control the flow of CUI in accordance with approved authorizations', 2, 'Control the flow of covered defense information in accordance with approved authorizations.', 'Prevent unauthorized transfer, modification, or disclosure of CUI through enforcement of information flow control policies.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.4', 'Access Control', 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion', 2, 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', 'Prevent fraud and errors by ensuring no single individual has control over all phases of a critical or sensitive transaction.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.5', 'Access Control', 'Employ the principle of least privilege', 2, 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', 'Limit security risks by ensuring users and processes operate with only the minimum privileges necessary.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.6', 'Access Control', 'Use non-privileged accounts when accessing nonsecurity functions', 2, 'Use non-privileged accounts or roles when accessing nonsecurity functions.', 'Reduce the risk of privilege escalation attacks by limiting when privileged accounts are used.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.7', 'Access Control', 'Prevent non-privileged users from executing privileged functions', 2, 'Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.', 'Prevent unauthorized privilege escalation and ensure privileged actions are logged.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.8', 'Access Control', 'Limit unsuccessful logon attempts', 2, 'Limit unsuccessful logon attempts.', 'Prevent brute force password attacks by limiting the number of failed authentication attempts.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.9', 'Access Control', 'Provide privacy and security notices', 2, 'Provide privacy and security notices consistent with applicable CUI rules.', 'Inform users of their privacy and security responsibilities when accessing CUI systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.10', 'Access Control', 'Use session lock with pattern-hiding displays', 2, 'Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.', 'Prevent unauthorized viewing of information on unattended systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.11', 'Access Control', 'Terminate user sessions after a defined condition', 2, 'Terminate (automatically) a user session after a defined condition.', 'Reduce the risk of unauthorized access through unattended authenticated sessions.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.12', 'Access Control', 'Monitor and control remote access sessions', 2, 'Monitor and control remote access sessions.', 'Ensure remote access activities are monitored and controlled to prevent unauthorized access.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.13', 'Access Control', 'Employ cryptographic mechanisms to protect confidentiality of remote access sessions', 2, 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', 'Protect information transmitted during remote access sessions from unauthorized disclosure.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.14', 'Access Control', 'Route remote access via managed access control points', 2, 'Route remote access via managed access control points.', 'Ensure all remote access goes through controlled points where security policies can be enforced.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.15', 'Access Control', 'Authorize remote execution of privileged commands', 2, 'Authorize remote execution of privileged commands and remote access to security-relevant information.', 'Ensure privileged operations performed remotely are properly authorized.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.16', 'Access Control', 'Authorize wireless access prior to allowing such connections', 2, 'Authorize wireless access prior to allowing such connections.', 'Prevent unauthorized wireless access to organizational systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.17', 'Access Control', 'Protect wireless access using authentication and encryption', 2, 'Protect wireless access using authentication and encryption.', 'Protect wireless communications from eavesdropping and unauthorized access.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.18', 'Access Control', 'Control connection of mobile devices', 2, 'Control connection of mobile devices.', 'Prevent unauthorized mobile devices from accessing organizational systems and data.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.19', 'Access Control', 'Encrypt CUI on mobile devices', 2, 'Encrypt CUI on mobile devices and mobile computing platforms.', 'Protect CUI from unauthorized disclosure if mobile devices are lost or stolen.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.20', 'Access Control', 'Verify and control connections to external systems', 2, 'Verify and control/limit connections to and use of external information systems.', 'Prevent unauthorized information transfer through connections to external systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.21', 'Access Control', 'Limit use of portable storage devices', 2, 'Limit use of organizational portable storage devices on external information systems.', 'Prevent malware introduction and unauthorized data exfiltration through portable storage.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AC.L2-3.1.22', 'Access Control', 'Control CUI posted or processed on publicly accessible systems', 2, 'Control CUI posted or processed on publicly accessible information systems.', 'Prevent unauthorized disclosure of CUI through publicly accessible systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AT.L2-3.2.1', 'Awareness and Training', 'Ensure managers, systems administrators, and users are trained', 2, 'Ensure that managers, systems administrators, and users of organizational information systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.', 'Ensure personnel understand their security responsibilities and risks.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AT.L2-3.2.2', 'Awareness and Training', 'Ensure personnel are trained to carry out assigned information security-related duties', 2, 'Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.', 'Ensure personnel have the knowledge and skills to perform security duties effectively.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AT.L2-3.2.3', 'Awareness and Training', 'Provide security awareness training on recognizing and reporting threats', 2, 'Provide security awareness training on recognizing and reporting potential indicators of insider threat.', 'Enable personnel to identify and report potential insider threats.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.1', 'Audit and Accountability', 'Create and retain system audit logs', 2, 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', 'Provide accountability for system activities through comprehensive logging.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.2', 'Audit and Accountability', 'Ensure actions of individual users can be uniquely traced', 2, 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.', 'Enable individual accountability for actions performed on organizational systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.3', 'Audit and Accountability', 'Review and update logged events', 2, 'Review and update logged events.', 'Ensure audit logs capture the most relevant security events.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.4', 'Audit and Accountability', 'Alert in the event of an audit logging process failure', 2, 'Alert in the event of an audit logging process failure.', 'Ensure audit logging failures are detected and addressed promptly.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.5', 'Audit and Accountability', 'Correlate audit record review, analysis, and reporting processes', 2, 'Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.', 'Enable effective detection and investigation of security incidents through audit analysis.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.6', 'Audit and Accountability', 'Provide audit record reduction and report generation', 2, 'Provide audit record reduction and report generation to support on-demand analysis and reporting.', 'Enable efficient analysis of audit data through reduction and reporting capabilities.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.7', 'Audit and Accountability', 'Provide system capability to process audit records for events of interest', 2, 'Provide a system capability that compares and synchronizes internal system clocks with an authoritative source to generate time stamps for audit records.', 'Ensure accurate timestamps on audit records for incident analysis and correlation.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.8', 'Audit and Accountability', 'Protect audit information and audit logging tools', 2, 'Protect audit information and audit logging tools from unauthorized access, modification, and deletion.', 'Ensure integrity and availability of audit records.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('AU.L2-3.3.9', 'Audit and Accountability', 'Limit management of audit logging functionality', 2, 'Limit management of audit logging functionality to a subset of privileged users.', 'Prevent unauthorized manipulation of audit logging capabilities.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.1', 'Configuration Management', 'Establish and maintain baseline configurations', 2, 'Establish and maintain baseline configurations and inventories of organizational information systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.', 'Ensure systems are configured securely and changes are controlled.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.2', 'Configuration Management', 'Establish and enforce security configuration settings', 2, 'Establish and enforce security configuration settings for information technology products employed in organizational information systems.', 'Ensure systems are configured according to security best practices.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.3', 'Configuration Management', 'Track, review, approve, or disapprove changes to systems', 2, 'Track, review, approve or disapprove, and log changes to organizational information systems.', 'Ensure changes to systems are controlled and authorized.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.4', 'Configuration Management', 'Analyze the security impact of changes', 2, 'Analyze the security impact of changes prior to implementation.', 'Prevent security vulnerabilities from being introduced through system changes.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.5', 'Configuration Management', 'Define, document, approve, and enforce access restrictions', 2, 'Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational information systems.', 'Ensure only authorized personnel can make changes to systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.6', 'Configuration Management', 'Employ least functionality principle', 2, 'Employ the principle of least functionality by configuring organizational information systems to provide only essential capabilities.', 'Reduce attack surface by disabling unnecessary system capabilities.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.7', 'Configuration Management', 'Restrict, disable, or prevent software program execution', 2, 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', 'Reduce attack surface by limiting unnecessary software and services.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.8', 'Configuration Management', 'Apply deny-by-exception policy for software', 2, 'Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the execution of authorized software.', 'Prevent execution of unauthorized or malicious software.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CM.L2-3.4.9', 'Configuration Management', 'Control and monitor user-installed software', 2, 'Control and monitor user-installed software.', 'Prevent introduction of unauthorized or malicious software by users.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L1-3.5.1', 'Identification and Authentication', 'Identify system users, processes, or devices', 1, 'Identify information system users, processes acting on behalf of users, or devices.', 'Ensure entities accessing the system can be uniquely identified.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L1-3.5.2', 'Identification and Authentication', 'Authenticate the identities of users, processes, or devices', 1, 'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.', 'Ensure only authenticated entities can access organizational systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.3', 'Identification and Authentication', 'Use multifactor authentication for local and network access', 2, 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', 'Strengthen authentication through multiple factors, making credential theft less effective.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.4', 'Identification and Authentication', 'Employ replay-resistant authentication mechanisms', 2, 'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.', 'Prevent replay attacks where captured credentials are reused.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.5', 'Identification and Authentication', 'Prevent reuse of identifiers', 2, 'Prevent reuse of identifiers for a defined period.', 'Prevent confusion and ensure accountability by not reusing user identifiers.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.6', 'Identification and Authentication', 'Disable identifiers after defined period of inactivity', 2, 'Disable identifiers after a defined period of inactivity.', 'Reduce risk of unauthorized access through dormant accounts.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.7', 'Identification and Authentication', 'Enforce minimum password complexity', 2, 'Enforce a minimum password complexity and change of characters when new passwords are created.', 'Ensure passwords are resistant to guessing and brute force attacks.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.8', 'Identification and Authentication', 'Prohibit password reuse', 2, 'Prohibit password reuse for a specified number of generations.', 'Prevent users from cycling through old compromised passwords.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.9', 'Identification and Authentication', 'Allow temporary password use for system logons', 2, 'Allow temporary password use for system logons with an immediate change to a permanent password.', 'Ensure temporary passwords are only used once and changed immediately.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.10', 'Identification and Authentication', 'Store and transmit only cryptographically-protected passwords', 2, 'Store and transmit only cryptographically-protected passwords.', 'Protect passwords from disclosure through encryption.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IA.L2-3.5.11', 'Identification and Authentication', 'Obscure feedback of authentication information', 2, 'Obscure feedback of authentication information.', 'Prevent shoulder surfing and observation of authentication credentials.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IR.L2-3.6.1', 'Incident Response', 'Establish operational incident-handling capability', 2, 'Establish an operational incident-handling capability for organizational information systems that includes preparation, detection, analysis, containment, recovery, and user response activities.', 'Ensure organization can effectively respond to security incidents.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IR.L2-3.6.2', 'Incident Response', 'Track, document, and report incidents', 2, 'Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.', 'Ensure incidents are properly documented and reported to appropriate parties.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('IR.L2-3.6.3', 'Incident Response', 'Test incident response capability', 2, 'Test the organizational incident response capability.', 'Ensure incident response procedures are effective when needed.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MA.L2-3.7.1', 'Maintenance', 'Perform maintenance on systems', 2, 'Perform maintenance on organizational information systems.', 'Ensure systems remain operational and secure through regular maintenance.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MA.L2-3.7.2', 'Maintenance', 'Provide controls on tools, techniques, and personnel for maintenance', 2, 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct information system maintenance.', 'Prevent introduction of vulnerabilities through maintenance activities.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MA.L2-3.7.3', 'Maintenance', 'Require multifactor authentication for remote maintenance', 2, 'Ensure equipment removed for off-site maintenance is sanitized of any CUI.', 'Prevent unauthorized disclosure of CUI on equipment sent for maintenance.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MA.L2-3.7.4', 'Maintenance', 'Check media containing diagnostic and test programs for malicious code', 2, 'Check media containing diagnostic and test programs for malicious code before the media are used in organizational information systems.', 'Prevent malware introduction through maintenance tools and media.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MA.L2-3.7.5', 'Maintenance', 'Require multifactor authentication for remote maintenance sessions', 2, 'Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.', 'Ensure remote maintenance access is strongly authenticated and properly terminated.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MA.L2-3.7.6', 'Maintenance', 'Supervise maintenance activities by personnel who lack appropriate access', 2, 'Supervise the maintenance activities of maintenance personnel without required access authorization.', 'Prevent unauthorized access to CUI by uncleared maintenance personnel.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.1', 'Media Protection', 'Protect system media', 2, 'Protect (i.e., physically control and securely store) information system media containing CUI, both paper and digital.', 'Prevent unauthorized access to CUI on media through physical controls.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.2', 'Media Protection', 'Limit access to CUI on system media', 2, 'Limit access to CUI on information system media to authorized users.', 'Ensure only authorized personnel can access media containing CUI.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.3', 'Media Protection', 'Sanitize or destroy media before disposal or reuse', 2, 'Sanitize or destroy information system media containing Federal Contract Information before disposal or release for reuse.', 'Prevent unauthorized disclosure of CUI from disposed or reused media.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.4', 'Media Protection', 'Mark media with CUI markings', 2, 'Mark media with necessary CUI markings and distribution limitations.', 'Ensure personnel are aware of CUI on media and handle it appropriately.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.5', 'Media Protection', 'Control access to media and maintain accountability', 2, 'Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.', 'Prevent loss or unauthorized access to CUI during transport.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.6', 'Media Protection', 'Implement cryptographic mechanisms to protect CUI on portable storage', 2, 'Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards.', 'Protect CUI from unauthorized disclosure if media is lost or stolen during transport.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.7', 'Media Protection', 'Control use of removable media on system components', 2, 'Control the use of removable media on information system components.', 'Prevent unauthorized data exfiltration and malware introduction via removable media.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.8', 'Media Protection', 'Prohibit use of portable storage devices when controls cannot be verified', 2, 'Prohibit the use of portable storage devices when such devices have no identifiable owner.', 'Prevent use of potentially malicious or compromised portable storage devices.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('MP.L2-3.8.9', 'Media Protection', 'Protect backups of CUI', 2, 'Protect the confidentiality of backup CUI at storage locations.', 'Ensure backup copies of CUI are protected from unauthorized disclosure.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PS.L2-3.9.1', 'Personnel Security', 'Screen individuals prior to authorizing access', 2, 'Screen individuals prior to authorizing access to organizational information systems containing CUI.', 'Reduce risk of insider threats through background screening.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PS.L2-3.9.2', 'Personnel Security', 'Ensure CUI is protected during and after personnel actions', 2, 'Ensure that organizational information and information systems are protected during and after personnel actions such as terminations and transfers.', 'Prevent unauthorized access to CUI by former or transferred personnel.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PE.L1-3.10.1', 'Physical Protection', 'Limit physical access to systems and facilities', 1, 'Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.', 'Prevent unauthorized physical access to systems containing CUI.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PE.L1-3.10.3', 'Physical Protection', 'Escort visitors and monitor visitor activity', 1, 'Escort visitors and monitor visitor activity.', 'Prevent unauthorized access or activities by visitors.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PE.L1-3.10.4', 'Physical Protection', 'Maintain audit logs of physical access', 1, 'Maintain audit logs of physical access.', 'Provide accountability for physical access to facilities.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PE.L1-3.10.5', 'Physical Protection', 'Control and manage physical access devices', 1, 'Control and manage physical access devices.', 'Prevent unauthorized use of physical access devices like keys and access cards.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PE.L2-3.10.2', 'Physical Protection', 'Protect and monitor physical facility and support infrastructure', 2, 'Protect and monitor the physical facility and support infrastructure for organizational information systems.', 'Detect and prevent physical threats to information systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('PE.L2-3.10.6', 'Physical Protection', 'Enforce safeguarding measures for CUI at alternate work sites', 2, 'Enforce safeguarding measures for CUI at alternate work sites.', 'Ensure CUI is protected when personnel work from alternate locations.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('RA.L2-3.11.1', 'Risk Assessment', 'Periodically assess risk', 2, 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational information systems and the associated processing, storage, or transmission of CUI.', 'Identify and understand risks to inform security decisions.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('RA.L2-3.11.2', 'Risk Assessment', 'Scan for vulnerabilities and remediate', 2, 'Scan for vulnerabilities in organizational information systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.', 'Identify and address system vulnerabilities before they can be exploited.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('RA.L2-3.11.3', 'Risk Assessment', 'Remediate vulnerabilities', 2, 'Remediate vulnerabilities in accordance with risk assessments.', 'Reduce risk by addressing identified vulnerabilities based on their severity.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CA.L2-3.12.1', 'Security Assessment', 'Periodically assess security controls', 2, 'Periodically assess the security controls in organizational information systems to determine if the controls are effective in their application.', 'Ensure security controls are working as intended.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CA.L2-3.12.2', 'Security Assessment', 'Develop and implement remediation plans', 2, 'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational information systems.', 'Address identified security deficiencies systematically.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CA.L2-3.12.3', 'Security Assessment', 'Monitor security controls on an ongoing basis', 2, 'Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.', 'Detect security control failures or degradation promptly.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('CA.L2-3.12.4', 'Security Assessment', 'Develop, document, and periodically update system security plans', 2, 'Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems.', 'Ensure security requirements and implementations are documented and maintained.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L1-3.13.1', 'System and Communications Protection', 'Monitor, control, and protect communications at external boundaries', 1, 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational information systems) at the external boundaries and key internal boundaries of the information systems.', 'Prevent unauthorized information disclosure through network boundaries.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L1-3.13.5', 'System and Communications Protection', 'Implement subnetworks for publicly accessible system components', 1, 'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.', 'Isolate public-facing systems from internal networks containing CUI.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.2', 'System and Communications Protection', 'Employ architectural designs, software development techniques, and systems engineering principles', 2, 'Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational information systems.', 'Build security into systems from the design phase.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.3', 'System and Communications Protection', 'Separate user functionality from system management functionality', 2, 'Separate user functionality from information system management functionality.', 'Prevent users from accessing or affecting system management functions.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.4', 'System and Communications Protection', 'Prevent unauthorized information transfer via shared resources', 2, 'Prevent unauthorized and unintended information transfer via shared system resources.', 'Prevent information leakage through covert channels in shared resources.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.6', 'System and Communications Protection', 'Deny network communications traffic by default', 2, 'Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).', 'Minimize attack surface by only allowing necessary network communications.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.7', 'System and Communications Protection', 'Prevent split tunneling for remote devices', 2, 'Prevent remote devices from simultaneously establishing non-remote connections with organizational information systems and communicating via some other connection to resources in external networks.', 'Prevent bypassing of security controls through split tunneling.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.8', 'System and Communications Protection', 'Implement cryptographic mechanisms to prevent unauthorized disclosure', 2, 'Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.', 'Protect CUI from eavesdropping during network transmission.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.9', 'System and Communications Protection', 'Terminate network connections at end of sessions', 2, 'Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.', 'Prevent unauthorized use of idle network sessions.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.10', 'System and Communications Protection', 'Establish and manage cryptographic keys', 2, 'Establish and manage cryptographic keys for cryptography employed in organizational systems.', 'Ensure cryptographic keys are properly managed to maintain security.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.11', 'System and Communications Protection', 'Employ FIPS-validated cryptography', 2, 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.', 'Ensure cryptographic protections meet federal standards.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.12', 'System and Communications Protection', 'Prohibit remote activation of collaborative computing devices', 2, 'Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users present at the device.', 'Prevent unauthorized remote surveillance through collaboration tools.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.13', 'System and Communications Protection', 'Control and monitor use of mobile code', 2, 'Control and monitor the use of mobile code.', 'Prevent malicious mobile code from executing on organizational systems.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.14', 'System and Communications Protection', 'Control and monitor use of Voice over Internet Protocol', 2, 'Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.', 'Protect VoIP communications from eavesdropping and unauthorized use.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.15', 'System and Communications Protection', 'Protect authenticity of communications sessions', 2, 'Protect the authenticity of communications sessions.', 'Prevent man-in-the-middle attacks and session hijacking.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SC.L2-3.13.16', 'System and Communications Protection', 'Protect confidentiality of CUI at rest', 2, 'Protect the confidentiality of CUI at rest.', 'Prevent unauthorized disclosure of CUI stored on systems and media.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SI.L1-3.14.1', 'System and Information Integrity', 'Identify, report, and correct system flaws', 1, 'Identify, report, and correct information and information system flaws in a timely manner.', 'Reduce vulnerabilities by addressing system flaws promptly.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SI.L1-3.14.2', 'System and Information Integrity', 'Provide protection from malicious code', 1, 'Provide protection from malicious code at appropriate locations within organizational information systems.', 'Prevent malware from compromising organizational systems and data.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SI.L1-3.14.3', 'System and Information Integrity', 'Monitor system security alerts and advisories', 1, 'Monitor information system security alerts and advisories and take appropriate actions in response.', 'Ensure organization is aware of and responds to new security threats.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SI.L1-3.14.4', 'System and Information Integrity', 'Update malicious code protection mechanisms', 1, 'Update malicious code protection mechanisms when new releases are available.', 'Maintain effectiveness of malware protection through timely updates.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SI.L1-3.14.5', 'System and Information Integrity', 'Perform periodic scans and real-time scans of files', 1, 'Perform periodic scans of the information system and real-time scans of files from external sources as files are downloaded, opened, or executed.', 'Detect and prevent malware infections through scanning.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SI.L2-3.14.6', 'System and Information Integrity', 'Monitor communications for unusual or unauthorized activities', 2, 'Monitor organizational information systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.', 'Detect security incidents and attacks through communications monitoring.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CMMCControl" (id, domain, practice, level, description, objective)
VALUES ('SI.L2-3.14.7', 'System and Information Integrity', 'Identify unauthorized use of the system', 2, 'Identify unauthorized use of organizational information systems.', 'Detect and respond to unauthorized system use.')
ON CONFLICT (id) DO NOTHING;


undefined
