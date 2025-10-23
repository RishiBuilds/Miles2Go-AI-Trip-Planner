'use client'

import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, Ticket, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Activity } from "./ChatBox";
import axios from "axios";

type Props = {
  activity: Activity;
};

interface PlaceDetails {
  photoUrl: string;
  name?: string;
  formatted_address?: string;
  rating?: number | null;
}

function PlaceCardItem({ activity }: Props) {
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails>({
    photoUrl: "/placeholder.jpg",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const GetGooglePlaceDetail = async (placeName: string) => {
    try {
      setIsLoading(true);
      setError(false);

      const response = await axios.post('/api/google-place-detail', {
        placeName: placeName
      });
      
      // API returns { success: true, data: { photoUrl, placeDetails } }
      if (response.data?.success && response.data?.data) {
        const { photoUrl, placeDetails } = response.data.data;
        setPlaceDetails({
          photoUrl: photoUrl || "/placeholder.jpg",
          name: placeDetails?.name,
          formatted_address: placeDetails?.formatted_address,
          rating: placeDetails?.rating,
        });
      } else {
        // Fallback if response structure is unexpected
        setPlaceDetails({
          photoUrl: "/placeholder.jpg",
          name: placeName,
          formatted_address: "Address not available",
          rating: null,
        });
      }
    } catch (error: any) {
      console.error('Error fetching place details:', error);
      setError(true);
      
      // Fallback to placeholder
      setPlaceDetails({
        photoUrl: '/placeholder.jpg',
        name: placeName,
        formatted_address: 'Address not available',
        rating: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      if (activity?.place_name && isMounted) {
        await GetGooglePlaceDetail(activity.place_name);
      } else {
        setIsLoading(false);
      }
    };

    fetchDetails();

    // Cleanup to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [activity?.place_name]); // Only re-run when place_name changes

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activity?.place_name || ""
  )}`;

  return (
    <div className="flex flex-col rounded-2xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 overflow-hidden h-full bg-white">
      {/* Image with Loading State */}
      <div className="relative h-48 w-full bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        <Image
          src={placeDetails.photoUrl}
          width={400}
          height={200}
          alt={activity?.place_name || "Activity image"}
          className="object-cover h-48 w-full"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setPlaceDetails(prev => ({ ...prev, photoUrl: "/placeholder.jpg" }));
            setError(true);
            setIsLoading(false);
          }}
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <h2 className="font-semibold text-lg text-gray-800 line-clamp-2">
          {activity?.place_name || "Unknown Place"}
        </h2>

        {/* Address */}
        {activity?.place_address && (
          <div className="flex items-start gap-1 text-gray-600 text-xs">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{activity.place_address}</span>
          </div>
        )}

        {/* Rating (if available from Google) */}
        {placeDetails.rating && (
          <div className="flex items-center gap-1 text-yellow-600 text-sm">
            <span>⭐</span>
            <span className="font-medium">{placeDetails.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-3">
          {activity?.place_details || "No details available"}
        </p>

        {/* Ticket + Best Time */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-auto">
          {activity?.ticket_pricing && (
            <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium">
              <Ticket size={16} /> {activity.ticket_pricing}
            </span>
          )}
          {activity?.best_time_to_visit && (
            <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-medium">
              <Clock size={16} /> {activity.best_time_to_visit}
            </span>
          )}
        </div>

        {/* View on Maps Button */}
        <div className="mt-2">
          <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="outline"
              className="w-full hover:bg-primary hover:text-white transition-colors duration-200 gap-2"
            >
              <MapPin size={16} />
              View on Maps
              <ExternalLink size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlaceCardItem;