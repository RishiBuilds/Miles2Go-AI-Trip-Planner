"use client";
import React from "react";
import { TrendingDown, TrendingUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SmartPricingCardProps = {
  name: string;
  basePrice: number;
  finalPrice: number;
  discount: number;
  explanation: string;
  currency?: string;
  imageUrl?: string;
};

const SmartPricingCard: React.FC<SmartPricingCardProps> = ({
  name,
  basePrice,
  finalPrice,
  discount,
  explanation,
  currency = "$",
  imageUrl,
}) => {
  const isPriceReduced = finalPrice < basePrice;
  const priceChange = Math.abs(discount);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 border border-gray-200">
      {imageUrl && (
        <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>

        <div className="flex items-baseline gap-3">
          {basePrice !== finalPrice && (
            <span className="text-gray-400 line-through text-sm">
              {currency}{basePrice}
            </span>
          )}
          <span className="text-2xl font-bold text-gray-900">
            {currency}{finalPrice}
          </span>
          {isPriceReduced && priceChange > 0 && (
            <span className="flex items-center text-green-600 text-sm font-medium">
              <TrendingDown className="h-4 w-4 mr-1" />
              {priceChange}% off
            </span>
          )}
          {!isPriceReduced && priceChange > 0 && (
            <span className="flex items-center text-orange-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{priceChange}%
            </span>
          )}
        </div>

        <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-900">{explanation}</p>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-xs text-gray-500 cursor-help">
              AI-optimized pricing
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Price calculated using demand analysis, seasonal trends, and
              real-time market data
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default SmartPricingCard;
