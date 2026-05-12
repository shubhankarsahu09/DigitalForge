import { useState } from "react";
import { motion } from "motion/react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
  };

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: "#ffffff",
      minHeight: "100vh",
      color: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .form-container {
          width: 100%;
          max-width: 480px;
          text-align: center;
        }

        .minimal-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #eee;
          padding: 20px 0;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #000;
          transition: all 0.3s ease;
          outline: none;
          margin-bottom: 8px;
        }

        .minimal-input:focus {
          border-bottom-color: #000;
        }

        .minimal-input::placeholder {
          color: #bbb;
        }

        .submit-btn {
          width: 100%;
          background: #000;
          color: #fff;
          border: none;
          padding: 20px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 48px;
        }

        .submit-btn:hover {
          background: #333;
          letter-spacing: 0.15em;
        }

        .submit-btn:disabled {
          background: #eee;
          color: #aaa;
          cursor: not-allowed;
        }

        .label-hint {
          display: block;
          text-align: left;
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 24px;
        }
      `}</style>

      <div className="form-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 12 }}>Contact Us.</h1>
          <p style={{ fontSize: 15, color: "#888", marginBottom: 48 }}>Drop a message and we'll get back shortly.</p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: "40px 0" }}
          >
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <p style={{ fontSize: 16, color: "#666" }}>Your message has been sent.</p>
            <button onClick={() => setSubmitted(false)} className="submit-btn" style={{ background: "transparent", color: "#000", border: "1px solid #eee", marginTop: 32 }}>Back</button>
          </motion.div>
        ) : (
          <form action="https://formspree.io/shubhankarsahu82@gmail.com" method="POST" onSubmit={handleSubmit}>
            <div style={{ textAlign: "left" }}>
              <span className="label-hint">Identity</span>
              <input type="text" name="name" required placeholder="Your Name" className="minimal-input" />
              
              <span className="label-hint">Communication</span>
              <input type="email" name="email" required placeholder="Email Address" className="minimal-input" />
              
              <span className="label-hint">Subject</span>
              <select name="topic" className="minimal-input" required style={{ appearance: "none", background: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23bbb%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E') no-repeat right center", backgroundSize: "16px" }}>
                <option value="General">General Inquiry</option>
                <option value="Access">Product Access</option>
                <option value="Billing">Billing</option>
                <option value="Other">Other</option>
              </select>
              
              <span className="label-hint">Message</span>
              <textarea name="message" required placeholder="How can we help?" className="minimal-input" style={{ minHeight: 120, resize: "none" }} />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit Message"}
            </button>
          </form>
        )}

        <div style={{ marginTop: 80, opacity: 0.3 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>© DigitalForge</p>
        </div>
      </div>
    </div>
  );
}
