"use client";
import { motion } from "framer-motion";
import GooglePlayDownloadButton from "./GooglePlayDownloadButton";
import AppStoreDownloadButton from "./AppStoreDownloadButton";

const Legacy = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-transparent text-white"
    >
      <article className=" container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-5xl flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 items-center justify-center">
          <h2 className="text-h3 lg:text-h4 font-bold text-center max-w-[80%]">
            Want to leave a legacy but don&apos;t know how?
          </h2>
          <p className="my-6 text-center max-w-[80%] lg:max-w-[60%] lg:leading-8">
            TaskGate makes capturing your life story both effortless and
            insightful.
          </p>
          <div className="mt-8 flex space-x-4">
            <div className="flex flex-col md:flex-row gap-4">
              <GooglePlayDownloadButton />
              <AppStoreDownloadButton />
            </div>
          </div>
        </div>
      </article>
    </motion.section>
  );
};

export default Legacy;
