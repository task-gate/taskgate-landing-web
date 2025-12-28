"use client";

import "../globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Users,
  TrendingUp,
  Code,
  Rocket,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: <Users className="w-8 h-8 text-accent" />,
    title: "Reach Engaged Users",
    description:
      "Connect with users actively building better digital habits and looking for productive alternatives to mindless scrolling.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-accent" />,
    title: "Increase User Acquisition",
    description:
      "Get discovered by TaskGate users at the perfect moment—when they're ready to replace impulsive behavior with meaningful action.",
  },
  {
    icon: <Code className="w-8 h-8 text-accent" />,
    title: "Simple Integration",
    description:
      "Our deep link API makes integration straightforward. Minimal technical overhead with maximum impact.",
  },
  {
    icon: <Shield className="w-8 h-8 text-accent" />,
    title: "Privacy-First Approach",
    description:
      "We respect user privacy and don't share personal data. Partners receive usage analytics without compromising user trust.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Integrate via Deep Links",
    description:
      "Connect your app using our simple deep link protocol. Users complete mini-tasks from your app before accessing gated apps.",
  },
  {
    step: "2",
    title: "Users Discover Your App",
    description:
      "TaskGate users encounter your app as a task option, trying it naturally as part of their habit-building routine.",
  },
  {
    step: "3",
    title: "Seamless Experience",
    description:
      "After completing your task, users are automatically redirected back to their desired app—creating a smooth, frustration-free flow.",
  },
  {
    step: "4",
    title: "Track & Optimize",
    description:
      "Monitor engagement metrics and optimize your task offerings to maximize user acquisition and retention.",
  },
];

const currentPartners = [
  {
    name: "Law of Attraction",
    description: "Manifestation and affirmation exercises",
    icon: "/partners/loa.png",
    isImage: true,
    category: "Wellness",
    color: "from-purple-500 to-pink-600",
    link: "https://loa-web-landing.vercel.app/",
  },
  {
    name: "Duolingo",
    description: "Language learning flashcards",
    icon: "🦉",
    category: "Learning",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Headspace",
    description: "Meditation and mindfulness",
    icon: "🧘",
    category: "Wellness",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Anki",
    description: "Spaced repetition flashcards",
    icon: "🎴",
    category: "Learning",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Todoist",
    description: "Task management and to-do lists",
    icon: "✓",
    category: "Productivity",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Strava",
    description: "Fitness and workout tracking",
    icon: "🏃",
    category: "Fitness",
    color: "from-orange-600 to-amber-600",
  },
];

const idealPartners = [
  "Language Learning Apps",
  "Meditation & Wellness Apps",
  "Fitness & Health Trackers",
  "Productivity & Task Management",
  "Educational Platforms",
  "Habit Tracking Apps",
  "Flashcard & Study Tools",
  "Mindfulness Apps",
];

export default function Partnership() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-black pt-32 pb-16 overflow-hidden"
      >
        <div className="relative z-20 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-accent font-medium text-sm">
                Partner Program
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Grow Your App with <span className="text-accent">TaskGate</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Help users build better habits while discovering your app.
              Integrate with TaskGate and reach engaged users at the perfect
              moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact-us?interest=partnership">
                <button className="px-8 py-4 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                  Become a Partner
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300">
                  Learn How It Works
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-center text-sm text-gray-500 mb-4">Our Vision</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="text-4xl font-bold text-accent mb-2">10K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="text-4xl font-bold text-accent mb-2">100K+</div>
                <div className="text-gray-400">Tasks Completed</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="text-4xl font-bold text-accent mb-2">95%</div>
                <div className="text-gray-400">User Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative pb-20 bg-transparent"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="mb-12 flex justify-center">
              <Image
                src="/mock/mock10.png"
                alt="TaskGate Partnership"
                width={1500}
                height={1125}
                quality={100}
                priority
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Partner with TaskGate?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join our ecosystem and help users replace mindless scrolling with
              productive engagement with your app.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-accent/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Current Partners Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-20 bg-transparent"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Current Partner Apps
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join these amazing apps already integrated with TaskGate, helping
              users build better habits every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {currentPartners.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative flex h-full"
              >
                <a
                  href={app.link || "#"}
                  target={app.link ? "_blank" : "_self"}
                  rel={app.link ? "noopener noreferrer" : ""}
                  className={`flex flex-col w-full p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-accent/50 hover:bg-white/10 transition-all duration-300 ${
                    app.link ? "cursor-pointer" : ""
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r ${app.color}`}
                  />
                  <div className="flex items-start gap-4 h-full">
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                      {app.isImage ? (
                        <Image
                          src={app.icon}
                          alt={app.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-4xl leading-none">
                          {app.icon}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold text-white leading-tight mb-2">
                          {app.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {!app.link && (
                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 whitespace-nowrap">
                              Coming Soon
                            </span>
                          )}
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 whitespace-nowrap">
                            {app.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                        {app.description}
                      </p>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-20 bg-transparent"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              How Partnership Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Simple integration, powerful results. Here&apos;s how our
              partnership model works.
            </p>
            <div className="flex justify-center mb-12">
              <video
                src="/mock/demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="max-w-[200px] lg:max-w-xs h-auto drop-shadow-lg rounded-3xl"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
              >
                <div className="absolute -top-4 left-6 w-12 h-12 rounded-full bg-gradient-to-r from-accent to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Ideal Partners Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-20 bg-transparent"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ideal Partner Categories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We&apos;re looking for apps that help users learn, grow, and
              improve their well-being.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {idealPartners.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-center hover:border-accent/50 hover:bg-white/10 transition-all duration-300"
              >
                <CheckCircle2 className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-white text-sm font-medium">{category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-20 bg-transparent"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 rounded-2xl p-12 text-center"
          >
            <Rocket className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Partner with TaskGate?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our growing ecosystem of apps helping users build better
              digital habits. Let&apos;s create something amazing together.
            </p>
            <Link href="/contact-us?interest=partnership">
              <button className="px-10 py-4 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl text-lg flex items-center gap-2 mx-auto">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
