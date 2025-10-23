'use client'
import { Button } from "@/components/ui/button";
import { Star, Wallet2, MapPin, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Hotel } from "./ChatBox";
import axios from "axios";

type Props = {
  hotel: Hotel;
};

function HotelCardItem({ hotel }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>("/placeholder.jpg");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const GetGooglePlaceDetail = async () => {
      if (!hotel?.hotel_name) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const result = await axios.post('/api/google-place-detail', {
          placeName: hotel.hotel_name,
          address: hotel.hotel_address
        }, {
          signal: controller.signal,
          timeout: 8000
        });
        
        clearTimeout(timeoutId);
        
        // API returns { success: true, data: { photoUrl, placeDetails } }
        if (result.data?.success && result.data?.data?.photoUrl) {
          const imageUrl = result.data.data.photoUrl;
          
          // Validate URL
          if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
            setPhotoUrl(imageUrl);
          } else {
            setHasError(true);
          }
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error('Failed to fetch hotel image:', error);
        setHasError(true);
        // Keep placeholder on error
      } finally {
        setIsLoading(false);
      }
    };

    GetGooglePlaceDetail();
  }, [hotel?.hotel_name, hotel?.hotel_address]);

  return (
    <div className="flex flex-col rounded-2xl shadow-md hover:shadow-primary transition overflow-hidden bg-white h-full">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-200">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <ImageIcon size={48} className="mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        ) : (
          <Image
            src={photoUrl}
            alt={hotel?.hotel_name || "Hotel Image"}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              setPhotoUrl('/placeholder.jpg');
              setHasError(true);
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="font-semibold text-lg text-gray-800 line-clamp-2">
          {hotel.hotel_name}
        </h2>
        <p className="flex items-start gap-1 text-gray-500 text-sm line-clamp-2">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" /> 
          {hotel.hotel_address}
        </p>

        {/* Price & Rating */}
        <div className="flex justify-between items-center mt-1">
          <p className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg text-sm">
            <Wallet2 size={16} /> {hotel.price_per_night}
          </p>
          <p className="flex items-center gap-1 text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded-lg text-sm">
            <Star size={16} /> {hotel.rating}
          </p>
        </div>

        {/* View Button pinned at bottom */}
        <div className="mt-auto">
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.hotel_name + ' ' + hotel?.hotel_address)}`}
            target="_blank"
          >
            <Button
              variant="outline"
              className="w-full hover:bg-primary hover:text-white transition"
            >
              View on Map
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HotelCardItem;