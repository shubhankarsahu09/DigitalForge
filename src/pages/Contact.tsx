import { useState } from "react";
import { motion } from "motion/react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("https://formspree.io/f/xwvyynrn", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
        // Automatically refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        alert("Oops! There was a problem submitting your form");
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: "hsl(var(--background))",
      minHeight: "100vh",
      color: "hsl(var(--foreground))",
      lineHeight: 1.5,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .input-group {
          margin-bottom: 24px;
        }

        .input-label {
          font-size: 13px;
          font-weight: 600;
          color: #a1a1a6;
          margin-bottom: 8px;
          display: block;
          letter-spacing: -0.01em;
        }

        .modern-input {
          width: 100%;
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 14px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: hsl(var(--foreground));
          transition: all 0.2s ease;
          outline: none;
        }

        .modern-input:focus {
          background: #000;
          border-color: hsl(var(--foreground));
          box-shadow: 0 0 0 4px hsl(var(--foreground) / 0.1);
        }

        .modern-input::placeholder {
          color: #666;
        }

        .submit-btn {
          width: 100%;
          background: hsl(var(--foreground));
          color: #000;
          border: none;
          padding: 16px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 12px;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px hsl(var(--foreground) / 0.15);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .info-card {
          background: #111;
          padding: 32px;
          border-radius: 24px;
          height: 100%;
          border: 1px solid #222;
        }

        @media (max-width: 768px) {
          .grid-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-section { padding: 120px 0 40px !important; }
        }
      `}</style>

      <div className="md:px-28 px-8" style={{ margin: "0 auto" }}>
        
        {/* Modern Hero Section */}
        <div className="hero-section" style={{ padding: "160px 0 80px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{ 
              fontSize: "clamp(48px, 8vw, 82px)", 
              fontWeight: 800, 
              letterSpacing: "-0.04em", 
              lineHeight: 1,
              marginBottom: 24
            }}>
              Contact <span style={{ color: "#c9a96e" }}>Support.</span>
            </h1>
            <p style={{ 
              fontSize: 19, 
              color: "#86868b", 
              maxWidth: 600, 
              margin: "0 auto",
              fontWeight: 500
            }}>
              We're here to help you get the most out of DigitalForge. Reach out and our team will be in touch.
            </p>
          </motion.div>
        </div>

        <div className="grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32, paddingBottom: 120, alignItems: "start" }}>
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: "#0a0a0a", padding: "40px", borderRadius: "32px", border: "1px solid #222", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Message Sent</h2>
                <p style={{ color: "#86868b", marginBottom: 32 }}>We'll get back to you at your email address shortly.</p>
                <button onClick={() => setSubmitted(false)} className="submit-btn" style={{ maxWidth: 200 }}>Done</button>
              </div>
            ) : (
              <form action="https://formspree.io/f/xwvyynrn" method="POST" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" name="name" required placeholder="John Doe" className="modern-input" />
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" name="email" required placeholder="name@example.com" className="modern-input" />
                </div>

                <div className="input-group">
                  <label className="input-label">Topic</label>
                  <select name="topic" className="modern-input" required style={{ appearance: "none" }}>
                    <option value="General">General Inquiry</option>
                    <option value="Billing">Billing & Access</option>
                    <option value="Technical">Technical Issue</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea name="message" required placeholder="How can we help?" className="modern-input" style={{ minHeight: 150, resize: "none" }} />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="info-card"
          >
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Response Time</h3>
              <p style={{ color: "#a1a1a6", fontSize: 15, lineHeight: 1.6 }}>Our typical response time is within 2-4 hours during business days. We operate between 9:00 AM and 6:00 PM IST.</p>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Follow Us</h3>
              <div style={{ display: "flex", gap: 12 }}>
                {["Instagram", "Twitter", "LinkedIn"].map(social => (
                  <a key={social} href="#" style={{ 
                    padding: "8px 16px", 
                    background: "#111", 
                    borderRadius: "100px", 
                    fontSize: 13, 
                    fontWeight: 600, 
                    color: "hsl(var(--foreground))", 
                    textDecoration: "none",
                    border: "1px solid #333"
                  }}>{social}</a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
