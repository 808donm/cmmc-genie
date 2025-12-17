import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-slate-600 mb-8">Last updated: December 17, 2024</p>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-slate-700 mb-4">
              CMMC Genie (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CMMC compliance management platform.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Account information (name, email address)</li>
              <li>Organization details</li>
              <li>Project and task data</li>
              <li>CMMC compliance documentation</li>
              <li>Team member information</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Usage data and analytics</li>
              <li>Device information</li>
              <li>IP address and browser type</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.3 OAuth and Third-Party Services</h3>
            <p className="text-slate-700 mb-4">
              When you sign in with Microsoft or Google, we receive:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Your email address</li>
              <li>Your name and profile picture</li>
              <li>Organization information (for Microsoft accounts)</li>
              <li>OAuth access tokens for email sending (with your explicit consent)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>To provide and maintain our services</li>
              <li>To manage your account and organization</li>
              <li>To facilitate CMMC compliance tracking</li>
              <li>To send team invitations via your email account (with permission)</li>
              <li>To communicate with you about service updates</li>
              <li>To improve our platform and user experience</li>
              <li>To ensure security and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Email Sending Permissions</h2>
            <p className="text-slate-700 mb-4">
              When you grant us permission to send emails on your behalf:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>We only send invitation emails when you explicitly request them</li>
              <li>Emails are sent from your Microsoft or Gmail account</li>
              <li>You can see all sent invitations in your Sent folder</li>
              <li>We do not read, modify, or delete any of your existing emails</li>
              <li>You can revoke this permission at any time through your OAuth provider settings</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Data Storage and Security</h2>
            <p className="text-slate-700 mb-4">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure database storage</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>OAuth tokens are encrypted and refreshed automatically</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">6. Data Sharing and Disclosure</h2>
            <p className="text-slate-700 mb-4">
              We do not sell your personal information. We may share your information:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>With your organization members and MSP providers (as configured)</li>
              <li>With service providers who assist in platform operations</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">7. Your Rights and Choices</h2>
            <p className="text-slate-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Revoke OAuth permissions</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">8. Cookies</h2>
            <p className="text-slate-700 mb-4">
              We use cookies and similar technologies for authentication, preferences, and analytics. You can control cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">9. Third-Party Links</h2>
            <p className="text-slate-700 mb-4">
              Our platform may contain links to third-party websites. We are not responsible for their privacy practices.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-slate-700 mb-4">
              Our services are not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-slate-700 mb-2">
              Email: <a href="mailto:support@cmmc-genie.com" className="text-blue-600 hover:text-blue-700">support@cmmc-genie.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
