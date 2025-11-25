"use client";
import { motion } from "framer-motion";

export const features = [
  {
    id: "01",
    title: "Conscious App Interruption",
    desc: "Transform mindless scrolling into mindful moments. TaskGate gently interrupts app usage with personalized affirmations and manifestation reminders to keep you aligned with your highest self.",
  },
  {
    id: "02",
    title: "Personalized Affirmation Screens",
    desc: "Receive customized Law of Attraction affirmations based on your goals, energy patterns, and manifestation intentions. Each screen is designed to elevate your vibration and attract abundance.",
  },
  {
    id: "03",
    title: "Digital Energy Tracking",
    desc: "Monitor your digital energy patterns and see how your phone usage affects your manifestation practice. Gain insights into when you're most aligned and when you need energetic realignment.",
  },
  {
    id: "04",
    title: "Manifestation Goal Integration",
    desc: "Connect your digital habits with your manifestation goals. TaskGate helps you stay focused on attracting your desires by creating conscious pauses before potentially energy-draining activities.",
  },
  {
    id: "05",
    title: "Visualization & Vision Board Tools",
    desc: "Access powerful visualization exercises and digital vision boards during app interruptions. Turn every digital interaction into an opportunity to visualize and attract your dream life.",
  },
  {
    id: "06",
    title: "Privacy-First Spiritual Practice",
    desc: "Your manifestation journey stays completely private. All affirmations, goals, and spiritual insights are stored securely on your device, ensuring your path to conscious living remains personal.",
  },
];
  },
];
];

const Benefits = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="w-full bg-secondary text-primary"
    >
      <article className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] gap-4flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-h2 lg:text-h3 font-bold text-center max-w-[80%]">
            Features & Benefits
          </h2>
          <span className="w-16 h-1 mt-3 bg-bg" />

          <article className="flex flex-col items-center justify-center mt-16">
            <h3
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-4xl lg:max-w-[60%] lg:text-center"
              style={{ lineHeight: 1.2 }}
            >
              Unlock the Power of AI-Driven
              <span className="relative whitespace-nowrap text-[#505050]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute top-2/3 left-0 h-[0.58em] w-full fill-pink-400/70 dark:fill-pink-300/60"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.780 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.540-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.810 23.239-7.825 27.934-10.149 28.304-14.005 .417-4.348-3.529-6-16.878-7.066Z"></path>
                </svg>
                <span className="relative "> Storytelling</span>
              </span>
              !
            </h3>
            <p className="mt-5 text-justify md:max-w-[60%] md:text-center">
              We believe your thoughts, emotions, and everyday moments deserve
              more than a scroll and a like. TaskGate is your private space to make
              sense of your life — not for followers, but for your future self
            </p>
          </article>
        </div>
        <div className="mt-16 lg:mt-26 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {features.map((paragraph) => (
            <motion.article
              key={paragraph.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
              viewport={{ once: true }}
              className="mt-2 border drop-shadow-xl lg:drop-shadow-none relative lg:items-start items-center flex flex-col gap-4 p-4 md:p-6 lg:p-10 py-10 rounded-lg"
            >
              <h3 className="text-h3 absolute lg:static top-[-40px] border-2 lg:border-none text-[#505050] left-[40%] bg-white rounded-full p-4 w-[70px] h-[70px] flex items-center justify-center font-bold">
                {paragraph.id}
              </h3>
              <h4 className="text-h5 font-bold mt-5 lg:mt-0 lg:text-left text-center">
                {paragraph.title}
              </h4>
              <p className="mt-2 text-center lg:text-left">{paragraph.desc}</p>
            </motion.article>
          ))}
        </div>
      </article>
    </motion.section>
  );
};

export default Benefits;
