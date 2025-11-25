"use client";

import "./globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, Heart, Zap } from "lucide-react";
import AppStoreDownloadButton from "@/components/AppStoreDownloadButton";
import GooglePlayDownloadButton from "@/components/GooglePlayDownloadButton";
import HowItWorks from "@/components/HowItWorks";
import AppFeatures from "@/components/AppFeatures";
import UserTestimonials from "@/components/UserTestimonials";
import Start from "@/components/Start";
import Faqs from "@/components/Faqs";
// import FoldingBlocksBackground from "@/components/FoldingBlocksBackground";
import ShiftingGridBackground from "@/components/ShiftingGridBackground";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section with solar system background */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen bg-black pt-20 overflow-hidden"
      >
        {/* Folding Blocks Background */}
        <div className="absolute inset-0 z-0">
          <FoldingBlocksBackground />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-indigo-300 rounded-full animate-pulse"></div>
          <div className="absolute top-60 left-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">
                Mindful App Usage, One Task at a Time
              </span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative mb-8"
            >
              <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight">
                <span className="block mb-2 text-white">
                  Break the Cycle of
                </span>
                <span className="relative inline-block text-accent">
                  Impulsive Scrolling
                </span>
              </h1>
            </motion.div>

            {/* Description card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="relative max-w-4xl mx-auto mb-12"
            >
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-2xl">
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  TaskGate intercepts impulsive app opens and requires you to
                  complete a{" "}
                  <span className="text-accent font-semibold">quick task</span>{" "}
                  before access is granted. Choose from built-in mini-tasks like
                  breathing exercises, reflections, and flashcards—or connect
                  with partner apps for even more variety.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <GooglePlayDownloadButton />
              <AppStoreDownloadButton />
            </motion.div>
          </div>

          {/* Key principles */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all">
              <Eye className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Impulse Interception
              </h3>
              <p className="text-white/80 text-sm">
                TaskGate catches impulsive app opens before they happen, giving
                you a moment to pause and reflect.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all">
              <Heart className="w-10 h-10 text-notion-red mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Meaningful Tasks
              </h3>
              <p className="text-white/80 text-sm">
                Complete short activities like breathing exercises, journal
                prompts, or partner app challenges to earn access.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all">
              <Zap className="w-10 h-10 text-notion-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Partner Integration
              </h3>
              <p className="text-white/80 text-sm">
                Connect with partner apps via deep links—complete their
                mini-tasks and get redirected back automatically.
              </p>
            </div>
          </motion.div>

          {/* App visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="text-center"
          >
            <div className="mx-auto max-w-md md:max-w-lg">
              <img
                src="/mock/mock2.png"
                alt="Your Daily Affirmation"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Philosophy Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-20 bg-transparent"
      >
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-8 text-white"
          >
            &quot;Pause before you scroll&quot;
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-400 leading-relaxed mb-12"
          >
            Most app usage is impulsive—you reach for your phone without
            thinking. TaskGate adds intentionality by requiring a small
            commitment before access. Whether it's a breathing exercise, a
            reflection, or a partner app's challenge, you'll build healthier
            digital habits one task at a time.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-3 text-white">
                Before: Impulsive Opening
              </h3>
              <p className="text-gray-400">
                You tap Instagram or TikTok without thinking, losing minutes (or
                hours) to endless scrolling and distraction.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="p-6 bg-accent/20 rounded-lg border border-accent/30"
            >
              <h3 className="text-xl font-semibold mb-3 text-accent">
                After: Intentional Access
              </h3>
              <p className="text-white">
                TaskGate intercepts the impulse, presents a quick task, and
                gives you the choice—continue with purpose or redirect your
                time.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <HowItWorks />
      <AppFeatures />
      <UserTestimonials />
      <Start />
      <Faqs />
    </>
  );
}
