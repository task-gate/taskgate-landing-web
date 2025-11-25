"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { privacyPolicy } from "@/components/data/legal";
import LegalDocs from "@/components/LegalDocs";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ delay: 0.5 }}
      className="min-h-screen flex items-center flex-col justify-center"
    >
      <h2 className="text-h2 bg-bg pt-36 pb-20 lg:text-h3 text-white w-full text-center mb-14">
        Privacy Policy
      </h2>
      <div className="mx-auto px-5 md:px-[5%] 2xl:px-0 pb-20 container max-w-[1200px]">
        <article className="flex flex-col gap-5">
          <p className="py-5">
            <strong>Privacy Policy — TaskGate</strong>
            <br />
            Last updated: October 22, 2025
          </p>
          <p className="text-base">
            Thank you for using TaskGate (&quot;we&quot;, &quot;our&quot;, or
            &quot;us&quot;). Your privacy is important to us. This Privacy
            Policy explains how we collect, use, and protect your information
            when you use the TaskGate mobile application (&quot;App&quot;).
          </p>
          <LegalDocs mou={privacyPolicy} />
          <p className="text-center mt-6">
            By using our app and services, you acknowledge that you have read,
            understood, and agree to be bound by this Privacy Policy.
          </p>
        </article>
      </div>
    </motion.section>
  );
};

export default Privacy;
