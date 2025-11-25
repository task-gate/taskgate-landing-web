"use client";
import { motion } from "framer-motion";
import {
  Clock,
  Heart,
  Target,
  BarChart3,
  Smartphone,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Impulse Interception",
    description:
      "TaskGate catches impulsive app opens before they happen, breaking the automatic reach-for-phone cycle.",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Diverse Mini-Tasks",
    description:
      "Choose from breathing exercises, journal prompts, flashcards, quick reflections, and more to complete before app access.",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Partner App Integration",
    description:
      "Connect with partner apps via deep links. Complete their mini-tasks and get redirected back automatically with a completion callback.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Usage Analytics",
    description:
      "Track how often you're intercepted, which tasks you complete, and see your progress toward more intentional phone habits.",
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Selective Gating",
    description:
      "Choose exactly which apps to gate. Leave productivity apps open while adding friction to social media and games.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Habit Building",
    description:
      "Build awareness and reduce impulsive usage over time. Each task reinforces intentional decision-making.",
  },
];

const AppFeatures = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-bg-secondary py-16 overflow-hidden"
    >
      <div className="container mx-auto p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px]">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            viewport={{ once: true }}
            className="text-h2 lg:text-h1 font-bold mb-4 text-primary"
          >
            Features That Put You Back in Control
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2 },
            }}
            viewport={{ once: true }}
            className="text-lg text-secondary max-w-2xl mx-auto"
          >
            Discover how TaskGate transforms impulsive app opens into
            opportunities for mindfulness, learning, and intentional digital
            habits.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: index * 0.1 },
              }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-accent mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.5 },
          }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white border border-border p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Ready to Break the Scroll Cycle?
            </h3>
            <p className="text-secondary mb-6 max-w-2xl mx-auto">
              Join thousands who are using TaskGate to build healthier digital
              habits and transform impulsive scrolling into intentional usage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-hover transition-all duration-300">
                Download for iOS
              </button>
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300">
                Download for Android
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AppFeatures;
