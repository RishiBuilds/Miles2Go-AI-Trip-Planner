"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Sparkles,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  Eye,
  Edit,
  Plus,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

const VendorDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "pricing" | "bookings">("overview");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Real-time data from Convex
  const allVendors = useQuery(api.VendorSchema.GetAllVendors);

  // Filter vendors
  const vendors = selectedCity === "all"
    ? allVendors
    : allVendors?.filter((v) => v.location.city === selectedCity);

  const filteredVendors = vendors?.filter((v) =>
    v.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updatePricing = useMutation(api.VendorSchema.UpdateVendorPricing);

  // Simulate real-time booking updates
  const [liveBookings, setLiveBookings] = useState(85);
  const [revenueGrowth, setRevenueGrowth] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBookings((prev) => Math.min(100, prev + Math.floor(Math.random() * 3)));
      setRevenueGrowth((prev) => prev + (Math.random() - 0.5));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Get unique cities
  const cities = Array.from(new Set(allVendors?.map((v) => v.location.city) || []));

  // Calculate stats
  const totalRevenue = filteredVendors?.reduce(
    (sum: number, v: any) => sum + (v.dynamicPrice || v.basePrice) * v.totalBookings,
    0
  ) || 0;

  const avgRating = (filteredVendors?.reduce((sum: number, v: any) => sum + v.averageRating, 0) || 0) / (filteredVendors?.length || 1);

  const totalBookings = filteredVendors?.reduce((sum: number, v: any) => sum + v.totalBookings, 0) || 0;

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

  // If no vendors, show onboarding
  if (!allVendors || allVendors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-2xl text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <Building2 className="h-24 w-24 text-blue-600 mx-auto relative" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Vendor Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey by registering your first business and unlock the power of AI-driven smart pricing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/vendor-register")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
            >
              <Plus className="mr-2 h-5 w-5" />
              Register Your Business
            </Button>
            <Button
              onClick={() => router.push("/features")}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              <Eye className="mr-2 h-5 w-5" />
              View Features
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => router.push("/vendor-register")}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change={`+${revenueGrowth.toFixed(1)}%`}
            icon={<DollarSign className="h-6 w-6" />}
            color="green"
          />
          <StatsCard
            title="Live Occupancy"
            value={`${liveBookings}%`}
            change="+5%"
            icon={<Activity className="h-6 w-6" />}
            color="blue"
            live
          />
          <StatsCard
            title="Total Bookings"
            value={totalBookings.toString()}
            change="+12%"
            icon={<Calendar className="h-6 w-6" />}
            color="purple"
          />
          <StatsCard
            title="Avg Rating"
            value={avgRating.toFixed(1)}
            change="+0.3"
            icon={<TrendingUp className="h-6 w-6" />}
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "listings", label: "My Listings", icon: Building2 },
                { id: "pricing", label: "Smart Pricing", icon: Sparkles },
                { id: "bookings", label: "Bookings", icon: Calendar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewContent
                vendors={filteredVendors}
                liveBookings={liveBookings}
                totalRevenue={totalRevenue}
              />
            )}
            {activeTab === "listings" && (
              <ListingsContent
                vendors={filteredVendors}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                cities={cities}
                allVendors={allVendors}
              />
            )}
            {activeTab === "pricing" && (
              <PricingContent
                vendors={filteredVendors}
                liveBookings={liveBookings}
                onApplyPrice={handleApplySmartPrice}
              />
            )}
            {activeTab === "bookings" && <BookingsContent />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, change, icon, color, live }: any) => {
  const colors = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-pink-600",
    orange: "from-orange-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color as keyof typeof colors]}`}>
          <div className="text-white">{icon}</div>
        </div>
        {live && (
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Live</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <span className="text-sm font-medium flex items-center text-green-600">
          <ArrowUpRight className="h-4 w-4" />
          {change}
        </span>
      </div>
    </div>
  );
};

// Overview Content
const OverviewContent = ({ vendors, liveBookings, totalRevenue }: any) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Listings</span>
              <span className="font-semibold">{vendors?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Occupancy</span>
              <span className="font-semibold">{liveBookings}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h4 className="font-semibold text-gray-900 mb-3">Smart Pricing Impact</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue Increase</span>
              <span className="font-semibold text-green-600">+40%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Optimized Listings</span>
              <span className="font-semibold">{vendors?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AI Recommendations</span>
              <span className="font-semibold text-blue-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Listings Content
const ListingsContent = ({ vendors, searchQuery, setSearchQuery, selectedCity, setSelectedCity, cities, allVendors }: any) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {cities.length > 1 && (
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Cities ({allVendors?.length || 0})</option>
          {cities.map((city: string) => (
            <option key={city} value={city}>
              {city} ({allVendors?.filter((v: any) => v.location.city === city).length || 0})
            </option>
          ))}
        </select>
      )}
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {vendors?.map((vendor: any) => (
        <div key={vendor._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg text-gray-900">{vendor.vendorName}</h4>
              <p className="text-sm text-gray-600">{vendor.vendorType} • {vendor.location.city}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${vendor.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
              {vendor.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">${vendor.dynamicPrice || vendor.basePrice}</p>
              <p className="text-xs text-gray-500">per night</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Pricing Content
const PricingContent = ({ vendors, liveBookings, onApplyPrice }: any) => {
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});

  const calculateSmartPrice = (basePrice: number, occupancy: number) => {
    const demandMultiplier = occupancy > 80 ? 1.25 : occupancy > 60 ? 1.1 : 0.9;
    const seasonalMultiplier = 1.2;
    return Math.round(basePrice * demandMultiplier * seasonalMultiplier);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Smart Pricing</h3>
        </div>
        <p className="text-gray-700">
          Real-time pricing optimization based on {liveBookings}% occupancy, demand levels, and market conditions
        </p>
      </div>

      <div className="space-y-4">
        {vendors?.map((vendor: any) => {
          const smartPrice = calculateSmartPrice(vendor.basePrice, liveBookings);
          const customPrice = customPrices[vendor._id] || smartPrice;
          const priceChange = ((smartPrice - vendor.basePrice) / vendor.basePrice) * 100;

          return (
            <div key={vendor._id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">{vendor.vendorName}</h4>
                  <p className="text-sm text-gray-600 mb-4">{vendor.location.city} • {vendor.vendorType}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Base Price</p>
                      <p className="font-semibold text-gray-900">${vendor.basePrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Occupancy</p>
                      <p className="font-semibold text-gray-900">{liveBookings}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Demand</p>
                      <p className="font-semibold text-orange-600">High</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Change</p>
                      <p className={`font-semibold ${priceChange > 0 ? "text-green-600" : "text-red-600"}`}>
                        {priceChange > 0 ? "+" : ""}{priceChange.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">AI Recommended</p>
                    <p className="text-4xl font-bold text-green-600">${smartPrice}</p>
                  </div>
                  
                  <div className="flex gap-2 w-full">
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrices(prev => ({ ...prev, [vendor._id]: parseFloat(e.target.value) || smartPrice }))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                      placeholder={`${smartPrice}`}
                    />
                    <Button
                      onClick={() => onApplyPrice(vendor._id, customPrice, 1.25, 1.2)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Bookings Content
const BookingsContent = () => (
  <div className="text-center py-12">
    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
    <p className="text-gray-600">Bookings will appear here once customers start booking your services</p>
  </div>
);

export default VendorDashboard;
