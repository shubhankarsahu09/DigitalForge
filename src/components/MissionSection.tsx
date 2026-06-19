import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const highlighted = new Set(["clarity", "meets", "depth"]);

const para1 = "We're building a space where clarity meets depth — where creators find powerful tools, builders find efficiency, and every software tool becomes a catalyst for real-world growth.".split(
  " "
);

const para2 = "A premium suite of high-performance tools and digital utilities — with zero noise, maximum productivity, and total flexibility for every professional.".split(
  " "
);

export default function MissionSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="px-6 md:px-28 pt-0 pb-32 md:pb-44 flex flex-col items-center"
    >
      {/* Mission Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-20"
      >
        <video
          className="w-full max-w-[800px] max-h-[800px] object-cover rounded-2xl"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </motion.div>

      {/* Scroll-driven word reveal — paragraph 1 */}
      <div className="max-w-4xl text-center mb-10">
        <p className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-snug flex flex-wrap justify-center gap-x-2 gap-y-1">
          {para1.map((word, i) => {
            const start = i / para1.length;
            const end = (i + 1) / para1.length;
            return (
              <WordReveal
                key={i}
                word={word}
                scrollYProgress={scrollYProgress}
                start={start * 0.6}
                end={end * 0.6 + 0.1}
                isHighlighted={highlighted.has(word.replace(/[^a-z]/gi, "").toLowerCase())}
              />
            );
          })}
        </p>
      </div>

      {/* Scroll-driven word reveal — paragraph 2 */}
      <div className="max-w-3xl text-center">
        <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-snug flex flex-wrap justify-center gap-x-2 gap-y-1">
          {para2.map((word, i) => {
            const start = 0.3 + (i / para2.length) * 0.5;
            const end = 0.3 + ((i + 1) / para2.length) * 0.5 + 0.1;
            return (
              <WordReveal
                key={i}
                word={word}
                scrollYProgress={scrollYProgress}
                start={start}
                end={end}
                isHighlighted={false}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}

function WordReveal({
  word,
  scrollYProgress,
  start,
  end,
  isHighlighted,
}: {
  word: string;
  scrollYProgress: any;
  start: number;
  end: number;
  isHighlighted: boolean;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={isHighlighted ? "text-foreground" : "text-hero-subtitle"}
    >
      {word}
    </motion.span>
  );
}
