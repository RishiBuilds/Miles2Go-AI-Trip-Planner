"use client";
import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/provider";
import { TripInfo } from "./ChatBox";

function Itinerary() {
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (tripDetailInfo) {
      setTripData(tripDetailInfo);
      setIsLoading(false);
    }
  }, [tripDetailInfo]);

  // Generate timeline data from trip information
  const generateTimelineData = () => {
    if (!tripData) return [];

    const timelineItems = [];

    // Add Hotels section if available
    if (tripData.hotels && tripData.hotels.length > 0) {
      timelineItems.push({
        title: "Hotels",
        content: (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Recommended accommodations for your stay
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripData.hotels.map((hotel, index) => (
                <HotelCardItem key={`hotel-${index}-${hotel.hotel_name}`} hotel={hotel} />
              ))}
            </div>
          </div>
        ),
      });
    }

    // Add daily itinerary sections
    if (tripData.itinerary && tripData.itinerary.length > 0) {
      tripData.itinerary.forEach((dayData) => {
        timelineItems.push({
          title: `Day ${dayData.day}`,
          content: (
            <div className="space-y-4">
              {/* Day Overview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {dayData.day_plan}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Best Time:</strong>{" "}
                  <span className="text-primary font-medium">
                    {dayData.best_time_to_visit_day}
                  </span>
                </p>
              </div>

              {/* Activities */}
              {dayData.activities && dayData.activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dayData.activities.map((activity, index) => (
                    <PlaceCardItem
                      key={`day-${dayData.day}-activity-${index}-${activity.place_name}`}
                      activity={activity}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No activities planned for this day</p>
              )}
            </div>
          ),
        });
      });
    }

    return timelineItems;
  };

  const timelineData = generateTimelineData();

  return (
    <div className="relative w-full h-[83vh] overflow-auto">
      {tripData && timelineData.length > 0 ? (
        <div className="p-4">
          <Timeline data={timelineData} tripData={tripData} />
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Loading/Welcome State */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/travel.png"
              alt="Travel planning illustration"
              width={800}
              height={800}
              className="w-full h-full object-cover rounded-3xl"
              priority
            />
            <div className="absolute inset-0 bg-black/40 rounded-3xl" />
          </div>

          {/* Welcome Message */}
          <div className="relative z-10 text-center px-6 max-w-2xl">
            <h2 className="flex flex-col sm:flex-row gap-3 items-center justify-center text-2xl sm:text-3xl text-white font-bold">
              <span className="text-black flex gap-2 items-center bg-white/90 px-4 py-2 rounded-lg">
                <ArrowLeft size={32} />
                Getting to know you
              </span>
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-white font-medium">
              to build your perfect trip...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Itinerary;