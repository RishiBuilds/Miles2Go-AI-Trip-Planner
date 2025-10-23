"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Sparkles,
  CheckCircle,
  Camera,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Hotel,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    number: 1,
    title: "Share Your Travel Goals",
    description: "Tell us where you want to go, when, and what you love doing.",
    icon: MapPin,
    features: [
      "Select destination",
      "Set dates",
      "Define budget",
      "Add preferences"
    ],
    color: "from-blue-100 to-blue-50",
  },
  {
    number: 2,
    title: "AI Creates Your Plan",
    description: "Our AI builds a personalized itinerary just for you in minutes.",
    icon: Sparkles,
    features: [
      "Smart scheduling",
      "Hotel recommendations",
      "Restaurant suggestions",
      "Budget optimization"
    ],
    color: "from-purple-100 to-purple-50",
  },
  {
    number: 3,
    title: "Customize & Finalize",
    description: "Make any changes you want until it's perfect for you.",
    icon: CheckCircle,
    features: [
      "Edit activities",
      "Adjust timings",
      "Add personal notes",
      "Save versions"
    ],
    color: "from-green-100 to-green-50",
  },
  {
    number: 4,
    title: "Travel With Confidence",
    description: "Access your plan anywhere and enjoy your perfectly planned trip.",
    icon: Camera,
    features: [
      "Export to PDF",
      "Sync to calendar",
      "Share with friends",
      "Get updates"
    ],
    color: "from-orange-100 to-orange-50",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get a complete itinerary in under 2 minutes",
  },
  {
    icon: Shield,
    title: "Trusted & Secure",
    description: "Your data is encrypted and never shared",
  },
  {
    icon: Clock,
    title: "Save Hours",
    description: "No more endless research and planning",
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple & Powerful
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How AI Trip Planner Works
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From idea to itinerary in 4 simple steps. Let AI do the heavy lifting while you focus on the excitement of your upcoming adventure.
          </p>
        </motion.div>

        {/* Benefits Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800"
              >
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 * index }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  isEven ? "" : "lg:grid-flow-dense"
                }`}
              >
                {/* Content */}
                <div className={isEven ? "" : "lg:col-start-2"}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full text-xl font-bold">
                      {step.number}
                    </div>
                    <div className={`p-3 bg-gradient-to-br ${step.color} rounded-lg`}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {step.description}
                  </p>

                  <ul className="space-y-3">
                    {step.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className={isEven ? "lg:col-start-2" : "lg:col-start-1"}>
                  <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${step.color} p-8`}>
                    <div className="relative h-64 w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden">
                      <Image
                        src="/placeholder.jpg"
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Step {step.number}: {step.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Intelligence
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI learns from millions of trips to create the perfect itinerary for you
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Hotel className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-Time Pricing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get up-to-date prices for hotels, activities, and transportation
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Collaborative Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share and plan trips together with friends and family in real-time
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-orange-50 dark:from-neutral-900/40 rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Experience the Magic?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the easiest way to plan their dream trips. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-new-trip">
              <Button className="bg-orange-600 hover:bg-orange-700 !text-white text-lg px-8 py-6">
                Create Your First Trip
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="border-gray-300 dark:border-neutral-700 !text-gray-900 dark:!text-gray-100 text-lg px-8 py-6">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            No credit card required • Free to start • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorksPage;