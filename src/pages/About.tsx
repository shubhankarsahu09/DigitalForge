import { useState, useEffect } from "react";

const LAST_UPDATED = "May 12, 2026";
const SUPPORT_EMAIL = "support@digitalforge.com";
const WEBSITE = "www.digitalforge.com";

const sections = {
  tos: [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: `By accessing or using the DigitalForge platform (the "Platform"), creating an account, or purchasing any digital product, you ("User," "you," or "your") agree to be legally bound by these Terms of Service ("Terms"). If you do not agree to these Terms in their entirety, you must immediately discontinue your use of the Platform.

These Terms constitute a binding legal agreement between you and DigitalForge ("we," "us," or "our"). We reserve the right to modify these Terms at any time. Continued use of the Platform after any modification constitutes your acceptance of the revised Terms. We will notify registered users of material changes via email.`
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      content: `To use DigitalForge, you must:

• Be at least 13 years of age (or the minimum age required by your jurisdiction).
• Have the legal capacity to enter into a binding agreement.
• Not be prohibited from using the Platform under applicable law.

By registering an account, you represent and warrant that you meet all eligibility requirements. Accounts created by individuals who do not meet these requirements may be suspended or permanently terminated without notice.`
    },
    {
      id: "accounts",
      title: "3. User Accounts",
      content: `3.1 Account Creation. You may register for an account using your email address or through supported third-party OAuth providers, currently Google and GitHub. You agree to provide accurate, current, and complete information during registration and to keep your account information updated.

3.2 Account Security. You are solely responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately at ${SUPPORT_EMAIL} upon becoming aware of any unauthorized use of your account. DigitalForge shall not be liable for any loss or damage arising from your failure to safeguard your credentials.

3.3 Account Termination. We reserve the right to suspend or permanently terminate your account, at our sole discretion, for violations of these Terms, fraudulent activity, or conduct deemed harmful to the Platform or its users. Upon termination, access to purchased content may be revoked where technically or legally required.`
    },
    {
      id: "purchases",
      title: "4. Purchases & Payment",
      content: `4.1 Pricing. All prices listed on the Platform are in US Dollars (USD) unless otherwise stated. We reserve the right to modify pricing at any time. Price changes will not retroactively apply to completed purchases.

4.2 Payment Processing. Payments are processed by third-party payment processors. By completing a purchase, you authorize DigitalForge to charge your selected payment method for the full purchase amount. DigitalForge does not store complete payment card information on its servers.

4.3 Order Confirmation. Upon successful payment, you will receive a confirmation email at the address associated with your account. Access to your purchased playbook(s) will be reflected in your Studio dashboard.`
    },
    {
      id: "refunds",
      title: "5. No Refund Policy",
      content: `ALL SALES ARE FINAL. Due to the immediate and irreversible nature of digital product delivery, DigitalForge does not offer refunds, exchanges, or credits for any purchased PDF playbooks once the transaction has been completed and the product has been made accessible in your account.

This policy applies regardless of whether you have downloaded the file or opened it. By completing a purchase, you expressly acknowledge and accept this no-refund policy.

Exceptions. We may, at our sole discretion, offer a refund or account credit in cases where:

• A technical error on our part prevented you from accessing the purchased product and we are unable to resolve the issue within a reasonable timeframe.
• You were charged more than once for the same order (duplicate charge).

To request a review under these limited exceptions, contact ${SUPPORT_EMAIL} within 7 days of the transaction date with your order details.`
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property & License",
      content: `6.1 Ownership. All PDF playbooks, written content, graphics, branding, logos, and materials available on DigitalForge (collectively, "Content") are the exclusive intellectual property of DigitalForge or its licensed authors and are protected by applicable copyright, trademark, and intellectual property laws.

6.2 Personal Use License. Upon purchase, DigitalForge grants you a limited, non-exclusive, non-transferable, revocable license to access and use the purchased PDF for your own personal, non-commercial educational purposes only.

6.3 Prohibited Uses. You expressly agree NOT to:

• Copy, reproduce, duplicate, or redistribute any purchased PDF in whole or in part.
• Sell, resell, sublicense, rent, or otherwise commercially exploit any purchased content.
• Share your account login credentials to provide others access to purchased content.
• Upload, post, or otherwise make available any purchased PDF on any public or private platform, website, or file-sharing service.
• Modify, reverse-engineer, or create derivative works from any purchased content without express written permission.

6.4 Enforcement. DigitalForge actively monitors for unauthorized distribution of its content. Violations of this section may result in immediate account termination, legal action, and pursuit of damages to the fullest extent permitted by law.`
    },
    {
      id: "user-conduct",
      title: "7. Prohibited Conduct",
      content: `You agree not to use the Platform to:

• Violate any applicable local, national, or international law or regulation.
• Engage in fraudulent, deceptive, or misleading activity.
• Attempt to gain unauthorized access to any part of the Platform, its servers, or connected systems.
• Transmit malware, viruses, or any code of a destructive nature.
• Scrape, crawl, or use automated tools to extract data from the Platform without prior written consent.
• Impersonate any person or entity or misrepresent your affiliation with any person or entity.`
    },
    {
      id: "disclaimers",
      title: "8. Disclaimers & Limitation of Liability",
      content: `8.1 Educational Nature. All PDF playbooks sold on DigitalForge are educational materials intended for informational purposes only. Nothing in our Content constitutes professional legal, financial, medical, or other licensed professional advice.

8.2 "As Is" Basis. The Platform and all Content are provided on an "as is" and "as available" basis, without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.

8.3 Limitation of Liability. To the maximum extent permitted by applicable law, DigitalForge, its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform or its Content, even if advised of the possibility of such damages.

Our total aggregate liability to you for any claim arising under these Terms shall not exceed the total amount paid by you to DigitalForge in the six (6) months preceding the event giving rise to such claim.`
    },
    {
      id: "governing-law",
      title: "9. Governing Law & Disputes",
      content: `These Terms shall be governed by and construed in accordance with applicable law. Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration, with each party bearing its own costs.

You waive any right to bring claims as a plaintiff or class member in any purported class or representative proceeding.`
    },
    {
      id: "contact-tos",
      title: "10. Contact",
      content: `For questions, concerns, or support related to these Terms of Service, please contact us at:

Email: ${SUPPORT_EMAIL}
Website: ${WEBSITE}

We aim to respond to all inquiries within 3 business days.`
    }
  ],
  privacy: [
    {
      id: "intro",
      title: "1. Introduction",
      content: `DigitalForge ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you access or use the DigitalForge platform at ${WEBSITE} (the "Platform").

By creating an account or using the Platform, you consent to the data practices described in this Privacy Policy. If you do not agree, please discontinue use of the Platform immediately.`
    },
    {
      id: "data-collected",
      title: "2. Information We Collect",
      content: `2.1 Information You Provide Directly.

• Identity Data: First name, last name, and email address, collected at account registration.
• Payment Data: Billing information such as card details, processed and held exclusively by our third-party payment processors. DigitalForge does not store complete payment card data on its own servers.
• Communications: Messages or emails you send to our support team.

2.2 Information Collected via Third-Party Authentication.

If you choose to sign in using Google or GitHub (OAuth), we receive a limited set of data from those providers, which may include:

• Your name and email address as registered with the provider.
• A unique provider-specific identifier (user ID).
• Profile picture URL (if provided by the provider).

We do not receive or store your passwords for Google or GitHub. The scope of data shared is governed by the permissions you grant and each provider's privacy policy.

2.3 Automatically Collected Data.

• Usage Data: Pages visited, features used, timestamps, and session duration.
• Device & Browser Data: IP address, browser type, operating system, and referring URL.
• Cookies & Similar Technologies: We use cookies and local storage for authentication sessions and platform functionality. See Section 6 for details.`
    },
    {
      id: "use-of-data",
      title: "3. How We Use Your Information",
      content: `We use the information we collect for the following purposes:

• Account Management: To create, authenticate, and manage your DigitalForge account.
• Product Delivery: To grant access to purchased PDF playbooks in your Studio dashboard.
• Communication: To send you order confirmations, receipts, and essential account notifications.
• Customer Support: To respond to your inquiries and resolve issues.
• Platform Improvement: To analyze usage patterns and improve our features, content, and user experience.
• Legal Compliance: To comply with applicable laws, regulations, and legal processes.
• Security: To detect, investigate, and prevent fraudulent activity or unauthorized access.

We will not use your personal information for purposes materially different from those stated above without your prior consent.`
    },
    {
      id: "data-sharing",
      title: "4. Information Sharing & Disclosure",
      content: `We do not sell, rent, or trade your personal information to any third party for their own marketing purposes. We may share your information only in the following limited circumstances:

4.1 Service Providers. We engage trusted third-party service providers to assist in operating the Platform, including:

• Database & Authentication: Supabase (for secure user authentication and data storage).
• Payment Processing: Third-party payment processors (e.g., Stripe) to handle transactions.
• Email Delivery: Email service providers to send transactional notifications.

These providers are contractually obligated to use your data solely on our behalf and in accordance with this Privacy Policy.

4.2 Legal Requirements. We may disclose your information if required to do so by law, court order, or in response to valid requests from public authorities.

4.3 Business Transfers. In the event of a merger, acquisition, or sale of all or substantially all of our assets, your data may be transferred as part of that transaction. We will notify registered users of such a transfer via email.

4.4 Protection of Rights. We may disclose information where we believe it is necessary to investigate, prevent, or take action regarding illegal activities, suspected fraud, or violations of our Terms of Service.`
    },
    {
      id: "data-storage",
      title: "5. Data Storage & Security",
      content: `5.1 Storage. Your personal data is stored using Supabase, a secure database platform with industry-standard infrastructure. Data may be stored on servers located outside your country of residence.

5.2 Security Measures. We implement appropriate technical and organizational measures to protect your personal data, including:

• Encrypted data transmission via HTTPS/TLS.
• Secure authentication via Supabase Auth with industry-standard hashing for credentials.
• Access controls limiting employee access to personal data on a need-to-know basis.

5.3 Limitations. Despite our best efforts, no method of internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security of your data.`
    },
    {
      id: "cookies",
      title: "6. Cookies & Tracking Technologies",
      content: `We use cookies and similar technologies (such as local storage tokens) for the following purposes:

• Authentication Cookies: To keep you securely logged into your account across sessions.
• Functional Cookies: To remember your preferences and maintain session state.
• Analytics: To understand how users interact with the Platform in aggregate (non-personally-identifiable form).

You may control or disable cookies through your browser settings. Note that disabling certain cookies may impair Platform functionality, including the ability to remain logged in.

We do not use cookies to serve targeted advertising and do not share cookie data with advertising networks.`
    },
    {
      id: "user-rights",
      title: "7. Your Rights & Choices",
      content: `Depending on your jurisdiction, you may have the following rights regarding your personal data:

• Access: Request a copy of the personal information we hold about you.
• Correction: Request correction of inaccurate or incomplete information.
• Deletion: Request deletion of your personal data, subject to legal retention obligations.
• Portability: Request your data in a structured, machine-readable format.
• Objection: Object to certain processing activities, including analytics.
• Withdrawal of Consent: Where processing is based on consent, withdraw it at any time.

To exercise any of these rights, contact us at ${SUPPORT_EMAIL}. We will respond within 30 days. Note that deletion of your account may result in loss of access to purchased content.`
    },
    {
      id: "retention",
      title: "8. Data Retention",
      content: `We retain your personal data for as long as your account is active or as necessary to provide you with services and fulfill the purposes described in this Policy. We may also retain certain information for longer periods where required by law (e.g., financial records for tax compliance).

Upon account deletion, we will delete or anonymize your personal data within a reasonable period, unless retention is required by law.`
    },
    {
      id: "childrens",
      title: "9. Children's Privacy",
      content: `The Platform is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected data from a child under 13, we will promptly delete that information. If you believe we have collected data from a minor, contact us at ${SUPPORT_EMAIL}.`
    },
    {
      id: "third-party",
      title: "10. Third-Party Links",
      content: `The Platform may contain links to third-party websites or services. This Privacy Policy does not apply to those third-party sites. We are not responsible for the privacy practices of external websites and encourage you to review the privacy policies of any third-party sites you visit.`
    },
    {
      id: "changes",
      title: "11. Changes to This Policy",
      content: `We may update this Privacy Policy periodically to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make material changes, we will notify registered users via email and update the "Last Updated" date at the top of this page.

Your continued use of the Platform after such notification constitutes your acceptance of the revised Privacy Policy.`
    },
    {
      id: "contact-privacy",
      title: "12. Contact Us",
      content: `For privacy-related questions, requests, or concerns, please contact our team at:

Email: ${SUPPORT_EMAIL}
Website: ${WEBSITE}

We will respond to all privacy inquiries within 30 days.`
    }
  ]
};

