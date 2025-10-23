import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type RealTimePricingData = {
  currentPrice: number;
  basePrice: number;
  occupancyRate: number;
  demandLevel: "low" | "medium" | "high" | "peak";
  priceChange: number;
  lastUpdated: Date;
};

/**
 * Hook for real-time pricing updates
 * Automatically recalculates prices based on live booking data
 */
export function useRealTimePricing(vendorId: Id<"VendorTable"> | null) {
  const [pricingData, setPricingData] = useState<RealTimePricingData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get real-time bookings data (simulated for now)
  const [liveBookings, setLiveBookings] = useState(0);

  useEffect(() => {
    if (!vendorId) return;

    // Simulate real-time booking updates
    const updateBookings = () => {
      setLiveBookings((prev) => {
        const change = Math.random() * 4 - 1; // -1 to +3
        return Math.max(0, Math.min(100, prev + change));
      });
    };

    // Initial value
    setLiveBookings(Math.random() * 100);

    // Update every 5 seconds
    const interval = setInterval(updateBookings, 5000);

    return () => clearInterval(interval);
  }, [vendorId]);

  useEffect(() => {
    if (!vendorId) return;

    setIsUpdating(true);

    // Calculate pricing based on occupancy
    const basePrice = 150; // Get from vendor data
    const occupancyRate = liveBookings;

    // Determine demand level
    let demandLevel: "low" | "medium" | "high" | "peak";
    if (occupancyRate >= 90) demandLevel = "peak";
    else if (occupancyRate >= 70) demandLevel = "high";
    else if (occupancyRate >= 40) demandLevel = "medium";
    else demandLevel = "low";

    // Calculate multipliers
    const demandMultipliers = {
      low: 0.85,
      medium: 1.0,
      high: 1.25,
      peak: 1.5,
    };

    const currentPrice = Math.round(
      basePrice * demandMultipliers[demandLevel]
    );
    const priceChange = ((currentPrice - basePrice) / basePrice) * 100;

    setPricingData({
      currentPrice,
      basePrice,
      occupancyRate,
      demandLevel,
      priceChange,
      lastUpdated: new Date(),
    });

    setIsUpdating(false);
  }, [liveBookings, vendorId]);

  return {
    pricingData,
    isUpdating,
    refresh: () => setLiveBookings((prev) => prev + 0.1), // Force update
  };
}

/**
 * Hook for monitoring all vendors' real-time pricing
 */
export function useVendorsPricing(city: string) {
  const vendors = useQuery(api.VendorSchema.GetVendorsByLocation, { city });
  const [pricingMap, setPricingMap] = useState<
    Record<string, RealTimePricingData>
  >({});

  useEffect(() => {
    if (!vendors) return;

    const updatePricing = () => {
      const newPricingMap: Record<string, RealTimePricingData> = {};

      vendors.forEach((vendor) => {
        const occupancyRate = Math.random() * 100;
        let demandLevel: "low" | "medium" | "high" | "peak";

        if (occupancyRate >= 90) demandLevel = "peak";
        else if (occupancyRate >= 70) demandLevel = "high";
        else if (occupancyRate >= 40) demandLevel = "medium";
        else demandLevel = "low";

        const demandMultipliers = {
          low: 0.85,
          medium: 1.0,
          high: 1.25,
          peak: 1.5,
        };

        const currentPrice = Math.round(
          vendor.basePrice * demandMultipliers[demandLevel]
        );
        const priceChange =
          ((currentPrice - vendor.basePrice) / vendor.basePrice) * 100;

        newPricingMap[vendor._id] = {
          currentPrice,
          basePrice: vendor.basePrice,
          occupancyRate,
          demandLevel,
          priceChange,
          lastUpdated: new Date(),
        };
      });

      setPricingMap(newPricingMap);
    };

    // Initial update
    updatePricing();

    // Update every 10 seconds
    const interval = setInterval(updatePricing, 10000);

    return () => clearInterval(interval);
  }, [vendors]);

  return {
    vendors,
    pricingMap,
    isLoading: vendors === undefined,
  };
}
