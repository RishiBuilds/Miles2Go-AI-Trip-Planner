"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Download,
  FileText,
  Globe,
  Shield,
  Plane,
  CreditCard,
  Phone,
  Wifi,
  Map,
  Calculator,
  Cloud,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";

const resourceCategories = [
  {
    category: "Travel Tools",
    icon: Plane,
    resources: [
      {
        name: "Flight Comparison",
        description: "Compare flight prices across multiple airlines",
        url: "https://www.skyscanner.com",
        type: "external",
      },
      {
        name: "Hotel Booking",
        description: "Find and book accommodations worldwide",
        url: "https://www.booking.com",
        type: "external",
      },
      {
        name: "Currency Converter",
        description: "Real-time exchange rates for 150+ currencies",
        url: "https://www.xe.com",
        type: "external",
      },
      {
        name: "Travel Insurance",
        description: "Compare and purchase travel insurance plans",
        url: "https://www.worldnomads.com",
        type: "external",
      },
    ],
  },
  {
    category: "Planning Resources",
    icon: Map,
    resources: [
      {
        name: "Visa Requirements",
        description: "Check visa requirements for any destination",
        url: "https://www.visahq.com",
        type: "external",
      },
      {
        name: "Weather Forecast",
        description: "Long-range weather forecasts for travel planning",
        url: "https://www.weather.com",
        type: "external",
      },
      {
        name: "Packing Checklist",
        description: "Downloadable packing list template",
        url: "/downloads/packing-checklist.pdf",
        type: "download",
      },
      {
        name: "Budget Calculator",
        description: "Estimate your trip costs by destination",
        url: "https://www.budgetyourtrip.com",
        type: "external",
      },
    ],
  },
  {
    category: "Safety & Health",
    icon: Shield,
    resources: [
      {
        name: "Travel Advisories",
        description: "Government travel warnings and safety information",
        url: "https://travel.state.gov",
        type: "external",
      },
      {
        name: "Vaccination Requirements",
        description: "Required and recommended vaccines by country",
        url: "https://wwwnc.cdc.gov/travel",
        type: "external",
      },
      {
        name: "Emergency Contacts",
        description: "International emergency numbers guide",
        url: "/downloads/emergency-contacts.pdf",
        type: "download",
      },
      {
        name: "Travel Health Insurance",
        description: "Medical coverage for international travel",
        url: "https://www.insuremytrip.com",
        type: "external",
      },
    ],
  },
  {
    category: "Communication",
    icon: Phone,
    resources: [
      {
        name: "Translation Apps",
        description: "Best apps for language translation",
        url: "https://translate.google.com",
        type: "external",
      },
      {
        name: "International SIM Cards",
        description: "Stay connected with affordable data plans",
        url: "https://www.airalo.com",
        type: "external",
      },
      {
        name: "WiFi Hotspot Finder",
        description: "Find free WiFi locations worldwide",
        url: "https://www.wifimap.io",
        type: "external",
      },
      {
        name: "Common Phrases Guide",
        description: "Essential phrases in 20+ languages",
        url: "/downloads/common-phrases.pdf",
        type: "download",
      },
    ],
  },
  {
    category: "Guides & Articles",
    icon: BookOpen,
    resources: [
      {
        name: "First-Time Traveler Guide",
        description: "Complete guide for international travel beginners",
        url: "/blog",
        type: "internal",
      },
      {
        name: "Budget Travel Tips",
        description: "How to travel more while spending less",
        url: "/blog",
        type: "internal",
      },
      {
        name: "Sustainable Travel",
        description: "Eco-friendly travel practices and tips",
        url: "/blog",
        type: "internal",
      },
      {
        name: "Solo Travel Safety",
        description: "Essential safety tips for solo travelers",
        url: "/blog",
        type: "internal",
      },
    ],
  },
];

const quickLinks = [
  { name: "TSA Guidelines", url: "https://www.tsa.gov", icon: Shield },
  { name: "Passport Services", url: "https://travel.state.gov/content/travel/en/passports.html", icon: FileText },
  { name: "Time Zone Converter", url: "https://www.timeanddate.com/worldclock/converter.html", icon: Globe },
  { name: "Luggage Restrictions", url: "https://www.iata.org/en/programs/passenger/baggage/", icon: Plane },
];

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayCategories = selectedCategory
    ? resourceCategories.filter((cat) => cat.category === selectedCategory)
    : resourceCategories;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "external":
        return <ExternalLink className="w-4 h-4" />;
      case "download":
        return <Download className="w-4 h-4" />;
      case "internal":
        return <FileText className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Travel Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Essential Travel Resources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need for a smooth and successful trip - tools, guides, and helpful links
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 hover:shadow-lg hover:border-primary transition-all"
              >
                <link.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === null
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                }`}
            >
              All Resources
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.category
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="space-y-12">
          {displayCategories.map((category, catIndex) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * catIndex }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CategoryIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.resources.map((resource, resIndex) => (
                    <a
                      key={resIndex}
                      href={resource.url}
                      target={resource.type === "external" ? "_blank" : "_self"}
                      rel={resource.type === "external" ? "noopener noreferrer" : ""}
                      className="flex items-start gap-4 p-5 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 hover:shadow-lg hover:border-primary transition-all group"
                    >
                      <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg group-hover:bg-primary/10 transition-colors">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.description}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-purple-50 to-white dark:from-neutral-900/40 rounded-2xl p-8 text-center border border-gray-100 dark:border-neutral-800"
        >
          <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Planning?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Use our AI-powered trip planner to create a personalized itinerary with all these resources integrated
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/create-new-trip">
              <Button className="bg-orange-600 hover:bg-orange-700 !text-white">
                Create Your Trip
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="border-gray-300 dark:border-neutral-700 !text-gray-900 dark:!text-gray-100">
                View FAQ
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourcesPage;
