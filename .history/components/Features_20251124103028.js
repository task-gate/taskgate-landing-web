"use client";
import { motion } from "framer-motion";

const features = [
  {
    id: "01",
    title: "Conscious App Interruption",
    desc: [
      "Transform mindless scrolling into mindful moments with gentle app interruptions.",
      "Receive personalized affirmations and manifestation reminders aligned with your goals.",
      "Create sacred pauses that help you choose consciousness over distraction.",
    ],
  },
  {
    id: "02",
    title: "Personalized Affirmation Screens",
    desc: [
      "Access customized Law of Attraction affirmations based on your unique energy patterns.",
      "Each affirmation is designed to elevate your vibration and attract abundance.",
      "Practice manifestation principles seamlessly integrated into your daily digital routine.",
    ],
  },
  {
    id: "03",
    title: "Digital Energy Pattern Analysis",
    desc: [
      "Monitor how your phone usage affects your manifestation practice and energy levels.",
      "Gain insights into when you're most aligned and when you need energetic realignment.",
      "Discover patterns that either support or hinder your conscious living goals.",
    ],
  },
  {
    id: "04",
    title: "Manifestation Goal Integration",
    desc: [
      "Connect your digital habits directly with your manifestation and life goals.",
      "Create conscious pauses before potentially energy-draining activities.",
      "Stay focused on attracting your desires through intentional digital interactions.",
    ],
  },
  {
    id: "05",
    title: "Visualization & Vision Board Tools",
    desc: [
      "Access powerful visualization exercises during app interruption moments.",
      "Create and view digital vision boards that reinforce your manifestation practice.",
      "Turn every digital interaction into an opportunity to visualize your dream life.",
    ],
  },
  {
    id: "06",
    title: "Privacy-First Spiritual Practice",
    desc: [
      "Your manifestation journey and affirmations remain completely private on your device.",
      "No data sharing ensures your spiritual practice stays sacred and personal.",
      "Maintain the energetic integrity of your conscious living path.",
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
          <span className="w-16 h-1 mt-3 bg-bg" />

          <article className="flex flex-col items-center justify-center mt-16">
            <p className="mt-5 text-justify md:max-w-[60%] md:text-center text-white/90">
              TaskGate transforms every digital interaction into a manifestation
              opportunity. With conscious interruptions, personalized
              affirmations, and energy pattern insights, your spiritual journey
              integrates seamlessly with your technology use.
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
              <div className="w-[50%] md:w-[20%] h-[200px] flex items-center justify-center">
                <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center">
                  <div className="absolute inset-2 bg-gray-900 rounded-xl flex items-center justify-center">
                    <div className="text-3xl">
                      {paragraph.id === "01" && "🛡️"}
                      {paragraph.id === "02" && "✨"}
                      {paragraph.id === "03" && "📊"}
                      {paragraph.id === "04" && "🎯"}
                      {paragraph.id === "05" && "🌟"}
                      {paragraph.id === "06" && "🔐"}
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
                    ⚡
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <h4 className="text-h5 font-bold mt-5 lg:mt0 lg:text-left text-center">
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
