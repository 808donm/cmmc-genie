/**
 * Configuration Agent
 *
 * Generates CMMC-compliant network equipment configurations
 * for various vendors and device types
 */

import { BaseAgent, AgentRequest, AgentResponse } from "../base-agent";

const CONFIGURATION_AGENT_SYSTEM_PROMPT = `You are the Configuration Agent for CMMC Genie, an expert in network security configuration and CMMC-compliant infrastructure design.

## Your Expertise

You specialize in generating secure configurations for:

**Supported Vendors**:
- **Cisco**: ASA, ISR, Catalyst switches, Nexus, Meraki
- **HP/HPE**: ProCurve, Aruba switches
- **Aruba**: Switches, wireless controllers, access points
- **Unifi**: USG, Dream Machine, switches, access points
- **Sonicwall**: TZ/NSa series firewalls, VPNs
- **Fortinet**: FortiGate firewalls, FortiSwitch, FortiAP

**Device Types**:
- Routers and Layer 3 switches
- Layer 2 switches
- Firewalls and UTM devices
- Wireless controllers and access points
- VPN gateways

## CMMC Configuration Requirements

Your configurations must address these CMMC control families:

### Access Control (AC)
- Implement least privilege access
- Configure role-based access control
- Separate user and privileged accounts
- Enforce session timeout
- Control wireless access

### System and Communications Protection (SC)
- Encrypt data in transit (TLS, IPsec, SSH)
- Segment networks (VLANs for CUI separation)
- Implement boundary protection (firewalls, ACLs)
- Deny by default traffic
- Protect wireless communications (WPA3)

### Identification and Authentication (IA)
- Enforce strong password policies
- Implement multi-factor authentication where possible
- Unique user identification
- Secure password storage

### Configuration Management (CM)
- Baseline configurations
- Change control procedures
- Disable unnecessary services/ports
- Security configuration settings

### System and Information Integrity (SI)
- Enable logging and monitoring
- Configure SNMP securely
- Implement IDS/IPS where applicable
- Malware protection integration

## Configuration Best Practices

1. **Security Hardening**:
   - Disable unnecessary services
   - Change default credentials
   - Use strong encryption
   - Implement defense in depth

2. **Network Segmentation**:
   - Separate CUI and non-CUI networks
   - Create DMZ for external-facing services
   - Isolate management networks
   - Implement VLAN segregation

3. **Access Control**:
   - Use AAA (RADIUS/TACACS+) where possible
   - Implement local user accounts as backup
   - Configure privilege levels
   - Enable SSH, disable Telnet

4. **Logging and Monitoring**:
   - Enable comprehensive logging
   - Send logs to central syslog server
   - Configure NTP for accurate timestamps
   - Set appropriate log levels

5. **Documentation**:
   - Include configuration comments
   - Document CMMC control mappings
   - Note any deviations from baseline
   - Provide implementation instructions

## Output Format

When generating configurations, provide:

1. **Configuration Header**:
   - Device type and model
   - CMMC level targeted
   - Purpose and network role
   - Date and version

2. **Complete Configuration**:
   - Ready to copy/paste
   - Proper syntax for the vendor
   - Comments explaining sections
   - Highlighted security settings

3. **CMMC Control Mapping**:
   - Which controls this config addresses
   - How each requirement is met
   - Any controls requiring additional configuration

4. **Implementation Notes**:
   - Pre-requisites
   - Deployment steps
   - Testing procedures
   - Rollback plan

5. **Variables to Customize**:
   - IP addresses
   - Interface names
   - Hostnames
   - Passwords (mark for change)

## Security Considerations

- Never include real passwords in configurations
- Use placeholders like <STRONG_PASSWORD_HERE>
- Warn about potential service disruptions
- Include testing steps before production deployment
- Recommend configuration backup before changes

Generate configurations that are:
- ✅ Production-ready and secure
- ✅ Compliant with CMMC requirements
- ✅ Following vendor best practices
- ✅ Well-documented and clear
- ✅ Tested and validated (where possible)`;

