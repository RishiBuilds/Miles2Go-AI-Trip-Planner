# Quick Start Guide - AI Travel Planning with Smart Pricing

## 🎯 What's New

Your travel planning platform now includes:

1. **AI-Powered Smart Pricing** - Dynamic pricing based on demand, seasonality, and market conditions
2. **Trip Optimization Engine** - AI optimizes routes and activities for best experience
3. **Vendor Management System** - Dashboard for local businesses to manage listings and pricing
4. **Enhanced Components** - Beautiful UI components with smart pricing displays

## 🚀 Quick Demo

### 1. View Features Showcase
```
Navigate to: http://localhost:3000/features
```
This page demonstrates all new features with interactive examples.

### 2. Try Smart Pricing
```typescript
// In any component
import { useSmartPricing } from "@/hooks/useSmartPricing";

const { pricing, loading } = useSmartPricing({
  basePrice: 150,
  destination: "Paris",
  checkInDate: "2025-06-15",
  userBudgetLevel: "medium"
});

// pricing.finalPrice - AI-calculated price
// pricing.explanation - Why this price
```

### 3. Optimize a Trip
```typescript
import { useTripOptimization } from "@/hooks/useSmartPricing";

const { optimizedTrip, optimizeTrip } = useTripOptimization();

await optimizeTrip(activities, {
  budget: "medium",
  pace: "moderate",
  interests: ["culture", "food"],
  groupSize: 2
}, 5); // 5 days
```

### 4. Display Smart Pricing
```typescript
import SmartPricingCard from "@/app/_components/SmartPricingCard";

<SmartPricingCard
  name="Hotel Name"
  basePrice={200}
  finalPrice={170}
  discount={15}
  explanation="Early booking discount + Off-season"
/>
```

### 5. Enhanced Hotel Cards
```typescript
import EnhancedHotelCard from "@/app/_components/EnhancedHotelCard";

<EnhancedHotelCard
  hotel={hotelData}
  destination="Paris"
  checkInDate="2025-06-15"
  onBook={() => handleBooking()}
/>
```

## 📁 New Files Created

### Core Logic
- `lib/smartPricing.ts` - Smart pricing algorithm
- `lib/aiTripOptimizer.ts` - Trip optimization engine

### API Routes
- `app/api/smart-pricing/route.ts` - Dynamic pricing endpoint
- `app/api/optimize-trip/route.ts` - Trip optimization endpoint

### Database
- `convex/VendorSchema.ts` - Vendor operations
- Updated `convex/schema.ts` - New tables for vendors, bookings, pricing history

### React Components
- `app/_components/SmartPricingCard.tsx` - Display pricing with AI insights
- `app/_components/EnhancedHotelCard.tsx` - Rich hotel presentation
- `app/_components/IntegrationExample.tsx` - Full integration example

### Hooks
- `hooks/useSmartPricing.ts` - Easy pricing and optimization hooks

### Pages
- `app/features/page.tsx` - Features showcase
- `app/vendors/page.tsx` - Vendor dashboard

### Documentation
- `FEATURES.md` - Complete feature documentation
- `QUICKSTART.md` - This file

## 🔧 API Endpoints

### POST /api/smart-pricing
Calculate dynamic pricing for any service.

**Request:**
```json
{
  "basePrice": 150,
  "destination": "Paris",
  "checkInDate": "2025-06-15",
  "currentBookings": 80,
  "capacity": 100,
  "userBudgetLevel": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "pricing": {
    "finalPrice": 187,
    "discount": -25,
    "demandMultiplier": 1.25,
    "seasonalMultiplier": 1.3,
    "explanation": "High demand + Peak season"
  },
  "factors": {
    "demandLevel": "high",
    "seasonalFactor": "peak-season",
    "occupancyRate": 80,
    "daysUntilBooking": 45
  }
}
```

### POST /api/optimize-trip
Optimize itinerary for best experience.

**Request:**
```json
{
  "activities": [
    {
      "name": "Eiffel Tower",
      "type": "landmark",
      "duration": 120,
      "cost": 25,
      "location": { "lat": 48.8584, "lng": 2.2945 },
      "priority": 10
    }
  ],
  "preferences": {
    "budget": "medium",
    "pace": "moderate",
    "interests": ["culture", "food"],
    "groupSize": 2
  },
  "days": 5
}
```

**Response:**
```json
{
  "success": true,
  "optimizedItinerary": [...],
  "summary": {
    "totalCost": 1250,
    "totalTravelTime": 180,
    "satisfactionScore": 87,
    "averageDailyCost": 250
  }
}
```

## 🎨 Component Examples

### Basic Smart Pricing
```tsx
import { useSmartPricing } from "@/hooks/useSmartPricing";

function HotelPrice() {
  const { pricing, loading } = useSmartPricing({
    basePrice: 200,
    destination: "Paris",
    checkInDate: "2025-06-15"
  });

  if (loading) return <div>Calculating...</div>;

  return (
    <div>
      <p>Base: ${200}</p>
      <p>Smart Price: ${pricing?.finalPrice}</p>
      <p>{pricing?.explanation}</p>
    </div>
  );
}
```

### Trip Optimization
```tsx
import { useTripOptimization } from "@/hooks/useSmartPricing";

function TripPlanner() {
  const { optimizedTrip, optimizeTrip } = useTripOptimization();

  const handleOptimize = async () => {
    await optimizeTrip(activities, preferences, 5);
  };

  return (
    <div>
      <button onClick={handleOptimize}>Optimize Trip</button>
      {optimizedTrip && (
        <div>
          <p>Total Cost: ${optimizedTrip.summary.totalCost}</p>
          <p>Satisfaction: {optimizedTrip.summary.satisfactionScore}%</p>
        </div>
      )}
    </div>
  );
}
```

## 🔍 Testing the Features

### 1. Test Smart Pricing
```bash
# Using curl
curl -X POST http://localhost:3000/api/smart-pricing \
  -H "Content-Type: application/json" \
  -d '{
    "basePrice": 150,
    "destination": "Paris",
    "checkInDate": "2025-06-15"
  }'
```

### 2. Test Trip Optimization
```bash
curl -X POST http://localhost:3000/api/optimize-trip \
  -H "Content-Type: application/json" \
  -d '{
    "activities": [...],
    "preferences": {"budget": "medium", "pace": "moderate"},
    "days": 5
  }'
```

### 3. View Integration Example
Navigate to any page and import:
```tsx
import IntegrationExample from "@/app/_components/IntegrationExample";

<IntegrationExample />
```

## 📊 Pricing Algorithm Details

The smart pricing algorithm considers:

1. **Demand Level** (4 tiers)
   - Low: 15% discount
   - Medium: Base price
   - High: 25% premium
   - Peak: 50% premium

2. **Seasonal Factors**
   - Off-season: 25% discount
   - Shoulder: 10% discount
   - Peak season: 30% premium

3. **Booking Timing**
   - Last-minute (≤3 days): 20% discount
   - Week ahead (≤7 days): 10% discount
   - Early bird (≥60 days): 15% discount

4. **Occupancy Rate**
   - Higher occupancy = higher prices (up to 20%)

5. **Competitor Pricing**
   - Adjusts based on market rates

6. **User Budget**
   - Tailors recommendations to budget level

## 🎯 Next Steps

1. **Integrate with existing trip creation flow**
   - Update `app/create-new-trip/_components/ChatBox.tsx` to use smart pricing
   - Display optimized prices in itinerary

2. **Add vendor registration**
   - Create vendor signup flow
   - Connect to payment processing

3. **Enhance AI model**
   - Update prompts to include smart pricing in responses
   - Add vendor recommendations

4. **Add analytics**
   - Track pricing effectiveness
   - Monitor user satisfaction

## 💡 Tips

- Smart pricing works best with real booking data
- Start with conservative multipliers and adjust based on results
- Test different scenarios (peak season, last-minute, etc.)
- Monitor vendor feedback on pricing recommendations
- Use A/B testing to optimize pricing strategy

## 🐛 Troubleshooting

**Pricing seems off?**
- Check `lib/smartPricing.ts` multipliers
- Verify input data (dates, occupancy, etc.)
- Review seasonal factor calculation

**Optimization not working?**
- Ensure activities have valid coordinates
- Check that preferences are properly formatted
- Verify activity priorities are set

**Components not displaying?**
- Check that all dependencies are installed
- Verify image URLs are valid
- Ensure data structure matches expected format

## 📚 Learn More

- See `FEATURES.md` for complete documentation
- Check individual API route files for detailed specs
- Review component files for prop types and usage

## 🤝 Support

For questions or issues:
1. Check the documentation files
2. Review the integration example
3. Test with the features showcase page
4. Examine the API responses for errors

---

**Happy Building! 🚀**
