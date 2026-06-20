import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Hls from "hls.js";

import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as any,
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const HLS_URL = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

interface CtaSectionProps {
  onAuthRequired: () => void;
}

export default function CtaSection({ onAuthRequired }: CtaSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <section className="relative py-32 md:py-44 border-t border-border/30 overflow-hidden flex flex-col items-center justify-center text-center px-6">
      {/* HLS Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/45 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl">
        {/* Concentric circles logo */}
        <motion.div
          {...fadeUp(0)}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-foreground/60 mb-8"
        >
          <div className="w-5 h-5 rounded-full border border-foreground/60" />
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl font-medium tracking-[-1.5px] text-foreground mb-6"
        >
          Start Your <span className="font-serif italic font-normal">Transformation</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-muted-foreground text-lg mb-10 leading-relaxed"
        >
          Join thousands of professionals who are already boosting productivity through our premium tools. Get your first tool today.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.3)} className="flex items-center gap-4">
          <motion.button
            onClick={() => {
              if (user) {
                navigate("/dashboard");
              } else {
                onAuthRequired();
              }
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-foreground text-background rounded-lg px-8 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-colors duration-200"
          >
            Get Started
          </motion.button>
          <motion.button
            onClick={() => {
              if (user) {
                navigate("/dashboard?tab=purchased");
              } else {
                onAuthRequired();
              }
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="liquid-glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground hover:text-foreground transition-colors duration-200"
          >
            Browse Tools
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
