"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";

// Dynamic import to prevent hydration mismatch
const SignInButtonDynamic = dynamic(
  async () => (await import("@clerk/nextjs")).SignInButton,
  { ssr: false }
);

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Destinations", path: "/destinations" },
  { name: "For Vendors", path: "/vendor-register" },
  { name: "Pricing", path: "/pricing" },
  { name: "Blog", path: "/blog" },
  { name: "About Us", path: "/about" },
];

const Header = () => {
  const { user } = useUser();
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const renderActionButton = () => {
    if (!user) {
      return (
        <SignInButtonDynamic mode="modal">
          <Button size="sm" className="whitespace-nowrap !text-black">
            Get Started
          </Button>
        </SignInButtonDynamic>
      );
    }

    if (path === "/create-new-trip") {
      return (
        <Link href="/my-trips">
          <Button size="sm" className="whitespace-nowrap !text-black">
            My Trips
          </Button>
        </Link>
      );
    }

    return (
      <Link href="/create-new-trip">
        <Button size="sm" className="whitespace-nowrap text-sm px-3 sm:px-4 !text-black">
          + New Trip
        </Button>
      </Link>
    );
  };

  return (
    <>
      <header className="w-full px-4 sm:px-6 lg:px-8 py-3 md:py-4 bg-white/80 dark:bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-black/5 dark:border-white/10 shadow-sm fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <Image
              src="/logo.svg"
              alt="Miles2Go AI logo"
              width={30}
              height={30}
              className="w-7 h-7 sm:w-8 sm:h-8"
            />
            <motion.h2
              className="font-bold sm:text-lg md:text-xl text-primary text-2xl"
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Miles2Go AI
            </motion.h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 xl:gap-12 items-center">
            {menuOptions.map((menu, index) => (
              <Link
                key={index}
                href={menu.path}
                className={`group relative text-base font-medium transition-colors ${
                  path === menu.path
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary"
                }`}
              >
                {menu.name}
                <span
                  className={`pointer-events-none absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    path === menu.path ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex gap-4 items-center">
            {renderActionButton()}
            {user && <UserButton afterSignOutUrl="/" />}
          </div>

          {/* Mobile/Tablet Actions */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            {renderActionButton()}
            {user && (
              <div className="hidden sm:block">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: mobileMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-white dark:bg-neutral-900 shadow-2xl z-50 lg:hidden ${
          mobileMenuOpen ? "" : "pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-700">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Miles2Go</h3>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-1">
              {menuOptions.map((menu, index) => (
                <Link
                  key={index}
                  href={menu.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    path === menu.path
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Profile Section (Mobile only) */}
          {user && (
            <div className="p-4 border-t border-gray-200 dark:border-neutral-700 sm:hidden">
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Account</span>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-12 md:h-16" />
    </>
  );
};

export default Header;
