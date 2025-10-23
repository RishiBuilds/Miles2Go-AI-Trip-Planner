"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Quote, ThumbsUp, MapPin, Calendar } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    id: 1,
    name: "Raj Shamani",
    location: "Pune, Maharashtra",
    avatar: "/placeholder.jpg",
    rating: 5,
    date: "January 2025",
    trip: "2-week Europe Tour",
    title: "Best Travel Planning Experience Ever!",
    review: "AI Trip Planner completely transformed how I plan my vacations. I was planning a complex 2-week trip through 5 European countries and was overwhelmed. The AI created a perfect itinerary in minutes, including hidden gems I never would have found on my own. The hotel recommendations were spot-on for my budget, and the day-by-day schedule was realistic and well-paced. Highly recommend!",
    helpful: 127,
    verified: true,
  },
  {
    id: 2,
    name: "Ankit Rajpurohit",
    location: "Jaipur, Rajasthan",
    avatar: "/placeholder.jpg",
    rating: 5,
    date: "December 2024",
    trip: "Japan Adventure",
    title: "Saved Me Hours of Research",
    review: "As someone who usually spends weeks researching trips, this tool was a game-changer. The AI understood my preferences for authentic local experiences and suggested amazing restaurants and activities. The real-time pricing feature helped me stay within budget. My Japan trip was absolutely perfect thanks to this platform!",
    helpful: 94,
    verified: true,
  },
  {
    id: 3,
    name: "Megh Bari",
    location: "Dahanu, Maharashtra",
    avatar: "/placeholder.jpg",
    rating: 4,
    date: "November 2024",
    trip: "Bali Honeymoon",
    title: "Perfect for Couples Planning",
    review: "My fiancé and I used this for our honeymoon planning, and it was fantastic. The AI suggested romantic restaurants, beautiful beaches, and even included spa recommendations. The only reason I'm giving 4 stars instead of 5 is that some activities were a bit touristy, but we easily customized them. Overall, an excellent tool!",
    helpful: 82,
    verified: true,
  },
  {
    id: 4,
    name: "Abhishek Sharma",
    location: "Lahore, Punjab",
    avatar: "/placeholder.jpg",
    rating: 5,
    date: "October 2024",
    trip: "Family Trip to Orlando",
    title: "Great for Family Travel",
    review: "Planning a trip with two kids can be stressful, but this made it so easy. The AI considered our children's ages and suggested family-friendly activities, restaurants with kids' menus, and hotels with pools. The itinerary had perfect timing with breaks built in. Our Orlando vacation was stress-free and fun for everyone!",
    helpful: 156,
    verified: true,
  },
  {
    id: 5,
    name: "Priya Patel",
    location: "Mumbai, India",
    avatar: "/placeholder.jpg",
    rating: 5,
    date: "September 2024",
    trip: "Solo Backpacking Southeast Asia",
    title: "Solo Traveler's Dream Tool",
    review: "As a solo female traveler, safety is my top priority. The AI recommended safe neighborhoods, well-reviewed hostels, and even suggested group tours for certain activities. The budget breakdown was incredibly helpful for my backpacking trip. I felt confident and prepared throughout my journey!",
    helpful: 203,
    verified: true,
  },
  {
    id: 6,
    name: "Sunny",
    location: "Toronto, Canada",
    avatar: "/placeholder.jpg",
    rating: 4,
    date: "August 2024",
    trip: "Business + Leisure in Dubai",
    title: "Efficient for Business Travelers",
    review: "I had a business conference in Dubai and wanted to extend my stay for leisure. The AI perfectly balanced my work schedule with sightseeing. It suggested activities near my hotel and optimized my free time. The only improvement would be better integration with business travel tools. Still, highly recommended!",
    helpful: 67,
    verified: true,
  },
];

const stats = [
  { label: "Total Reviews", value: "12,450+" },
  { label: "Average Rating", value: "4.8/5" },
  { label: "Verified Travelers", value: "98%" },
  { label: "Would Recommend", value: "96%" },
];

const TestimonialsPage = () => {
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");

  const sortedTestimonials = [...testimonials].sort((a, b) => {
    if (sortBy === "helpful") {
      return b.helpful - a.helpful;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-green-700" />
            Trusted by Travelers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real stories from real travelers who used AI Trip Planner for their adventures
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 text-center border border-gray-200 dark:border-neutral-800"
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-8"
        >
          <button
            onClick={() => setSortBy("recent")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${sortBy === "recent"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
          >
            Most Recent
          </button>
          <button
            onClick={() => setSortBy("helpful")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${sortBy === "helpful"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
          >
            Most Helpful
          </button>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-gray-200 dark:border-neutral-800 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                      {testimonial.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-gray-300 dark:text-neutral-700" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 dark:text-neutral-700"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Trip Info */}
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{testimonial.date}</span>
                </div>
                <span className="text-primary font-medium">{testimonial.trip}</span>
              </div>

              {/* Review */}
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {testimonial.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                {testimonial.review}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({testimonial.helpful})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-green-50 to-white dark:from-neutral-900/40 rounded-2xl p-8 text-center border border-gray-100 dark:border-neutral-800"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Create Your Own Success Story?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of happy travelers who have discovered the easiest way to plan their dream trips
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/create-new-trip">
              <Button className="px-6 py-3 rounded-full text-base font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-md hover:shadow-lg">
                Start Planning Your Trip
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="px-6 py-3 rounded-full text-base font-semibold text-white bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-950 transition-all duration-300 shadow-md hover:shadow-xl">
              View Pricing
            </Button>
          </Link>
      </div>
    </motion.div>
      </div >
    </div >
  );
};

export default TestimonialsPage;
