"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Star, TrendingUp, Search, Globe, DollarSign, Calendar, Plane, Hotel, Utensils, Camera, Heart, Info, X, Clock, Shield, CreditCard, Check, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/lib/toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";


const destinations = [
  {
    id: 1,
    name: "Paris, France",
    country: "France",
    region: "Europe",
    description: "The City of Light offers romance, art, and world-class cuisine with iconic landmarks at every corner",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4.8,
    reviews: 12847,
    popularMonths: "Apr-Oct",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Arc de Triomphe"],
    trending: true,
    avgBudget: "$150-300/day",
    currency: "EUR",
    language: "French",
    timezone: "CET (UTC+1)",
    bestFor: ["Couples", "Art Lovers", "Foodies"],
    activities: ["Museums", "Fine Dining", "River Cruises", "Shopping"],
    avgTemp: "15-25°C",
    flightTime: "7-9 hrs from US",
    visaRequired: "Schengen Visa",
    safety: "Very Safe",
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    country: "Japan",
    region: "Asia",
    description: "A perfect blend of ancient traditions and cutting-edge technology, where temples meet skyscrapers",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    rating: 4.9,
    reviews: 15632,
    popularMonths: "Mar-May, Sep-Nov",
    highlights: ["Shibuya Crossing", "Mount Fuji", "Senso-ji Temple", "Tokyo Skytree"],
    trending: true,
    avgBudget: "$120-250/day",
    currency: "JPY",
    language: "Japanese",
    timezone: "JST (UTC+9)",
    bestFor: ["Tech Enthusiasts", "Culture Seekers", "Foodies"],
    activities: ["Temple Visits", "Sushi Making", "Shopping", "Cherry Blossom Viewing"],
    avgTemp: "10-28°C",
    flightTime: "12-14 hrs from US",
    visaRequired: "Visa-free for 90 days",
    safety: "Extremely Safe",
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    country: "Indonesia",
    region: "Asia",
    description: "Tropical paradise with stunning beaches, lush rice terraces, and rich spiritual culture",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.7,
    reviews: 9821,
    popularMonths: "Apr-Oct",
    highlights: ["Ubud Rice Terraces", "Tanah Lot", "Seminyak Beach", "Tegallalang"],
    trending: false,
    avgBudget: "$50-120/day",
    currency: "IDR",
    language: "Indonesian, Balinese",
    timezone: "WITA (UTC+8)",
    bestFor: ["Beach Lovers", "Yogis", "Digital Nomads"],
    activities: ["Surfing", "Yoga Retreats", "Temple Tours", "Spa & Wellness"],
    avgTemp: "26-30°C",
    flightTime: "18-22 hrs from US",
    visaRequired: "Visa on Arrival",
    safety: "Safe",
  },
  {
    id: 4,
    name: "New York City, USA",
    country: "USA",
    region: "Americas",
    description: "The city that never sleeps, filled with iconic landmarks, world-class museums, and diverse neighborhoods",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    rating: 4.6,
    reviews: 18943,
    popularMonths: "Apr-Jun, Sep-Nov",
    highlights: ["Statue of Liberty", "Central Park", "Times Square", "Brooklyn Bridge"],
    trending: true,
    avgBudget: "$200-400/day",
    currency: "USD",
    language: "English",
    timezone: "EST (UTC-5)",
    bestFor: ["City Explorers", "Shopaholics", "Theater Fans"],
    activities: ["Broadway Shows", "Museum Tours", "Food Tours", "Rooftop Bars"],
    avgTemp: "5-28°C",
    flightTime: "Domestic",
    visaRequired: "ESTA for tourists",
    safety: "Safe",
  },
  {
    id: 5,
    name: "Santorini, Greece",
    country: "Greece",
    region: "Europe",
    description: "Breathtaking sunsets and white-washed buildings on cliff edges overlooking the Aegean Sea",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    rating: 4.9,
    reviews: 11234,
    popularMonths: "May-Oct",
    highlights: ["Oia Sunset", "Red Beach", "Ancient Thera", "Fira Town"],
    trending: false,
    avgBudget: "$180-350/day",
    currency: "EUR",
    language: "Greek",
    timezone: "EET (UTC+2)",
    bestFor: ["Honeymooners", "Photographers", "Wine Lovers"],
    activities: ["Wine Tasting", "Sailing", "Beach Hopping", "Sunset Watching"],
    avgTemp: "18-28°C",
    flightTime: "10-12 hrs from US",
    visaRequired: "Schengen Visa",
    safety: "Very Safe",
  },
  {
    id: 6,
    name: "Dubai, UAE",
    country: "UAE",
    region: "Middle East",
    description: "Luxury shopping, ultramodern architecture, and desert adventures in the heart of the Arabian Gulf",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    rating: 4.7,
    reviews: 13567,
    popularMonths: "Nov-Mar",
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Desert Safari"],
    trending: true,
    avgBudget: "$180-400/day",
    currency: "AED",
    language: "Arabic, English",
    timezone: "GST (UTC+4)",
    bestFor: ["Luxury Travelers", "Shoppers", "Adventure Seekers"],
    activities: ["Desert Safari", "Skydiving", "Luxury Shopping", "Beach Clubs"],
    avgTemp: "20-40°C",
    flightTime: "12-14 hrs from US",
    visaRequired: "Visa on Arrival",
    safety: "Very Safe",
  },
  {
    id: 7,
    name: "Barcelona, Spain",
    country: "Spain",
    region: "Europe",
    description: "Gaudi's masterpieces, Mediterranean beaches, and vibrant nightlife in Catalonia's capital",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    rating: 4.8,
    reviews: 14289,
    popularMonths: "May-Oct",
    highlights: ["Sagrada Familia", "Park Güell", "La Rambla", "Gothic Quarter"],
    trending: false,
    avgBudget: "$120-250/day",
    currency: "EUR",
    language: "Spanish, Catalan",
    timezone: "CET (UTC+1)",
    bestFor: ["Architecture Fans", "Beach Lovers", "Party Goers"],
    activities: ["Architecture Tours", "Beach Time", "Tapas Crawls", "Flamenco Shows"],
    avgTemp: "15-28°C",
    flightTime: "8-10 hrs from US",
    visaRequired: "Schengen Visa",
    safety: "Safe",
  },
  {
    id: 8,
    name: "Maldives",
    country: "Maldives",
    region: "Islands",
    description: "Crystal-clear waters and overwater bungalows in paradise, perfect for ultimate relaxation",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    rating: 4.9,
    reviews: 8765,
    popularMonths: "Nov-Apr",
    highlights: ["Underwater Restaurant", "Bioluminescent Beach", "Diving", "Private Islands"],
    trending: false,
    avgBudget: "$300-800/day",
    currency: "MVR",
    language: "Dhivehi, English",
    timezone: "MVT (UTC+5)",
    bestFor: ["Honeymooners", "Divers", "Luxury Seekers"],
    activities: ["Scuba Diving", "Snorkeling", "Spa Treatments", "Water Sports"],
    avgTemp: "26-30°C",
    flightTime: "18-20 hrs from US",
    visaRequired: "Visa-free for 30 days",
    safety: "Very Safe",
  },
  {
    id: 9,
    name: "Rome, Italy",
    country: "Italy",
    region: "Europe",
    description: "Ancient history meets modern Italian charm and cuisine in the Eternal City",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    rating: 4.7,
    reviews: 16432,
    popularMonths: "Apr-Jun, Sep-Oct",
    highlights: ["Colosseum", "Vatican City", "Trevi Fountain", "Roman Forum"],
    trending: false,
    avgBudget: "$130-280/day",
    currency: "EUR",
    language: "Italian",
    timezone: "CET (UTC+1)",
    bestFor: ["History Buffs", "Foodies", "Art Lovers"],
    activities: ["Historical Tours", "Pasta Making", "Wine Tasting", "Vespa Tours"],
    avgTemp: "12-30°C",
    flightTime: "9-11 hrs from US",
    visaRequired: "Schengen Visa",
    safety: "Safe",
  },
  {
    id: 10,
    name: "Iceland",
    country: "Iceland",
    region: "Europe",
    description: "Land of fire and ice with stunning waterfalls, geysers, and the magical Northern Lights",
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    rating: 4.8,
    reviews: 7654,
    popularMonths: "Jun-Aug, Dec-Feb",
    highlights: ["Blue Lagoon", "Golden Circle", "Northern Lights", "Jökulsárlón"],
    trending: true,
    avgBudget: "$200-400/day",
    currency: "ISK",
    language: "Icelandic, English",
    timezone: "GMT (UTC+0)",
    bestFor: ["Nature Lovers", "Photographers", "Adventure Seekers"],
    activities: ["Northern Lights", "Glacier Hiking", "Hot Springs", "Whale Watching"],
    avgTemp: "-2-15°C",
    flightTime: "5-6 hrs from US East Coast",
    visaRequired: "Schengen Visa",
    safety: "Extremely Safe",
  },
  {
    id: 11,
    name: "Machu Picchu, Peru",
    country: "Peru",
    region: "Americas",
    description: "Ancient Incan citadel set high in the Andes Mountains, one of the New Seven Wonders",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    rating: 4.9,
    reviews: 9876,
    popularMonths: "May-Sep",
    highlights: ["Machu Picchu", "Inca Trail", "Sacred Valley", "Cusco"],
    trending: true,
    avgBudget: "$80-180/day",
    currency: "PEN",
    language: "Spanish, Quechua",
    timezone: "PET (UTC-5)",
    bestFor: ["Hikers", "History Buffs", "Adventure Seekers"],
    activities: ["Inca Trail Hiking", "Ruins Exploration", "Local Markets", "Llama Encounters"],
    avgTemp: "8-20°C",
    flightTime: "8-10 hrs from US",
    visaRequired: "Visa-free for 183 days",
    safety: "Safe",
  },
  {
    id: 12,
    name: "Sydney, Australia",
    country: "Australia",
    region: "Oceania",
    description: "Harbor city with iconic Opera House, beautiful beaches, and laid-back Australian lifestyle",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    rating: 4.7,
    reviews: 11543,
    popularMonths: "Sep-Nov, Mar-May",
    highlights: ["Opera House", "Harbour Bridge", "Bondi Beach", "Taronga Zoo"],
    trending: false,
    avgBudget: "$150-320/day",
    currency: "AUD",
    language: "English",
    timezone: "AEDT (UTC+11)",
    bestFor: ["Beach Lovers", "Outdoor Enthusiasts", "Foodies"],
    activities: ["Surfing", "Harbor Cruises", "Coastal Walks", "Wildlife Encounters"],
    avgTemp: "12-26°C",
    flightTime: "15-17 hrs from US West Coast",
    visaRequired: "eVisitor or ETA",
    safety: "Very Safe",
  },
  {
    id: 13,
    name: "Marrakech, Morocco",
    country: "Morocco",
    region: "Africa",
    description: "Vibrant souks, stunning palaces, and exotic gardens in the heart of North Africa",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    rating: 4.6,
    reviews: 8234,
    popularMonths: "Mar-May, Sep-Nov",
    highlights: ["Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace", "Medina"],
    trending: true,
    avgBudget: "$60-150/day",
    currency: "MAD",
    language: "Arabic, French",
    timezone: "WET (UTC+0)",
    bestFor: ["Culture Seekers", "Shoppers", "Foodies"],
    activities: ["Souk Shopping", "Hammam Spa", "Desert Tours", "Cooking Classes"],
    avgTemp: "12-36°C",
    flightTime: "7-9 hrs from US East Coast",
    visaRequired: "Visa-free for 90 days",
    safety: "Safe",
  },
  {
    id: 14,
    name: "Bangkok, Thailand",
    country: "Thailand",
    region: "Asia",
    description: "Bustling metropolis with ornate temples, vibrant street life, and incredible street food",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    rating: 4.7,
    reviews: 13876,
    popularMonths: "Nov-Feb",
    highlights: ["Grand Palace", "Wat Pho", "Floating Markets", "Khao San Road"],
    trending: false,
    avgBudget: "$40-100/day",
    currency: "THB",
    language: "Thai",
    timezone: "ICT (UTC+7)",
    bestFor: ["Budget Travelers", "Foodies", "Party Goers"],
    activities: ["Temple Tours", "Street Food", "Thai Massage", "River Cruises"],
    avgTemp: "25-35°C",
    flightTime: "16-18 hrs from US",
    visaRequired: "Visa-free for 30 days",
    safety: "Safe",
  },
  {
    id: 15,
    name: "Cape Town, South Africa",
    country: "South Africa",
    region: "Africa",
    description: "Stunning natural beauty with Table Mountain, pristine beaches, and world-class wineries",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    rating: 4.8,
    reviews: 9432,
    popularMonths: "Nov-Mar",
    highlights: ["Table Mountain", "Cape Point", "V&A Waterfront", "Robben Island"],
    trending: true,
    avgBudget: "$70-180/day",
    currency: "ZAR",
    language: "English, Afrikaans",
    timezone: "SAST (UTC+2)",
    bestFor: ["Nature Lovers", "Wine Enthusiasts", "Adventure Seekers"],
    activities: ["Wine Tours", "Shark Cage Diving", "Hiking", "Penguin Watching"],
    avgTemp: "15-27°C",
    flightTime: "15-18 hrs from US",
    visaRequired: "Visa-free for 90 days",
    safety: "Moderate - Stay Alert",
  },
];

const DestinationsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [destinationToSelect, setDestinationToSelect] = useState<any>(null);

  // Convex hooks
  const addDestination = useMutation(api.destinations.addSelectedDestination);
  const userDestinations = useQuery(api.destinations.getUserDestinations, {
    userId: user?.id || undefined,
  });
  const popularDestinations = useQuery(api.destinations.getPopularDestinations);

  // Load user's selected destinations
  useEffect(() => {
    if (userDestinations) {
      const selectedIds = userDestinations.map(dest => parseInt(dest.id));
      setSelectedDestinations(selectedIds);
    }
  }, [userDestinations]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handlePlanTrip = (destinationName: string) => {
    router.push(`/create-new-trip?destination=${encodeURIComponent(destinationName)}`);
  };

  const handleSelectDestination = (destination: any) => {
    if (!user) {
      toast.error("Please sign in to select destinations");
      return;
    }

    if (isDestinationSelected(destination.id)) {
      toast.info("This destination is already in your list");
      return;
    }

    setDestinationToSelect(destination);
    setShowConfirmDialog(true);
  };

  const confirmSelectDestination = async () => {
    if (!destinationToSelect || !user) return;

    setIsSelecting(true);

    try {
      await addDestination({
        id: destinationToSelect.id.toString(),
        name: destinationToSelect.name,
        country: destinationToSelect.country,
        region: destinationToSelect.region,
        description: destinationToSelect.description,
        imageUrl: destinationToSelect.image,
        rating: destinationToSelect.rating,
        bestTimeToVisit: destinationToSelect.popularMonths,
        priceRange: destinationToSelect.avgBudget,
        userId: user.id,
      });

      setSelectedDestinations(prev => [...prev, destinationToSelect.id]);
      toast.success(`${destinationToSelect.name} added to your selected destinations!`);
      setShowConfirmDialog(false);
      setDestinationToSelect(null);
    } catch (error) {
      console.error("Error selecting destination:", error);
      toast.error("Failed to select destination. Please try again.");
    } finally {
      setIsSelecting(false);
    }
  };

  const isDestinationSelected = (destinationId: number) => {
    return selectedDestinations.includes(destinationId);
  };

  const selectedDest = selectedDestination ? destinations.find(d => d.id === selectedDestination) : null;

  let filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "trending") return matchesSearch && dest.trending;
    if (filter === "favorites") return matchesSearch && favorites.includes(dest.id);
    return matchesSearch && dest.region.toLowerCase() === filter;
  });

  // Sort destinations
  filteredDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviews - a.reviews;
      case "budget-low":
        return parseInt(a.avgBudget.split("-")[0].replace(/\D/g, "")) -
          parseInt(b.avgBudget.split("-")[0].replace(/\D/g, ""));
      case "budget-high":
        return parseInt(b.avgBudget.split("-")[1].replace(/\D/g, "")) -
          parseInt(a.avgBudget.split("-")[1].replace(/\D/g, ""));
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return b.reviews - a.reviews; // popular
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-950 dark:to-neutral-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Amazing Destinations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Discover your next adventure with personalized recommendations and insider tips
          </p>

          {/* User's Selected Destinations */}
          {user && selectedDestinations.length > 0 && (
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Check className="text-green-600" size={20} />
                  Your Selected Destinations ({selectedDestinations.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/my-destinations')}
                  className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/30"
                >
                  View All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedDestinations.slice(0, 5).map(destId => {
                  const dest = destinations.find(d => d.id === destId);
                  return dest ? (
                    <span
                      key={destId}
                      className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <MapPin size={12} />
                      {dest.name}
                    </span>
                  ) : null;
                })}
                {selectedDestinations.length > 5 && (
                  <span className="text-green-600 dark:text-green-400 text-sm">
                    +{selectedDestinations.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700">Search</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            All Destinations
          </Button>
          <Button
            variant={filter === "trending" ? "default" : "outline"}
            onClick={() => setFilter("trending")}
            className="rounded-full"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Trending
          </Button>
          <Button
            variant={filter === "favorites" ? "default" : "outline"}
            onClick={() => setFilter("favorites")}
            className="rounded-full"
          >
            <Heart className="mr-2 h-4 w-4" /> Favorites ({favorites.length})
          </Button>
          <Button
            variant={filter === "europe" ? "default" : "outline"}
            onClick={() => setFilter("europe")}
            className="rounded-full"
          >
            <Globe className="mr-2 h-4 w-4" /> Europe
          </Button>
          <Button
            variant={filter === "asia" ? "default" : "outline"}
            onClick={() => setFilter("asia")}
            className="rounded-full"
          >
            <Globe className="mr-2 h-4 w-4" /> Asia
          </Button>
          <Button
            variant={filter === "americas" ? "default" : "outline"}
            onClick={() => setFilter("americas")}
            className="rounded-full"
          >
            <Globe className="mr-2 h-4 w-4" /> Americas
          </Button>
          <Button
            variant={filter === "africa" ? "default" : "outline"}
            onClick={() => setFilter("africa")}
            className="rounded-full"
          >
            <Globe className="mr-2 h-4 w-4" /> Africa
          </Button>
          <Button
            variant={filter === "oceania" ? "default" : "outline"}
            onClick={() => setFilter("oceania")}
            className="rounded-full"
          >
            <Globe className="mr-2 h-4 w-4" /> Oceania
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6 px-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="budget-low">Budget (Low to High)</option>
              <option value="budget-high">Budget (High to Low)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="group bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {destination.trending && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <TrendingUp size={14} /> Trending
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="fill-yellow-400 text-yellow-400" size={16} />
                  <span className="font-semibold text-sm">{destination.rating}</span>
                  <span className="text-xs text-gray-500">({destination.reviews.toLocaleString()})</span>
                </div>
                <button
                  onClick={() => toggleFavorite(destination.id)}
                  className="absolute bottom-4 right-4 bg-white/90 dark:bg-neutral-900/90 p-2 rounded-full hover:scale-110 transition-transform"
                >
                  <Heart
                    size={20}
                    className={favorites.includes(destination.id) ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"}
                  />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <MapPin size={14} className="mr-1" />
                      {destination.country}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} />
                        {destination.avgBudget}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Plane size={12} />
                        {destination.flightTime}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Best: {destination.popularMonths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Info size={12} />
                      {destination.safety}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {destination.bestFor.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded flex items-center gap-1"
                      >
                        <Camera size={10} />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Hotel size={14} className="text-blue-500" />
                      <span>{destination.language}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Utensils size={14} className="text-green-500" />
                      <span>{destination.avgTemp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handlePlanTrip(destination.name)}
                  >
                    <Plane className="mr-2" size={16} />
                    Plan Trip
                  </Button>
                  <Button
                    variant={isDestinationSelected(destination.id) ? "default" : "outline"}
                    className={`px-4 ${isDestinationSelected(destination.id) ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => handleSelectDestination(destination)}
                    disabled={isSelecting}
                    title={isDestinationSelected(destination.id) ? "Already selected" : "Select destination"}
                  >
                    {isSelecting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : isDestinationSelected(destination.id) ? (
                      <Check size={16} />
                    ) : (
                      <Heart size={16} />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="px-4"
                    onClick={() => setSelectedDestination(destination.id)}
                    title="View details"
                  >
                    <Info size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No destinations found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Destination Details Modal */}
      {selectedDest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Header with Image */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={selectedDest.image}
                alt={selectedDest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 bg-white/90 dark:bg-neutral-900/90 p-2 rounded-full hover:scale-110 transition-transform"
              >
                <X size={24} className="text-gray-900 dark:text-white" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-4xl font-bold text-white mb-2">{selectedDest.name}</h2>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                    <span className="font-semibold">{selectedDest.rating}</span>
                    <span className="text-sm">({selectedDest.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={18} />
                    <span>{selectedDest.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <DollarSign className="text-blue-600 dark:text-blue-400 mb-2" size={24} />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Budget</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{selectedDest.avgBudget}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                  <Calendar className="text-green-600 dark:text-green-400 mb-2" size={24} />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Best Time</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{selectedDest.popularMonths}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                  <Plane className="text-purple-600 dark:text-purple-400 mb-2" size={24} />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Flight Time</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{selectedDest.flightTime}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <Shield className="text-orange-600 dark:text-orange-400 mb-2" size={24} />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Safety</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{selectedDest.safety}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About {selectedDest.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {selectedDest.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Attractions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedDest.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                      <Camera className="text-blue-600 dark:text-blue-400" size={18} />
                      <span className="text-gray-900 dark:text-white font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Popular Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDest.activities.map((activity, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Perfect For</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDest.bestFor.map((type, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Travel Info */}
              <div className="mb-8 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Travel Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CreditCard className="text-gray-500 dark:text-gray-400 mt-1" size={18} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Currency</div>
                        <div className="font-medium text-gray-900 dark:text-white">{selectedDest.currency}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="text-gray-500 dark:text-gray-400 mt-1" size={18} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Language</div>
                        <div className="font-medium text-gray-900 dark:text-white">{selectedDest.language}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="text-gray-500 dark:text-gray-400 mt-1" size={18} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Timezone</div>
                        <div className="font-medium text-gray-900 dark:text-white">{selectedDest.timezone}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Entry Requirements</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="text-gray-500 dark:text-gray-400 mt-1" size={18} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Visa</div>
                        <div className="font-medium text-gray-900 dark:text-white">{selectedDest.visaRequired}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Utensils className="text-gray-500 dark:text-gray-400 mt-1" size={18} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Average Temperature</div>
                        <div className="font-medium text-gray-900 dark:text-white">{selectedDest.avgTemp}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t dark:border-gray-700">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    handlePlanTrip(selectedDest.name);
                    setSelectedDestination(null);
                  }}
                >
                  <Plane className="mr-2" size={20} />
                  Plan Your Trip to {selectedDest.name}
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-6"
                  onClick={() => toggleFavorite(selectedDest.id)}
                >
                  <Heart
                    size={20}
                    className={favorites.includes(selectedDest.id) ? "fill-red-500 text-red-500" : ""}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {destinationToSelect && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setDestinationToSelect(null);
          }}
          onConfirm={confirmSelectDestination}
          destination={{
            name: destinationToSelect.name,
            country: destinationToSelect.country,
            image: destinationToSelect.image,
            description: destinationToSelect.description,
          }}
          isLoading={isSelecting}
        />
      )}
    </div>
  );
};

export default DestinationsPage;