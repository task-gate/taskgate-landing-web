"use client";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Set Your Intentions",
    description:
      "Create personalized affirmations that align with your highest self and manifestation goals.",
  },
  {
    number: "02",
    title: "Choose Your Apps",
    description:
      "Select which apps to monitor - social media, games, or any app that tends to distract from your goals.",
  },
  {
    number: "03",
    title: "Pause & Reflect",
    description:
      "When you tap a monitored app, TaskGate pauses your impulse with a beautiful affirmation screen.",
  },
  {
    number: "04",
    title: "Make Conscious Choices",
    description:
      "Take a breath, read your affirmation, and decide if this aligns with what you want to attract.",
  },
  {
    number: "05",
    title: "Build Awareness",
    description:
      "Track your digital energy patterns and celebrate your journey toward conscious living.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative z-10 w-full bg-transparent overflow-hidden">
      <div className="container mx-auto py-20 px-5 md:px-[5%] 2xl:px-0 max-w-[1400px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
              How TaskGate Works
            </span>
          </h2>
          <p className="text-gray-900 text-lg md:text-xl max-w-3xl mx-auto font-medium">
            Transform your phone into a tool for conscious manifestation
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow effect behind phone */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl rounded-full scale-110"></div>

              {/* Phone image */}
              <div className="relative">
                <img
                  src="/mock/mock1.png"
                  alt="TaskGate App Interface"
                  className="w-full max-w-sm lg:max-w-md h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Connector line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-12 bg-gradient-to-b from-purple-300 to-transparent"></div>
                )}

                {/* Step card */}
                <div className="flex gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  {/* Number circle */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {step.title}
                    </h3>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl px-8 py-6">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create micro-moments of awareness
              </span>{" "}
              throughout your day and redirect your energy toward what you truly
              want to attract
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
