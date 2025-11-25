"use client";
import { motion } from "framer-motion";

const story = [
  "Most apps are built to capture your attention and keep you scrolling.",
  "We built TaskGate to help you reclaim your digital energy — for your highest good.",
  "In a world where we're constantly distracted, what's often missing is conscious intention in our digital interactions.",
  "We saw how people's energy was being scattered across endless notifications, mindless scrolling, and unconscious app usage — with no pause for reflection.",
  "So we built a new kind of digital companion. Consciousness by design. Energetically aligned.",
  "A gentle guardian that creates sacred pauses between impulse and action, transforming digital distractions into manifestation moments.",
  "With personalized affirmations and Law of Attraction principles, each phone interaction becomes an opportunity to align with your highest self and attract your desires.",
  "TaskGate is where your digital habits serve your spiritual growth — not distract from it.",
];

const OurStory = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full text-white bg-transparent"
    >
      <article className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] lg:grid lg:grid-cols-2 items-center justify-center gap-4">
        <div className="flex flex-col items-center lg:items-start justify-start">
          <h2 className="text-h2 lg:text-h3 font-bold text-center lg:text-left max-w-[80%]">
            The Birth of TaskGate
          </h2>
          <span className="w-16 h-1 mt-3 bg-white" />
          <div className="flex items-center justify-center lg:justify-start mt-6">
            <img
              src="/mock/mock1.png"
              alt="TaskGate App Mockup"
              className="w-auto h-auto max-w-[200px] lg:max-w-[250px]"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 text-justify self-start">
          {story.map((paragraph, index) => {
            const isIntro = index === 0;
            const isQuote = paragraph.startsWith("TaskGate is");

            return (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                }}
                viewport={{ once: true }}
                className={`mt-1 ${isIntro ? "font-semibold text-lg" : ""} ${
                  isQuote
                    ? "italic font-bold text-xl mt-6 text-white"
                    : "text-base text-white/90"
                }`}
              >
                {paragraph}
              </motion.p>
            );
          })}
        </div>
      </article>
    </motion.section>
  );
};

export default OurStory;
