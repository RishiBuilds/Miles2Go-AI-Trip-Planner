'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { HydrationSafe } from '@/components/ui/hydration-safe';
import { motion } from 'motion/react';

const Footer = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-neutral-800">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4 }}
        className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        aria-label="Footer content"
      >
        {/* Branding & About */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.svg" alt="AI Trip Planner Logo" width={40} height={40} className="h-auto w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Miles2Go AI
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            Your intelligent travel companion. Create personalized itineraries with AI-powered recommendations for unforgettable journeys.
          </p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary flex-shrink-0" />
              <span>Worldwide Destinations</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-primary flex-shrink-0" />
              <a href="mailto:support@miles2go.ai" className="hover:text-primary transition-colors">
                support@miles2go.ai
              </a>
            </div>
          </div>
        </motion.div>
        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">Explore</h3>
          <ul className="space-y-3 text-sm">
            {[
              { href: '/', label: 'Home' },
              { href: '/destinations', label: 'Destinations' },
              { href: '/how-it-works', label: 'How It Works' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/blog', label: 'Blog' },
              { href: '/resources', label: 'Resources' },
              { href: '/about', label: 'About Us' },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Support Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">Support</h3>
          <ul className="space-y-3 text-sm">
            {[
              { href: '/faq', label: 'FAQ' },
              { href: '/testimonials', label: 'Testimonials' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/privacy', label: 'Privacy Policy' },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
        {/* Newsletter & Social */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <h3 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">Stay Connected</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Get travel tips, destination guides, and exclusive offers.
          </p>

          <HydrationSafe fallback={<div className="h-12 bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>}>
            <form
              className="mb-6"
              aria-label="Subscribe to our newsletter"
              onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.currentTarget;
                const emailInput = formEl.querySelector("input[type='email']") as HTMLInputElement;
                const email = emailInput.value;

                try {
                  (formEl.querySelector('button[type="submit"]') as HTMLButtonElement).disabled = true;
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });

                  if (!res.ok) throw new Error("Failed to subscribe");

                  setSuccessMsg("✅ Subscribed successfully!");
                  emailInput.value = "";

                  setTimeout(() => setSuccessMsg(null), 5000);
                } catch (err) {
                  setErrorMsg("❌ Subscription failed. Try again.");
                  setTimeout(() => setErrorMsg(null), 5000);
                } finally {
                  (formEl.querySelector('button[type="submit"]') as HTMLButtonElement).disabled = false;
                }
              }}
            >
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  name="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm hover:shadow-md"
                >
                  Subscribe Now
                </button>
              </div>
            </form>
            {(successMsg || errorMsg) && (
              <div className="mb-4" aria-live="polite" role="status">
                {successMsg && (
                  <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    {errorMsg}
                  </div>
                )}
              </div>
            )}
          </HydrationSafe>

          {/* Social Media */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { href: 'https://www.facebook.com/rishi-chaurasiya', icon: FaFacebook, label: 'Facebook' },
                { href: 'https://x.com/KingRishi2005', icon: FaTwitter, label: 'Twitter/X' },
                { href: 'https://www.instagram.com/rishichaurasia192', icon: FaInstagram, label: 'Instagram' },
                { href: 'https://www.linkedin.com/in/rishi-chaurasiya', icon: FaLinkedin, label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`Visit our ${social.label}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:scale-110"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Bottom */}
      <div className="relative border-t border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <HydrationSafe fallback={<span className="text-gray-600 dark:text-gray-400">&copy; 2024 Miles2Go AI. All rights reserved.</span>}>
              <p className="text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-900 dark:text-white">Miles2Go AI</span>. All rights reserved.
              </p>
            </HydrationSafe>

            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
              <a
                href="/privacy"
                className="hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              >
                Privacy
              </a>
              <span className="text-gray-300 dark:text-neutral-700">|</span>
              <a
                href="/terms"
                className="hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              >
                Terms
              </a>
              <span className="text-gray-300 dark:text-neutral-700">|</span>
              <a
                href="/contact"
                className="hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
