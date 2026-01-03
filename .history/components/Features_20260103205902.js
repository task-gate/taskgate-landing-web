"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    id: "01",
    title: "Break Impulsive Habits",
    desc: [
      "Stop mindless scrolling before it starts by intercepting automatic app opens.",
      "Build awareness of your phone usage patterns and replace bad habits with good ones.",
      "Transform unconscious phone reaching into intentional, purposeful actions.",
    ],
  },
  {
    id: "02",
    title: "Personalized Habit Building",
    desc: [
      "Customize which apps require tasks and create your own habit-building rules.",
      "Choose from breathing exercises, reflections, gratitude prompts, or custom tasks.",
      "Design a system that matches your goals—whether it's reducing social media or building mindfulness.",
    ],
  },
  {
    id: "03",
    title: "Track Your Progress",
    desc: [
      "See exactly how your habits are changing with detailed analytics and insights.",
      "Monitor task completion rates, streak tracking, and time saved from distractions.",
      "Celebrate milestones as you build stronger, healthier digital habits over time.",
    ],
  },
  {
    id: "04",
    title: "Flexible & Adaptive System",
    desc: [
      "Adjust task difficulty and frequency as your habits strengthen.",
      "Set different rules for different times of day—stricter during work, relaxed in the evening.",
      "Your habit-building system evolves with you as you grow and improve.",
    ],
  },
  {
    id: "05",
    title: "Expand With Partner Apps",
    desc: [
      "Integrate with partner apps to add even more productive habits to your routine.",
      "Complete language flashcards, fitness challenges, or learning tasks before app access.",
      "Turn every impulsive moment into an opportunity to practice something valuable.",
    ],
  },
  {
    id: "06",
    title: "Your Data, Your Device",
    desc: [
      "All habit tracking and personal data stays completely private on your device.",
      "No accounts, no cloud sync, no data collection—just you building better habits.",
      "Focus on your growth without worrying about privacy or data security.",
    ],
  },
];

const Feature = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-transparent text-white"
    >
      <article className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] gap-4flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-h2 lg:text-h3 font-bold text-center max-w-[80%]">
            Features & Benefits
          </h2>
          <span className="w-16 h-1 mt-3 bg-gradient-to-r from-accent to-purple-600 rounded-full" />

          <article className="flex flex-col items-center justify-center mt-16">
            <p className="mt-5 text-justify md:max-w-[60%] md:text-center text-white/90">
              TaskGate is your personalized habit-building companion that helps
              you replace impulsive scrolling with intentional actions.
              Customize your experience, track your progress, and build lasting
              digital wellness habits that actually stick—one mindful moment at
              a time.
            </p>
          </article>
        </div>
        <div className="mt-16 lg:mt-26 max-w-[1000px] mx-auto grid grid-cols-1 gap-5">
          {features.map((paragraph, index) => (
            <motion.article
              key={paragraph.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
              viewport={{ once: true }}
              className={`mt-2 items-center flex flex-col mx-auto md:justify-between gap-4 p-4 py-10 border-b-2 last:border-b-0 border-silver ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="w-[40%] md:w-[30%] flex items-center justify-center">
                <Image
                  src={`/mock/mock${parseInt(paragraph.id) + 2}.png`}
                  alt={paragraph.title}
                  width={300}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="flex flex-col items-start">
                <h4 className="text-h5 font-bold mt-5 lg:mt0 lg:text-left text-center bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                  {paragraph.title}
                </h4>
                <ul className="mt-2 px-4 text-center lg:text-left">
                  {paragraph.desc.map((item, index) => (
                    <li key={index} className="text-left list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </article>
    </motion.section>
  );
};

export default Feature;
