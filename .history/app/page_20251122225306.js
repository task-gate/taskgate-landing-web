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
import SolarSystemBackground from "@/components/SolarSystemBackground";

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
        className="relative min-h-screen bg-transparent pt-20 overflow-hidden"
      >
        {/* Solar System Background */}
        <SolarSystemBackground />

        {/* Floating elements for mystical feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-indigo-300 rounded-full animate-pulse"></div>
          <div className="absolute top-60 left-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Futuristic badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 backdrop-blur-md border border-purple-400/30 shadow-lg shadow-purple-500/20"
            >
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-300" />
                <div className="absolute inset-0 blur-sm">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-purple-300 via-pink-400 to-purple-300 bg-clip-text text-transparent inline-block">
                Law of Attraction for the Digital Age
              </span>
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-300" />
                <div className="absolute inset-0 blur-sm">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
              </div>
            </motion.div>

            {/* Holographic title with glow effects */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative mb-8"
            >
              {/* Background glow */}
              <div className="absolute inset-0 blur-3xl opacity-30">
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
              </div>

              <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight">
                <span className="block text-white mb-2">Attract What You</span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    Focus On
                  </span>
                  {/* Holographic underline */}
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-sm opacity-60"></div>
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"></div>
                </span>
              </h1>
            </motion.div>

            {/* Futuristic description with glassmorphic container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="relative max-w-4xl mx-auto mb-12"
            >
              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-purple-400/40 rounded-tl-xl"></div>
              <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-pink-400/40 rounded-tr-xl"></div>
              <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-indigo-400/40 rounded-bl-xl"></div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-purple-400/40 rounded-br-xl"></div>

              <div className="relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                  Transform every phone interaction into a moment of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-bold">
                    conscious awareness
                  </span>
                  . TaskGate interrupts digital distractions with personalized
                  affirmations, helping you align your energy with your highest
                  intentions.
                </p>

                {/* Energy indicator */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-8 bg-gradient-to-t from-purple-500/50 to-pink-500 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-purple-300 text-xs font-semibold tracking-wider">
                    VIBRATIONAL FREQUENCY
                  </span>
                </div>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Eye className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Intentional Awareness
              </h3>
              <p className="text-gray-300">
                Notice your thoughts and redirect your focus consciously before
                digital distractions take hold.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Aligned Energy
              </h3>
              <p className="text-gray-300">
                Tune your mindset toward gratitude, abundance, and clarity
                through personalized affirmations.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Zap className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Conscious Living
              </h3>
              <p className="text-gray-300">
                Turn micro-moments into opportunities for manifestation and
                mindful decision-making.
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
        className="relative z-10 py-20 bg-gradient-to-r from-gray-50 to-purple-50"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent"
          >
            &quot;You attract what you think and feel&quot;
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray/90 leading-relaxed mb-12"
          >
            The Law of Attraction teaches us that our thoughts, emotions, and
            focus shape our reality. When you align your energy with gratitude,
            clarity, and abundance, you naturally attract experiences that
            reflect those states. TaskGate brings this ancient wisdom into your
            digital life.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-3 text-indigo-900">
                Before: Unconscious Scrolling
              </h3>
              <p className="text-gray-700">
                Mindless phone use scattered your attention, feeding energy into
                distraction, anxiety, and endless comparison.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-3 text-purple-900">
                After: Conscious Alignment
              </h3>
              <p className="text-gray-800">
                Every digital interaction becomes an opportunity to affirm your
                intentions and redirect energy toward your highest good.
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
