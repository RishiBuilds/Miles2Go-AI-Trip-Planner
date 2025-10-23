import { NextResponse } from "next/server";
import axios from "axios";

/**
 * API Route: /api/google-price-detail
 * Method: POST
 * Body: { placeName: string, checkIn: string, checkOut: string, guests: number }
 * Returns: { priceEstimate: object, availability: boolean }
 */
export async function POST(req: Request) {
  try {
    const { placeName, checkIn, checkOut, guests = 2 } = await req.json();

    if (!placeName) {
      return NextResponse.json(
        { error: "Missing place name" },
        { status: 400 }
      );
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    if (!GOOGLE_API_KEY) {
      console.error("Missing Google API key in environment variables");
      return NextResponse.json(
        { error: "Google API key missing" },
        { status: 500 }
      );
    }

    // 1️⃣ Search for the place by text to get place_id
    const findPlaceRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: placeName,
          inputtype: "textquery",
          fields: "place_id,name,formatted_address",
          key: GOOGLE_API_KEY,
        },
        timeout: 10000,
      }
    );

    const candidates = findPlaceRes.data?.candidates;
    
    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        priceEstimate: {
          minPrice: null,
          maxPrice: null,
          currency: "USD",
          message: "Place not found"
        },
        availability: false,
      });
    }

    const place = candidates[0];
    
    // 2️⃣ Get detailed place information including price level
    const placeDetailRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: place.place_id,
          fields: "price_level,rating,user_ratings_total,types",
          key: GOOGLE_API_KEY,
        },
        timeout: 10000,
      }
    );

    const placeDetails = placeDetailRes.data?.result;
    const priceLevel = placeDetails?.price_level || 2; // Default to moderate pricing
    
    // 3️⃣ Estimate pricing based on Google's price level (0-4 scale)
    const priceEstimates = {
      0: { min: 0, max: 50, label: "Free" },
      1: { min: 50, max: 100, label: "Inexpensive" },
      2: { min: 100, max: 200, label: "Moderate" },
      3: { min: 200, max: 400, label: "Expensive" },
      4: { min: 400, max: 1000, label: "Very Expensive" },
    };

    const estimate = priceEstimates[priceLevel as keyof typeof priceEstimates] || priceEstimates[2];
    
    // 4️⃣ Adjust for number of guests and duration
    const nights = checkIn && checkOut ? 
      Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
    
    const guestMultiplier = Math.max(1, Math.ceil(guests / 2));
    const adjustedMinPrice = estimate.min * nights * guestMultiplier;
    const adjustedMaxPrice = estimate.max * nights * guestMultiplier;

    return NextResponse.json({
      priceEstimate: {
        minPrice: adjustedMinPrice,
        maxPrice: adjustedMaxPrice,
        currency: "USD",
        priceLevel: priceLevel,
        priceLevelLabel: estimate.label,
        nights: nights,
        guests: guests,
        message: `Estimated ${estimate.label.toLowerCase()} pricing for ${nights} night(s)`
      },
      availability: true,
      placeDetails: {
        name: place.name,
        address: place.formatted_address,
        rating: placeDetails?.rating || null,
        totalRatings: placeDetails?.user_ratings_total || 0,
        types: placeDetails?.types || []
      }
    });

  } catch (error: any) {
    console.error("❌ Error fetching Google Price Detail:", {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });

    // Return a graceful fallback
    return NextResponse.json({
      priceEstimate: {
        minPrice: null,
        maxPrice: null,
        currency: "USD",
        message: "Price estimation unavailable"
      },
      availability: false,
    });
  }
}
