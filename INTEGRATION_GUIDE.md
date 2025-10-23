# Integration Guide - Adding Smart Pricing to Existing Trip Planning

This guide shows how to integrate the new smart pricing and optimization features into your existing trip planning flow.

## 🎯 Goal

Enhance the existing ChatBox trip planning experience with:
1. Smart pricing for hotels and activities
2. Trip optimization for better routes
3. Vendor recommendations
4. Real-time pricing explanations

## 📝 Step-by-Step Integration

### Step 1: Update the AI Model Response Handler

The AI model already returns enhanced data with smart pricing. The response now includes:

```typescript
{
  trip_plan: {
    hotels: [{
      base_price: number,
      smart_price: number,
      price_explanation: string,
      // ... other fields
    }],
    itinerary: [{
      activities: [{
        base_price: number,
        smart_price: number,
        price_explanation: string,
        priority_score: number,
        // ... other fields
      }]
    }],
    local_vendors: {
      restaurants: [...],
      transportation: [...],
      guides: [...]
    },
    hidden_gems: [...],
    optimization_score: number,
    total_estimated_cost: number
  }
}
```

### Step 2: Enhance the Itinerary Component

Update `app/create-new-trip/_components/Itinerary.tsx` to display smart pricing:

```tsx
import EnhancedHotelCard from "@/app/_components/EnhancedHotelCard";
import SmartPricingCard from "@/app/_components/SmartPricingCard";

// In your itinerary component
{tripDetail?.hotels?.map((hotel, idx) => (
  <EnhancedHotelCard
    key={idx}
    hotel={hotel}
    destination={tripDetail.destination}
    checkInDate={/* your check-in date */}
    onBook={() => handleHotelBooking(hotel)}
  />
))}
```

### Step 3: Add Real-Time Pricing Updates

Create a new component to fetch and display real-time pricing:

```tsx
// app/create-new-trip/_components/RealTimePricing.tsx
"use client";
import { useSmartPricing } from "@/hooks/useSmartPricing";
import { useEffect } from "react";

export function RealTimePricing({ hotel, onPriceUpdate }) {
  const { pricing, loading } = useSmartPricing({
    basePrice: hotel.base_price || hotel.price_per_night,
    destination: hotel.location,
    checkInDate: hotel.checkInDate,
    userBudgetLevel: "medium" // Get from user context
  });

  useEffect(() => {
    if (pricing && onPriceUpdate) {
      onPriceUpdate(pricing);
    }
  }, [pricing]);

  if (loading) return <span>Calculating best price...</span>;

  return (
    <div className="flex items-center gap-2">
      {pricing && (
        <>
          <span className="text-2xl font-bold">${pricing.finalPrice}</span>
          {pricing.discount > 0 && (
            <span className="text-green-600 text-sm">
              {pricing.discount}% off
            </span>
          )}
        </>
      )}
    </div>
  );
}
```

### Step 4: Add Trip Optimization Button

Add an optimization feature to the existing itinerary:

```tsx
// In your Itinerary component
import { useTripOptimization } from "@/hooks/useSmartPricing";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

function Itinerary() {
  const { optimizedTrip, loading, optimizeTrip } = useTripOptimization();
  const { tripDetailInfo } = useTripDetail();

  const handleOptimize = async () => {
    if (!tripDetailInfo?.itinerary) return;

    // Convert itinerary to activities format
    const activities = tripDetailInfo.itinerary.flatMap(day =>
      day.activities.map(activity => ({
        name: activity.place_name,
        type: activity.type || "attraction",
        duration: 120, // Default 2 hours
        cost: parseFloat(activity.smart_price || activity.ticket_pricing || "0"),
        location: {
          lat: activity.geo_coordinates.latitude,
          lng: activity.geo_coordinates.longitude
        },
        priority: activity.priority_score || 5
      }))
    );

    await optimizeTrip(activities, {
      budget: tripDetailInfo.budget,
      pace: "moderate",
      interests: tripDetailInfo.interests || [],
      groupSize: parseInt(tripDetailInfo.group_size) || 1
    }, tripDetailInfo.itinerary.length);
  };

  return (
    <div>
      {/* Existing itinerary display */}
      
      <Button 
        onClick={handleOptimize}
        disabled={loading}
        className="mt-4"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {loading ? "Optimizing..." : "Optimize Trip"}
      </Button>

      {optimizedTrip && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Optimization Results</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Cost</p>
              <p className="text-xl font-bold">${optimizedTrip.summary.totalCost}</p>
            </div>
            <div>
              <p className="text-gray-600">Satisfaction Score</p>
              <p className="text-xl font-bold">{optimizedTrip.summary.satisfactionScore}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 5: Display Vendor Recommendations

Add a new section to show local vendors:

```tsx
// app/create-new-trip/_components/VendorRecommendations.tsx
"use client";

export function VendorRecommendations({ vendors }) {
  if (!vendors) return null;

  return (
    <div className="mt-8 space-y-6">
      {/* Restaurants */}
      {vendors.restaurants && vendors.restaurants.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Recommended Restaurants</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {vendors.restaurants.map((restaurant, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h4 className="font-semibold">{restaurant.name}</h4>
                <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">{restaurant.price_range}</span>
                  <span className="text-sm">⭐ {restaurant.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transportation */}
      {vendors.transportation && vendors.transportation.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Transportation Options</h3>
          <div className="space-y-3">
            {vendors.transportation.map((transport, idx) => (
              <div key={idx} className="border rounded-lg p-4 flex justify-between">
                <div>
                  <h4 className="font-semibold">{transport.type}</h4>
                  <p className="text-sm text-gray-600">{transport.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${transport.estimated_cost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local Guides */}
      {vendors.guides && vendors.guides.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Local Guides</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {vendors.guides.map((guide, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h4 className="font-semibold">{guide.name}</h4>
                <p className="text-sm text-gray-600">{guide.specialty}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">${guide.price_per_day}/day</span>
                  <span className="text-sm">⭐ {guide.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Add Hidden Gems Section

```tsx
// app/create-new-trip/_components/HiddenGems.tsx
"use client";
import { Eye } from "lucide-react";

export function HiddenGems({ gems }) {
  if (!gems || gems.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-bold">Hidden Gems</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {gems.map((gem, idx) => (
          <div key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-900">{gem.name}</h4>
            <p className="text-sm text-gray-700 mt-2">{gem.description}</p>
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs text-purple-700">
                <strong>Why special:</strong> {gem.why_special}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                <strong>Best time:</strong> {gem.best_time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 7: Update the Main Itinerary Component

Bring it all together:

```tsx
// app/create-new-trip/_components/Itinerary.tsx
import { useTripDetail } from "@/app/provider";
import EnhancedHotelCard from "@/app/_components/EnhancedHotelCard";
import { VendorRecommendations } from "./VendorRecommendations";
import { HiddenGems } from "./HiddenGems";
import { useTripOptimization } from "@/hooks/useSmartPricing";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";

export default function Itinerary() {
  const { tripDetailInfo } = useTripDetail();
  const { optimizedTrip, loading, optimizeTrip } = useTripOptimization();

  if (!tripDetailInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Start planning your trip to see the itinerary</p>
      </div>
    );
  }

  const handleOptimize = async () => {
    // Optimization logic from Step 4
  };

  return (
    <div className="p-6 space-y-8">
      {/* Trip Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">{tripDetailInfo.destination}</h1>
        <div className="flex gap-6 text-sm">
          <span>📅 {tripDetailInfo.duration}</span>
          <span>👥 {tripDetailInfo.group_size}</span>
          <span>💰 {tripDetailInfo.budget} Budget</span>
        </div>
        {tripDetailInfo.optimization_score && (
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>Optimization Score: {tripDetailInfo.optimization_score}%</span>
          </div>
        )}
      </div>

      {/* Optimize Button */}
      <Button onClick={handleOptimize} disabled={loading} size="lg" className="w-full">
        <Sparkles className="mr-2 h-5 w-5" />
        {loading ? "Optimizing..." : "Optimize This Trip"}
      </Button>

      {/* Hotels */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended Hotels</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tripDetailInfo.hotels?.map((hotel, idx) => (
            <EnhancedHotelCard
              key={idx}
              hotel={hotel}
              destination={tripDetailInfo.destination}
              onBook={() => console.log("Book hotel:", hotel)}
            />
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Day-by-Day Itinerary</h2>
        {tripDetailInfo.itinerary?.map((day, idx) => (
          <div key={idx} className="mb-6 border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Day {day.day}</h3>
            <p className="text-gray-600 mb-4">{day.day_plan}</p>
            {day.estimated_daily_cost && (
              <p className="text-sm text-gray-500 mb-4">
                Estimated cost: ${day.estimated_daily_cost}
              </p>
            )}
            <div className="space-y-4">
              {day.activities?.map((activity, actIdx) => (
                <div key={actIdx} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">{activity.place_name}</h4>
                  <p className="text-sm text-gray-600">{activity.place_details}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    {activity.smart_price && (
                      <span className="font-semibold text-green-600">
                        ${activity.smart_price}
                      </span>
                    )}
                    {activity.base_price && activity.smart_price !== activity.base_price && (
                      <span className="line-through text-gray-400">
                        ${activity.base_price}
                      </span>
                    )}
                    <span className="text-gray-500">{activity.best_time_to_visit}</span>
                  </div>
                  {activity.price_explanation && (
                    <p className="text-xs text-blue-600 mt-1">
                      💡 {activity.price_explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Vendor Recommendations */}
      {tripDetailInfo.local_vendors && (
        <VendorRecommendations vendors={tripDetailInfo.local_vendors} />
      )}

      {/* Hidden Gems */}
      {tripDetailInfo.hidden_gems && (
        <HiddenGems gems={tripDetailInfo.hidden_gems} />
      )}

      {/* Total Cost Summary */}
      {tripDetailInfo.total_estimated_cost && (
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-4">Trip Cost Summary</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Estimated Cost</span>
            <span className="text-3xl font-bold text-green-600">
              ${tripDetailInfo.total_estimated_cost}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Prices optimized with AI for best value
          </p>
        </div>
      )}
    </div>
  );
}
```

## 🎨 Styling Tips

Add these utility classes to your `globals.css` if needed:

```css
/* Smooth animations for pricing updates */
.price-update {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Gradient backgrounds for premium features */
.premium-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Smart pricing badge */
.smart-price-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

## 🧪 Testing the Integration

1. **Test the full flow:**
   ```
   1. Go to /create-new-trip
   2. Chat with AI to create a trip
   3. View the enhanced itinerary with smart pricing
   4. Click "Optimize Trip" button
   5. See vendor recommendations and hidden gems
   ```

2. **Test individual components:**
   ```tsx
   // Test smart pricing
   import { useSmartPricing } from "@/hooks/useSmartPricing";
   
   // Test in any component
   const { pricing } = useSmartPricing({
     basePrice: 150,
     destination: "Paris",
     checkInDate: "2025-06-15"
   });
   ```

3. **Test API endpoints:**
   ```bash
   # Test smart pricing API
   curl -X POST http://localhost:3000/api/smart-pricing \
     -H "Content-Type: application/json" \
     -d '{"basePrice": 150, "destination": "Paris", "checkInDate": "2025-06-15"}'
   ```

## 📊 Monitoring & Analytics

Add tracking for:
- Price acceptance rate
- Optimization usage
- User satisfaction with smart pricing
- Vendor booking conversion

```typescript
// Example tracking
const trackPriceAcceptance = (basePrice: number, smartPrice: number, accepted: boolean) => {
  // Send to analytics
  console.log({
    event: "price_acceptance",
    basePrice,
    smartPrice,
    discount: ((basePrice - smartPrice) / basePrice) * 100,
    accepted
  });
};
```

## 🚀 Deployment Checklist

- [ ] All new API routes are tested
- [ ] Smart pricing algorithm is calibrated
- [ ] Components render correctly on all screen sizes
- [ ] Error handling is in place
- [ ] Loading states are implemented
- [ ] Database schema is updated in production
- [ ] Environment variables are set
- [ ] Documentation is updated

## 🎯 Next Steps

1. **A/B Testing**: Test smart pricing vs. static pricing
2. **User Feedback**: Collect feedback on pricing transparency
3. **Vendor Onboarding**: Create vendor registration flow
4. **Analytics Dashboard**: Build admin dashboard for pricing insights
5. **Mobile Optimization**: Ensure mobile experience is smooth

---

**Need Help?** Check `FEATURES.md` for detailed documentation or `QUICKSTART.md` for quick examples.
