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
      className="relative z-10 w-full bg-transparent text-primary overflow-hidden"
    >
      <div className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col items-center justify-center gap-8">
        {/* Title Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl w-full">
          <div className="flex flex-col items-center lg:items-start justify-center">
            <h2 className="text-h2 lg:text-h3 font-bold text-center bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
              How TaskGate Transforms Your Digital Life
            </h2>
            <span className="w-16 h-1 mt-3 bg-gradient-to-r from-purple-600 to-indigo-600" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Left Column - Description and Process */}
          <div className="flex flex-col gap-8">
            {/* Description Container */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
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
            </div>

            {/* Process Steps Container */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8 },
              }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl"
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
          </div>

          {/* Right Column - App Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8 },
            }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            {/* Futuristic Web3 Glassmorphic Card */}
            <div className="relative w-full max-w-md">
              {/* Animated border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-3xl blur-xl opacity-75 animate-pulse"></div>

              {/* Main card */}
              <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Holographic accent lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>

                {/* Header section */}
                <div className="relative bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6 mb-6">
                  {/* Floating orb */}
                  <div className="relative mx-auto mb-4 w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-white/30 shadow-lg">
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 text-center">
                    Manifestation Moment
                  </h4>
                  <p className="text-gray-300 text-sm text-center leading-relaxed">
                    &quot;I attract opportunities that align with my highest
                    good&quot;
                  </p>

                  {/* Energy meter */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Vibrational Energy</span>
                      <span>98%</span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-purple-500/20">
                      <div className="h-full w-[98%] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                    </div>
                  </div>
                </div>

                {/* App Status Cards */}
                <div className="space-y-3 mb-6">
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
                          <span className="text-lg">📱</span>
                        </div>
                        <span className="text-white text-sm font-medium">
                          Social Media
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/50 rounded-full text-purple-300 text-xs font-medium">
                        Redirected
                      </span>
                    </div>
                  </div>

                  <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-green-400/50 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
                          <span className="text-lg">🎮</span>
                        </div>
                        <span className="text-white text-sm font-medium">
                          Games
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 border border-green-400/50 rounded-full text-green-300 text-xs font-medium">
                        Mindful
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 relative group overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300">
                    <span className="relative z-10">Continue</span>
                  </button>
                  <button className="flex-1 relative group overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/50 transition-all duration-300">
                    <span className="relative z-10">Manifest</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-purple-400/30 rounded-tr-2xl"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-pink-400/30 rounded-bl-2xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
