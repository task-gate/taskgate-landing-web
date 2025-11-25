"use client";
import { motion } from "framer-motion";

const steps = [
  "Set your manifestation intentions and create personalized affirmations that align with your highest self.",
  "Choose which apps to monitor - social media, games, or any app that tends to distract from your goals.",
  "When you tap a monitored app, TaskGate pauses your impulse with a beautiful affirmation screen.",
  "Take a conscious breath, read your affirmation, and decide: does this align with what I want to attract?",
  "Build awareness of your digital energy patterns and celebrate your journey toward conscious living.",
];

const HowItWorks = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full mt-[-100px] bg-transparent text-primary overflow-hidden"
    >
      <div className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col items-center justify-center gap-4">
        <article className="">
          <div className="flex flex-col items-center lg:items-start justify-center">
            <h2 className="text-h2 lg:text-h3 font-bold text-center bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
              How TaskGate Transforms Your Digital Life
            </h2>
            <span className="w-16 h-1 mt-3 bg-gradient-to-r from-purple-600 to-indigo-600" />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-10">
            <article className="flex flex-col justify-center">
              <motion.h3
                initial={{ opacity: 0, y: 100 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8 },
                }}
                viewport={{ once: true }}
                className="text-h4 lg:text-h3 font-bold leading-none"
              >
                Transform Your Phone into a Tool for{" "}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Conscious Manifestation
                </span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8 },
                }}
                viewport={{ once: true }}
                className="text-p lg:text-lg mt-5 text-gray-600"
              >
                TaskGate applies the Law of Attraction to your digital habits.
                By pausing before distractions with personalized affirmations,
                you redirect your energy toward what you truly want to attract
                into your life, creating micro-moments of conscious awareness
                throughout your day.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8 },
                }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  The TaskGate Process:
                </h4>
                <ul className="space-y-3">
                  {steps.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.1, duration: 0.5 },
                      }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </article>
            <motion.article
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.8 },
              }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">
                    Manifestation Moment
                  </h4>
                  <p className="text-purple-100 text-sm">
                    &quot;I attract opportunities that align with my highest
                    good&quot;
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 text-sm">
                      📱 Social Media
                    </span>
                    <span className="text-purple-600 text-xs">Redirected</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 text-sm">🎮 Games</span>
                    <span className="text-green-600 text-xs">Mindful</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
                    Continue
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm">
                    Manifest
                  </button>
                </div>
              </div>
            </motion.article>
          </div>
        </article>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
