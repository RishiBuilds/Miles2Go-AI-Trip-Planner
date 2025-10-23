"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { HydrationSafe } from "@/components/ui/hydration-safe";
import { motion } from "motion/react";

export function PopularCityList() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full bg-white dark:bg-neutral-950 py-8 px-4">
      <motion.div
        className="max-w-7xl mx-auto text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200/60 bg-blue-50/60 dark:bg-blue-950/20 dark:border-blue-900/40 backdrop-blur-sm mb-4"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">Explore the World</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3"
        >
          Popular Destinations to Visit
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Discover destinations you'll love. Let <span className="font-semibold">AI</span> craft a tailored itinerary with must‑see spots, stays, and experiences.
        </motion.p>
      </motion.div>

      {/* Carousel */}
      <HydrationSafe
        fallback={
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 md:h-[36rem] rounded-3xl bg-gray-100 dark:bg-neutral-900 overflow-hidden">
                  <div className="h-full w-full animate-pulse bg-gradient-to-b from-gray-200/70 to-gray-100 dark:from-neutral-800 dark:to-neutral-900" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <Carousel items={cards} />
      </HydrationSafe>
    </div>
  );
}

const DestinationContent = ({
  category,
  description,
  bestTime,
  attractions,
  tips
}: {
  category: string;
  description: string;
  bestTime: string;
  attractions: string[];
  tips: string[];
}) => {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-6 md:p-8 rounded-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">
          About {category}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Best Time to Visit */}
      <div className="bg-blue-50 dark:bg-blue-950/30 p-6 md:p-8 rounded-2xl border border-blue-100 dark:border-blue-900">
        <h3 className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Best Time to Visit
        </h3>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base">
          {bestTime}
        </p>
      </div>

      {/* Top Attractions */}
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-6 md:p-8 rounded-2xl">
        <h3 className="text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
          Top Attractions
        </h3>
        <ul className="space-y-3">
          {attractions.map((attraction, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-primary text-lg">•</span>
              <span className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
                {attraction}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Travel Tips */}
      <div className="bg-green-50 dark:bg-green-950/30 p-6 md:p-8 rounded-2xl border border-green-100 dark:border-green-900">
        <h3 className="text-lg md:text-xl font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Travel Tips
        </h3>
        <ul className="space-y-2">
          {tips.map((tip, idx) => (
            <li key={idx} className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const destinationsData = [
  {
    category: "Nepal",
    title: "Mystical Himalayas – Kathmandu, Pokhara & Everest Views",
    src: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmVwYWx8ZW58MHx8MHx8fDA%3D",
    description: "Nepal is a landlocked country in South Asia, home to eight of the world's ten tallest mountains, including Mount Everest. Experience ancient temples, vibrant culture, and breathtaking Himalayan landscapes. From the bustling streets of Kathmandu to the serene lakes of Pokhara, Nepal offers an unforgettable journey.",
    bestTime: "October to December (autumn) and March to May (spring) offer clear skies and moderate temperatures, perfect for trekking and mountain views.",
    attractions: [
      "Mount Everest Base Camp - Trek to the base of the world's highest peak",
      "Kathmandu Durbar Square - UNESCO World Heritage Site with ancient palaces",
      "Pokhara - Gateway to the Annapurna region with stunning lake views",
      "Chitwan National Park - Wildlife safari to spot rhinos and tigers",
      "Swayambhunath (Monkey Temple) - Ancient Buddhist stupa with panoramic city views"
    ],
    tips: [
      "Obtain a visa on arrival or apply online before traveling",
      "Acclimatize properly if planning high-altitude treks",
      "Respect local customs and dress modestly when visiting temples",
      "Try local dishes like dal bhat, momos, and Newari cuisine"
    ],
  },
  {
    category: "Paris, France",
    title: "Explore the City of Lights - Eiffel Tower, Louvre & more",
    src: "https://images.unsplash.com/photo-1566555374250-e99b902bcdbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8UGFyaXMlMkMlMjBGcmFuY2V8ZW58MHx8MHx8fDA%3D",
    description: "Paris, the capital of France, is renowned for its art, fashion, gastronomy, and culture. The City of Light captivates visitors with its iconic landmarks, world-class museums, charming cafés, and romantic ambiance along the Seine River.",
    bestTime: "April to June and September to October offer pleasant weather and fewer crowds. Spring brings blooming gardens while autumn offers golden foliage.",
    attractions: [
      "Eiffel Tower - Iconic iron lattice tower with stunning city views",
      "Louvre Museum - World's largest art museum, home to the Mona Lisa",
      "Notre-Dame Cathedral - Gothic masterpiece on Île de la Cité",
      "Champs-Élysées & Arc de Triomphe - Famous avenue and monument",
      "Montmartre & Sacré-Cœur - Artistic hilltop neighborhood with basilica"
    ],
    tips: [
      "Purchase museum passes to skip long queues",
      "Learn basic French phrases - locals appreciate the effort",
      "Use the efficient Metro system for getting around",
      "Enjoy café culture and try authentic French pastries"
    ],
  },
  {
    category: "India",
    title: "Colors of Culture - Taj Mahal, Jaipur & Kerala Backwaters",
    src: "https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEluZGlhfGVufDB8fDB8fHww",
    description: "India is a vast South Asian country with diverse terrain, from Himalayan peaks to Indian Ocean coastline. Experience 5,000 years of history, vibrant festivals, spiritual traditions, and incredible cuisine across this land of contrasts and colors.",
    bestTime: "October to March offers cooler weather ideal for exploring. Avoid monsoon season (June-September) in most regions.",
    attractions: [
      "Taj Mahal, Agra - Iconic white marble mausoleum and UNESCO World Heritage Site",
      "Jaipur (Pink City) - Amber Fort, City Palace, and vibrant bazaars",
      "Kerala Backwaters - Serene houseboat cruises through palm-lined canals",
      "Varanasi - Ancient spiritual city on the banks of the Ganges",
      "Goa Beaches - Tropical paradise with Portuguese colonial heritage"
    ],
    tips: [
      "Dress modestly, especially when visiting religious sites",
      "Stay hydrated and be cautious with street food initially",
      "Bargain at markets but be respectful",
      "Book trains and popular attractions in advance"
    ],
  },
  {
    category: "New York, USA",
    title: "Experience NYC - Times Square, Central Park, Broadway",
    src: "https://images.unsplash.com/photo-1701750131051-8f1753498688?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TmV3JTIwWW9yayUyQyUyMFVTQXxlbnwwfHwwfHx8MA%3D%3D",
    description: "New York City, the city that never sleeps, is a global hub of culture, finance, and entertainment. From towering skyscrapers to world-class museums, diverse neighborhoods to Broadway shows, NYC offers endless experiences in the heart of America.",
    bestTime: "April to June and September to November offer mild weather and vibrant seasonal colors. Avoid extreme summer heat and winter cold.",
    attractions: [
      "Statue of Liberty & Ellis Island - Iconic symbol of freedom",
      "Central Park - 843-acre urban oasis in Manhattan",
      "Times Square - Bright lights and Broadway theaters",
      "Metropolitan Museum of Art - One of the world's finest art collections",
      "Brooklyn Bridge - Historic suspension bridge with skyline views"
    ],
    tips: [
      "Use the subway system - it's the fastest way to get around",
      "Book Broadway tickets in advance or try TKTS for discounts",
      "Walk across neighborhoods to experience the city's diversity",
      "Try iconic NYC foods: pizza, bagels, and hot dogs"
    ],
  },
  {
    category: "Tokyo, Japan",
    title: "Discover Tokyo - Shibuya, Cherry Blossoms, Temples",
    src: "https://images.unsplash.com/photo-1726809348586-66f0e72d96b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
    description: "Tokyo, Japan's bustling capital, seamlessly blends ultramodern and traditional. From neon-lit skyscrapers to historic temples, cutting-edge technology to ancient traditions, Tokyo offers a unique cultural experience with world-class cuisine and impeccable hospitality.",
    bestTime: "March to May (cherry blossom season) and September to November (autumn foliage) offer beautiful weather and stunning natural displays.",
    attractions: [
      "Shibuya Crossing - World's busiest pedestrian intersection",
      "Senso-ji Temple - Tokyo's oldest Buddhist temple in Asakusa",
      "Meiji Shrine - Peaceful Shinto shrine in a forested area",
      "Tokyo Skytree - Tallest structure in Japan with panoramic views",
      "Tsukiji Outer Market - Fresh seafood and authentic Japanese street food"
    ],
    tips: [
      "Get a JR Pass for unlimited train travel",
      "Learn basic Japanese etiquette and phrases",
      "Cash is still widely used - carry yen",
      "Experience a traditional tea ceremony and stay in a ryokan"
    ],
  },
  {
    category: "Rome, Italy",
    title: "Walk through History - Colosseum, Vatican, Roman Forum",
    src: "https://plus.unsplash.com/premium_photo-1661962277645-d490f3f3a941?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fFJvbWUlMkMlMjBJdGFseXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Rome, the Eternal City, is a living museum where ancient ruins stand alongside Renaissance masterpieces. With nearly 3,000 years of history, world-class art, incredible cuisine, and vibrant street life, Rome captivates every visitor.",
    bestTime: "April to June and September to October offer pleasant weather and manageable crowds. Avoid the intense summer heat and peak tourist season.",
    attractions: [
      "Colosseum - Ancient amphitheater and iconic symbol of Rome",
      "Vatican City - St. Peter's Basilica, Sistine Chapel, and Vatican Museums",
      "Roman Forum - Heart of ancient Rome with impressive ruins",
      "Trevi Fountain - Baroque masterpiece where wishes come true",
      "Pantheon - Best-preserved ancient Roman building with stunning dome"
    ],
    tips: [
      "Book skip-the-line tickets for major attractions in advance",
      "Dress modestly for Vatican and churches (covered shoulders and knees)",
      "Enjoy aperitivo hour and authentic Roman cuisine",
      "Wear comfortable shoes - Rome is best explored on foot"
    ],
  },
  {
    category: "Dubai, UAE",
    title: "Luxury and Innovation - Burj Khalifa, Desert Safari",
    src: "https://images.unsplash.com/photo-1671618802338-682e248b48e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHViYWklMjB1YWV8ZW58MHx8MHx8fDA%3D",
    description: "Dubai is a futuristic metropolis in the United Arab Emirates, known for luxury shopping, ultramodern architecture, and vibrant nightlife. From the world's tallest building to man-made islands, Dubai pushes boundaries while honoring Emirati heritage.",
    bestTime: "November to March offers pleasant weather (20-30°C). Avoid the scorching summer months (June-August) when temperatures exceed 40°C.",
    attractions: [
      "Burj Khalifa - World's tallest building with observation decks",
      "Dubai Mall - Massive shopping center with aquarium and ice rink",
      "Palm Jumeirah - Iconic man-made island with luxury resorts",
      "Dubai Marina - Waterfront district with dining and entertainment",
      "Desert Safari - Dune bashing, camel rides, and Bedouin-style dinner"
    ],
    tips: [
      "Respect local customs and dress modestly in public areas",
      "Use the efficient Metro system or taxis for transportation",
      "Stay hydrated and use sunscreen year-round",
      "Book desert safaris and attraction tickets through reputable operators"
    ],
  },
];

const data = destinationsData.map((dest) => ({
  category: dest.category,
  title: dest.title,
  src: dest.src,
  content: (
    <DestinationContent
      category={dest.category}
      description={dest.description}
      bestTime={dest.bestTime}
      attractions={dest.attractions}
      tips={dest.tips}
    />
  ),
}));
