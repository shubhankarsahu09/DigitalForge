import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as any,
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});


export default function SolutionSection() {
  return (
    <section className="px-6 md:px-28 py-32 md:py-44 border-t border-border/30">
      {/* Label */}
      <motion.p
        {...fadeUp(0)}
        className="text-xs tracking-[3px] uppercase text-muted-foreground mb-6"
      >
        The Solution
      </motion.p>

      {/* Heading */}
      <motion.h2
        {...fadeUp(0.1)}
        className="text-4xl md:text-6xl font-medium tracking-[-1.5px] text-foreground mb-12 max-w-2xl"
      >
        The platform for <span className="font-serif italic font-normal">professional</span> mastery
      </motion.h2>

      {/* Video */}
      <motion.div
        {...fadeUp(0.2)}
        className="mb-16 w-full"
      >
        <video
          className="w-full rounded-2xl object-cover aspect-[3/1]"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </motion.div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-4 gap-8">
        {[
          {
            title: "High-Performance Workflows",
            description: "Beautifully designed, fast tools that you can integrate seamlessly into your daily workflow to save hours of manual work.",
          },
          {
            title: "Advanced Capabilities",
            description: "No fluff. Every tool is packed with powerful features, intuitive interfaces, and real-world solutions you can implement instantly.",
          },
          {
            title: "Cloud & Local Sync",
            description: "Work anywhere without losing context. Your tools are yours to keep, synced across devices and always accessible.",
          },
          {
            title: "Built for Professionals",
            description: "Get the direct logic of industry experts distilled into structured applications that act as a co-pilot in your pocket.",
          },
        ].map((feature, i) => (
          <motion.div key={feature.title} {...fadeUp(0.1 * (i + 1))}>
            <h3 className="font-semibold text-base text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
