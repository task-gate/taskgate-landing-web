import { useState } from "react";
import { motion } from "framer-motion";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import faqs from "./data/faqs.js";

const FaqsWhite = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-white overflow-hidden"
    >
      <article className="container mx-auto py-14 p-4 px-5 md:px-[5%] 2xl:px-0 max-w-5xl flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-h2 lg:text-h3 font-bold text-center max-w-[80%]">
            Frequently Asked Questions (FAQs)
          </h2>
          <span className="w-16 h-1 mt-3 bg-gradient-to-r from-accent to-purple-600 rounded-full" />
        </div>
        <ul className="space-y-4 mt-14 w-full">
          {faqs.map((faq, index) => (
            <li key={index}>
              <div
                className={`faq-item border-b-2 border-gray-300 p-4 ${
                  activeIndex === index ? "py-6 px-4" : ""
                }`}
              >
                <div className="flex justify-between items-start py-3">
                  <div className="faq-question cursor-pointer max-w-[90%]">
                    <span className="text-lg font-semibold">
                      {faq.question}
                    </span>
                  </div>
                  <button
                    className="toggle-button"
                    onClick={() => toggleAnswer(index)}
                  >
                    {activeIndex === index ? (
                      <MdKeyboardArrowUp className="w-8 h-8" />
                    ) : (
                      <MdKeyboardArrowDown className="w-8 h-8" />
                    )}
                  </button>
                </div>

                <div className="faq-answer mt-">
                  {activeIndex === index && (
                    <>
                      <p className="text-gray-500">{faq?.answer}</p>
                      {faq?.list && (
                        <ul className="list-disc pl-6">
                          {faq.list.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </motion.section>
  );
};

export default FaqsWhite;
