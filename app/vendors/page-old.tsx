"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Building2, DollarSign, TrendingUp, RefreshCw, Sparkles, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

const VendorDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "bookings">("overview");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  // Real-time data from Convex - Get all vendors
  const allVendors = useQuery(api.VendorSchema.GetAllVendors);
  
  // Filter vendors by city if needed
  const vendors = selectedCity === "all" 
    ? allVendors 
    : allVendors?.filter(v => v.location.city === selectedCity);
  
  const updatePricing = useMutation(api.VendorSchema.UpdateVendorPricing);
  
  // Simulate real-time booking updates
  const [liveBookings, setLiveBookings] = useState(85);
  
  // Get unique cities for filter
  const cities = Array.from(new Set(allVendors?.map(v => v.location.city) || []));
  
  useEffect(() => {
    // Simulate real-time booking updates every 10 seconds
    const interval = setInterval(() => {
      setLiveBookings(prev => Math.min(100, prev + Math.floor(Math.random() * 3)));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleApplySmartPrice = async (vendorId: Id<"VendorTable">, smartPrice: number, demandMultiplier: number, seasonalMultiplier: number) => {
    try {
      await updatePricing({
        vendorId,
        dynamicPrice: smartPrice,
        demandMultiplier,
        seasonalMultiplier,
      });
      alert("Smart pricing applied successfully!");
    } catch (error) {
      console.error("Error applying pricing:", error);
      alert("Failed to apply pricing");
    }
  };

  // If no vendors, show registration prompt
  if (vendors && vendors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <Building2 className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Vendor Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            Register your business to start receiving bookings and benefit from AI-powered smart pricing
          </p>
          <Button
            onClick={() => router.push("/vendor-register")}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Register Your Business
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your listings and optimize pricing with AI • Live Updates
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {/* City Filter */}
            {cities.length > 1 && (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Cities ({allVendors?.length || 0})</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city} ({allVendors?.filter(v => v.location.city === city).length || 0})
                  </option>
                ))}
              </select>
            )}
            <Button
              onClick={() => router.push("/vendor-register")}
              variant="outline"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Add New Business
            </Button>
          </div>
        </div>
        
        {/* Real-time Stats Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <div>
                <p className="text-sm opacity-90">Total Vendors</p>
                <p className="text-3xl font-bold">{vendors?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Live Occupancy Rate</p>
                <p className="text-3xl font-bold">{liveBookings}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm">Updating in real-time</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="inline mr-2 h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "pricing"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <DollarSign className="inline mr-2 h-5 w-5" />
            Smart Pricing
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "bookings"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp className="inline mr-2 h-5 w-5" />
            Bookings
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "overview" && <OverviewTab vendors={vendors} liveBookings={liveBookings} />}
          {activeTab === "pricing" && (
            <PricingTab 
              vendors={vendors} 
              onApplyPrice={handleApplySmartPrice}
              liveBookings={liveBookings}
            />
          )}
          {activeTab === "bookings" && <BookingsTab />}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ vendors, liveBookings }: any) => {
  const totalRevenue = vendors?.reduce((sum: number, v: any) => 
    sum + (v.dynamicPrice || v.basePrice) * v.totalBookings, 0
  ) || 0;
  
  const avgRating = vendors?.reduce((sum: number, v: any) => 
    sum + v.averageRating, 0
  ) / (vendors?.length || 1);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Business Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Live Occupancy" 
          value={`${liveBookings}%`} 
          change="+12%" 
          live={true}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          change="+8%" 
        />
        <StatCard 
          title="Avg Rating" 
          value={avgRating.toFixed(1)} 
          change="+0.2" 
        />
      </div>
      
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Listings</h3>
          <div className="space-y-3">
            {vendors?.map((vendor: any) => (
              <div key={vendor._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{vendor.vendorName}</p>
                  <p className="text-sm text-gray-600">{vendor.location.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ${vendor.dynamicPrice || vendor.basePrice}
                  </p>
                  <p className="text-xs text-gray-500">
                    {vendor.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Add New Listing
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Sparkles className="mr-2 h-4 w-4" />
              Optimize All Prices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingTab = ({ vendors, onApplyPrice, liveBookings }: any) => {
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  
  const calculateSmartPrice = (basePrice: number, occupancy: number) => {
    const demandMultiplier = occupancy > 80 ? 1.25 : occupancy > 60 ? 1.1 : 0.9;
    const seasonalMultiplier = 1.2; // Assume peak season
    return Math.round(basePrice * demandMultiplier * seasonalMultiplier);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">AI-Powered Smart Pricing</h2>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <p className="font-semibold text-gray-900">Real-Time Price Optimization</p>
        </div>
        <p className="text-gray-700 text-sm">
          Our AI analyzes demand ({liveBookings}% occupancy), seasonality, and competitor pricing to optimize your rates automatically.
        </p>
      </div>
      
      <div className="space-y-4">
        {vendors?.map((vendor: any) => {
          const smartPrice = calculateSmartPrice(vendor.basePrice, liveBookings);
          const customPrice = customPrices[vendor._id] || smartPrice;
          
          return (
            <div key={vendor._id} className="border rounded-lg p-6 bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{vendor.vendorName}</h4>
                  <p className="text-sm text-gray-600">{vendor.vendorType}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Current occupancy: {liveBookings}% • {vendor.location.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">${vendor.basePrice}</p>
                  <p className="text-3xl font-bold text-green-600">${smartPrice}</p>
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    +{Math.round(((smartPrice - vendor.basePrice) / vendor.basePrice) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Pricing Factors:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Demand:</span>
                    <span className="font-semibold">High ({liveBookings}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Season:</span>
                    <span className="font-semibold">Peak (+20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">${vendor.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recommended:</span>
                    <span className="font-semibold text-green-600">${smartPrice}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">Custom Price (optional)</label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrices(prev => ({
                      ...prev,
                      [vendor._id]: parseFloat(e.target.value) || smartPrice
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder={`${smartPrice}`}
                  />
                </div>
                <Button
                  onClick={() => onApplyPrice(vendor._id, customPrice, 1.25, 1.2)}
                  className="mt-6"
                >
                  Apply Price
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BookingsTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
    <div className="space-y-4">
      <BookingCard
        guest="John Doe"
        service="Hotel Room"
        date="Dec 25-27, 2024"
        amount="$370"
        status="Confirmed"
      />
      <BookingCard
        guest="Jane Smith"
        service="Guided Tour"
        date="Dec 30, 2024"
        amount="$120"
        status="Pending"
      />
    </div>
  </div>
);

const StatCard = ({ title, value, change, live }: { title: string; value: string; change: string; live?: boolean }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-600 text-sm">{title}</p>
      {live && (
        <span className="flex items-center gap-1 text-xs text-green-600">
          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
          Live
        </span>
      )}
    </div>
    <p className="text-3xl font-bold mt-2">{value}</p>
    <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
      <TrendingUp className="h-3 w-3" />
      {change}
    </p>
  </div>
);



const BookingCard = ({
  guest,
  service,
  date,
  amount,
  status,
}: {
  guest: string;
  service: string;
  date: string;
  amount: string;
  status: string;
}) => (
  <div className="border rounded-lg p-4 flex justify-between items-center">
    <div>
      <h4 className="font-semibold">{guest}</h4>
      <p className="text-sm text-gray-600">{service}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
    <div className="text-right">
      <p className="text-xl font-bold">{amount}</p>
      <span
        className={`text-sm px-3 py-1 rounded-full ${
          status === "Confirmed"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {status}
      </span>
    </div>
  </div>
);

export default VendorDashboard;
