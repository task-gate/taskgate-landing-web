"use client";

import "../globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdOutlineWifiFind } from "react-icons/md";
import { TbClockRecord } from "react-icons/tb";
import OurStory from "@/components/OurStory";
import Legacy from "@/components/Legacy";
import Testimonial from "@/components/Testimonial";
import Faqs from "@/components/Faqs";
import CoreValues from "@/components/CoreValue";
import AppStoreDownloadButton from "@/components/AppStoreDownloadButton";
import GooglePlayDownloadButton from "@/components/GooglePlayDownloadButton";
import SolarSystemBackground from "@/components/SolarSystemBackground";

const values = [
  {
    id: 1,
    title: "Conscious Digital Living",
    desc: "We believe technology should serve your highest good, not scatter your energy. TaskGate creates intentional pauses that help you align your digital interactions with your manifestation practice and conscious awareness.",
    icon: <RiSecurePaymentFill className="w-8 h-8 text-[#505050]" />,
  },
  {
    id: 2,
    title: "Manifestation Through Action",
    desc: "Every affirmation screen is an opportunity to align your actions with your aspirations. By practicing the Law of Attraction before digital distractions, you transform routine interactions into moments of conscious manifestation.",
    icon: <MdOutlineWifiFind className="w-8 h-8 text-[#505050]" />,
  },
  {
    id: 3,
    title: "Privacy-First Approach",
    desc: "Your manifestation journey and personal affirmations are yours alone. TaskGate keeps all data on your device, ensuring your path toward conscious digital living remains completely private and secure.",
    icon: <TbClockRecord className="w-8 h-8 text-[#505050]" />,
  },
];
export default function About() {
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
              Transforming Digital Distractions Into Manifestation Moments
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 1.25 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="my-4 mb-6 text-white w-[80%] md:w-[60%] md:leading-8 text-center"
            >
              We believe technology should serve your highest good, not scatter
              your energy. TaskGate helps you create conscious moments between
              impulse and action, transforming digital distractions into
              opportunities for manifestation and alignment.
            </motion.p>

            <div className="mt-8 flex space-x-4">
              <div className="flex flex-col md:flex-row gap-4">
                <GooglePlayDownloadButton />
                <AppStoreDownloadButton />
              </div>
            </div>
          </article>
        </section>
      </motion.article>

      <motion.article className="relative z-10 bg-white text-primary overflow-hidden">
        <article className="container mx-auto py-20 pb-32 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col items-center justify-center gap-12">
          <div className="flex flex-col items-center md:items-start md:self-start pt-8">
            <h2 className="text-h2 lg:text-h3 font-bold text-center text-primary">
              Our Mission: Help People Build Intentional Relationships with
              Technology
            </h2>
            <span className="w-16 h-1 mt-3 bg-bg" />
          </div>
          <div className="text-primary text-left w-full max-w-3xl mt-8 space-y-10">
            <div>
              <h3 className="text-xl font-bold">
                📱 Conscious Digital Alignment
              </h3>
              <p>
                No judgment, just awareness. TaskGate tracks your digital energy
                patterns and creates gentle interruptions that help you pause
                and align with your manifestation goals before diving into
                potentially energy-draining applications.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                🧘 Mindfulness Meets Manifestation
              </h3>
              <p>
                Transform every digital interaction into an opportunity for
                conscious growth. Our affirmation screens help you practice the
                Law of Attraction and mindfulness, turning routine app opens
                into moments of manifestation and energetic alignment.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">📊 Insights Without Shame</h3>
              <p>
                Knowledge is power, but only when it&apos;s used with
                compassion. TaskGate provides clear insights into your digital
                energy patterns without judgment, helping you make conscious
                decisions about your digital alignment and manifestation
                practice.
              </p>
              <p className="mt-2 font-semibold">
                Because awareness is the first step toward conscious
                transformation.
              </p>
            </div>
          </div>

          {/* Visual representation of the philosophy */}
          <div className="hidden md:block p-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
                  The TaskGate Journey
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-lg">📱</span>
                  </div>
                  <span className="text-xs text-gray-600">Impulse</span>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <span className="text-xs text-gray-600">Affirmation</span>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-lg">🧘</span>
                  </div>
                  <span className="text-xs text-gray-600">Choice</span>
                </div>
              </div>
            </div>
          </div>

          <article className="grid grid-cols-1 items-center justify-center lg:grid-cols-3 gap-4 mt-10 lg:pb-0 px-6 pb-10 lg:rounded-2xl text-black lg:shadow-xl lg:w-full">
            {values.map((hook) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
                key={hook.id}
                className="rounded-3xl border min-h-[290px] lg:rounded-none lg:border-none flex flex-col items-center gap-5 w-full max-w-[480px] mx-auto lg:max-w-none p-4 pb-8"
              >
                <div className="rounded-full border w-14 h-14 flex justify-center items-center py-2">
                  {hook.icon}
                </div>
                <h4 className="font-bold text-center">{hook.title}</h4>
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
      <Faqs />
    </>
  );
}
