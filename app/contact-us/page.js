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
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTray, setShowTray] = useState(false);
  const [providerValidation, setProviderValidation] = useState({
    checking: false,
    exists: null,
    error: null,
  });
  const searchParams = useSearchParams();
  const interest = searchParams?.get("interest") || null;
  const providerParam = searchParams?.get("provider") || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const checkProviderExists = async (providerId) => {
    if (!providerId || !/^[a-z0-9_]+$/.test(providerId)) {
      setProviderValidation({ checking: false, exists: null, error: null });
      return;
    }
    setProviderValidation({ checking: true, exists: null, error: null });
    try {
      const docRef = doc(db, "partner_configs_dev", providerId);
      const docSnap = await getDoc(docRef);
      setProviderValidation({
        checking: false,
        exists: docSnap.exists(),
        error: null,
      });
    } catch (err) {
      setProviderValidation({
        checking: false,
        exists: null,
        error: "Could not verify provider ID",
      });
    }
  };

  // Check provider on mount if prefilled
  useEffect(() => {
    if (providerParam) {
      checkProviderExists(providerParam);
    }
  }, [providerParam]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      comment: "",
      taskDescription: "",
      distributionEmail: "",
      providerId: providerParam,
      areaOfInterest: {
        loaUsage: false,
        developerSupport: interest === "developer",
        devBuildRequest: interest === "devbuild",
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
      distributionEmail: Yup.string().when("areaOfInterest.devBuildRequest", {
        is: true,
        then: (schema) =>
          schema
            .email("Invalid email address")
            .required("Email for App Distribution is required"),
        otherwise: (schema) => schema,
      }),
      providerId: Yup.string().when("areaOfInterest.devBuildRequest", {
        is: true,
        then: (schema) =>
          schema
            .matches(
              /^[a-z0-9_]+$/,
              "Only lowercase letters, numbers, and underscores"
            )
            .required("Provider ID is required"),
        otherwise: (schema) => schema,
      }),
      taskDescription: Yup.string().when("areaOfInterest.devBuildRequest", {
        is: true,
        then: (schema) =>
          schema
            .min(10, "Please provide more details (at least 10 characters)")
            .required("Task description is required"),
        otherwise: (schema) => schema,
      }),
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
          taskDescription: values.taskDescription,
          distributionEmail: values.distributionEmail,
          providerId: values.providerId,
          areaOfInterest: {
            loaUsage: values.areaOfInterest.loaUsage,
            developerSupport: values.areaOfInterest.developerSupport,
            devBuildRequest: values.areaOfInterest.devBuildRequest,
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

  const hasErrors = Object.keys(formik.errors).length > 0;

  useEffect(() => {
    if (interest === "developer") {
      formik.setFieldValue("areaOfInterest.developerSupport", true);
    } else if (interest === "partnership") {
      formik.setFieldValue("areaOfInterest.partnership", true);
    } else if (interest === "devbuild") {
      formik.setFieldValue("areaOfInterest.devBuildRequest", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interest]);

  useEffect(() => {
    if (!hasErrors) return;

    const timer = setTimeout(() => {
      formik.setErrors({});
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasErrors]);

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
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
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
                  data-lpignore="true"
                  autoComplete="off"
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
                    data-lpignore="true"
                    autoComplete="off"
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
                    checked={formik.values.areaOfInterest?.loaUsage || false}
                  />
                  <span className="ml-2 text-white">TaskGate Usage</span>
                </label>
                <label className="inline-flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-500 bg-white/20 border-white/30 rounded"
                    name="areaOfInterest.developerSupport"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={
                      formik.values.areaOfInterest?.developerSupport || false
                    }
                  />
                  <span className="ml-2 text-white">Developer Support</span>
                </label>
                <label className="inline-flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-500 bg-white/20 border-white/30 rounded"
                    name="areaOfInterest.devBuildRequest"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={
                      formik.values.areaOfInterest?.devBuildRequest || false
                    }
                  />
                  <span className="ml-2 text-white">
                    Request TaskGate Dev Build
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-500 bg-white/20 border-white/30 rounded"
                    name="areaOfInterest.partnership"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.areaOfInterest?.partnership || false}
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
                    checked={formik.values.areaOfInterest?.others || false}
                  />
                  <span className="ml-2 text-white">Others</span>
                </label>
              </div>

              {/* Task Description - shown when dev build is selected */}
              {formik.values.areaOfInterest?.devBuildRequest && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                  <div>
                    <label
                      htmlFor="distributionEmail"
                      className="block text-sm font-bold mb-2 text-white"
                    >
                      Email for App Distribution Access{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="distributionEmail"
                      name="distributionEmail"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.distributionEmail}
                      className={`bg-white/20 backdrop-blur-sm border ${
                        formik.touched.distributionEmail &&
                        formik.errors.distributionEmail
                          ? "border-red-400"
                          : "border-white/30"
                      } rounded-lg w-full h-[41px] py-2 px-3 text-white placeholder-white/50 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent`}
                      placeholder="developer@yourcompany.com"
                      data-lpignore="true"
                      autoComplete="off"
                    />
                    {formik.touched.distributionEmail &&
                    formik.errors.distributionEmail ? (
                      <div className="text-red-400 text-sm mt-1">
                        {formik.errors.distributionEmail}
                      </div>
                    ) : (
                      <p className="text-white/50 text-xs mt-1">
                        We&apos;ll send you an invite to access the TaskGate dev
                        build via Firebase App Distribution.
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="providerId"
                      className="block text-sm font-bold mb-2 text-white"
                    >
                      Provider ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="providerId"
                      name="providerId"
                      onChange={(e) => {
                        formik.handleChange(e);
                        setProviderValidation({
                          checking: false,
                          exists: null,
                          error: null,
                        });
                      }}
                      onBlur={(e) => {
                        formik.handleBlur(e);
                        checkProviderExists(e.target.value);
                      }}
                      value={formik.values.providerId}
                      className={`bg-white/20 backdrop-blur-sm border ${
                        formik.touched.providerId && formik.errors.providerId
                          ? "border-red-400"
                          : providerValidation.exists === true
                          ? "border-green-400"
                          : providerValidation.exists === false
                          ? "border-red-400"
                          : "border-white/30"
                      } rounded-lg w-full h-[41px] py-2 px-3 text-white placeholder-white/50 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent font-mono`}
                      placeholder="your_app_id"
                      data-lpignore="true"
                      autoComplete="off"
                    />
                    {formik.touched.providerId && formik.errors.providerId ? (
                      <div className="text-red-400 text-sm mt-1">
                        {formik.errors.providerId}
                      </div>
                    ) : providerValidation.checking ? (
                      <p className="text-white/50 text-xs mt-1">
                        Checking provider ID...
                      </p>
                    ) : providerValidation.exists === true ? (
                      <p className="text-green-400 text-xs mt-1">
                        ✓ Provider ID found
                      </p>
                    ) : providerValidation.exists === false ? (
                      <p className="text-red-400 text-xs mt-1">
                        Provider ID not found. Please create it in the Partner
                        Portal first.
                      </p>
                    ) : providerValidation.error ? (
                      <p className="text-yellow-400 text-xs mt-1">
                        {providerValidation.error}
                      </p>
                    ) : (
                      <p className="text-white/50 text-xs mt-1">
                        Your provider ID from the Partner Portal.
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="taskDescription"
                      className="block text-sm font-bold mb-2 text-white"
                    >
                      What tasks are you planning to build?{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="taskDescription"
                      name="taskDescription"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.taskDescription}
                      rows="3"
                      className={`bg-white/20 backdrop-blur-sm border ${
                        formik.touched.taskDescription &&
                        formik.errors.taskDescription
                          ? "border-red-400"
                          : "border-white/30"
                      } rounded-lg w-full py-2 px-3 text-white placeholder-white/50 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent`}
                      placeholder="e.g., Meditation timer, Quick puzzle game, Breathing exercises..."
                    />
                    {formik.touched.taskDescription &&
                      formik.errors.taskDescription && (
                        <div className="text-red-400 text-sm mt-1">
                          {formik.errors.taskDescription}
                        </div>
                      )}
                  </div>
                  <p className="text-yellow-400/80 text-xs">
                    ⚠️ Note: We do not accept social networking (SNS) apps as
                    partner tasks.
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-purple-600 active:scale-95 hover:opacity-90 transition-all text-white font-bold h-[48px] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
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
    <Suspense
      fallback={
        <div className="min-h-screen flex w-full items-center justify-center bg-transparent">
          <InfinitySpin
            visible
            width="200"
            color="#505050"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  );
};

export default Contact;
