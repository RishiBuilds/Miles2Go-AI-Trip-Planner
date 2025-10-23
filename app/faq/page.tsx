"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqCategories = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How does AI Trip Planner work?",
        answer: "AI Trip Planner uses advanced artificial intelligence to create personalized travel itineraries. Simply tell us your destination, travel dates, budget, and preferences, and our AI will generate a detailed day-by-day plan including hotels, activities, restaurants, and transportation options.",
      },
      {
        question: "Is AI Trip Planner free to use?",
        answer: "We offer a free tier that allows you to create basic trip itineraries. For advanced features like real-time pricing, unlimited trips, and premium support, check out our pricing plans. All users get their first trip completely free!",
      },
      {
        question: "Do I need to create an account?",
        answer: "Yes, creating an account allows you to save your trips, access them from any device, and receive personalized recommendations. Sign up is quick and easy using your email or social media accounts.",
      },
    ],
  },
  {
    category: "Trip Planning",
    questions: [
      {
        question: "How accurate are the AI-generated itineraries?",
        answer: "Our AI is trained on millions of travel data points and real traveler experiences. While we strive for high accuracy, we always recommend reviewing and customizing your itinerary based on your personal preferences and current conditions at your destination.",
      },
      {
        question: "Can I customize my itinerary after it's generated?",
        answer: "Absolutely! Every itinerary is fully customizable. You can add, remove, or rearrange activities, change hotels, adjust timings, and add personal notes. Your changes are saved automatically.",
      },
      {
        question: "How far in advance should I plan my trip?",
        answer: "We recommend planning at least 2-3 months in advance for international trips and 1 month for domestic travel. This gives you better options for flights and accommodations. However, our AI can help with last-minute planning too!",
      },
      {
        question: "Can I plan trips for groups?",
        answer: "Yes! You can specify the number of travelers when creating your trip. Our AI will adjust recommendations for group activities, accommodation options, and budget calculations accordingly.",
      },
    ],
  },
  {
    category: "Pricing & Payments",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various local payment methods depending on your region. All transactions are secure and encrypted.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your billing period.",
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 14 days of purchase for a full refund.",
      },
    ],
  },
  {
    category: "Features & Functionality",
    questions: [
      {
        question: "Can I access my trips offline?",
        answer: "Yes! Premium users can download their itineraries as PDF files for offline access. You can also export your trips to various formats including Google Calendar and Apple Calendar.",
      },
      {
        question: "Does the AI consider my dietary restrictions?",
        answer: "Yes, you can specify dietary preferences and restrictions (vegetarian, vegan, gluten-free, etc.) when creating your trip. The AI will recommend restaurants and food experiences that match your requirements.",
      },
      {
        question: "Can I share my itinerary with travel companions?",
        answer: "Absolutely! You can share your trip via email, generate a shareable link, or collaborate in real-time with other users. Everyone can view and suggest changes to the itinerary.",
      },
      {
        question: "Do you provide real-time pricing for hotels and flights?",
        answer: "Premium users get access to real-time pricing from our travel partners. We integrate with major booking platforms to show you current prices and availability, though we don't handle bookings directly.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        question: "How do you protect my personal information?",
        answer: "We take privacy seriously. All data is encrypted in transit and at rest. We never sell your personal information to third parties. Read our Privacy Policy for complete details on how we handle your data.",
      },
      {
        question: "Can I delete my account and data?",
        answer: "Yes, you can delete your account at any time from your account settings. This will permanently remove all your personal data and trip information from our servers.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        question: "How can I contact customer support?",
        answer: "You can reach our support team via email, live chat (available for premium users), or through our contact form. We typically respond within 24 hours on business days.",
      },
      {
        question: "Do you offer travel insurance?",
        answer: "We don't provide travel insurance directly, but we can recommend trusted insurance partners. We always advise travelers to purchase comprehensive travel insurance before their trip.",
      },
      {
        question: "What if something goes wrong during my trip?",
        answer: "While we provide planning tools, we're not responsible for travel disruptions. However, premium users have access to 24/7 support for itinerary adjustments and emergency recommendations.",
      },
    ],
  },
];

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const displayCategories = selectedCategory
    ? faqCategories.filter((cat) => cat.category === selectedCategory)
    : faqCategories;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about AI Trip Planner
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            >
              All Topics
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.category
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {displayCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * catIndex }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openItems[key];

                  return (
                    <div
                      key={qIndex}
                      className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(catIndex, qIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-white dark:from-neutral-900/40 rounded-2xl p-8 text-center border border-gray-100 dark:border-neutral-800"
        >
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button className="px-6 py-3 rounded-full text-base font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-md hover:shadow-lg">
                Contact Support
              </Button>
            </Link>
            <Link href="/create-new-trip">
              <Button className="px-6 py-3 rounded-full text-base font-semibold text-white bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-950 transition-all duration-300 shadow-md hover:shadow-xl">
                Start Planning
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
