import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as any,
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const features = [
  {
    title: "Downloadable Layouts",
    description:
      "Beautifully designed, print-ready PDF playbooks that you can read, annotate, and keep in your digital library forever.",
  },
  {
    title: "High-Density Content",
    description:
      "No fluff. Every page is packed with actionable insights, step-by-step logic, and real-world examples you can implement.",
  },
  {
    title: "Offline Mastery",
    description:
      "Learn anywhere without needing a connection. Your courses are yours to keep, offline and always accessible.",
  },
  {
    title: "Written Mentorship",
    description:
      "Get the direct logic of industry experts distilled into structured guides that act as a mentor in your pocket.",
  },
];

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
            title: "Downloadable Layouts",
            description: "Beautifully designed, print-ready PDF playbooks that you can read, annotate, and keep in your digital library forever.",
          },
          {
            title: "High-Density Content",
            description: "No fluff. Every page is packed with actionable insights, step-by-step logic, and real-world examples you can implement.",
          },
          {
            title: "Offline Mastery",
            description: "Learn anywhere without needing a connection. Your courses are yours to keep, offline and always accessible.",
          },
          {
            title: "Written Mentorship",
            description: "Get the direct logic of industry experts distilled into structured guides that act as a mentor in your pocket.",
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
