"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Calendar, DollarSign, Plane, Trash2, ArrowLeft, ExternalLink } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/lib/toast";

const MyDestinationsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Convex hooks
  const userDestinations = useQuery(api.destinations.getUserDestinations, {
    userId: user?.id || undefined,
  });
  const removeDestination = useMutation(api.destinations.removeSelectedDestination);

  const handleRemoveDestination = async (destinationId: string) => {
    setDeletingId(destinationId);
    try {
      await removeDestination({ destinationId: destinationId as any });
      toast.success("Destination removed from your list");
    } catch (error) {
      console.error("Error removing destination:", error);
      toast.error("Failed to remove destination");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePlanTrip = (destinationName: string) => {
    router.push(`/create-new-trip?destination=${encodeURIComponent(destinationName)}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-950 dark:to-neutral-900 pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Please sign in to view your selected destinations.
          </p>
          <Button onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-950 dark:to-neutral-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              My Selected Destinations
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your favorite travel destinations
            </p>
          </div>
        </div>

        {/* Loading State */}
        {userDestinations === undefined && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your destinations...</p>
          </div>
        )}

        {/* Empty State */}
        {userDestinations && userDestinations.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <MapPin className="text-gray-400" size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No destinations selected yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Start exploring and selecting destinations to build your travel wishlist.
            </p>
            <Button
              onClick={() => router.push('/destinations')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Explore Destinations
            </Button>
          </div>
        )}

        {/* Destinations Grid */}
        {userDestinations && userDestinations.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                {userDestinations.length} destination{userDestinations.length !== 1 ? 's' : ''} selected
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/destinations')}
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Add More Destinations
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDestinations.map((destination) => (
                <div
                  key={destination._id}
                  className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="fill-yellow-400 text-yellow-400" size={14} />
                      <span className="font-semibold text-sm">{destination.rating}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveDestination(destination._id)}
                      disabled={deletingId === destination._id}
                      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Remove from selected destinations"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                      <MapPin size={14} className="mr-1" />
                      {destination.country} • {destination.region}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {destination.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={14} className="text-blue-500" />
                        <span>Best time: {destination.bestTimeToVisit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign size={14} className="text-green-500" />
                        <span>Budget: {destination.priceRange}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Selected on {new Date(destination.createdAt).toLocaleDateString()}
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handlePlanTrip(destination.name)}
                    >
                      <Plane className="mr-2" size={16} />
                      Plan Trip to {destination.name.split(',')[0]}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyDestinationsPage;