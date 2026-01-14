"use client";

import "../globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import AppStoreDownloadButton from "@/components/AppStoreDownloadButton";
import GooglePlayDownloadButton from "@/components/GooglePlayDownloadButton";
import { Smartphone, Target, CheckCircle2 } from "lucide-react";

export default function Download() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    "Break impulsive app habits",
    "Complete tasks before scrolling",
    "Track your progress",
    "Integrate with partner apps",
  ];

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen bg-black pt-32 pb-20 overflow-hidden"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-purple-600/5 to-transparent pointer-events-none" />

        <div className="relative z-20 max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                Download{" "}
              </span>
              <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                TaskGate
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Start designing your digital habits today. Available on iOS and
              Android.
            </motion.p>

            {/* QR Codes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                {/* iOS QR Code */}
                <div className="flex flex-col items-center">
                  <div className="relative p-5 rounded-3xl bg-gradient-to-br from-accent via-purple-600 to-pink-600">
                    <div className="relative">
                      <Image
                        src="/ios-qrcode.png"
                        alt="iOS App QR Code"
                        width={180}
                        height={180}
                        className="w-full h-auto rounded-2xl"
                      />
                      {/* Center Logo Overlay */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
                        <Image
                          src="/app_logo_dark.png"
                          alt="TaskGate Logo"
                          width={40}
                          height={40}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="px-5 py-4 text-center">
                      <p className="text-white font-semibold text-lg">
                        TaskGate
                      </p>
                      <p className="text-gray-200 text-sm">for iOS</p>
                    </div>
                    <div className="px-5 pb-2 pt-2 flex justify-center">
                      <AppStoreDownloadButton />
                    </div>
                  </div>
                </div>

                {/* Android QR Code */}
                <div className="flex flex-col items-center">
                  <div className="relative p-5 rounded-3xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600">
                    <div className="relative">
                      <Image
                        src="/android-qrcode.png"
                        alt="Android App QR Code"
                        width={180}
                        height={180}
                        className="w-full h-auto rounded-2xl"
                      />
                      {/* Center Logo Overlay */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
                        <Image
                          src="/app_logo_dark.png"
                          alt="TaskGate Logo"
                          width={40}
                          height={40}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="px-5 py-4 text-center">
                      <p className="text-white font-semibold text-lg">
                        TaskGate
                      </p>
                      <p className="text-gray-200 text-sm">for Android</p>
                    </div>
                    <div className="px-5 pb-2 pt-2 flex justify-center">
                      <GooglePlayDownloadButton />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-left p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-gray-300 text-lg">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Secondary CTA Section */}
      <section className="bg-gradient-to-br from-accent/10 via-purple-600/10 to-transparent py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Digital Habits?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are taking control of their screen
              time and building healthier digital habits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AppStoreDownloadButton />
              <GooglePlayDownloadButton />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
