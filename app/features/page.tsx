"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SmartPricingCard from "../_components/SmartPricingCard";
import EnhancedHotelCard from "../_components/EnhancedHotelCard";
import { Brain, TrendingUp, Users, Sparkles } from "lucide-react";

const FeaturesShowcase = () => {
  const [activeDemo, setActiveDemo] = useState<"pricing" | "ai" | "vendors">("pricing");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">AI-Powered Travel Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Travel Planning
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meets Dynamic Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the future of travel with AI-optimized itineraries and
            intelligent pricing that benefits both travelers and local vendors.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="AI Trip Planning"
              description="Personalized itineraries optimized for your preferences, budget, and travel style"
              color="blue"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Smart Pricing"
              description="Dynamic pricing based on demand, seasonality, and real-time market data"
              color="green"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Vendor Network"
              description="Connect with verified local vendors offering authentic experiences"
              color="purple"
            />
          </div>

          {/* Demo Tabs */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex gap-4 mb-8 border-b pb-4">
              <Button
                onClick={() => setActiveDemo("pricing")}
                variant={activeDemo === "pricing" ? "default" : "outline"}
                className="flex-1"
              >
                Smart Pricing Demo
              </Button>
              <Button
                onClick={() => setActiveDemo("ai")}
                variant={activeDemo === "ai" ? "default" : "outline"}
                className="flex-1"
              >
                AI Optimization
              </Button>
              <Button
                onClick={() => setActiveDemo("vendors")}
                variant={activeDemo === "vendors" ? "default" : "outline"}
                className="flex-1"
              >
                Vendor Benefits
              </Button>
            </div>

            {/* Demo Content */}
            {activeDemo === "pricing" && <PricingDemo />}
            {activeDemo === "ai" && <AIDemo />}
            {activeDemo === "vendors" && <VendorDemo />}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Travel?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers and vendors using our AI-powered platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg">
              Start Planning
            </Button>
            <Button size="lg" variant="outline" className="text-lg bg-white/10 hover:bg-white/20 text-white border-white">
              Become a Vendor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div
        className={`w-16 h-16 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center text-white mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const PricingDemo = () => {
  const demoHotels = [
    {
      name: "Luxury Beach Resort",
      basePrice: 250,
      finalPrice: 312,
      discount: -25,
      explanation: "Peak season + High demand + Premium location",
      imageUrl: "/placeholder.jpg",
    },
    {
      name: "Downtown Boutique Hotel",
      basePrice: 180,
      finalPrice: 144,
      discount: 20,
      explanation: "Early booking discount + Off-season pricing",
      imageUrl: "/placeholder.jpg",
    },
    {
      name: "Mountain View Lodge",
      basePrice: 150,
      finalPrice: 120,
      discount: 20,
      explanation: "Low occupancy + Last-minute deal",
      imageUrl: "/placeholder.jpg",
    },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Dynamic Pricing in Action</h3>
      <p className="text-gray-600 mb-8">
        Our AI analyzes multiple factors to provide optimal pricing for both travelers and vendors.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {demoHotels.map((hotel, idx) => (
          <SmartPricingCard key={idx} {...hotel} />
        ))}
      </div>
    </div>
  );
};

const AIDemo = () => {
  const sampleHotel = {
    hotel_name: "Grand Plaza Hotel",
    hotel_address: "123 Main Street, Paris, France",
    base_price: 200,
    smart_price: 170,
    price_explanation: "15% early booking discount + Shoulder season pricing",
    hotel_image_url: "/placeholder.jpg",
    rating: 4.7,
    description: "Elegant hotel in the heart of Paris with stunning city views and world-class amenities.",
    amenities: ["Free WiFi", "Breakfast Included", "Pool", "Gym", "Spa", "Restaurant"],
    geo_coordinates: { latitude: 48.8566, longitude: 2.3522 },
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">AI-Enhanced Hotel Recommendations</h3>
      <p className="text-gray-600 mb-8">
        See how our AI optimizes pricing and presents hotel options with smart insights.
      </p>
      <div className="max-w-md mx-auto">
        <EnhancedHotelCard
          hotel={sampleHotel}
          destination="Paris"
          checkInDate="2025-03-15"
          onBook={() => alert("Booking feature coming soon!")}
        />
      </div>
    </div>
  );
};

const VendorDemo = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Benefits for Local Vendors</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <BenefitItem
            title="Maximize Revenue"
            description="AI-powered pricing helps you earn more during peak times while staying competitive during low seasons"
          />
          <BenefitItem
            title="Increased Visibility"
            description="Get discovered by travelers whose preferences match your offerings"
          />
          <BenefitItem
            title="Smart Analytics"
            description="Understand demand patterns and optimize your business strategy"
          />
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
          <h4 className="font-bold text-lg mb-4">Revenue Impact Example</h4>
          <div className="space-y-3">
            <StatBar label="Traditional Pricing" value={65} color="gray" />
            <StatBar label="With Smart Pricing" value={92} color="green" />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Average 40% increase in revenue with AI-optimized pricing
          </p>
        </div>
      </div>
    </div>
  );
};

const BenefitItem = ({ title, description }: { title: string; description: string }) => (
  <div className="flex gap-4">
    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const StatBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium">{label}</span>
      <span className="font-bold">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full ${color === "green" ? "bg-green-500" : "bg-gray-400"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default FeaturesShowcase;
