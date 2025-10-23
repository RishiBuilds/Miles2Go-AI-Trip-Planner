"use client";
import React, { useState } from "react";
import { useSmartPricing, useTripOptimization } from "@/hooks/useSmartPricing";
import EnhancedHotelCard from "./EnhancedHotelCard";
import SmartPricingCard from "./SmartPricingCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Integration Example: Demonstrates how to use Smart Pricing and AI Optimization together
 * 
 * This component shows:
 * 1. How to fetch smart pricing for hotels
 * 2. How to optimize a trip itinerary
 * 3. How to display results with enhanced components
 */

const IntegrationExample = () => {
  const [destination] = useState("Paris");
  const [checkInDate] = useState("2025-06-15");
  const [showOptimization, setShowOptimization] = useState(false);

  // Example hotel data
  const sampleHotel = {
    hotel_name: "Le Grand Hotel Paris",
    hotel_address: "2 Rue Scribe, 75009 Paris, France",
    base_price: 250,
    smart_price: 0, // Will be calculated
    price_explanation: "",
    hotel_image_url: "/placeholder.jpg",
    rating: 4.8,
    description: "Luxurious 5-star hotel near Opera Garnier with elegant rooms, Michelin-starred restaurant, and spa.",
    amenities: ["Free WiFi", "Breakfast", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge"],
    geo_coordinates: { latitude: 48.8708, longitude: 2.3314 },
  };

  // Use smart pricing hook
  const { pricing, loading: pricingLoading } = useSmartPricing({
    basePrice: sampleHotel.base_price,
    destination,
    checkInDate,
    currentBookings: 85,
    capacity: 100,
    userBudgetLevel: "high",
  });

  // Use trip optimization hook
  const { optimizedTrip, loading: optimizationLoading, optimizeTrip } = useTripOptimization();

  // Update hotel with smart pricing
  const hotelWithSmartPrice = {
    ...sampleHotel,
    smart_price: pricing?.finalPrice || sampleHotel.base_price,
    price_explanation: pricing?.explanation || "Standard pricing",
  };

  // Example activities for optimization
  const sampleActivities = [
    {
      name: "Eiffel Tower",
      type: "landmark",
      duration: 120,
      cost: 25,
      location: { lat: 48.8584, lng: 2.2945 },
      bestTimeSlot: "morning",
      priority: 10,
    },
    {
      name: "Louvre Museum",
      type: "museum",
      duration: 180,
      cost: 17,
      location: { lat: 48.8606, lng: 2.3376 },
      bestTimeSlot: "afternoon",
      priority: 9,
    },
    {
      name: "Notre-Dame Cathedral",
      type: "landmark",
      duration: 60,
      cost: 0,
      location: { lat: 48.8530, lng: 2.3499 },
      bestTimeSlot: "morning",
      priority: 8,
    },
    {
      name: "Montmartre & Sacré-Cœur",
      type: "cultural",
      duration: 120,
      cost: 0,
      location: { lat: 48.8867, lng: 2.3431 },
      bestTimeSlot: "afternoon",
      priority: 8,
    },
    {
      name: "Seine River Cruise",
      type: "activity",
      duration: 90,
      cost: 15,
      location: { lat: 48.8606, lng: 2.3376 },
      bestTimeSlot: "evening",
      priority: 7,
    },
  ];

  const handleOptimize = () => {
    optimizeTrip(sampleActivities, {
      budget: "high",
      pace: "moderate",
      interests: ["culture", "landmarks", "food"],
      groupSize: 2,
    }, 3);
    setShowOptimization(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Smart Travel Planning Integration
        </h1>
        <p className="text-gray-600 text-lg">
          See how AI-powered pricing and optimization work together
        </p>
      </div>

      {/* Section 1: Smart Pricing */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">1. Smart Pricing</h2>
          <p className="text-gray-600">
            Dynamic pricing based on demand, seasonality, and booking patterns
          </p>
        </div>

        {pricingLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Calculating optimal price...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Enhanced Hotel Card</h3>
              <EnhancedHotelCard
                hotel={hotelWithSmartPrice}
                destination={destination}
                checkInDate={checkInDate}
                onBook={() => alert("Booking integration coming soon!")}
              />
            </div>
            <div>
              <h3 className="font-semibold mb-4">Pricing Breakdown</h3>
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Base Price</span>
                  <span className="text-xl font-semibold">${sampleHotel.base_price}</span>
                </div>
                {pricing && (
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Demand Multiplier</span>
                        <span className="font-medium">×{pricing.demandMultiplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seasonal Multiplier</span>
                        <span className="font-medium">×{pricing.seasonalMultiplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Urgency Multiplier</span>
                        <span className="font-medium">×{pricing.urgencyMultiplier}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-gray-900 font-semibold">Smart Price</span>
                      <span className="text-2xl font-bold text-primary">
                        ${pricing.finalPrice}
                      </span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-900">{pricing.explanation}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Trip Optimization */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">2. AI Trip Optimization</h2>
          <p className="text-gray-600">
            Optimize your itinerary for minimal travel time and maximum experience
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Sample Activities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {sampleActivities.map((activity, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-gray-600">{activity.type}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      ${activity.cost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleOptimize}
            disabled={optimizationLoading}
            className="w-full"
            size="lg"
          >
            {optimizationLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Optimizing...
              </>
            ) : (
              "Optimize Itinerary"
            )}
          </Button>

          {showOptimization && optimizedTrip && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Optimization Complete!</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Cost</p>
                    <p className="text-xl font-bold text-green-900">
                      ${optimizedTrip.summary.totalCost}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Travel Time</p>
                    <p className="text-xl font-bold text-green-900">
                      {optimizedTrip.summary.totalTravelTime}m
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Satisfaction</p>
                    <p className="text-xl font-bold text-green-900">
                      {optimizedTrip.summary.satisfactionScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Daily Avg</p>
                    <p className="text-xl font-bold text-green-900">
                      ${optimizedTrip.summary.averageDailyCost}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {optimizedTrip.optimizedItinerary.map((day: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Day {day.day}</h4>
                    <div className="space-y-2">
                      {day.activities.map((activity: any, actIdx: number) => (
                        <div key={actIdx} className="flex justify-between text-sm">
                          <span>{activity.name}</span>
                          <span className="text-gray-600">${activity.cost}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                      <span className="text-gray-600">Day Total</span>
                      <span className="font-semibold">${day.estimatedCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Code Example */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">3. Implementation Code</h2>
          <p className="text-gray-600">
            How to integrate these features in your components
          </p>
        </div>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm">
{`// Import hooks
import { useSmartPricing, useTripOptimization } from "@/hooks/useSmartPricing";

// Use smart pricing
const { pricing, loading } = useSmartPricing({
  basePrice: 250,
  destination: "Paris",
  checkInDate: "2025-06-15",
  userBudgetLevel: "high"
});

// Use trip optimization
const { optimizedTrip, optimizeTrip } = useTripOptimization();

// Optimize trip
await optimizeTrip(activities, preferences, days);

// Display results
<EnhancedHotelCard 
  hotel={hotelWithSmartPrice}
  onBook={handleBooking}
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default IntegrationExample;
