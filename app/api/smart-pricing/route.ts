import { NextRequest, NextResponse } from "next/server";
import {
  calculateSmartPrice,
  calculateDemandLevel,
  calculateSeasonalFactor,
  type PricingFactors,
} from "@/lib/smartPricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      basePrice,
      destination,
      checkInDate,
      currentBookings,
      capacity,
      historicalAverage,
      competitorPrices,
      userBudgetLevel,
    } = body;

    // Validate required fields
    if (!basePrice || !destination || !checkInDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInDate);
    const today = new Date();
    const daysUntilBooking = Math.ceil(
      (checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate demand level
    const demandLevel = calculateDemandLevel(
      currentBookings || 0,
      capacity || 100,
      historicalAverage || 50
    );

    // Calculate seasonal factor
    const seasonalFactor = calculateSeasonalFactor(checkIn, destination);

    // Calculate occupancy rate
    const occupancyRate = capacity
      ? (currentBookings / capacity) * 100
      : 50;

    // Prepare pricing factors
    const pricingFactors: PricingFactors = {
      basePrice,
      demandLevel,
      seasonalFactor,
      occupancyRate,
      daysUntilBooking,
      competitorPrices,
      userBudgetLevel,
    };

    // Calculate smart price
    const pricingResult = calculateSmartPrice(pricingFactors);

    return NextResponse.json({
      success: true,
      pricing: pricingResult,
      factors: {
        demandLevel,
        seasonalFactor,
        occupancyRate: Math.round(occupancyRate),
        daysUntilBooking,
      },
    });
  } catch (error: any) {
    console.error("Smart pricing error:", error);
    return NextResponse.json(
      { error: "Failed to calculate pricing", details: error.message },
      { status: 500 }
    );
  }
}
