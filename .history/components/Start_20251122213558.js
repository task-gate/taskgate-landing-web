"use client";
import { motion } from "framer-motion";

import GooglePlayDownloadButton from "./GooglePlayDownloadButton";
import AppStoreDownloadButton from "./AppStoreDownloadButton";

const Start = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-primary text-secondary"
    >
      <article className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="flex flex-col gap-12 items-center md:items-start justify-center">
          <h2 className="text-h3 lg:text-h4 font-bold text-center md:text-left max-w-[80%] leading-relaxed">
            Transform Your Digital Life Today. <br />
            Your Conscious Journey Begins with TaskGate
          </h2>
          <div className="mt-8 flex space-x-4">
            <div className="flex flex-col md:flex-row gap-4">
              <GooglePlayDownloadButton />
              <AppStoreDownloadButton />
            </div>
          </div>
        </div>
        <div className="max-w-[50%] md:max-w-[40%] h-[500px] flex items-center justify-center">
          <div className="relative w-[280px] h-[400px] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-4 bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-white">✨</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-2">
                  Manifest Your Dreams
                </h3>
                <p className="text-gray-300 text-sm">
                  Law of Attraction in Action
                </p>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-white text-sm">📱 Social Media</span>
                  <span className="text-purple-300 text-xs">Paused</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-white text-sm">🎯 Affirmation</span>
                  <span className="text-green-300 text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-white text-sm">🌟 Manifestation</span>
                  <span className="text-yellow-300 text-xs">Flowing</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Continue Journey
                </button>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg">
              ⚡
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-lg">
              💫
            </div>
          </div>
        </div>
      </article>
    </motion.section>
  );
};

export default Start;
