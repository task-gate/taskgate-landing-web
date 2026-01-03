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
        {/* Favicon and App Icons for Google Search Results */}
        <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        
        {/* Structured Data for Google Search Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TaskGate",
              "url": "https://taskgate-landing-web.vercel.app",
              "logo": "https://taskgate-landing-web.vercel.app/favicon/android-chrome-512x512.png",
              "sameAs": []
            })
          }}
        />
        <meta
          property="og:title"
          content="TaskGate - Mindful App Usage, One Task at a Time"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://taskgate-landing-web.vercel.app/"
        />
        <meta
          property="og:image"
          content="https://taskgate-landing-web.vercel.app/og.png"
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
          content="https://taskgate-landing-web.vercel.app/og.png"
        />
      </head>
      <body
        className="text-gray-900 min-h-screen flex flex-col bg-black"
        suppressHydrationWarning
      >
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
