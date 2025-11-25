"use client";

import "../globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Testimonial from "@/components/Testimonial";
import FaqsWhite from "@/components/FaqsWhite";
import Feature from "@/components/Features";
import ReadyToStart from "@/components/Ready";

export default function Features() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="pt-20">
        <Feature />
        <ReadyToStart />
        <Testimonial />
        <FaqsWhite />
      </div>
    </>
  );
}
