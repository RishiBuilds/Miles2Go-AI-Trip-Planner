"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Target,
  RefreshCw,
  Filter,
  Search,
  Download,
  Bell,
  MapPin,
  Camera,
  Wifi,
  Car,
  Utensils
} from "lucide-react";
import { useRealTimePricing } from "@/hooks/useRealTimePricing";

type VendorService = {
  id: string;
  name: string;
  type: "hotel" | "restaurant" | "activity" | "transport" | "guide";
  location: string;
  basePrice: number;
  currentPrice: number;
  priceChange: number;
  rating: number;
  reviews: number;
  bookings: number;
  revenue: number;
  status: "active" | "pending" | "inactive";
  lastUpdated: string;
  amenities: string[];
  images: string[];
};

type BookingData = {
  id: string;
  serviceName: string;
  customerName: string;
  date: string;
  amount: number;
  status: "confirmed" | "pending" | "cancelled";
  guests: number;
};

type AnalyticsData = {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  occupancyRate: number;
  priceOptimization: number;
  monthlyGrowth: number;
};

const VendorDashboard: React.FC = () => {
  const [services, setServices] = useState<VendorService[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "bookings" | "analytics" | "chat">("overview");
  const [loading, setLoading] = useState(true);

  // Use real-time pricing hook
  const { pricingData, isUpdating: pricesLoading, refresh } = useRealTimePricing();

  useEffect(() => {
    // Mock data initialization
    const mockServices: VendorService[] = [
      {
        id: "1",
        name: "Grand Hotel Paris",
        type: "hotel",
        location: "Paris, France",
        basePrice: 150,
        currentPrice: 180,
        priceChange: 20,
        rating: 4.6,
        reviews: 1247,
        bookings: 89,
        revenue: 16020,
        status: "active",
        lastUpdated: "2 hours ago",
        amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
        images: ["hotel1.jpg", "hotel2.jpg"]
      },
      {
        id: "2",
        name: "Seine River Cruise",
        type: "activity",
        location: "Paris, France",
        basePrice: 25,
        currentPrice: 30,
        priceChange: 5,
        rating: 4.8,
        reviews: 892,
        bookings: 156,
        revenue: 4680,
        status: "active",
        lastUpdated: "1 hour ago",
        amenities: ["Audio Guide", "Refreshments"],
        images: ["cruise1.jpg"]
      },
      {
        id: "3",
        name: "Le Petit Bistro",
        type: "restaurant",
        location: "Paris, France",
        basePrice: 45,
        currentPrice: 42,
        priceChange: -3,
        rating: 4.4,
        reviews: 567,
        bookings: 78,
        revenue: 3276,
        status: "active",
        lastUpdated: "30 minutes ago",
        amenities: ["Outdoor Seating", "Wine Selection"],
        images: ["restaurant1.jpg"]
      }
    ];

    const mockBookings: BookingData[] = [
      {
        id: "1",
        serviceName: "Grand Hotel Paris",
        customerName: "John Smith",
        date: "2024-03-15",
        amount: 540,
        status: "confirmed",
        guests: 2
      },
      {
        id: "2",
        serviceName: "Seine River Cruise",
        customerName: "Emma Johnson",
        date: "2024-03-16",
        amount: 120,
        status: "pending",
        guests: 4
      },
      {
        id: "3",
        serviceName: "Le Petit Bistro",
        customerName: "Michael Brown",
        date: "2024-03-17",
        amount: 168,
        status: "confirmed",
        guests: 4
      }
    ];

    const mockAnalytics: AnalyticsData = {
      totalRevenue: 23976,
      totalBookings: 323,
      averageRating: 4.6,
      occupancyRate: 78,
      priceOptimization: 15,
      monthlyGrowth: 12
    };

    setServices(mockServices);
    setBookings(mockBookings);
    setAnalytics(mockAnalytics);
    setLoading(false);
  }, []);

  const handlePriceUpdate = async (serviceId: string, newPrice: number) => {
    try {
      // In a real implementation, this would call an API to update the price
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, currentPrice: newPrice, lastUpdated: "Just now" }
          : service
      ));
      refresh(); // Refresh pricing data
    } catch (error) {
      console.error("Failed to update price:", error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics?.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp size={14} />
                +{analytics?.monthlyGrowth}% this month
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalBookings}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {bookings.filter(b => b.status === 'pending').length} pending
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.averageRating}
              </p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    size={14} 
                    className={star <= (analytics?.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI Optimization</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                +{analytics?.priceOptimization}%
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Revenue increase
              </p>
            </div>
            <Zap className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Real-time Price Optimization */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Real-time Price Optimization
          </h3>
          <Button variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh Prices
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {services.slice(0, 3).map(service => (
            <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  service.priceChange > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : service.priceChange < 0
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                }`}>
                  {service.priceChange > 0 ? '+' : ''}${service.priceChange}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                  <span className="text-gray-900 dark:text-white">${service.basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${service.currentPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                  <span className="text-gray-500 dark:text-gray-400">{service.lastUpdated}</span>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePriceUpdate(service.id, service.currentPrice - 5)}
                  className="flex-1"
                >
                  -$5
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePriceUpdate(service.id, service.currentPrice + 5)}
                  className="flex-1"
                >
                  +$5
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab("bookings")}>
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {bookings.slice(0, 5).map(booking => (
            <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{booking.serviceName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.customerName} • {booking.guests} guests • {booking.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {booking.status}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">${booking.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Services</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus size={16} className="mr-2" />
          Add New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  service.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : service.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {service.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <MapPin size={14} />
                  {service.location}
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({service.reviews} reviews)
                  </span>
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs capitalize">
                  {service.type}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Price:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${service.currentPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bookings:</span>
                  <span className="text-gray-900 dark:text-white">{service.bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="text-gray-900 dark:text-white">${service.revenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {service.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    {amenity}
                  </span>
                ))}
                {service.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    +{service.amenities.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye size={14} className="mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Revenue Chart Placeholder</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Patterns</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Booking Chart Placeholder</p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          AI-Powered Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Price Optimization</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Increase your hotel rates by 12% during peak season (March 15-30) to maximize revenue.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">Demand Forecast</h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Expected 25% increase in bookings next week. Consider adjusting availability.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Customer Insights</h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Guests value WiFi and breakfast most. Highlighting these can increase bookings by 8%.
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-2">Competition Analysis</h4>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Your prices are 5% below market average. You have room to increase rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell size={20} />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare size={20} />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "services", label: "My Services", icon: Store },
              { id: "bookings", label: "Bookings", icon: Calendar },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "chat", label: "Messages", icon: MessageSquare }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "services" && renderServices()}
        {activeTab === "analytics" && renderAnalytics()}
        {activeTab === "bookings" && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bookings Management</h3>
            <p className="text-gray-600 dark:text-gray-300">Detailed bookings view coming soon...</p>
          </div>
        )}
        {activeTab === "chat" && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Customer Chat</h3>
            <p className="text-gray-600 dark:text-gray-300">Real-time chat with travelers coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;