export default function About() {
  const [activeTab, setActiveTab] = useState("tos");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const currentSections = sections[activeTab as keyof typeof sections];

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: "#ffffff",
      minHeight: "100vh",
      color: "#1a1a1a",
      lineHeight: 1.6,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f9f9f9; }
        ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

        .cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono { font-family: 'DM Mono', 'Courier New', monospace; }

        .tab-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 24px;
          transition: all 0.2s ease;
          position: relative;
          color: #888;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 2px;
          background: #000;
          transition: width 0.3s ease;
        }

        .tab-btn.active { color: #000; }
        .tab-btn.active::after { width: 100%; }

        .section-card {
          padding: 40px 0;
          transition: opacity 0.3s ease;
        }

        .section-card + .section-card {
          border-top: 1px solid #f0f0f0;
        }

        .nav-item {
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
          padding: 10px 0;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #999;
          transition: all 0.2s ease;
        }

        .nav-item:hover, .nav-item.active { color: #000; transform: translateX(4px); }

        .header-bar {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #f0f0f0;
        }

        .badge {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #f5f5f5;
          border: 1px solid #e5e5e5;
          color: #666;
          padding: 4px 12px;
          border-radius: 4px;
        }

        .content-text {
          color: #444;
          font-size: 16px;
          line-height: 1.7;
          white-space: pre-line;
        }

        .content-text strong {
          color: #000;
          font-weight: 600;
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        {/* Hero */}
        <div style={{ padding: "140px 0 64px" }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "#999", textTransform: "uppercase", marginBottom: 24 }}>
            DigitalForge Legal
          </div>
          <h1 className="cormorant" style={{ fontSize: "clamp(48px, 8vw, 84px)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.03em", color: "#000", marginBottom: 32 }}>
            Policies & <em style={{ color: "#c9a96e" }}>Terms</em>
          </h1>
          <p style={{ fontSize: 18, color: "#666", maxWidth: 600, lineHeight: 1.6 }}>
            The formal framework governing your experience on DigitalForge. <br />
            <span style={{ fontSize: 13, color: "#999" }} className="mono">Last updated {LAST_UPDATED}</span>
          </p>

          {/* Tab Switcher */}
          <div style={{ display: "flex", gap: 8, marginTop: 64, borderBottom: "1px solid #f0f0f0" }}>
            <button
              className={`tab-btn ${activeTab === "tos" ? "active" : ""}`}
              onClick={() => setActiveTab("tos")}
            >
              Terms of Service
            </button>
            <button
              className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 240px) 1fr", gap: 0, paddingBottom: 120 }}>

          {/* Sidebar TOC */}
          <div className="hidden md:block" style={{ paddingTop: 40, paddingRight: 40, borderRight: "1px solid #f0f0f0", position: "sticky", top: 120, height: "fit-content" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "#000", textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>
              On this page
            </div>
            {currentSections.map((s) => (
              <button
                key={s.id}
                className={`nav-item ${activeSection === s.id ? "active" : ""}`}
                onClick={() => {
                  setActiveSection(s.id);
                  const el = document.getElementById(s.id);
                  if (el) {
                    const offset = 120;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = el.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
              >
                {s.title.replace(/^\d+\.\s/, "")}
              </button>
            ))}
          </div>

          {/* Sections */}
          <div style={{ paddingTop: 40, paddingLeft: "clamp(0px, 8vw, 80px)" }}>
            <div style={{ marginBottom: 48 }}>
              <div className="badge" style={{ marginBottom: 16 }}>{activeTab === "tos" ? "Agreement" : "Data Protection"}</div>
              <p className="content-text" style={{ fontSize: 18, color: "#1a1a1a", fontWeight: 400 }}>
                {activeTab === "tos" 
                  ? "Please review these terms carefully. They define our mutual rights and responsibilities when you use DigitalForge." 
                  : "We take your privacy seriously. This document outlines our data practices and your rights regarding your personal information."}
              </p>
            </div>

            {currentSections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="section-card"
              >
                <h2
                  className="cormorant"
                  style={{
                    fontSize: 28,
                    fontWeight: 400,
                    color: "#000",
                    marginBottom: 24,
                    letterSpacing: "-0.01em"
                  }}
                >
                  {section.title}
                </h2>
                <p className="content-text">{section.content}</p>
              </div>
            ))}

            {/* Footer note */}
            <div style={{ marginTop: 80, paddingTop: 40, borderTop: "2px solid #000" }}>
              <p className="mono" style={{ fontSize: 12, color: "#000", letterSpacing: "0.05em", fontWeight: 500 }}>
                © {new Date().getFullYear()} DigitalForge. All rights reserved.
              </p>
              <p className="mono" style={{ fontSize: 12, color: "#666", letterSpacing: "0.05em", marginTop: 8 }}>
                Distilled Knowledge in Every PDF.
              </p>
              <p className="mono" style={{ fontSize: 12, color: "#666", letterSpacing: "0.05em", marginTop: 16 }}>
                Direct inquiries to <span style={{ color: "#000", textDecoration: "underline" }}>{SUPPORT_EMAIL}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
