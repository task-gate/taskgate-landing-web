"use client";
import { motion } from "framer-motion";

import GooglePlayDownloadButton from "./GooglePlayDownloadButton";
import AppStoreDownloadButton from "./AppStoreDownloadButton";

const Start = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-black text-white overflow-hidden"
    >
      <article className="relative z-10 container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px] flex flex-col md:flex-row items-center justify-center gap-12">
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
        <img
          src="/mock/mock3.png"
          alt="Manifest Your Dreams"
          className="w-auto h-auto max-w-[280px] md:max-w-[320px]"
        />
      </article>
    </motion.section>
  );
};

export default Start;
