"use client";

import "../globals.css";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdOutlineWifiFind } from "react-icons/md";
import { TbClockRecord } from "react-icons/tb";
import OurStory from "@/components/OurStory";
import Legacy from "@/components/Legacy";
import Testimonial from "@/components/Testimonial";
import FaqsWhite from "@/components/FaqsWhite";
import CoreValues from "@/components/CoreValue";
import AppStoreDownloadButton from "@/components/AppStoreDownloadButton";
import GooglePlayDownloadButton from "@/components/GooglePlayDownloadButton";

const values = [
  {
    id: 1,
    title: "Intentional Digital Living",
    desc: "We believe technology should serve you, not distract you. TaskGate creates intentional pauses that help you align your digital interactions with your goals and priorities.",
    icon: <RiSecurePaymentFill className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    title: "Habits Through Action",
    desc: "Every task screen is an opportunity to build better habits. By completing a quick activity before accessing distracting apps, you transform impulsive behavior into intentional choices.",
    icon: <MdOutlineWifiFind className="w-6 h-6 text-white" />,
  },
  {
    id: 3,
    title: "Privacy-First Approach",
    desc: "Your habit-building journey and personal data are yours alone. TaskGate keeps all data on your device, ensuring your path toward better digital habits remains completely private and secure.",
    icon: <TbClockRecord className="w-6 h-6 text-white" />,
  },
];
export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
        viewport={{ once: true }}
        className="relative z-10 pt-24 flex bg-transparent min-h-[100vh] flex-col items-center justify-items-center overflow-x-hidden"
      >
        <section className="w-full px-5 md:px-[5%] 2xl:px-0 max-w-5xl mx-auto flex flex-col items-center justify-center gap-8">
          <article className="relative w-full py-4 mx-auto flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white text-h2 md:max-w-[70%] lg:mt-12 font-bold text-center"
            >
              Helping You Design Better Digital Habits
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 1.25 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="my-4 mb-6 text-white w-[80%] md:w-[60%] md:leading-8 text-center"
            >
              We believe technology should serve you, not distract you. TaskGate
              helps you create intentional moments between impulse and action,
              transforming mindless scrolling into purposeful habits.
            </motion.p>

            <div className="mt-8 flex space-x-4">
              <div className="flex flex-col md:flex-row gap-4">
                <GooglePlayDownloadButton />
                <AppStoreDownloadButton />
              </div>
            </div>

            {/* App visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 text-center"
            >
              <Image
                src="/mock/mock2.png"
                alt="TaskGate App Screenshot"
                width={1500}
                height={1125}
                quality={100}
                priority
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </article>
        </section>
      </motion.article>

      <motion.article className="relative z-10 bg-white overflow-hidden">
        <article className="container mx-auto py-20 pb-32 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col items-center justify-center gap-12">
          <div className="flex flex-col items-center pt-8">
            <h2 className="text-h2 lg:text-h3 font-bold text-center">
              Our Mission: Help People Build Intentional Relationships with
              Technology
            </h2>
            <span className="w-16 h-1 mt-3 bg-gradient-to-r from-accent to-purple-600 rounded-full" />
          </div>
          <div className=" text-left w-full max-w-3xl mt-8 space-y-10">
            <div>
              <h3 className="text-xl font-bold">📱 Break the Scroll Cycle</h3>
              <p>
                No judgment, just awareness. TaskGate tracks your app usage
                patterns and creates gentle interruptions that help you pause
                and reflect before diving into potentially time-consuming
                applications.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                🧘 Mindfulness Meets Productivity
              </h3>
              <p>
                Transform every app open into an opportunity for intentional
                choice. Our mini-tasks help you practice mindfulness and build
                better habits, turning impulsive scrolling into purposeful
                moments.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">📊 Insights Without Shame</h3>
              <p>
                Knowledge is power, but only when it&apos;s used with
                compassion. TaskGate provides clear insights into your digital
                habits without judgment, helping you make intentional decisions
                about your screen time.
              </p>
              <p className="mt-2 font-semibold">
                Because awareness is the first step toward positive change.
              </p>
            </div>
          </div>

          <article className="grid grid-cols-1 items-start justify-center lg:grid-cols-3 gap-4 mt-10 lg:pb-0 px-6 pb-10 lg:rounded-2xl text-black lg:shadow-xl lg:w-full">
            {values.map((hook) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
                key={hook.id}
                className="rounded-3xl border min-h-[290px] lg:rounded-none lg:border-none flex flex-col items-center gap-5 w-full max-w-[480px] mx-auto lg:max-w-none p-4 pb-8"
              >
                <div className="rounded-full bg-gradient-to-r from-accent to-purple-600 w-14 h-14 flex justify-center items-center flex-shrink-0">
                  {hook.icon}
                </div>
                <h4 className="font-bold text-center bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                  {hook.title}
                </h4>
                <p className="text-center lg:text-base text-black lg:max-w-80">
                  {hook.desc}
                </p>
              </motion.div>
            ))}
          </article>
        </article>
      </motion.article>
      <OurStory />
      <CoreValues />
      <Legacy />
      <Testimonial />
      <FaqsWhite />
    </>
  );
}
