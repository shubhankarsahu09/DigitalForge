import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";

const LAST_UPDATED = "May 12, 2026";
const SUPPORT_EMAIL = "shubhankarsahu82@gmail.com";
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("tos");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "privacy" || tab === "tos") {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const currentSections = sections[activeTab as keyof typeof sections];

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: "#fafafa",
      minHeight: "100vh",
      color: "#1a1a1a",
      lineHeight: 1.7,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #fafafa; }
        ::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 10px; }

        .cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono { font-family: 'DM Mono', 'Courier New', monospace; }

        .tab-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.01em;
          padding: 12px 0;
          margin-right: 32px;
          transition: all 0.2s ease;
          position: relative;
          color: #999;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #000;
          transition: width 0.3s ease;
        }

        .tab-btn.active { color: #000; }
        .tab-btn.active::after { width: 100%; }

        .section-card {
          padding: 64px 0;
          transition: opacity 0.3s ease;
        }

        .section-card + .section-card {
          border-top: 1px solid #eaeaea;
        }

        .nav-item {
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
          padding: 12px 0;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #999;
          transition: all 0.2s ease;
          border-bottom: 1px solid transparent;
        }

        .nav-item:hover, .nav-item.active { color: #000; }

        .badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #000;
          color: #fff;
          padding: 6px 14px;
          border-radius: 100px;
          display: inline-block;
        }

        .content-text {
          color: #444;
          font-size: 17px;
          line-height: 1.8;
          white-space: pre-line;
          font-weight: 400;
        }

        .content-text strong {
          color: #000;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main-content { padding-left: 0 !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>

        {/* Hero Section */}
        <div style={{ padding: "180px 0 80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mono" style={{ fontSize: 12, letterSpacing: "0.3em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>
              Legal Framework
            </div>
            <h1 className="cormorant" style={{ fontSize: "clamp(56px, 10vw, 110px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.04em", color: "#000", marginBottom: 40 }}>
              Trust & <em style={{ color: "#c9a96e" }}>Integrity</em>
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
              <p style={{ fontSize: 20, color: "#666", maxWidth: 650, lineHeight: 1.5, fontWeight: 400 }}>
                DigitalForge is built on a foundation of clarity. Our policies ensure a secure and transparent environment for every learner.
              </p>
              <div className="mono" style={{ fontSize: 12, color: "#999", borderLeft: "1px solid #ddd", paddingLeft: 20 }}>
                Version 1.0.4<br />
                Updated {LAST_UPDATED}
              </div>
            </div>
          </motion.div>

          {/* Tab Switcher */}
          <div style={{ display: "flex", marginTop: 80, borderBottom: "1px solid #eaeaea" }}>
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

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 280px) 1fr", gap: 0, paddingBottom: 160 }}>

          {/* Sidebar Navigation */}
          <div className="sidebar" style={{ paddingTop: 64, paddingRight: 60, position: "sticky", top: 140, height: "fit-content" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", color: "#000", textTransform: "uppercase", marginBottom: 32, fontWeight: 600 }}>
              Navigation
            </div>
            {currentSections.map((s) => (
              <button
                key={s.id}
                className={`nav-item ${activeSection === s.id ? "active" : ""}`}
                onClick={() => {
                  setActiveSection(s.id);
                  const el = document.getElementById(s.id);
                  if (el) {
                    const offset = 140;
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

          {/* Content Body */}
          <div className="main-content" style={{ paddingTop: 64, paddingLeft: "clamp(0px, 10vw, 100px)" }}>
            <div style={{ marginBottom: 80 }}>
              <div className="badge" style={{ marginBottom: 24 }}>
                {activeTab === "tos" ? "Terms & Conditions" : "Privacy & Data"}
              </div>
              <h3 className="cormorant" style={{ fontSize: 36, fontWeight: 400, color: "#000", marginBottom: 24 }}>
                {activeTab === "tos" 
                  ? "Our promise of quality and service." 
                  : "How we protect your digital footprint."}
              </h3>
              <p className="content-text" style={{ fontSize: 19, color: "#1a1a1a" }}>
                {activeTab === "tos" 
                  ? "These terms outline the agreement between DigitalForge and our users. By using our platform, you agree to uphold these standards." 
                  : "We believe in radical transparency. This policy details our commitment to your privacy and how we manage your information."}
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
                    fontSize: 32,
                    fontWeight: 400,
                    color: "#000",
                    marginBottom: 28,
                    letterSpacing: "-0.02em"
                  }}
                >
                  {section.title}
                </h2>
                <p className="content-text">{section.content}</p>
              </div>
            ))}

            {/* Premium Footer Branding */}
            <div style={{ marginTop: 120, paddingTop: 64, borderTop: "4px solid #000" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40 }}>
                <div>
                  <div className="cormorant" style={{ fontSize: 32, fontWeight: 400, marginBottom: 12 }}>DigitalForge</div>
                  <p className="mono" style={{ fontSize: 12, color: "#999", letterSpacing: "0.1em" }}>DISTILLED KNOWLEDGE</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="mono" style={{ fontSize: 13, color: "#000", fontWeight: 600, marginBottom: 8 }}>Questions or Feedback?</p>
                  <p className="mono" style={{ fontSize: 13, color: "#c9a96e", textDecoration: "underline" }}>{SUPPORT_EMAIL}</p>
                </div>
              </div>
              <div style={{ marginTop: 64, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: 32 }}>
                <p className="mono" style={{ fontSize: 11, color: "#aaa" }}>© {new Date().getFullYear()} DIGITALFORGE. ALL RIGHTS RESERVED.</p>
                <p className="mono" style={{ fontSize: 11, color: "#aaa" }}>MADE WITH INTEGRITY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
