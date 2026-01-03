"use client";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Select Apps to Gate",
    description:
      "Choose which apps you want to gate - social media, games, or any apps that tend to trigger impulsive usage.",
  },
  {
    number: "02",
    title: "Customize Your Tasks",
    description:
      "Pick from built-in tasks like breathing exercises, journal prompts, and flashcards - or connect partner apps for more variety.",
  },
  {
    number: "03",
    title: "TaskGate Intercepts",
    description:
      "When you try to open a gated app, TaskGate intercepts the launch and presents a mini-task instead.",
  },
  {
    number: "04",
    title: "Complete the Task",
    description:
      "Finish the quick activity - it only takes seconds. Partner apps open via deep links and return automatically when done.",
  },
  {
    number: "05",
    title: "Access Granted",
    description:
      "After completing the task, you can proceed to your app - but now with intentionality instead of impulse.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative z-10 w-full bg-white overflow-hidden">
      <div className="container mx-auto py-20 px-5 md:px-[5%] 2xl:px-0 max-w-[1400px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary">
            How TaskGate Works
          </h2>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto">
            Break the cycle of impulsive app opens with meaningful micro-tasks
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
            className="flex justify-center lg:justify-center"
          >
            <div className="relative mr-8 lg:mr-16">
              {/* Phone video */}
              <div className="relative">
                <video
                  src="/mock/demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-[200px] lg:max-w-xs h-auto drop-shadow-lg rounded-3xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Steps */}
          <div className="space-y-4">
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
                  <div className="absolute left-5 top-14 w-0.5 h-10 bg-border"></div>
                )}

                {/* Step card */}
                <div className="flex gap-4 p-5 rounded-lg bg-white border border-border hover:shadow-md transition-all duration-300">
                  {/* Number circle */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 text-primary">
                      {step.title}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
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
          <div className="inline-block bg-gradient-to-r from-accent/5 to-purple-600/5 border border-accent/20 rounded-lg px-8 py-4">
            <p className="text-primary text-base">
              <span className="font-semibold text-accent">
                Partner apps integrate seamlessly
              </span>{" "}
              - TaskGate opens their mini-task via app link, and they redirect
              back automatically when complete
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
