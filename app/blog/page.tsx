"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Search, Tag } from "lucide-react";
import { motion } from "motion/react";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Travel Tips for First-Time International Travelers",
    excerpt: "Planning your first international trip? Here are the must-know tips to make your journey smooth and memorable.",
    author: "Rishi Chaurasia",
    date: "2025-01-15",
    readTime: "5 min read",
    category: "Travel Tips",
    image: "/placeholder.jpg",
    tags: ["beginner", "international", "tips"],
  },
  {
    id: 2,
    title: "How AI is Revolutionizing Travel Planning",
    excerpt: "Discover how artificial intelligence is transforming the way we plan and experience travel in 2025.",
    author: "Rishi Chaurasia",
    date: "2025-01-10",
    readTime: "7 min read",
    category: "Technology",
    image: "/placeholder.jpg",
    tags: ["AI", "technology", "innovation"],
  },
  {
    id: 3,
    title: "Budget Travel: Exploring Europe on $50 a Day",
    excerpt: "Yes, it's possible! Learn how to maximize your European adventure without breaking the bank.",
    author: "Rishi Chaurasia",
    date: "2025-01-05",
    readTime: "6 min read",
    category: "Budget Travel",
    image: "/placeholder.jpg",
    tags: ["budget", "europe", "backpacking"],
  },
  {
    id: 4,
    title: "The Ultimate Packing List for Any Destination",
    excerpt: "Never forget essentials again with our comprehensive packing checklist for all types of trips.",
    author: "Rishi Chaurasia",
    date: "2024-12-28",
    readTime: "4 min read",
    category: "Travel Tips",
    image: "/placeholder.jpg",
    tags: ["packing", "checklist", "essentials"],
  },
  {
    id: 5,
    title: "Hidden Gems: 15 Underrated Destinations for 2025",
    excerpt: "Skip the crowds and discover these amazing destinations that most travelers haven't found yet.",
    author: "Rishi Chaurasia",
    date: "2024-12-20",
    readTime: "8 min read",
    category: "Destinations",
    image: "/placeholder.jpg",
    tags: ["destinations", "hidden gems", "2025"],
  },
  {
    id: 6,
    title: "Sustainable Travel: How to Reduce Your Carbon Footprint",
    excerpt: "Travel responsibly with these eco-friendly tips that help protect the planet while exploring it.",
    author: "Rishi Chaurasia",
    date: "2024-12-15",
    readTime: "6 min read",
    category: "Sustainable Travel",
    image: "/placeholder.jpg",
    tags: ["sustainability", "eco-friendly", "responsible"],
  },
];

const categories = ["All", "Travel Tips", "Technology", "Budget Travel", "Destinations", "Sustainable Travel"];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Travel Blog & Tips
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Expert advice, destination guides, and travel inspiration to help you plan your next adventure
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-800"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                      Read More →
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No articles found. Try adjusting your search or filter.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-orange-50 to-white dark:from-neutral-900/40 rounded-2xl p-8 text-center border border-gray-100 dark:border-neutral-800"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Plan Your Next Adventure?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Use our AI-powered trip planner to create personalized itineraries in minutes
          </p>
          <Link href="/create-new-trip">
            <Button className="px-6 py-3 rounded-full text-base font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-md hover:shadow-lg">
              Start Planning Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
