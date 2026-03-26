import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Midnight Explorer"
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="pt-8 space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              1. Introduction and Scope
            </h2>
            <p>
              This Privacy Policy applies to all data collected and processed
              when you use Midnight Explorer (hereinafter referred to as “we”,
              “us”, or “our”). Midnight Explorer is solely a public blockchain
              explorer for the Midnight network; we do not own, control, or
              store your private keys or cryptocurrency assets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              2. Definitions
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Personal Data:</strong> Any
                information relating to an identified or identifiable
                individual.
              </li>
              <li>
                <strong className="text-foreground">On-chain Data:</strong>{" "}
                Transaction information, wallet addresses, smart contracts, and
                similar data that is publicly available on the blockchain. We do
                not consider this private user data and only retrieve it via
                public nodes for display purposes.
              </li>
              <li>
                <strong className="text-foreground">Off-chain Data:</strong>{" "}
                Information you provide directly to us (e.g., when creating an
                account, contacting us, or submitting feedback).
              </li>
              <li>
                <strong className="text-foreground">Third Parties:</strong>{" "}
                Service providers such as website analytics (e.g., Google
                Analytics), CDN providers, Midnight node providers (e.g.,
                Blockfrost), or advertising networks (if applicable).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              3. Data We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">
                  Data you provide:
                </h3>
                <p>
                  When registering an account or contacting us, we may collect
                  basic contact information such as your name, email address,
                  organization (if any), and any content you submit (emails,
                  notes, etc.). This is collected based on your consent.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Login and interaction data:
                </h3>
                <p>
                  When you log in or interact with the website, we may collect
                  your IP address, browser type, operating system, access time,
                  and browsing behavior (pages visited, clicks, etc.). This data
                  is used to analyze and improve user experience and is
                  generally processed based on our legitimate interests (service
                  improvement and security).
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Cookies and tracking technologies:
                </h3>
                <p>
                  We use cookies (e.g., to store theme or language preferences)
                  and may use analytics tools such as Google Analytics (see
                  Section 6). Cookies may store session information or random
                  identifiers to enhance user experience. You will be notified
                  and may refuse cookies via browser settings or consent tools.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">On-chain data:</h3>
                <p>
                  Midnight Explorer only reads blockchain data (transactions,
                  blocks, pools, etc.) from public nodes or APIs and displays
                  it. We do not treat this as personal data, as it is publicly
                  available by design. We do not associate this data with
                  individuals beyond displaying publicly available information.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              4. Purpose and Legal Basis
            </h2>
            <p>We process your personal data for the following purposes:</p>
            <ul className="list-[lower-alpha] pl-6 space-y-2">
              <li>
                Providing and improving services (analytics, debugging, feature
                enhancement)
              </li>
              <li>
                Customer interaction and support (responding to emails, updates,
                events)
              </li>
              <li>Security and fraud prevention</li>
              <li>Legal compliance</li>
            </ul>
            <p>
              For required data (e.g., contact information for support), the
              legal basis is contract or your consent. For technical data (e.g.,
              IP, cookies), we rely on legitimate interests to maintain and
              improve our services. We comply with GDPR transparency
              requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              5. Data Retention
            </h2>
            <p>
              Personal data is retained only as long as necessary for its
              intended purpose. For example:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Cookies:</strong> up to 1
                year
              </li>
              <li>
                <strong className="text-foreground">Access logs:</strong> ~6
                months
              </li>
              <li>
                <strong className="text-foreground">Analytics data:</strong>{" "}
                12–24 months
              </li>
              <li>
                <strong className="text-foreground">Account data:</strong> until
                deletion request or account termination (whichever comes first)
              </li>
            </ul>
            <p>
              We follow data minimization principles and retain only necessary
              data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              6. Cookies and Web Beacons
            </h2>
            <p>
              We use cookies and pixels for analytics (e.g., Google Analytics)
              and may allow third parties (e.g., CDN providers) to deliver
              content. Cookies help recognize returning users, store
              preferences, and measure traffic.
            </p>
            <p>
              You will see a cookie consent banner (e.g., “This website uses
              cookies to enhance user experience. Please accept or customize”).
              Essential cookies are enabled by default, while
              analytics/marketing cookies may require consent. You can disable
              cookies anytime via your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              7. Third-Party Partners
            </h2>
            <p>We may work with third-party providers, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Analytics:</strong> Google
                Analytics
              </li>
              <li>
                <strong className="text-foreground">
                  Advertising networks:
                </strong>{" "}
                Google AdSense (if applicable)
              </li>
              <li>
                <strong className="text-foreground">CDN and hosting:</strong>{" "}
                e.g., Cloudflare (for performance and DDoS protection)
              </li>
              <li>
                <strong className="text-foreground">
                  Midnight node providers:
                </strong>{" "}
                e.g., Blockfrost, Project Midnight API
              </li>
            </ul>
            <p>
              We only share necessary data with partners for specific purposes.
              Each partner has its own privacy policy. We do not sell personal
              data. Third-party cookies are governed by their respective
              policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              8. International Data Transfers
            </h2>
            <p>
              Your personal data may be stored and processed in other countries
              (e.g., Singapore, United States).
            </p>
            <p>We comply with applicable data transfer laws:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">For EU users:</strong>{" "}
                Standard Contractual Clauses (SCCs)
              </li>
              <li>
                <strong className="text-foreground">For Vietnam:</strong>{" "}
                compliance with PDPL regulations
              </li>
            </ul>
            <p>
              Appropriate safeguards are implemented for cross-border transfers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              9. Your Rights
            </h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Access:</strong> Request a
                copy of your data
              </li>
              <li>
                <strong className="text-foreground">Correction:</strong> Request
                correction of inaccurate or incomplete data
              </li>
              <li>
                <strong className="text-foreground">Deletion:</strong> Request
                deletion under certain conditions
              </li>
              <li>
                <strong className="text-foreground">Restriction:</strong>{" "}
                Request limitation of processing
              </li>
              <li>
                <strong className="text-foreground">Portability:</strong>{" "}
                Request data in a transferable format
              </li>
              <li>
                <strong className="text-foreground">Opt-out:</strong> For
                California users, opt out of data sale/sharing
              </li>
              <li>
                <strong className="text-foreground">Withdraw consent:</strong>{" "}
                At any time
              </li>
              <li>
                <strong className="text-foreground">Non-discrimination:</strong>{" "}
                No penalty for exercising your rights
              </li>
            </ul>
            <p>
              We will respond within legal timeframes (GDPR: 1 month; CCPA: 45
              days).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              10. Request Procedures
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">
                  Data access request:
                </h3>
                <p>
                  Provide name, email, request type, and reason. First request
                  is free and processed within ~45 days.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Data deletion request:
                </h3>
                <p>
                  Provide identity verification and request details. Data will
                  be deleted unless legally required to retain it.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              11. Children&apos;s Privacy
            </h2>
            <p>
              We do not knowingly collect data from children under 13 (or under
              7 under Vietnamese law without parental consent). If such data is
              identified, it will be deleted promptly upon notification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              12. Data Security
            </h2>
            <p>
              We implement technical and organizational safeguards, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of sensitive data</li>
              <li>Multi-factor authentication</li>
              <li>Access control</li>
              <li>Regular updates and backups</li>
            </ul>
            <p>Users are responsible for maintaining account security.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              13. Automated Decision-Making
            </h2>
            <p>
              Midnight Explorer does not use personal data for automated
              decision-making or profiling with legal effects. Any displayed
              analytics are informational only and not financial advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              14. Policy Updates
            </h2>
            <p>
              We may update this Privacy Policy as required. Changes will be
              posted on the website and, where appropriate, notified via email.
              Continued use constitutes acceptance of updates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              15. Contact & Data Protection Officer (DPO)
            </h2>
            <p>For inquiries or requests, contact us at:</p>
            <ul className="space-y-1">
              <li>
                <strong className="text-foreground">Email:</strong>{" "}
                contact@midnightexplorer.com
              </li>
              <li>
                <strong className="text-foreground">Address:</strong> Hanoi,
                Vietnam
              </li>
            </ul>
            <p>
              We aim to respond within 30 days. A Data Protection Officer (DPO)
              may be appointed as needed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              16. Governing Law and Dispute Resolution
            </h2>
            <p>
              This Privacy Policy is governed by the laws of the jurisdiction
              where the company is registered (e.g., Vietnam).
            </p>
            <p>
              Disputes will first be resolved through negotiation; failing that,
              they will be handled by competent courts in the applicable
              jurisdiction.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
