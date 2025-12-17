import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-slate-600 mb-8">Last updated: December 17, 2024</p>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 mb-4">
              By accessing or using CMMC Genie (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 mb-4">
              CMMC Genie is a cloud-based platform designed to help organizations manage and track their Cybersecurity Maturity Model Certification (CMMC) compliance efforts. The Service includes:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>CMMC compliance tracking and documentation</li>
              <li>Project and task management</li>
              <li>Team collaboration tools</li>
              <li>AI-powered compliance assistance</li>
              <li>Managed Service Provider (MSP) capabilities</li>
              <li>Email invitation system</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.1 Account Creation</h3>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 18 years old to use the Service</li>
              <li>One person or entity may not maintain multiple accounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.2 Account Security</h3>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>You are responsible for all activity under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>We are not liable for losses due to compromised credentials</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. OAuth and Email Permissions</h2>
            <p className="text-slate-700 mb-4">
              When you grant email sending permissions through Microsoft or Google OAuth:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>You authorize the Service to send emails on your behalf for invitation purposes only</li>
              <li>You can revoke these permissions at any time through your OAuth provider</li>
              <li>We will not use these permissions for any unauthorized purposes</li>
              <li>You remain responsible for emails sent from your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-slate-700 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or viruses</li>
              <li>Attempt to gain unauthorized access to systems</li>
              <li>Use the Service for spam or unsolicited communications</li>
              <li>Interfere with other users&apos; access to the Service</li>
              <li>Misrepresent your identity or affiliation</li>
              <li>Share false or misleading compliance information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">6. Your Content</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">6.1 Ownership</h3>
            <p className="text-slate-700 mb-4">
              You retain ownership of all content you upload to the Service, including compliance documentation, project data, and organizational information.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">6.2 License to Us</h3>
            <p className="text-slate-700 mb-4">
              You grant us a limited license to store, process, and display your content solely to provide the Service to you.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">6.3 Your Responsibility</h3>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>You are responsible for the accuracy of your compliance data</li>
              <li>You must have rights to upload all content</li>
              <li>You are responsible for backing up important data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-slate-700 mb-4">
              The Service, including its software, design, features, and content (excluding your content), is owned by CMMC Genie and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">8. Compliance Disclaimer</h2>
            <p className="text-slate-700 mb-4">
              <strong>Important:</strong> CMMC Genie is a tool to assist with CMMC compliance tracking and management. However:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Use of the Service does not guarantee CMMC certification</li>
              <li>We do not provide legal, compliance, or cybersecurity advice</li>
              <li>You should consult with qualified professionals for compliance guidance</li>
              <li>We are not responsible for your compliance outcomes</li>
              <li>All compliance decisions remain your responsibility</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">9. AI-Generated Content</h2>
            <p className="text-slate-700 mb-4">
              Our AI agents provide suggestions and assistance. However:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>AI-generated content should be reviewed and verified</li>
              <li>We do not guarantee the accuracy of AI suggestions</li>
              <li>You are responsible for all content you publish based on AI recommendations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">10. Payment and Subscriptions</h2>
            <p className="text-slate-700 mb-4">
              If you subscribe to a paid plan:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Fees are billed in advance on a recurring basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days notice</li>
              <li>You can cancel your subscription at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">11. Service Modifications and Termination</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">11.1 Our Rights</h3>
            <p className="text-slate-700 mb-4">We reserve the right to:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Modify or discontinue the Service at any time</li>
              <li>Suspend or terminate accounts that violate these Terms</li>
              <li>Change features and functionality with notice</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">11.2 Your Rights</h3>
            <p className="text-slate-700 mb-4">
              You may terminate your account at any time. Upon termination, we will delete your data according to our data retention policies.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">12. Disclaimers and Limitations of Liability</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">12.1 Service Provided &quot;As Is&quot;</h3>
            <p className="text-slate-700 mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">12.2 Limitation of Liability</h3>
            <p className="text-slate-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">13. Indemnification</h2>
            <p className="text-slate-700 mb-4">
              You agree to indemnify and hold harmless CMMC Genie from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">14. Governing Law</h2>
            <p className="text-slate-700 mb-4">
              These Terms are governed by the laws of the United States, without regard to conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">15. Dispute Resolution</h2>
            <p className="text-slate-700 mb-4">
              Any disputes arising from these Terms or use of the Service shall be resolved through binding arbitration, except where prohibited by law.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">16. Changes to Terms</h2>
            <p className="text-slate-700 mb-4">
              We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">17. Severability</h2>
            <p className="text-slate-700 mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">18. Contact Information</h2>
            <p className="text-slate-700 mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-slate-700 mb-2">
              Email: <a href="mailto:legal@cmmc-genie.com" className="text-blue-600 hover:text-blue-700">legal@cmmc-genie.com</a>
            </p>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                By using CMMC Genie, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
