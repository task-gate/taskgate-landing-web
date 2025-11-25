"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const how = [
  "Capture daily events or dive deep into your life’s most meaningful moments.",
  "Eve Guides Your Storytelling by asking insightful questions and suggest content.",
  "Eve organizes your memories into structured chapters, suggesting new topics as you go.",
  "You decide which journal entries become part of your biography. Eve simply helps you make sense of it all.",
  "Everything you write stays between you and Eve. Your journals are safe, and you choose what to include in your biography.",
];

const OurPhilosophy = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="w-full mt-[-100px] bg-secondary text-primary overflow-hidden"
    >
      <div className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col items-center justify-center gap-4">
        <article className="">
          <div className="flex flex-col items-center lg:items-start justify-center">
            <h2 className="text-h2 lg:text-h3 font-bold text-center">
              Our Philosophy
            </h2>
            <span className="w-16 h-1 mt-3 bg-bg" />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-10">
            <article className="flex flex-col justify-center">
              <motion.h3
                initial={{ opacity: 0, y: 100 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                }}
                viewport={{ once: true }}
                className="mt-12 text-h3"
              >
                🌱 Every Life Deserves to Be Remembered
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                }}
                viewport={{ once: true }}
                className="mt-8"
              >
                &quot;We believe your digital moments — the songs you listen to,
                the thoughts you write, the photos you take, and even the posts
                you share — all hold meaning. Our mission is to help you
                reflect, preserve, and piece together the life story only you
                could live.&quot;
              </motion.p>
            </article>
            <Image
              src="/mockups/workImg.webp"
              alt="TaskGate Mockup"
              className="w-full"
              width={500}
              height={400}
            />
          </div>
        </article>
      </div>
    </motion.section>
  );
};

export default OurPhilosophy;
