"use client";

import { useState } from "react";
import LeadForm from "./LeadForm";

const Button = ({ text }) => {
  const [showForm, setShowForm] = useState(false);

  const handleForm = () => {
    if (typeof window !== "undefined") {
      import("react-facebook-pixel").then((module) => {
        const ReactPixel = module.default;

        ReactPixel.init(process.env.NEXT_PUBLIC_META_PIXEL_ID);
        ReactPixel.trackCustom("CTA_Click", {
          button_name: text,
        });

        console.log(`Meta Pixel Event: CTA_Click triggered for ${text}`);
      });
    }

    if (text === "Learn More") {
      window.location.href = "/about-us";
      return;
    }

    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <>
      <button
        className="text-white active:scale-95 transition-all relative group cursor-pointer font-bold rounded-lg p-0.5 shadow-lg bg-gradient-to-r from-accent to-purple-600 focus:outline-none focus:shadow-outline"
        onClick={handleForm}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="bg-bg relative text-[3vw] md:text-body p-3 rounded-lg">
          {text}
        </div>
      </button>
      {showForm && <LeadForm handleClose={handleCloseForm} />}
    </>
  );
};

export default Button;
