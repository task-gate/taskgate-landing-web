"use client";

import "../globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Testimonial from "@/components/Testimonial";
import Faqs from "@/components/Faqs";
import Feature from "@/components/Features";
import Analysis from "@/components/Compare";
import ReadyToStart from "@/components/Ready";
import AppStoreDownloadButton from "@/components/AppStoreDownloadButton";
import GooglePlayDownloadButton from "@/components/GooglePlayDownloadButton";
import SolarSystemBackground from "@/components/SolarSystemBackground";
import { Sparkles } from "lucide-react";

export default function Features() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen bg-transparent pt-20 overflow-hidden"
      >
        {/* Solar System Background */}
        <SolarSystemBackground />

        {/* Floating elements */}
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
              <span className="text-white font-semibold tracking-wide text-sm md:text-base whitespace-nowrap">
                Powerful Features for Digital Alignment
              </span>
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-300" />
                <div className="absolute inset-0 blur-sm">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
              </div>
            </motion.div>

            {/* Holographic title */}
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

              <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                <span className="block text-white mb-2">Transform Your</span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    Digital Experience
                  </span>
                  {/* Holographic underline */}
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-sm opacity-60"></div>
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"></div>
                </span>
              </h1>
            </motion.div>

            {/* Description container */}
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
                  TaskGate combines{" "}
                  <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent font-bold inline-block">
                    digital awareness tracking
                  </span>
                  , manifestation affirmations, and conscious living practices
                  to help you align your technology use with the Law of
                  Attraction.
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
                    ENHANCED AWARENESS
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
        </div>
      </motion.section>
      <Feature />
      <Analysis />
      <ReadyToStart />
      <Testimonial />
      <div className="relative top-[500px] mb-[500px]">
        <Faqs />
      </div>
    </>
  );
}
