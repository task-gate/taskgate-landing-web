"use client";
import { motion } from "framer-motion";

import GooglePlayDownloadButton from "./GooglePlayDownloadButton";
import AppStoreDownloadButton from "./AppStoreDownloadButton";

const Start = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-gradient-to-br from-purple-50 to-indigo-50 text-gray-900"
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
        <div className="max-w-[50%] md:max-w-[40%] flex items-center justify-center">
          <img
            src="/mock/mock3.png"
            alt="Manifest Your Dreams"
            className="w-full h-auto max-w-sm rounded-3xl shadow-2xl"
          />
        </div>
      </article>
    </motion.section>
  );
};

export default Start;
