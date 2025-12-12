"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Zap } from "lucide-react";

const partnerApps = [
  {
    name: "Law of Attraction",
    description:
      "Practice affirmations and manifestation exercises before app access",
    icon: "/partners/loa.png",
    isImage: true,
    category: "Wellness",
    color: "from-purple-500 to-pink-600",
    link: "https://loa-web-landing.vercel.app/",
  },
  {
    name: "Duolingo",
    description: "Complete language flashcards before accessing social media",
    icon: "🦉",
    category: "Learning",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Headspace",
    description: "Practice quick meditation exercises for mindful app usage",
    icon: "🧘",
    category: "Wellness",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Anki",
    description: "Review spaced repetition flashcards to unlock your apps",
    icon: "🎴",
    category: "Learning",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Todoist",
    description: "Check off a task from your to-do list before scrolling",
    icon: "✓",
    category: "Productivity",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Strava",
    description: "Log a quick workout activity to earn your app access",
    icon: "🏃",
    category: "Fitness",
    color: "from-orange-600 to-amber-600",
  },
  {
    name: "MyFitnessPal",
    description: "Track a meal or log your water intake before app opening",
    icon: "🍎",
    category: "Health",
    color: "from-blue-600 to-indigo-600",
  },
];

const PartnerApps = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-20 bg-transparent"
    >
      <div className="relative z-20 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent font-medium text-sm">
              Deep Link Integration
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Connect With Partner Apps
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Transform impulsive scrolling into productive habits by connecting
            with your favorite apps. Complete mini-tasks from partner apps and
            get redirected back automatically—making every app open an
            opportunity to learn, grow, or stay healthy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerApps.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <a
                href={app.link || "#"}
                target={app.link ? "_blank" : "_self"}
                rel={app.link ? "noopener noreferrer" : ""}
                className="block p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-accent/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r ${app.color}`}
                />
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">
                    {app.isImage ? (
                      <Image
                        src={app.icon}
                        alt={app.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      app.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {app.name}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                </div>
                {app.link && (
                  <div className="mt-4 flex items-center text-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                )}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 border border-accent/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Want to Become a Partner?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Integrate your app with TaskGate and help users build better
              habits while discovering your product. Our deep link API makes
              integration simple and seamless.
            </p>
            <a href="/contact-us?interest=partnership">
              <button className="px-8 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                Join Our Partner Program
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PartnerApps;
