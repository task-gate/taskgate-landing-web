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
        <div className="flex flex-col items-center lg:items-start justify-center">
          <h2 className="text-h2 lg:text-h3 font-bold text-center lg:text-left max-w-[80%]">
            The Birth of TaskGate
          </h2>
          <span className="w-16 h-1 mt-3 bg-white" />
          <div className="max-w-[50%] h-[400px] flex items-center justify-center">
            <div className="relative w-[200px] h-[300px] bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute inset-4 bg-gray-900 rounded-2xl flex flex-col items-center justify-center">
                <div className="text-4xl mb-4">🌟</div>
                <div className="text-white text-sm font-semibold mb-2 text-center">
                  Digital Consciousness
                </div>
                <div className="w-full px-4 space-y-2">
                  <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full w-3/4"></div>
                  <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full w-1/2"></div>
                </div>
                <div className="mt-4 text-2xl">✨</div>
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
                ⚡
              </div>
              <div className="absolute bottom-2 left-2 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center text-sm">
                💫
              </div>
            </div>
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
