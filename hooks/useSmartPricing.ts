import { useState, useEffect } from "react";
import axios from "axios";

export type SmartPricingParams = {
  basePrice: number;
  destination: string;
  checkInDate: string;
  currentBookings?: number;
  capacity?: number;
  historicalAverage?: number;
  competitorPrices?: number[];
  userBudgetLevel?: "low" | "medium" | "high";
};

export type SmartPricingResult = {
  finalPrice: number;
  discount: number;
  demandMultiplier: number;
  seasonalMultiplier: number;
  urgencyMultiplier: number;
  explanation: string;
  factors: {
    demandLevel: string;
    seasonalFactor: string;
    occupancyRate: number;
    daysUntilBooking: number;
  };
};

export function useSmartPricing(params: SmartPricingParams | null) {
  const [pricing, setPricing] = useState<SmartPricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) {
      setPricing(null);
      return;
    }

    const fetchPricing = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post("/api/smart-pricing", params);
        
        if (response.data.success) {
          setPricing({
            ...response.data.pricing,
            factors: response.data.factors,
          });
        } else {
          setError("Failed to calculate pricing");
        }
      } catch (err: any) {
        console.error("Smart pricing error:", err);
        setError(err.response?.data?.error || "Failed to fetch pricing");
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [params?.basePrice, params?.checkInDate, params?.destination]);

  return { pricing, loading, error };
}

export function useTripOptimization() {
  const [optimizedTrip, setOptimizedTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeTrip = async (activities: any[], preferences: any, days: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/optimize-trip", {
        activities,
        preferences,
        days,
      });

      if (response.data.success) {
        setOptimizedTrip(response.data);
      } else {
        setError("Failed to optimize trip");
      }
    } catch (err: any) {
      console.error("Trip optimization error:", err);
      setError(err.response?.data?.error || "Failed to optimize trip");
    } finally {
      setLoading(false);
    }
  };

  return { optimizedTrip, loading, error, optimizeTrip };
}
