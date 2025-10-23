import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "@/app/lib/arcjet";
import { auth, currentUser } from "@clerk/nextjs/server";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `You are an AI Trip Planner Agent.  
Your goal is to help the user design their perfect trip by asking **one clear and relevant travel-related question at a time**.  
Always maintain a **friendly, conversational, and professional tone** while guiding the user through their trip planning journey.  

CRITICAL: You will receive collectedInfo and shownUiTypes to track what information has already been gathered and which UI components have been shown. NEVER ask for information that's already collected or show UI components that have already been shown.

Required information to collect (in order):  
1. Destination city or country  
2. Starting location (source)  
3. Group size (Solo, Couple, Family, Friends)  
4. Budget level (Low, Medium, High)  
5. Trip duration (number of days)  
6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation, hidden gems)  
7. Special requirements or preferences (optional)  

⚠️ STRICT Rules:  
- NEVER ask multiple questions at once  
- NEVER repeat questions for information already collected  
- NEVER show UI components that have already been shown  
- Check collectedInfo object to see what's already gathered  
- Check shownUiTypes array to see which UI components were already displayed  
- If information is missing or unclear, ask for clarification  
- Keep responses short, natural, and engaging  
- Progress logically through the missing information only  

JSON Response Schema:  
{
  resp: "Your natural conversational text response to user",
  ui: "destination / groupSize / budget / tripDuration / travelInterests / specialRequirements / final"
}

UI Component Logic:  
- 'destination' → Ask for destination (only if not in collectedInfo.destination)  
- 'groupSize' → Ask for group size (only if not in collectedInfo.groupSize and not in shownUiTypes)  
- 'budget' → Ask for budget (only if not in collectedInfo.budget and not in shownUiTypes)  
- 'tripDuration' → Ask for duration (only if not in collectedInfo.duration and not in shownUiTypes)  
- 'travelInterests' → Ask for interests (only if not in collectedInfo.interests and not in shownUiTypes)  
- 'specialRequirements' → Ask for requirements (only if not in collectedInfo.requirements and not in shownUiTypes)  
- 'final' → Only when ALL required info is collected  

⚠️ CRITICAL: Before setting any UI type, verify that:
1. The information is not already in collectedInfo
2. The UI type is not already in shownUiTypes
3. Move to 'final' ONLY when all required information is complete
`;

const FINAL_PROMPT = `Generate a detailed, AI-optimized travel plan with the given details.  

IMPORTANT: Apply smart pricing logic based on:
- User's budget level (low/medium/high)
- Travel dates (consider seasonality and demand)
- Group size (bulk discounts for larger groups)
- Booking timing (early bird vs last-minute)

Include a list of hotel options with the following fields:  
- Hotel name, hotel address, base price per night, smart_price (AI-optimized), price_explanation, hotel image URL, geo-coordinates (latitude & longitude), rating, description, and amenities.  

Also, suggest a complete optimized itinerary with the following details:  
- Day-wise plan including activities optimized for minimal travel time and maximum experience
- Best time to visit each day
- For each activity/place: place name, place details, place image URL, geo-coordinates (latitude & longitude), place address, base_price, smart_price (AI-optimized), price_explanation, estimated travel time to reach the location, best time to visit, and priority_score (1-10).

Include vendor recommendations:
- Local restaurants with cuisine type and price range
- Transportation options with estimated costs
- Local guides or tour operators
- Hidden gems and off-the-beaten-path experiences

Return the output strictly in **valid JSON format** following this schema:

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "optimization_score": "number (0-100)",
    "total_estimated_cost": "number",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "base_price": "number",
        "smart_price": "number",
        "price_explanation": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string",
        "amenities": ["string"]
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "estimated_daily_cost": "number",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },
            "place_address": "string",
            "base_price": "number",
            "smart_price": "number",
            "price_explanation": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string",
            "priority_score": "number"
          }
        ]
      }
    ],
    "local_vendors": {
      "restaurants": [
        {
          "name": "string",
          "cuisine": "string",
          "price_range": "string",
          "rating": "number",
          "location": "string"
        }
      ],
      "transportation": [
        {
          "type": "string",
          "provider": "string",
          "estimated_cost": "number",
          "description": "string"
        }
      ],
      "guides": [
        {
          "name": "string",
          "specialty": "string",
          "price_per_day": "number",
          "rating": "number"
        }
      ]
    },
    "hidden_gems": [
      {
        "name": "string",
        "description": "string",
        "why_special": "string",
        "best_time": "string"
      }
    ]
  }
}
`;

export async function POST(req: NextRequest) {
  try {
    // Validate API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured");
      return NextResponse.json(
        { e: "API configuration error" },
        { status: 500 }
      );
    }

    const { messages, isFinal, collectedInfo = {}, shownUiTypes = [] } = await req.json();
    
    // Filter out invalid messages
    const validMessages = messages.filter((msg: any) => {
      // Must have a role
      if (!msg.role) return false;
      
      // Assistant and user messages must have content
      if (msg.role === 'assistant' || msg.role === 'user') {
        return msg.content && msg.content.trim().length > 0;
      }
      
      // System messages are always valid
      if (msg.role === 'system') return true;
      
      return false;
    });

    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("Original messages:", messages.length);
      console.log("Valid messages:", validMessages.length);
    }
    
    if (validMessages.length === 0) {
      return NextResponse.json(
        { e: "No valid messages provided" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const authResult = await auth();
    const hasPremiumAccess = typeof authResult?.has === "function" 
      ? authResult.has({ plan: "monthly" }) 
      : false;

    const decision = await aj.protect(req, {
      userId: user?.primaryEmailAddress?.emailAddress ?? "",
      requested: isFinal ? 55 : 0,
    });

    // @ts-ignore - aj decision typings vary by version
    if (decision?.reason?.remaining === 0 && !hasPremiumAccess) {
      return NextResponse.json(
        {
          resp: "No Free Credit Remaining Switch to Premium",
          ui: "limit",
        },
        { status: 402 }
      );
    }

    try {
      // Create context-aware system message
      const systemContent = isFinal ? FINAL_PROMPT : PROMPT;
      const contextMessage = isFinal ? "" : `

CURRENT CONTEXT:
- Collected Information: ${JSON.stringify(collectedInfo)}
- Already Shown UI Components: ${JSON.stringify(shownUiTypes)}

Based on this context, determine what information is still missing and what UI component should be shown next. Do NOT repeat questions for information already collected or show UI components already displayed.`;

      const completion = await openai.chat.completions.create({
        model: "alibaba/tongyi-deepresearch-30b-a3b:free",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemContent + contextMessage },
          ...validMessages,
        ],
      });

      const message = completion.choices?.[0]?.message;
      
      if (!message?.content) {
        console.error("No content in model response");
        return NextResponse.json(
          { e: "Empty model response" },
          { status: 502 }
        );
      }

      try {
        const payload = JSON.parse(message.content);
        return NextResponse.json(payload);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw content:", message.content);
        return NextResponse.json(
          { e: "Invalid model response format" },
          { status: 502 }
        );
      }
    } catch (openaiError: any) {
      // Enhanced error logging for OpenAI/OpenRouter errors
      console.error("OpenRouter API Error:", {
        status: openaiError.status,
        code: openaiError.code,
        message: openaiError.message,
        error: openaiError.error,
        type: openaiError.type,
      });

      // Check for specific error types
      if (openaiError.status === 400) {
        return NextResponse.json(
          { 
            e: "Invalid request to AI model. Please try again.",
            details: openaiError.message || "Bad request"
          },
          { status: 400 }
        );
      }

      if (openaiError.status === 401) {
        return NextResponse.json(
          { e: "API authentication failed" },
          { status: 500 }
        );
      }

      if (openaiError.status === 429) {
        return NextResponse.json(
          { e: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }

      // Generic model error
      return NextResponse.json(
        { 
          e: "AI model temporarily unavailable",
          details: openaiError.message 
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { 
        e: "Internal server error",
        details: error.message 
      },
      { status: 500 }
    );
  }
}