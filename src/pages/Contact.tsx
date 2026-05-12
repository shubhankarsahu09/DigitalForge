import { useState } from "react";
import { motion } from "motion/react";

const SUPPORT_EMAIL = "shubhankarsahu82@gmail.com";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // We'll let the form submit naturally to Formspree
    setIsSubmitting(true);
  };

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

        .cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono { font-family: 'DM Mono', 'Courier New', monospace; }

        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #ddd;
          padding: 16px 0;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #1a1a1a;
          transition: border-color 0.3s ease;
          outline: none;
        }

        .input-field:focus {
          border-bottom-color: #000;
        }

        .input-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          display: block;
          margin-top: 32px;
        }

        .submit-btn {
          margin-top: 64px;
          background: #000;
          color: #fff;
          border: none;
          padding: 18px 48px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .submit-btn:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ padding: "180px 0 80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mono" style={{ fontSize: 12, letterSpacing: "0.3em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>
              Get In Touch
            </div>
            <h1 className="cormorant" style={{ fontSize: "clamp(56px, 10vw, 110px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.04em", color: "#000", marginBottom: 40 }}>
              Let's <em style={{ color: "#c9a96e" }}>Connect</em>
            </h1>
            <p style={{ fontSize: 20, color: "#666", maxWidth: 650, lineHeight: 1.5, fontWeight: 400 }}>
              Have a question about our playbooks or need technical support? Drop us a line below and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 350px) 1fr", gap: 80, paddingBottom: 160 }}>
          {/* Info Sidebar */}
          <div style={{ borderRight: "1px solid #eee", paddingRight: 40 }}>
            <div style={{ marginBottom: 48 }}>
              <span className="mono" style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.2em" }}>Office Hours</span>
              <p className="cormorant" style={{ fontSize: 24, marginTop: 12 }}>Mon — Fri <br /> 9am — 6pm IST</p>
            </div>
            <div style={{ marginBottom: 48 }}>
              <span className="mono" style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.2em" }}>Direct Email</span>
              <p className="cormorant" style={{ fontSize: 24, marginTop: 12, color: "#c9a96e" }}>{SUPPORT_EMAIL}</p>
            </div>
            <div>
              <span className="mono" style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.2em" }}>Social</span>
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <a href="#" style={{ fontSize: 14, color: "#000", textDecoration: "none" }} className="mono">TW</a>
                <a href="#" style={{ fontSize: 14, color: "#000", textDecoration: "none" }} className="mono">IN</a>
                <a href="#" style={{ fontSize: 14, color: "#000", textDecoration: "none" }} className="mono">IG</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "40px 0" }}
              >
                <h3 className="cormorant" style={{ fontSize: 32, marginBottom: 16 }}>Message Received.</h3>
                <p className="content-text">Thank you for reaching out. We'll be in touch shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="submit-btn"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form 
                action={`https://formspree.io/f/mldevnqz`} // This is a placeholder, user should ideally create their own
                method="POST"
                onSubmit={handleSubmit}
              >
                {/* Hidden field for the target email */}
                <input type="hidden" name="_replyto" value={SUPPORT_EMAIL} />
                <input type="hidden" name="_subject" value="New message from DigitalForge Contact Form" />

                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">Your Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Enter your name" 
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="name@example.com" 
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">Subject</label>
                  <select name="subject" className="input-field" required>
                    <option value="">Select a topic</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">How can we help?</label>
                  <textarea 
                    name="message" 
                    required 
                    placeholder="Tell us about your inquiry..." 
                    className="input-field"
                    style={{ minHeight: 120, resize: "vertical" }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}

            {/* Premium Footer Branding */}
            <div style={{ marginTop: 120, paddingTop: 64, borderTop: "4px solid #000" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="mono" style={{ fontSize: 11, color: "#aaa" }}>© {new Date().getFullYear()} DIGITALFORGE.</div>
                <div className="mono" style={{ fontSize: 11, color: "#aaa" }}>EST. 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
