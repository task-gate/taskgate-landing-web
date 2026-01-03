"use client";
import { motion } from "framer-motion";

const values = [
  {
    id: "01",
    title: "Consciousness Over Convenience",
    desc: `Every digital interaction should serve your highest good, not scatter your energy. TaskGate creates intentional pauses that help you choose awareness over autopilot, transforming mindless habits into moments of conscious choice.<br /><span class="italic text-black/60">💡 Your attention is your most valuable resource — invest it wisely.</span>`,
  },
  {
    id: "02",
    title: "Your Manifestation Journey Is Sacred",
    desc: `Your affirmations, goals, and spiritual practice belong to you alone. We keep everything private on your device because your path to abundance shouldn't be data to be harvested — it's sacred work that deserves protection.<br /><span class="italic text-black/60">💡 True manifestation happens in private, sacred spaces — not public feeds.</span>`,
  },
  {
    id: "03",
    title: "Small Shifts Create Big Transformations",
    desc: `You don't need to overhaul your entire life overnight. With each mindful pause and conscious affirmation, TaskGate helps you gradually realign your energy with your desires — building powerful momentum one moment at a time.<br /><span class="italic text-black/60">💡 Consistency in small practices creates quantum leaps in manifestation.</span>`,
  },
  {
    id: "04",
    title: "Technology Should Support Your Spirit",
    desc: `Instead of technology draining your energy, it should amplify your spiritual practice. TaskGate transforms your phone from a distraction device into a manifestation tool that supports your conscious living journey.<br /><span class="italic text-black/60">💡 When technology serves consciousness, magic happens.</span>`,
  },
  {
    id: "05",
    title: "Alignment Over Achievement",
    desc: `We're not building another productivity app focused on doing more. We're creating space for being more — helping you align your digital habits with your soul's purpose and attract what truly serves your highest good.<br /><span class="italic text-black/60">💡 When you're aligned, manifestation becomes effortless.</span>`,
  },
];

const CoreValues = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-white"
    >
      <article className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-h2 lg:text-h3 font-bold max-w-[80%]">
            TaskGate – Our Core Values
          </h2>
          <span className="w-16 h-1 mt-3 bg-gradient-to-r from-accent to-purple-600 rounded-full" />
          <p className="mt-5 text-justify md:max-w-[60%] md:text-center">
            At <strong>TaskGate</strong>, we believe your digital habits should
            elevate your consciousness — not scatter your energy. Our values
            reflect our commitment to helping you{" "}
            <strong>
              transform technology into a tool for manifestation, alignment, and
              conscious living
            </strong>
            , one mindful interaction at a time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {values.map((item) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.5 },
              }}
              viewport={{ once: true }}
              className="relative flex flex-col gap-4 border border-primary/20 bg-white rounded-xl p-6 md:p-8 shadow-lg"
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-[50px] h-[50px] rounded-full bg-gradient-to-r from-accent to-purple-600 text-white flex items-center justify-center font-bold text-md shadow-md">
                {item.id}
              </div>
              <h4 className="mt-6 text-lg font-semibold text-center lg:text-left bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                {item.title}
              </h4>
              <p
                className="text-base text-center lg:text-left text-black/90"
                dangerouslySetInnerHTML={{ __html: item.desc }}
              />
            </motion.article>
          ))}
        </div>
      </article>
    </motion.section>
  );
};

export default CoreValues;
