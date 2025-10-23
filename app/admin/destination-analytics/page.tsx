"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapPin, TrendingUp, Users, Star, BarChart3 } from "lucide-react";

const DestinationAnalyticsPage = () => {
  const allDestinations = useQuery(api.destinations.getAllDestinations);
  const popularDestinations = useQuery(api.destinations.getPopularDestinations);

  if (allDestinations === undefined || popularDestinations === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-950 dark:to-neutral-900 pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSelections = allDestinations.length;
  const uniqueDestinations = new Set(allDestinations.map(d => d.id)).size;
  const uniqueUsers = new Set(allDestinations.map(d => d.userId).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-950 dark:to-neutral-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Destination Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Insights into user destination preferences and selection patterns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Selections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSelections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <MapPin className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Unique Destinations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueDestinations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <Users className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Avg per User</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {uniqueUsers > 0 ? (totalSelections / uniqueUsers).toFixed(1) : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Most Popular Destinations
          </h2>

          {popularDestinations.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No destination data available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {popularDestinations.map((destination: any, index: number) => (
                <div
                  key={destination.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-700 rounded-xl"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                    {index + 1}
                  </div>
                  
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {destination.country} • {destination.region}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star size={16} className="fill-current" />
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {destination.count} selection{destination.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Selections */}
        <div className="mt-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Selections
          </h2>

          {allDestinations.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No selections yet.
            </p>
          ) : (
            <div className="space-y-3">
              {allDestinations.slice(0, 10).map((destination) => (
                <div
                  key={destination._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {destination.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {destination.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(destination.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationAnalyticsPage;