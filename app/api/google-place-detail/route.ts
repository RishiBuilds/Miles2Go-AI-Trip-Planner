import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { placeName } = await req.json();

    if (!process.env.GOOGLE_PLACE_API_KEY) {
      console.error("❌ Missing GOOGLE_PLACE_API_KEY in environment");
      return NextResponse.json(
        { success: false, message: "Missing API key" },
        { status: 500 }
      );
    }

    const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACE_API_KEY,
        "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
      },
    };

    const result = await axios.post(BASE_URL, { textQuery: placeName }, config);
    const place = result?.data?.places?.[0];
    const placeRefName = place?.photos?.[0]?.name;

    if (!placeRefName) {
      return NextResponse.json({ success: false, message: "No photo found" });
    }

    const photoUrl = `https://places.googleapis.com/v1/${placeRefName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${process.env.GOOGLE_PLACE_API_KEY}`;

    return NextResponse.json({
      success: true,
      data: {
        photoUrl,
        placeDetails: {
          id: place.id,
          name: place.displayName?.text,
        },
      },
    });
  } catch (e: any) {
    console.error("Error fetching place details:", e.response?.data || e.message);
    return NextResponse.json({ success: false, message: "API error" });
  }
}
