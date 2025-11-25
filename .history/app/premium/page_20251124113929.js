"use client";

import "../globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";

import Testimonial from "@/components/Testimonial";
import Faqs from "@/components/Faqs";
import Feature from "@/components/Features";
import ReadyToStart from "@/components/Ready";
import PricingPlans from "@/components/PricingPolicy";
import AppStoreDownloadButton from "@/components/AppStoreDownloadButton";
import GooglePlayDownloadButton from "@/components/GooglePlayDownloadButton";
import SolarSystemBackground from "@/components/SolarSystemBackground";

export default function Premium() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SolarSystemBackground />
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
        viewport={{ once: true }}
        className="relative z-10 pt-28 lg:pt-64 lg:pb-32 flex bg-transparent flex-col items-center justify-items-center overflow-x-hidden"
      >
        <section className="w-full container px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] mx-auto flex flex-col lg:flex-row-reverse items-center lg:items-start justify-center lg:gap-5 gap-8">
          <article className="py-4 mx-auto lg:mx-0 lg:relative lg:left-[-100px] w-full flex flex-col gap-5 items-start justify-center">
            <motion.h1
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white text-h2 md:max-w-[70%] lg:max-w-[100%] lg:text-h4 font-bold text-left"
            >
              Unlock Advanced Manifestation Tools with TaskGate Premium
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 1.25 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-white max-w-[85%] md:max-w-[70%] lg:max-w-[100%] md:leading-8 text-left"
            >
              TaskGate Premium amplifies your manifestation practice with
              advanced features designed to accelerate your Law of Attraction
              journey. Access deeper insights, powerful visualization tools, and
              exclusive content to attract your desires faster.
            </motion.p>

            <div className="mt-8 flex space-x-4">
              <div className="flex flex-col md:flex-row gap-4">
                <GooglePlayDownloadButton />
                <AppStoreDownloadButton />
              </div>
            </div>
          </article>
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            className="flex py-4 mx-auto items-center w-full justify-center"
          >
            ="relative w-[200px] h-[200px] bg-gradient-to-br from-indigo-500
            via-purple-500 to-pink-500 rounded-full flex items-center
            justify-center shadow-2xl">
            <img
              src="/mock/mock1.png"
              alt="TaskGate App Mockup"
              className="w-auto h-auto max-w-[300px] lg:max-w-[350px]"
            />
          </motion.article>
        </section>
      </motion.article>
      <PricingPlans />
      <ReadyToStart />
      <Testimonial />
      <Faqs />
    </>
  );
}
