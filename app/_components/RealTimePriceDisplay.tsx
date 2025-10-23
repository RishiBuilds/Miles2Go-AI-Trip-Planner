"use client";
import React from "react";
import { useRealTimePricing } from "@/hooks/useRealTimePricing";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

type RealTimePriceDisplayProps = {
  vendorId: Id<"VendorTable">;
  showDetails?: boolean;
};

const RealTimePriceDisplay: React.FC<RealTimePriceDisplayProps> = ({
  vendorId,
  showDetails = false,
}) => {
  const { pricingData, isUpdating, refresh } = useRealTimePricing(vendorId);

  if (!pricingData) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const { currentPrice, basePrice, occupancyRate, demandLevel, priceChange, lastUpdated } =
    pricingData;

  const isPriceUp = priceChange > 0;
  const demandColors = {
    low: "text-green-600 bg-green-50",
    medium: "text-blue-600 bg-blue-50",
    high: "text-orange-600 bg-orange-50",
    peak: "text-red-600 bg-red-50",
  };

  return (
    <div className="space-y-2">
      {/* Price Display */}
      <div className="flex items-baseline gap-3">
        {basePrice !== currentPrice && (
          <span className="text-gray-400 line-through text-lg">
            ${basePrice}
          </span>
        )}
        <span className="text-3xl font-bold text-gray-900">
          ${currentPrice}
        </span>
        {priceChange !== 0 && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              isPriceUp ? "text-orange-600" : "text-green-600"
            }`}
          >
            {isPriceUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(priceChange).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Real-time Indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live pricing
        </span>
        <span>•</span>
        <span>Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s ago</span>
        <button
          onClick={refresh}
          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
          disabled={isUpdating}
        >
          <RefreshCw className={`h-3 w-3 ${isUpdating ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Occupancy Rate</span>
            <span className="font-semibold">{occupancyRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Demand Level</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${demandColors[demandLevel]}`}
            >
              {demandLevel.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimePriceDisplay;
