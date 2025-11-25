"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/Button";

const Updates = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ delay: 0.5 }}
      className="min-h-screen ex-col justify-center"
    >
      <h2 className="text-h2 bg-bg pt-36 pb-20 lg:text-h3 text-white w-full text-center mb-14">
        What&apos;s New
      </h2>
      <div className="mx-auto px-5 md:px-[5%] 2xl:px-0 pb-20 container max-w-[1200px]">
        <article className="flex items-center justify-center flex-col gap-12">
          <h3 className="font-extrabold text-h3">Join the Waitlist</h3>
          <Button text="Be the first to know" />
          <Image
            src="/mockups/mockupJournal.png"
            alt="About TaskGate"
            className="w-[40%]"
            width={300}
            height={300}
          />
        </article>
      </div>
    </motion.section>
  );
};

export default Updates;
