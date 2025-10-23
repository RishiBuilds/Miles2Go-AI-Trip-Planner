"use client";
import React, { useState, useEffect } from "react";
import { useSmartPricing } from "@/hooks/useSmartPricing";
import { Star, MapPin, Wifi, Coffee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type EnhancedHotelCardProps = {
  hotel: {
    hotel_name: string;
    hotel_address: string;
    base_price?: number;
    smart_price?: number;
    price_explanation?: string;
    hotel_image_url: string;
    rating: number;
    description: string;
    amenities?: string[];
    geo_coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  destination: string;
  checkInDate?: string;
  onBook?: () => void;
};

const EnhancedHotelCard: React.FC<EnhancedHotelCardProps> = ({
  hotel,
  destination,
  checkInDate,
  onBook,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Use smart pricing if available
  const basePrice = hotel.base_price || parseFloat(hotel.smart_price?.toString() || "0");
  const smartPrice = hotel.smart_price || basePrice;
  const priceExplanation = hotel.price_explanation || "Standard pricing";

  const discount = basePrice > 0 ? Math.round(((basePrice - smartPrice) / basePrice) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={hotel.hotel_image_url || "/placeholder.jpg"}
          alt={hotel.hotel_name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {discount}% OFF
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{hotel.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {hotel.hotel_name}
          </h3>
          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{hotel.hotel_address}</span>
          </div>
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1"
              >
                {amenity.toLowerCase().includes("wifi") && <Wifi className="h-3 w-3" />}
                {amenity.toLowerCase().includes("breakfast") && <Coffee className="h-3 w-3" />}
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {hotel.description}
        </p>

        {/* Pricing */}
        <div className="border-t pt-4">
          <div className="flex items-baseline gap-3 mb-2">
            {basePrice !== smartPrice && basePrice > 0 && (
              <span className="text-gray-400 line-through text-lg">
                ${basePrice}
              </span>
            )}
            <span className="text-3xl font-bold text-gray-900">
              ${smartPrice}
            </span>
            <span className="text-gray-600 text-sm">/ night</span>
          </div>

          {/* AI Pricing Badge */}
          <div className="flex items-start gap-2 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-3">
            <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-purple-900 mb-1">
                AI-Optimized Price
              </p>
              <p className="text-xs text-purple-700">{priceExplanation}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={onBook}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1"
            >
              {showDetails ? "Hide" : "Details"}
            </Button>
          </div>
        </div>

        {/* Extended Details */}
        {showDetails && (
          <div className="border-t pt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div>
              <h4 className="font-semibold text-sm mb-2">All Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities?.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Location</h4>
              <p className="text-xs text-gray-600">
                Coordinates: {hotel.geo_coordinates.latitude.toFixed(4)},{" "}
                {hotel.geo_coordinates.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedHotelCard;
