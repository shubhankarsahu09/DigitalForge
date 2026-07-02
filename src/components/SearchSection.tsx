import { motion } from "framer-motion";
import { Video, Box, Code } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as any,
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});


export default function SearchSection() {
  return (
    <section className="text-center px-6 md:px-28 pt-52 md:pt-64 pb-6 md:pb-9">
      <motion.h2
        {...fadeUp(0)}
        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground leading-[1.05] mb-6"
      >
        Elevate your <span className="font-serif italic font-normal">craft.</span> Instantly.
      </motion.h2>

      <motion.p
        {...fadeUp(0.1)}
        className="text-muted-foreground text-lg max-w-2xl mx-auto mb-24"
      >
        Skip the noise of clunky workflows. Our marketplace provides high-performance tools and professional assets that you can integrate and master anywhere.
      </motion.p>

      {/* Platform Cards */}
      <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20">
        {[
          {
            icon: Video,
            name: "Video Editing Essentials",
            description: "Professional templates, presets, and tools for After Effects and Premiere Pro.",
          },
          {
            icon: Box,
            name: "3D Assets & Workflows",
            description: "High-quality models, textures, and add-ons optimized for Blender.",
          },
          {
            icon: Code,
            name: "Coding Templates",
            description: "Production-ready boilerplate code and scripts to accelerate your development.",
          },
        ].map((platform, i) => (
          <motion.div
            key={platform.name}
            {...fadeUp(0.1 * (i + 1))}
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-[120px] h-[120px] rounded-3xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors border border-border">
              <platform.icon size={48} strokeWidth={1} />
            </div>
            <h3 className="font-semibold text-base text-foreground mt-4">{platform.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{platform.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        {...fadeUp(0.4)}
        className="text-muted-foreground text-sm text-center"
      >
        Premium assets. Integrated instantly. Productivity supercharged.
      </motion.p>
    </section>
  );
}
