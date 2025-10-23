import { NextRequest, NextResponse } from "next/server";
import {
  optimizeItinerary,
  predictSatisfactionScore,
  type TripPreferences,
  type Activity,
} from "@/lib/aiTripOptimizer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activities, preferences, days } = body;

    if (!activities || !preferences || !days) {
      return NextResponse.json(
        { error: "Missing required fields: activities, preferences, days" },
        { status: 400 }
      );
    }

    // Validate preferences
    const validPreferences: TripPreferences = {
      budget: preferences.budget || 'medium',
      pace: preferences.pace || 'moderate',
      interests: preferences.interests || [],
      groupSize: preferences.groupSize || 1,
      accessibility: preferences.accessibility,
      dietaryRestrictions: preferences.dietaryRestrictions,
    };

    // Optimize the itinerary
    const optimizedItinerary = optimizeItinerary(
      activities,
      validPreferences,
      days
    );

    // Predict satisfaction score
    const satisfactionScore = predictSatisfactionScore(
      optimizedItinerary,
      validPreferences
    );

    // Calculate total trip cost
    const totalCost = optimizedItinerary.reduce(
      (sum, day) => sum + day.estimatedCost,
      0
    );

    // Calculate total travel time
    const totalTravelTime = optimizedItinerary.reduce(
      (sum, day) => sum + day.travelTime,
      0
    );

    return NextResponse.json({
      success: true,
      optimizedItinerary,
      summary: {
        totalCost: Math.round(totalCost),
        totalTravelTime: Math.round(totalTravelTime),
        satisfactionScore,
        averageDailyCost: Math.round(totalCost / days),
        totalActivities: activities.length,
      },
    });
  } catch (error: any) {
    console.error("Trip optimization error:", error);
    return NextResponse.json(
      { error: "Failed to optimize trip", details: error.message },
      { status: 500 }
    );
  }
}
