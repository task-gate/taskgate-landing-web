"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "./Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isActive = (pathname) => {
    return router.pathname === pathname
      ? "text-silver"
      : "text-white hover:text-gray-300 transition-colors duration-300";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full min-h-[80px] z-50 bg-black/30 backdrop-blur-lg border-b border-white/10"
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <article className="p-4 px-5 md:px-[5%] w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center cursor-pointer font-ubuntu text-white md:text-xl font-bold"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/app_logo.svg"
            alt="TaskGate Logo"
            width={32}
            height={32}
            className="mr-2"
            priority
          />
          TaskGate
        </Link>

        <ul className="hidden md:flex space-x-12">
          <li>
            <Link
              href="/features"
              className={isActive("/features")}
              onClick={toggleMenu}
            >
              Features
            </Link>
          </li>
          <li>
            <Link href="/about-us" className={isActive("/about-us")}>
              About
            </Link>
          </li>
          <li>
            <Link href="/partnership" className={isActive("/partnership")}>
              Partnership
            </Link>
          </li>
          {/* <li>
            <Link href="/premium" className={isActive("/premium")}>
              Premium
            </Link>
          </li> */}
          <li>
            <Link href="/contact-us" className={isActive("/contact-us")}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <article className="md:hidden flex items-center justify-between w-[50%]">
          <motion.button
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </motion.button>
        </article>
      </article>

      {/* Mobile Menu */}
      <motion.article
        className={`md:hidden ${
          isOpen
            ? "fixed block inset-0 min-h-[100vh] top-[80px] transform translate-y-0 transition-transform duration-300 w-full bg-black/90 backdrop-blur-xl"
            : "fixed hidden inset-0 transform -translate-y-full transition-transform duration-300"
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
        transition={{ duration: 0.3 }}
      >
        <ul className="flex text-secondary flex-col items-center pt-28 space-y-14">
          <li className="text-3xl">
            <Link
              href="/features"
              className={isActive("/features")}
              onClick={toggleMenu}
            >
              Features
            </Link>
          </li>
          <li className="text-3xl">
            <Link
              href="/about-us"
              className={isActive("/about-us")}
              onClick={toggleMenu}
            >
              About
            </Link>
          </li>
          <li className="text-3xl">
            <Link
              href="/partnership"
              className={isActive("/partnership")}
              onClick={toggleMenu}
            >
              Partnership
            </Link>
          </li>
          {/* <li className="text-3xl">
            <Link
              href="/premium"
              className={isActive("/premium")}
              onClick={toggleMenu}
            >
              Premium
            </Link>
          </li> */}
          <li className="text-3xl">
            <Link
              href="/contact-us"
              className={isActive("/contact-us")}
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </li>
        </ul>
      </motion.article>
    </motion.nav>
  );
};

export default Navbar;
