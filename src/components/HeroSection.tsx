import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onLogin: () => void;
  onSignup: () => void;
}

export default function HeroSection({ onLogin, onSignup }: HeroSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      onSignup();
    }
  };

  const handleBrowseLibrary = () => {
    if (user) {
      navigate("/dashboard?tab=purchased");
    } else {
      onSignup();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex flex-col">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
          type="video/mp4"
        />
      </video>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent z-[1] pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-28 md:pt-32 px-8 text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] mb-8 max-w-5xl leading-[1.05]"
        >
          Next-Generation <span className="font-serif italic font-normal">Tools</span> for Creators
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg text-hero-subtitle max-w-2xl mb-12 leading-relaxed"
        >
          Supercharge your workflow with our premium, high-performance tools. Designed for professionals who want to build faster, smarter, and better.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetStarted}
            className="bg-foreground text-background rounded-full px-8 py-4 font-bold text-sm tracking-wider w-full sm:w-auto"
          >
            GET STARTED
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBrowseLibrary}
            className="liquid-glass text-foreground border border-border rounded-full px-8 py-4 font-bold text-sm tracking-wider w-full sm:w-auto"
          >
            BROWSE TOOLS
          </motion.button>
        </motion.div>

        {/* Auth Buttons (Optional but kept if user wants them) */}
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest"
          >
            <button onClick={onLogin} className="hover:text-foreground transition-colors">Log In</button>
            <span>•</span>
            <button onClick={onSignup} className="hover:text-foreground transition-colors">Sign Up</button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
