# Usage Examples - AI Travel Planning System

## 📚 Table of Contents
1. [Basic Smart Pricing](#basic-smart-pricing)
2. [Trip Optimization](#trip-optimization)
3. [Vendor Integration](#vendor-integration)
4. [Complete User Flow](#complete-user-flow)
5. [Advanced Scenarios](#advanced-scenarios)

---

## 1. Basic Smart Pricing

### Example 1.1: Simple Hotel Pricing

```typescript
import { useSmartPricing } from "@/hooks/useSmartPricing";

function HotelPricing() {
  const { pricing, loading, error } = useSmartPricing({
    basePrice: 200,
    destination: "Paris",
    checkInDate: "2025-06-15",
    currentBookings: 85,
    capacity: 100,
    userBudgetLevel: "medium"
  });

  if (loading) return <div>Calculating best price...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Hotel Room</h3>
      <p>Base Price: ${200}</p>
      <p>Smart Price: ${pricing?.finalPrice}</p>
      <p>You save: {pricing?.discount}%</p>
      <p className="text-sm text-gray-600">
        {pricing?.explanation}
      </p>
    </div>
  );
}
```

**Output:**
```
Hotel Room
Base Price: $200
Smart Price: $262
You save: -31%
High demand • Peak season pricing • Limited availability
```

### Example 1.2: Activity Pricing with Discount

```typescript
const { pricing } = useSmartPricing({
  basePrice: 50,
  destination: "Tokyo",
  checkInDate: "2025-02-10", // Off-season
  currentBookings: 20,
  capacity: 100,
  userBudgetLevel: "low"
});

// Result: $32 (36% discount)
// Explanation: "Off-season discount • Low demand • Early booking discount"
```

### Example 1.3: Last-Minute Deal

```typescript
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const { pricing } = useSmartPricing({
  basePrice: 150,
  destination: "Barcelona",
  checkInDate: tomorrow.toISOString(),
  currentBookings: 60,
  capacity: 100,
  userBudgetLevel: "medium"
});

// Result: $120 (20% discount)
// Explanation: "Last-minute booking discount • Medium demand"
```

---

## 2. Trip Optimization

### Example 2.1: Basic Trip Optimization

```typescript
import { useTripOptimization } from "@/hooks/useSmartPricing";

function TripOptimizer() {
  const { optimizedTrip, loading, optimizeTrip } = useTripOptimization();

  const activities = [
    {
      name: "Eiffel Tower",
      type: "landmark",
      duration: 120,
      cost: 25,
      location: { lat: 48.8584, lng: 2.2945 },
      bestTimeSlot: "morning",
      priority: 10
    },
    {
      name: "Louvre Museum",
      type: "museum",
      duration: 180,
      cost: 17,
      location: { lat: 48.8606, lng: 2.3376 },
      bestTimeSlot: "afternoon",
      priority: 9
    },
    {
      name: "Notre-Dame",
      type: "landmark",
      duration: 60,
      cost: 0,
      location: { lat: 48.8530, lng: 2.3499 },
      bestTimeSlot: "morning",
      priority: 8
    }
  ];

  const handleOptimize = async () => {
    await optimizeTrip(activities, {
      budget: "medium",
      pace: "moderate",
      interests: ["culture", "history"],
      groupSize: 2
    }, 3);
  };

  return (
    <div>
      <button onClick={handleOptimize} disabled={loading}>
        {loading ? "Optimizing..." : "Optimize Trip"}
      </button>
      
      {optimizedTrip && (
        <div>
          <h3>Optimization Results</h3>
          <p>Total Cost: ${optimizedTrip.summary.totalCost}</p>
          <p>Travel Time: {optimizedTrip.summary.totalTravelTime} minutes</p>
          <p>Satisfaction Score: {optimizedTrip.summary.satisfactionScore}%</p>
          
          {optimizedTrip.optimizedItinerary.map((day, idx) => (
            <div key={idx}>
              <h4>Day {day.day}</h4>
              {day.activities.map((activity, actIdx) => (
                <p key={actIdx}>{activity.name} - ${activity.cost}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Output:**
```
Optimization Results
Total Cost: $42
Travel Time: 45 minutes
Satisfaction Score: 87%

Day 1
Eiffel Tower - $25
Notre-Dame - $0

Day 2
Louvre Museum - $17
```

### Example 2.2: Budget-Conscious Optimization

```typescript
await optimizeTrip(activities, {
  budget: "low",
  pace: "relaxed",
  interests: ["culture", "food"],
  groupSize: 1
}, 5);

// Result: Prioritizes free/low-cost activities
// Fewer activities per day (relaxed pace)
// Total cost optimized for low budget
```

### Example 2.3: Packed Itinerary

```typescript
await optimizeTrip(activities, {
  budget: "high",
  pace: "packed",
  interests: ["adventure", "nightlife", "culture"],
  groupSize: 4
}, 3);

// Result: 5 activities per day
// Optimized route for minimal travel time
// Higher budget allows premium experiences
```

---

## 3. Vendor Integration

### Example 3.1: Display Hotel with Smart Pricing

```typescript
import EnhancedHotelCard from "@/app/_components/EnhancedHotelCard";

function HotelList() {
  const hotel = {
    hotel_name: "Grand Plaza Hotel",
    hotel_address: "123 Main St, Paris",
    base_price: 200,
    smart_price: 170,
    price_explanation: "15% early booking discount + Shoulder season",
    hotel_image_url: "/images/hotel.jpg",
    rating: 4.7,
    description: "Luxury hotel in the heart of Paris",
    amenities: ["WiFi", "Breakfast", "Pool", "Gym"],
    geo_coordinates: { latitude: 48.8566, longitude: 2.3522 }
  };

  return (
    <EnhancedHotelCard
      hotel={hotel}
      destination="Paris"
      checkInDate="2025-06-15"
      onBook={() => console.log("Booking...")}
    />
  );
}
```

### Example 3.2: Vendor Dashboard Integration

```typescript
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function VendorPricingPanel() {
  const updatePricing = useMutation(api.VendorSchema.UpdateVendorPricing);
  
  const handleApplySmartPrice = async (vendorId, smartPrice) => {
    await updatePricing({
      vendorId,
      dynamicPrice: smartPrice,
      demandMultiplier: 1.25,
      seasonalMultiplier: 1.3
    });
  };

  return (
    <div>
      <h3>Smart Pricing Recommendation</h3>
      <p>Current Price: $150</p>
      <p>Suggested Price: $187</p>
      <button onClick={() => handleApplySmartPrice("vendor_123", 187)}>
        Apply Smart Price
      </button>
    </div>
  );
}
```

### Example 3.3: Register New Vendor

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function VendorRegistration() {
  const registerVendor = useMutation(api.VendorSchema.RegisterVendor);

  const handleSubmit = async (formData) => {
    const vendorId = await registerVendor({
      vendorName: formData.name,
      vendorType: "hotel",
      email: formData.email,
      phone: formData.phone,
      location: {
        city: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522
      },
      description: formData.description,
      amenities: ["WiFi", "Breakfast"],
      images: [formData.imageUrl],
      basePrice: 150,
      currency: "USD",
      capacity: 50,
      rating: 4.5
    });

    console.log("Vendor registered:", vendorId);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 4. Complete User Flow

### Example 4.1: End-to-End Trip Planning

```typescript
import { useState } from "react";
import { useSmartPricing, useTripOptimization } from "@/hooks/useSmartPricing";
import EnhancedHotelCard from "@/app/_components/EnhancedHotelCard";

function CompleteTripPlanner() {
  const [tripPlan, setTripPlan] = useState(null);
  const { optimizeTrip } = useTripOptimization();

  // Step 1: User creates trip via AI chat
  // (Handled by ChatBox component)

  // Step 2: Receive trip plan from AI
  const handleTripGenerated = (aiResponse) => {
    setTripPlan(aiResponse.trip_plan);
  };

  // Step 3: Display hotels with smart pricing
  const renderHotels = () => {
    return tripPlan?.hotels.map((hotel, idx) => (
      <EnhancedHotelCard
        key={idx}
        hotel={hotel}
        destination={tripPlan.destination}
        checkInDate={tripPlan.checkInDate}
        onBook={() => handleBookHotel(hotel)}
      />
    ));
  };

  // Step 4: Optimize itinerary
  const handleOptimize = async () => {
    const activities = tripPlan.itinerary.flatMap(day =>
      day.activities.map(activity => ({
        name: activity.place_name,
        type: "attraction",
        duration: 120,
        cost: activity.smart_price || 0,
        location: {
          lat: activity.geo_coordinates.latitude,
          lng: activity.geo_coordinates.longitude
        },
        priority: activity.priority_score || 5
      }))
    );

    await optimizeTrip(activities, {
      budget: tripPlan.budget,
      pace: "moderate",
      interests: ["culture"],
      groupSize: parseInt(tripPlan.group_size)
    }, tripPlan.itinerary.length);
  };

  // Step 5: Book selected options
  const handleBookHotel = async (hotel) => {
    // Booking logic
    console.log("Booking hotel:", hotel);
  };

  return (
    <div>
      {tripPlan && (
        <>
          <h1>Your Trip to {tripPlan.destination}</h1>
          
          <section>
            <h2>Hotels</h2>
            {renderHotels()}
          </section>

          <button onClick={handleOptimize}>
            Optimize Itinerary
          </button>

          <section>
            <h2>Itinerary</h2>
            {/* Display itinerary */}
          </section>
        </>
      )}
    </div>
  );
}
```

---

## 5. Advanced Scenarios

### Example 5.1: Dynamic Pricing Based on User History

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function PersonalizedPricing({ userId, hotelId }) {
  const userHistory = useQuery(api.TripDetail.GetUserTrip, { uid: userId });
  
  // Analyze user's past bookings
  const averageSpent = userHistory?.reduce((sum, trip) => 
    sum + (trip.tripDetail.total_estimated_cost || 0), 0
  ) / (userHistory?.length || 1);

  // Determine budget level
  const budgetLevel = averageSpent < 500 ? "low" 
    : averageSpent < 1500 ? "medium" 
    : "high";

  const { pricing } = useSmartPricing({
    basePrice: 200,
    destination: "Paris",
    checkInDate: "2025-06-15",
    userBudgetLevel: budgetLevel
  });

  return (
    <div>
      <p>Personalized Price: ${pricing?.finalPrice}</p>
      <p className="text-sm">
        Based on your travel history (avg: ${averageSpent.toFixed(0)})
      </p>
    </div>
  );
}
```

### Example 5.2: Real-Time Price Updates

```typescript
import { useEffect, useState } from "react";
import { useSmartPricing } from "@/hooks/useSmartPricing";

function RealTimePricing({ hotel }) {
  const [currentBookings, setCurrentBookings] = useState(80);

  // Simulate real-time booking updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBookings(prev => Math.min(100, prev + Math.random() * 2));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const { pricing } = useSmartPricing({
    basePrice: hotel.base_price,
    destination: hotel.location,
    checkInDate: hotel.checkInDate,
    currentBookings,
    capacity: 100
  });

  return (
    <div>
      <p>Current Price: ${pricing?.finalPrice}</p>
      <p className="text-xs text-gray-500">
        {currentBookings}% booked • Price updates in real-time
      </p>
    </div>
  );
}
```

### Example 5.3: Group Booking Discount

```typescript
function GroupBooking() {
  const [groupSize, setGroupSize] = useState(1);

  const { pricing } = useSmartPricing({
    basePrice: 150,
    destination: "Barcelona",
    checkInDate: "2025-07-01",
    userBudgetLevel: "medium"
  });

  // Apply group discount
  const groupDiscount = groupSize >= 5 ? 0.15 : groupSize >= 3 ? 0.10 : 0;
  const finalPrice = pricing?.finalPrice * (1 - groupDiscount);

  return (
    <div>
      <label>
        Group Size:
        <input 
          type="number" 
          value={groupSize}
          onChange={(e) => setGroupSize(parseInt(e.target.value))}
          min="1"
        />
      </label>
      
      <p>Base Price: ${pricing?.finalPrice}</p>
      {groupDiscount > 0 && (
        <p>Group Discount: {groupDiscount * 100}%</p>
      )}
      <p>Final Price per Person: ${finalPrice?.toFixed(2)}</p>
      <p>Total: ${(finalPrice * groupSize).toFixed(2)}</p>
    </div>
  );
}
```

### Example 5.4: Seasonal Pricing Calendar

```typescript
import { calculateSeasonalFactor } from "@/lib/smartPricing";

function PricingCalendar({ destination }) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getPriceForMonth = (monthIndex) => {
    const date = new Date(2025, monthIndex, 15);
    const seasonalFactor = calculateSeasonalFactor(date, destination);
    
    const multipliers = {
      "off-season": 0.75,
      "shoulder": 0.9,
      "peak-season": 1.3
    };

    return 150 * multipliers[seasonalFactor];
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {months.map((month, idx) => (
        <div key={idx} className="border p-3 rounded">
          <p className="font-semibold">{month}</p>
          <p className="text-lg">${getPriceForMonth(idx)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 5.5: A/B Testing Different Pricing Strategies

```typescript
function ABTestPricing({ userId }) {
  // Assign user to test group
  const testGroup = userId % 2 === 0 ? "A" : "B";

  const pricingParams = {
    basePrice: 150,
    destination: "Paris",
    checkInDate: "2025-06-15"
  };

  // Group A: Standard smart pricing
  const { pricing: pricingA } = useSmartPricing({
    ...pricingParams,
    userBudgetLevel: "medium"
  });

  // Group B: Aggressive discounting
  const { pricing: pricingB } = useSmartPricing({
    ...pricingParams,
    userBudgetLevel: "low" // More aggressive discounts
  });

  const displayPrice = testGroup === "A" ? pricingA : pricingB;

  // Track which group converts better
  const trackConversion = (accepted) => {
    console.log({
      testGroup,
      price: displayPrice?.finalPrice,
      accepted,
      timestamp: Date.now()
    });
  };

  return (
    <div>
      <p>Price: ${displayPrice?.finalPrice}</p>
      <button onClick={() => trackConversion(true)}>
        Book Now
      </button>
    </div>
  );
}
```

---

## 🎯 Common Patterns

### Pattern 1: Loading States

```typescript
function PricingWithLoading() {
  const { pricing, loading, error } = useSmartPricing({...});

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return <div>${pricing?.finalPrice}</div>;
}
```

### Pattern 2: Error Handling

```typescript
function RobustPricing() {
  const { pricing, error } = useSmartPricing({...});

  if (error) {
    // Fallback to base price
    return (
      <div>
        <p>${basePrice}</p>
        <p className="text-xs text-gray-500">
          Standard pricing (smart pricing unavailable)
        </p>
      </div>
    );
  }

  return <div>${pricing?.finalPrice}</div>;
}
```

### Pattern 3: Optimistic Updates

```typescript
function OptimisticBooking() {
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = async () => {
    // Optimistically update UI
    setIsBooked(true);

    try {
      await bookHotel();
    } catch (error) {
      // Revert on error
      setIsBooked(false);
      alert("Booking failed");
    }
  };

  return (
    <button onClick={handleBook} disabled={isBooked}>
      {isBooked ? "Booked!" : "Book Now"}
    </button>
  );
}
```

---

## 📚 Additional Resources

- See `FEATURES.md` for complete feature documentation
- See `QUICKSTART.md` for quick start guide
- See `INTEGRATION_GUIDE.md` for integration steps
- See `SYSTEM_OVERVIEW.md` for architecture details

---

**Happy coding! 🚀**