export class ConfigurationAgent extends BaseAgent {
  constructor() {
    super("CONFIGURATION", CONFIGURATION_AGENT_SYSTEM_PROMPT);
  }

  /**
   * Generate firewall configuration
   */
  async generateFirewallConfig(request: {
    vendor: "cisco" | "sonicwall" | "fortinet";
    model?: string;
    cmmcLevel: 1 | 2 | 3;
    requirements: {
      internetInterface?: string;
      internalInterface?: string;
      cuiNetwork?: string;
      nonCuiNetwork?: string;
      vpnRequired?: boolean;
      idsEnabled?: boolean;
    };
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Generate a CMMC Level ${request.cmmcLevel} compliant firewall configuration for:

Vendor: ${request.vendor}
${request.model ? `Model: ${request.model}` : ""}

Requirements:
${request.requirements.internetInterface ? `- Internet Interface: ${request.requirements.internetInterface}` : ""}
${request.requirements.internalInterface ? `- Internal Interface: ${request.requirements.internalInterface}` : ""}
${request.requirements.cuiNetwork ? `- CUI Network: ${request.requirements.cuiNetwork}` : ""}
${request.requirements.nonCuiNetwork ? `- Non-CUI Network: ${request.requirements.nonCuiNetwork}` : ""}
${request.requirements.vpnRequired ? "- VPN Required: Yes" : ""}
${request.requirements.idsEnabled ? "- IDS/IPS Enabled: Yes" : ""}

Please provide:
1. Complete firewall configuration
2. Security zones and policies
3. NAT rules (if applicable)
4. Access control lists
5. VPN configuration (if required)
6. Logging and monitoring settings
7. CMMC control mapping
8. Implementation instructions

Ensure proper CUI/non-CUI network segregation and deny-by-default policies.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate switch configuration with VLANs
   */
  async generateSwitchConfig(request: {
    vendor: "cisco" | "hp" | "aruba" | "unifi";
    model?: string;
    cmmcLevel: 1 | 2 | 3;
    vlans: Array<{
      id: number;
      name: string;
      purpose: string;
      isCUI?: boolean;
    }>;
    context?: any;
  }): Promise<AgentResponse> {
    const vlanDetails = request.vlans
      .map((v) => `  - VLAN ${v.id}: ${v.name} (${v.purpose})${v.isCUI ? " [CUI]" : ""}`)
      .join("\n");

    const prompt = `Generate a CMMC Level ${request.cmmcLevel} compliant switch configuration for:

Vendor: ${request.vendor}
${request.model ? `Model: ${request.model}` : ""}

VLANs Required:
${vlanDetails}

Please provide:
1. Complete switch configuration
2. VLAN creation and naming
3. Port assignments and security
4. Inter-VLAN routing (if applicable)
5. Port security settings
6. Spanning-tree configuration
7. Management VLAN isolation
8. SSH access configuration
9. Logging and SNMP settings
10. CMMC control mapping
11. Implementation steps

Ensure proper network segmentation between CUI and non-CUI VLANs.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate wireless configuration
   */
  async generateWirelessConfig(request: {
    vendor: "cisco" | "aruba" | "unifi";
    deviceType: "controller" | "standalone";
    cmmcLevel: 1 | 2 | 3;
    ssids: Array<{
      name: string;
      purpose: string;
      isCUI?: boolean;
      guestNetwork?: boolean;
    }>;
    context?: any;
  }): Promise<AgentResponse> {
    const ssidDetails = request.ssids
      .map((s) => {
        const tags = [];
        if (s.isCUI) tags.push("CUI");
        if (s.guestNetwork) tags.push("Guest");
        return `  - ${s.name}: ${s.purpose}${tags.length ? ` [${tags.join(", ")}]` : ""}`;
      })
      .join("\n");

    const prompt = `Generate a CMMC Level ${request.cmmcLevel} compliant wireless configuration for:

Vendor: ${request.vendor}
Type: ${request.deviceType}

SSIDs Required:
${ssidDetails}

Please provide:
1. Complete wireless configuration
2. SSID creation with security settings
3. WPA3/WPA2 Enterprise configuration
4. RADIUS integration (if applicable)
5. Guest network isolation
6. CUI wireless network protection
7. Rogue AP detection settings
8. Wireless IDS/IPS (if available)
9. Client isolation settings
10. Management interface security
11. CMMC control mapping
12. Deployment checklist

Ensure WPA3 or WPA2-Enterprise for CUI networks and proper network isolation.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate VPN configuration
   */
  async generateVPNConfig(request: {
    vendor: "cisco" | "sonicwall" | "fortinet" | "unifi";
    vpnType: "site-to-site" | "remote-access" | "both";
    cmmcLevel: 1 | 2 | 3;
    requirements?: {
      mfa?: boolean;
      splitTunnel?: boolean;
      allowedNetworks?: string[];
    };
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Generate a CMMC Level ${request.cmmcLevel} compliant VPN configuration for:

Vendor: ${request.vendor}
VPN Type: ${request.vpnType}

Requirements:
${request.requirements?.mfa ? "- Multi-Factor Authentication: Required" : ""}
${request.requirements?.splitTunnel !== undefined ? `- Split Tunneling: ${request.requirements.splitTunnel ? "Enabled" : "Disabled"}` : ""}
${request.requirements?.allowedNetworks?.length ? `- Allowed Networks: ${request.requirements.allowedNetworks.join(", ")}` : ""}

Please provide:
1. Complete VPN configuration
2. Encryption settings (recommend AES-256)
3. Authentication method (certificates, MFA)
4. Tunnel configuration
5. Access control policies
6. Logging and monitoring
7. Client configuration guide (for remote access)
8. CMMC control mapping
9. Security best practices
10. Testing procedures

Ensure strong encryption and authentication for protecting CUI data in transit.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Review existing configuration for compliance
   */
  async reviewConfiguration(request: {
    vendor: string;
    deviceType: string;
    currentConfig: string;
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Review the following ${request.vendor} ${request.deviceType} configuration for CMMC Level ${request.cmmcLevel} compliance:

${request.currentConfig}

Please provide:
1. Overall security assessment
2. CMMC controls addressed by this configuration
3. Security vulnerabilities identified
4. Missing security settings
5. Hardening recommendations
6. Configuration improvements
7. Priority ranking of findings (Critical/High/Medium/Low)
8. Step-by-step remediation guide

Focus on:
- Access control weaknesses
- Encryption gaps
- Logging deficiencies
- Unnecessary services
- Default credentials or settings
- Network segmentation issues`;

    return this.process({
      prompt,
      context: request.context,
    });
  }

  /**
   * Generate network segmentation design
   */
  async designNetworkSegmentation(request: {
    organizationSize: "small" | "medium" | "large";
    cuiSystems: string[];
    nonCuiSystems: string[];
    cmmcLevel: 1 | 2 | 3;
    context?: any;
  }): Promise<AgentResponse> {
    const prompt = `Design a network segmentation architecture for CMMC Level ${request.cmmcLevel}:

Organization Size: ${request.organizationSize}

CUI Systems:
${request.cuiSystems.map((s) => `- ${s}`).join("\n")}

Non-CUI Systems:
${request.nonCuiSystems.map((s) => `- ${s}`).join("\n")}

Please provide:
1. Network architecture diagram (in text/ASCII)
2. VLAN design and numbering scheme
3. Firewall rule requirements
4. Network boundary definitions
5. DMZ design (if applicable)
6. Management network isolation
7. Guest network setup
8. Traffic flow descriptions
9. CMMC control mapping (especially AC, SC)
10. Implementation roadmap

Ensure clear separation between CUI and non-CUI environments with appropriate controls.`;

    return this.process({
      prompt,
      context: request.context,
    });
  }
}
