import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Midnight Explorer"
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Terms of Service
        </h1>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="pt-8 space-y-8 text-muted-foreground leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Definitions</h2>
            <p>
              In these Terms, the “Service” includes the Midnight Explorer website and API. Users (“you”) may access and use the Service subject to the following terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Acceptance of Terms</h2>
            <p>By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you must discontinue use immediately.</p>
            <p>We reserve the right to update these Terms at any time. Updated versions will be published publicly and, where appropriate, notified via email. Continued use of the Service after updates constitutes acceptance of the revised Terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Account Creation and Security</h2>
            <p>Certain features require account registration. You agree to provide accurate, up-to-date information and to keep your password secure.</p>
            <p>You are solely responsible for all activities under your account. If you suspect unauthorized access or a security breach, you must notify us immediately.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Use of the Service</h2>
            <p>You may use Midnight Explorer to access publicly available information on the Midnight blockchain. You MUST NOT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Disrupt or interfere with the Service (e.g., overloading servers, DDoS attacks)</li>
              <li>Use the Service for illegal activities (money laundering, terrorism financing, illegal gambling, fraud)</li>
              <li>Use unauthorized automated tools (bots, crawlers, scripts) to extract data (except lawful public indexing for search engines)</li>
              <li>Reuse, copy, or redistribute Service content (e.g., labels, charts, API data) without our permission</li>
              <li>Use our data for AI/ML training or commercial redistribution without explicit consent (prohibited by default, even if modified)</li>
              <li>Access other users’ accounts without authorization or share your account</li>
              <li>Circumvent or attempt to bypass technical protections</li>
              <li>Distribute malware, viruses, or infringing content</li>
            </ul>
            <p>Violations may result in suspension or termination without prior notice.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. User-Generated Content</h2>
            <p>If the Service allows you to submit content (comments, address labels, notes, etc.), you retain ownership of your content. However, you grant us a non-exclusive, royalty-free license to use, publish, and modify such content as necessary to provide the Service.</p>
            <p>You agree not to submit unlawful or infringing content. We reserve the right (but not the obligation) to remove content deemed inappropriate.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
            <p>All content on the Service (logos, design, text, images, source code) is owned by or licensed to Midnight Explorer.</p>
            <p>You may view and use content for personal purposes only. You may not reproduce or redistribute it without permission. Proper attribution is required for any permitted use.</p>
            <p>If you believe your copyright has been infringed, please contact us following DMCA procedures.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. No Custodial Services</h2>
            <p>Midnight Explorer is NOT a custodian, trustee, or manager of any cryptocurrency assets, private keys, or wallets.</p>
            <p>We do not have access to your assets or private keys and are not responsible for losses due to lost keys or incorrect transactions. The Service is read-only and you are solely responsible for your blockchain interactions.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Disclaimer of Warranties</h2>
            <p>The Service is provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind.</p>
            <p>To the fullest extent permitted by law, we disclaim all liability for errors (including incomplete or inaccurate blockchain data), service interruptions, cyberattacks, or other issues.</p>
            <p>Any data or software downloaded from the Service is at your own risk. You are responsible for securing and backing up your data.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, Midnight Explorer and its employees and partners SHALL NOT BE LIABLE for any damages (direct, indirect, incidental, special, consequential, loss of profits, loss of data, etc.) arising from your use or inability to use the Service.</p>
            <p>This includes risks related to systems, networks, software bugs, or blockchain protocol changes. You use the Service entirely at your own risk.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">10. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless Midnight Explorer and its affiliates, directors, employees, and partners from any claims, damages, or expenses (including legal fees) arising from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of third-party rights</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">11. Termination</h2>
            <p>We may suspend or terminate your access at any time if you violate these Terms.</p>
            <p>You may stop using the Service and terminate your account at any time. Upon termination, your rights under these Terms will cease, except provisions that by nature should survive (e.g., liability, intellectual property, governing law).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">12. Service Fees</h2>
            <p>Currently, Midnight Explorer is free for most users.</p>
            <p>If paid plans are introduced in the future (e.g., higher API limits or enterprise features), pricing policies will be communicated separately. Payment terms will be governed by specific billing agreements.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">13. API Terms</h2>
            <p>To use the API, you must register for a personal API key.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>API keys are for your own use and must not be publicly shared</li>
              <li>Rate limits apply depending on your plan (free or paid)</li>
              <li>Exceeding limits or misuse may result in suspension</li>
              <li>API usage must comply with applicable laws (no abuse, spam, malicious analysis, etc.)</li>
            </ul>
            <p>We reserve the right to modify limits or revoke API access at any time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">14. Community Conduct</h2>
            <p>If the Service allows public interaction (comments, forums), you must act respectfully.</p>
            <p>Spam, harassment, illegal, or abusive content is prohibited. We may remove content or suspend accounts for violations.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">15. Changes to Terms</h2>
            <p>We may modify these Terms at any time. Changes take effect immediately upon posting or notification.</p>
            <p>You are responsible for reviewing the Terms regularly. Continued use constitutes acceptance of updates.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">16. Governing Law and Dispute Resolution</h2>
            <p>These Terms are governed by the laws of the jurisdiction where the company is registered (e.g., Vietnam).</p>
            <p>Disputes will first be resolved through negotiation. If unresolved, they will be handled by the competent courts of the applicable jurisdiction.</p>
          </section>

          <div className="pt-6 mt-6 border-t border-border/50 space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">No Legal Advice</h2>
              <p>Midnight Explorer provides blockchain data “as is” and does not guarantee absolute accuracy or timeliness.</p>
              <p>We do not provide investment, financial, or legal advice. All decisions are made at your own risk.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Disclaimer</h2>
              <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Midnight Explorer (including employees and partners) DISCLAIMS ALL LIABILITY for any losses or damages (direct or indirect) arising from the use of the Service or its data, to the fullest extent permitted by law.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Template Basis</h2>
              <p>These Terms are based on industry practices of major blockchain explorers (e.g., Etherscan, Polygonscan) and applicable data protection laws.</p>
            </section>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
