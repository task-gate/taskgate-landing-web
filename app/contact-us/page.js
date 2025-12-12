"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import Image from "next/image";
import * as Yup from "yup";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { InfinitySpin } from "react-loader-spinner";
import { MdCancel } from "react-icons/md";
import { db } from "@/utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTray, setShowTray] = useState(false);
  const searchParams = useSearchParams();
  const interest = searchParams?.get("interest") || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      comment: "",
      areaOfInterest: {
        loaUsage: false,
        adsSponsorship: false,
        partnership: interest === "partnership",
        others: false,
      },
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone Number is required"),
      comment: Yup.string().max(500, "Comment must be at most 500 characters"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const contactsCollectionRef = collection(db, "contacts");
        await addDoc(contactsCollectionRef, {
          name: values.name,
          email: values.email,
          phone: values.phone,
          comment: values.comment,
          areaOfInterest: {
            loaUsage: values.areaOfInterest.loaUsage,
            adsSponsorship: values.areaOfInterest.adsSponsorship,
            partnership: values.areaOfInterest.partnership,
            others: values.areaOfInterest.others,
          },
          timestamp: new Date(),
        });
        setIsLoading(false);
        setShowTray(true);
        formik.resetForm();
      } catch (error) {
        console.error("Error adding document: ", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      formik.setErrors({});
    }, 3000);

    return () => clearTimeout(timer);
  }, [formik, formik.errors]);

  return (
    <>
      {isLoading && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex w-full z-[100] items-center justify-center fixed top-0 left-0 bg-opacity-85 bg-primary"
        >
          <InfinitySpin
            visible
            width="200"
            color="#505050"
            ariaLabel="infinity-spin-loading"
          />
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, x: "-100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ delay: 0.5 }}
        className="relative z-10 min-h-screen w-full bg-transparent"
      >
        <div className="bg-transparent pt-36 pb-20">
          <h2 className="text-h2 lg:text-h3 text-white w-full text-center font-bold">
            Contact Us
          </h2>
        </div>
        <div className="mx-auto px-5 md:px-[5%] pb-20 container max-w-[1200px] space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Need Additional Support?
            </h2>
            <p className="text-white/80">
              Fill the form below and we will be in touch.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onSubmit={formik.handleSubmit}
            className="max-w-[600px] mx-auto flex flex-col justify-center space-y-6"
          >
            {/* Personal Info */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold mb-2 text-white"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg w-full h-[41px] py-2 px-3 text-white placeholder-white/50 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Name"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-400 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold mb-2 text-white"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg w-full h-[41px] py-2 px-3 text-white placeholder-white/50 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Email"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-400 text-sm mt-1">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-bold mb-2 text-white"
                  >
                    Phone Number:
                  </label>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={formik.values.phone}
                    onChange={(phone) => formik.setFieldValue("phone", phone)}
                    onBlur={() => formik.setFieldTouched("phone", true)}
                    defaultCountry="us"
                    name="phone"
                    international
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-400 text-sm mt-1">
                      {formik.errors.phone}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                htmlFor="comment"
                className="block text-sm font-bold mb-2 text-white"
              >
                Comment:
              </label>
              <textarea
                name="comment"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.comment}
                rows="4"
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg w-full py-2 px-3 text-white placeholder-white/50 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Additional details here"
              />
              {formik.touched.comment && formik.errors.comment ? (
                <div className="text-red-400 text-sm mt-1">
                  {formik.errors.comment}
                </div>
              ) : null}
            </div>

            {/* Area of Concern Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Area of Concern
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="inline-flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-500 bg-white/20 border-white/30 rounded"
                    name="areaOfInterest.loaUsage"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.areaOfInterest.loaUsage}
                  />
                  <span className="ml-2 text-white">TaskGate Usage</span>
                </label>
                <label className="inline-flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-500 bg-white/20 border-white/30 rounded"
                    name="areaOfInterest.adsSponsorship"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.areaOfInterest.adsSponsorship}
                  />
                  <span className="ml-2 text-white">Ads Sponsorship</span>
                </label>
                <label className="inline-flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-500 bg-white/20 border-white/30 rounded"
                    name="areaOfInterest.partnership"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.areaOfInterest.partnership}
                  />
                  <span className="ml-2 text-white">Partnership</span>
                </label>
                <label className="inline-flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-500 bg-white/20 border-white/30 rounded"
                    name="areaOfInterest.others"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.areaOfInterest.others}
                  />
                  <span className="ml-2 text-white">Others</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 active:scale-95 hover:from-purple-600 hover:to-pink-600 transition-all text-white font-bold h-[48px] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
            >
              Submit
            </button>
          </motion.form>
        </div>
      </motion.section>

      {showTray && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowTray(false)}
          className="fixed top-0 left-0 z-[500000] w-full h-full bg-black bg-opacity-85 flex items-center justify-center cursor-pointer"
        >
          <MdCancel
            className="absolute left-5 top-10 lg:top-14 lg:left-14 text-2xl cursor-pointer text-white hover:scale-110 transition-transform"
            onClick={() => setShowTray(false)}
          />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-16 py-12 flex flex-col items-center justify-center gap-6 max-w-md mx-4 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
                delay: 0.3,
              }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-12 h-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </motion.svg>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-bold text-white"
            >
              Message Sent!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-purple-100"
            >
              We got your message! We&apos;ll get back to you soon.
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => setShowTray(false)}
              className="mt-4 px-6 py-2 bg-white text-purple-900 font-semibold rounded-full hover:bg-purple-100 transition-colors"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.section>
      )}
    </>
  );
};

const Contact = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex w-full items-center justify-center bg-transparent">
        <InfinitySpin
          visible
          width="200"
          color="#505050"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
};

export default Contact;
