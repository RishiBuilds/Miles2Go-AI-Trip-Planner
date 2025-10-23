"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useParams } from "next/navigation";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Travel Tips for First-Time International Travelers",
    excerpt: "Planning your first international trip? Here are the must-know tips to make your journey smooth and memorable.",
    content: `
      <h2>Introduction</h2>
      <p>Traveling internationally for the first time can be both exciting and overwhelming. With proper preparation and the right mindset, your first international adventure can be the trip of a lifetime. Here are 10 essential tips to help you navigate your journey with confidence.</p>
      
      <h2>1. Check Your Passport and Visa Requirements Early</h2>
      <p>Make sure your passport is valid for at least six months beyond your planned return date. Research visa requirements for your destination country well in advance, as some visas can take weeks to process.</p>
      
      <h2>2. Get Travel Insurance</h2>
      <p>Never skip travel insurance. It protects you against unexpected medical emergencies, trip cancellations, lost luggage, and other unforeseen circumstances. The peace of mind is worth the investment.</p>
      
      <h2>3. Notify Your Bank and Credit Card Companies</h2>
      <p>Inform your financial institutions about your travel plans to avoid having your cards frozen due to suspicious activity. Also, check if your cards have foreign transaction fees.</p>
      
      <h2>4. Make Copies of Important Documents</h2>
      <p>Keep digital and physical copies of your passport, visa, travel insurance, and other important documents. Store them separately from the originals.</p>
      
      <h2>5. Learn Basic Phrases in the Local Language</h2>
      <p>Even knowing simple phrases like "hello," "thank you," and "where is the bathroom?" can go a long way in making connections and showing respect for the local culture.</p>
      
      <h2>6. Pack Smart and Light</h2>
      <p>Overpacking is a common mistake. Stick to versatile clothing items that can be mixed and matched. Remember, you can always buy essentials at your destination if needed.</p>
      
      <h2>7. Research Local Customs and Etiquette</h2>
      <p>Understanding local customs helps you avoid unintentional offense and shows respect for the culture you're visiting. Research dress codes, tipping practices, and social norms.</p>
      
      <h2>8. Keep Some Local Currency Handy</h2>
      <p>While cards are widely accepted, having some local currency for small purchases, tips, and emergencies is essential. Exchange a small amount before you leave or at the airport upon arrival.</p>
      
      <h2>9. Stay Connected</h2>
      <p>Research international phone plans or consider getting a local SIM card. Having reliable internet access helps with navigation, translation, and staying in touch with loved ones.</p>
      
      <h2>10. Be Open-Minded and Flexible</h2>
      <p>Things won't always go according to plan, and that's okay! Some of the best travel experiences come from unexpected detours and spontaneous decisions. Embrace the adventure!</p>
      
      <h2>Conclusion</h2>
      <p>International travel is an incredible opportunity for personal growth and cultural exchange. With these tips in mind, you're well-prepared to embark on your first international adventure. Safe travels!</p>
    `,
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
    content: `
      <h2>The AI Revolution in Travel</h2>
      <p>Artificial Intelligence is fundamentally changing how we plan, book, and experience travel. From personalized recommendations to real-time assistance, AI is making travel more accessible, efficient, and enjoyable than ever before.</p>
      
      <h2>Personalized Itinerary Generation</h2>
      <p>AI-powered platforms can now create customized travel itineraries in minutes, taking into account your preferences, budget, travel style, and even dietary restrictions. These systems learn from millions of traveler experiences to suggest the perfect activities and destinations for you.</p>
      
      <h2>Smart Price Predictions</h2>
      <p>Machine learning algorithms analyze historical pricing data to predict the best times to book flights and hotels, potentially saving travelers hundreds of dollars per trip.</p>
      
      <h2>Real-Time Language Translation</h2>
      <p>AI-powered translation apps have made language barriers almost obsolete, allowing travelers to communicate effectively in any country.</p>
      
      <h2>The Future of Travel Planning</h2>
      <p>As AI continues to evolve, we can expect even more innovative solutions that make travel planning effortless and experiences more memorable.</p>
    `,
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
    content: `
      <h2>Europe on a Budget</h2>
      <p>Traveling through Europe doesn't have to drain your savings. With smart planning and a few insider tips, you can explore this incredible continent on just $50 a day.</p>
      
      <h2>Accommodation Strategies</h2>
      <p>Stay in hostels, use Couchsurfing, or book budget hotels outside city centers. Consider overnight trains to save on both accommodation and transportation.</p>
      
      <h2>Eating Like a Local</h2>
      <p>Skip tourist restaurants and eat where locals eat. Visit markets, cook your own meals when possible, and take advantage of free breakfast at hostels.</p>
      
      <h2>Free Activities and Attractions</h2>
      <p>Many museums offer free entry on certain days. Walking tours, parks, and architectural wonders are free to enjoy. Research free activities in each city you visit.</p>
      
      <h2>Transportation Tips</h2>
      <p>Use budget airlines, buses, and trains. Consider getting a rail pass if you're visiting multiple countries. Walk or bike whenever possible.</p>
    `,
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
    content: `
      <h2>Master Packing List</h2>
      <p>Packing efficiently is an art. This comprehensive guide ensures you never forget the essentials while avoiding overpacking.</p>
      
      <h2>Documents and Money</h2>
      <ul>
        <li>Passport and copies</li>
        <li>Visa documents</li>
        <li>Travel insurance papers</li>
        <li>Credit cards and cash</li>
        <li>Driver's license</li>
      </ul>
      
      <h2>Clothing Essentials</h2>
      <p>Pack versatile, mix-and-match items. Choose quick-dry fabrics and layer for different weather conditions.</p>
      
      <h2>Toiletries and Health</h2>
      <p>Travel-sized toiletries, medications, first-aid kit, and any prescription medicines with documentation.</p>
      
      <h2>Electronics</h2>
      <p>Phone, chargers, power bank, universal adapter, and any necessary cables.</p>
    `,
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
    content: `
      <h2>Off the Beaten Path</h2>
      <p>While everyone flocks to Paris, Rome, and Barcelona, these hidden gems offer equally incredible experiences without the tourist crowds.</p>
      
      <h2>1. Albania - The Mediterranean's Best-Kept Secret</h2>
      <p>Stunning beaches, ancient ruins, and incredibly affordable prices make Albania a must-visit destination.</p>
      
      <h2>2. Georgia - Where Europe Meets Asia</h2>
      <p>Rich history, incredible food, and warm hospitality in the Caucasus Mountains.</p>
      
      <h2>3. Slovenia - Europe's Green Jewel</h2>
      <p>From Lake Bled to Ljubljana, Slovenia offers natural beauty and charming cities.</p>
      
      <p>...and 12 more incredible destinations waiting to be discovered!</p>
    `,
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
    content: `
      <h2>Traveling Sustainably</h2>
      <p>Tourism has a significant environmental impact, but we can all make choices that reduce our carbon footprint while still enjoying incredible travel experiences.</p>
      
      <h2>Choose Eco-Friendly Transportation</h2>
      <p>Opt for trains over planes when possible, use public transportation, walk, or bike at your destination.</p>
      
      <h2>Support Local and Sustainable Businesses</h2>
      <p>Stay at eco-certified hotels, eat at local restaurants, and buy from local artisans.</p>
      
      <h2>Reduce Plastic Waste</h2>
      <p>Bring a reusable water bottle, shopping bag, and utensils. Say no to single-use plastics.</p>
      
      <h2>Respect Wildlife and Nature</h2>
      <p>Observe animals from a distance, stay on marked trails, and never litter.</p>
    `,
    author: "Rishi Chaurasia",
    date: "2024-12-15",
    readTime: "6 min read",
    category: "Sustainable Travel",
    image: "/placeholder.jpg",
    tags: ["sustainability", "eco-friendly", "responsible"],
  },
];

const BlogPostPage = () => {
  const params = useParams();
  const postId = parseInt(params.id as string);
  const post = blogPosts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <Link href="/blog">
            <Button className="px-6 py-3 rounded-full text-base font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-md hover:shadow-lg">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 text-gray-600 dark:text-gray-400 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Category Badge */}
          <div className="mb-4">
            <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-ul:text-gray-700 dark:prose-ul:text-gray-300
              prose-li:marker:text-orange-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter((p) => p.id !== postId && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {relatedPost.readTime}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
