"use client";

import "./globals.css";
import { motion } from "framer-motion";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// ✅ Load Meta Pixel only on the client (Prevents SSR issues)
const MetaPixelNoSSR = dynamic(() => import("@/components/MetaPixelEvents"), {
  ssr: false,
});

export default function RootLayout({ children }) {
  const pageVariants = {
    initial: { opacity: 0, x: -100 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <html lang="en">
      <head>
        <title>TaskGate - Mindful App Usage, One Task at a Time</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="TaskGate prevents impulsive app opens by requiring you to complete a quick task first. Break the cycle of mindless scrolling with breathing exercises, reflections, flashcards, or partner app challenges."
        />
        <link rel="icon" href="/favicon.ico" type="image/png" />
        <meta
          property="og:title"
          content="TaskGate - Mindful App Usage, One Task at a Time"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.taskgate-app.com" />
        <meta
          property="og:image"
          content="https://www.taskgate-app.com/og.png"
        />
        <meta
          property="og:description"
          content="Break impulsive scrolling habits. TaskGate intercepts app opens and requires a mini-task before access. Supports partner app integration."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@TaskGateApp" />
        <meta
          name="twitter:title"
          content="TaskGate - Mindful App Usage, One Task at a Time"
        />
        <meta
          name="twitter:description"
          content="Break impulsive scrolling habits. TaskGate intercepts app opens and requires a mini-task before access. Supports partner app integration."
        />
        <meta
          name="twitter:image"
          content="https://www.taskgate-app.com/og.png"
        />
      </head>
      <body className="text-gray-900 min-h-screen flex flex-col bg-black">
        {/* ✅ Ensure Meta Pixel loads only on the client */}
        <Suspense fallback={null}>
          <MetaPixelNoSSR />
        </Suspense>

        <header className="w-full relative z-50">
          <Navbar />
        </header>

        <motion.main
          className="w-full mx-auto relative z-10"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>

        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  );
}
