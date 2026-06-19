import { motion } from "framer-motion";

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
        Workflows have <span className="font-serif italic font-normal">evolved.</span> Have you?
      </motion.h2>

      <motion.p
        {...fadeUp(0.1)}
        className="text-muted-foreground text-lg max-w-2xl mx-auto mb-24"
      >
        Skip the noise of clunky software. Our digital tools provide high-performance, seamless utility that you can use, integrate, and master anywhere.
      </motion.p>

      {/* Platform Cards */}
      <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20">
        {[
          {
            icon: "/icon-chatgpt.png",
            name: "Automation Scripts",
            description: "Deeply structured scripts covering modern workflows. From logic to deployment, master automation through clean code.",
          },
          {
            icon: "/icon-perplexity.png",
            name: "Design Extensions",
            description: "Visual-first plugins for creative professionals. Master editing, color theory, and digital layout with pixel-perfect precision.",
          },
          {
            icon: "/icon-google.png",
            name: "Analytics Dashboards",
            description: "Action-oriented data tools on business and marketing. Implement strategies directly from high-impact metrics.",
          },
        ].map((platform, i) => (
          <motion.div
            key={platform.name}
            {...fadeUp(0.1 * (i + 1))}
            className="flex flex-col items-center gap-4"
          >
            <img
              src={platform.icon}
              alt={platform.name}
              className="w-[120px] h-[120px] object-contain"
            />
            <h3 className="font-semibold text-base text-foreground">{platform.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{platform.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        {...fadeUp(0.4)}
        className="text-muted-foreground text-sm text-center"
      >
        High-performance tools. Integrated instantly. Productivity in your pocket.
      </motion.p>
    </section>
  );
}
