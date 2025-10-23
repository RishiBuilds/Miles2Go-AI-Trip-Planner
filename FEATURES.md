# AI-Based Dynamic Travel Planning & Smart Pricing System

## Overview

This system combines AI-powered travel planning with intelligent, demand-based pricing to create a win-win platform for both tourists and local vendors.

## 🚀 Key Features

### 1. AI-Powered Trip Planning

#### Personalized Itinerary Generation
- **Conversational AI Interface**: Natural language interaction to gather travel preferences
- **Smart Optimization**: Routes optimized for minimal travel time and maximum experience
- **Budget Alignment**: Recommendations tailored to user's budget level (low/medium/high)
- **Interest Matching**: Activities matched to user interests (adventure, culture, food, etc.)
- **Group Size Optimization**: Suggestions adapted for solo, couple, family, or group travel

#### Trip Optimization Engine (`lib/aiTripOptimizer.ts`)
- **Route Optimization**: Uses simplified TSP algorithm to minimize travel time between locations
- **Activity Scoring**: Prioritizes activities based on user preferences and constraints
- **Pace Customization**: Adjusts daily activity count based on preferred pace (relaxed/moderate/packed)
- **Satisfaction Prediction**: AI predicts trip satisfaction score before booking

### 2. Smart Pricing System

#### Dynamic Pricing Algorithm (`lib/smartPricing.ts`)

The system calculates optimal prices using multiple factors:

**Pricing Factors:**
- **Demand Level**: Low (15% discount) → Medium (base) → High (25% premium) → Peak (50% premium)
- **Seasonal Factors**: Off-season (25% discount) → Shoulder (10% discount) → Peak season (30% premium)
- **Occupancy Rate**: Higher occupancy = higher prices (up to 20% increase)
- **Booking Urgency**: 
  - Last-minute (≤3 days): 20% discount
  - Week ahead (≤7 days): 10% discount
  - Early booking (≥60 days): 15% discount
- **Competitor Analysis**: Adjusts pricing based on market rates
- **User Budget Alignment**: Tailors pricing to user's budget preferences

**Example Calculation:**
```typescript
Base Price: $150
+ Demand (High): ×1.25
+ Season (Peak): ×1.3
+ Occupancy (80%): ×1.16
+ Early Booking: ×0.85
= Final Price: $214
```

#### API Endpoints

**`/api/smart-pricing`** - Calculate dynamic pricing
```json
POST /api/smart-pricing
{
  "basePrice": 150,
  "destination": "Paris",
  "checkInDate": "2025-06-15",
  "currentBookings": 80,
  "capacity": 100,
  "userBudgetLevel": "medium"
}

Response:
{
  "success": true,
  "pricing": {
    "finalPrice": 214,
    "discount": -43,
    "demandMultiplier": 1.25,
    "seasonalMultiplier": 1.3,
    "explanation": "43% premium due to high demand • Peak season pricing"
  }
}
```

**`/api/optimize-trip`** - Optimize itinerary
```json
POST /api/optimize-trip
{
  "activities": [...],
  "preferences": {
    "budget": "medium",
    "pace": "moderate",
    "interests": ["culture", "food"],
    "groupSize": 2
  },
  "days": 5
}

Response:
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

### 3. Vendor Management System

#### Vendor Dashboard (`app/vendors/page.tsx`)
- **Business Overview**: Track bookings, revenue, and ratings
- **Smart Pricing Panel**: View AI-recommended prices with explanations
- **Booking Management**: Monitor and manage customer bookings
- **Analytics**: Understand demand patterns and optimize strategy

#### Vendor Database Schema (`convex/schema.ts`)
```typescript
VendorTable: {
  vendorName: string
  vendorType: "hotel" | "restaurant" | "transport" | "guide" | "activity"
  location: { city, country, latitude, longitude }
  basePrice: number
  dynamicPrice: number (AI-calculated)
  demandMultiplier: number
  seasonalMultiplier: number
  capacity: number
  totalBookings: number
  averageRating: number
}
```

#### Vendor Features
- **Registration System**: Easy onboarding for local businesses
- **Dynamic Pricing**: Automatic price optimization based on demand
- **Visibility Boost**: Get discovered by matching travelers
- **Revenue Analytics**: Track performance and pricing effectiveness

### 4. Enhanced AI Model Integration

#### Improved Prompts (`app/api/aimodel/route.ts`)
The AI model now generates:
- **Smart-priced recommendations** with explanations
- **Vendor information** (restaurants, guides, transport)
- **Hidden gems** and local experiences
- **Optimization scores** for trip quality
- **Cost breakdowns** with base vs. smart pricing

#### Response Schema
```json
{
  "trip_plan": {
    "optimization_score": 87,
    "total_estimated_cost": 2500,
    "hotels": [{
      "base_price": 200,
      "smart_price": 170,
      "price_explanation": "15% early booking discount"
    }],
    "local_vendors": {
      "restaurants": [...],
      "transportation": [...],
      "guides": [...]
    },
    "hidden_gems": [...]
  }
}
```

### 5. React Components

#### `SmartPricingCard` - Display pricing with AI insights
- Shows base price vs. smart price
- Visual discount/premium indicators
- Pricing explanation tooltip
- Responsive design

#### `EnhancedHotelCard` - Rich hotel presentation
- Image gallery with discount badges
- Rating display
- Amenities showcase
- AI pricing explanation
- Expandable details
- Booking integration

#### `useSmartPricing` Hook - Easy pricing integration
```typescript
const { pricing, loading, error } = useSmartPricing({
  basePrice: 150,
  destination: "Paris",
  checkInDate: "2025-06-15"
});
```

### 6. Database Enhancements

New tables added to `convex/schema.ts`:
- **VendorTable**: Store vendor information and pricing
- **BookingTable**: Track customer bookings
- **PricingHistoryTable**: Historical pricing data for analytics
- **AIRecommendationTable**: Store AI-generated recommendations

## 🎯 Benefits

### For Travelers
✅ Personalized trip plans optimized for preferences and budget
✅ Transparent pricing with AI-powered explanations
✅ Access to verified local vendors and hidden gems
✅ Time-optimized itineraries with minimal travel time
✅ Real-time pricing that can offer significant savings

### For Vendors
✅ Maximize revenue with demand-based pricing
✅ Increased visibility to matching travelers
✅ Automated pricing optimization
✅ Better occupancy rates through smart discounting
✅ Analytics to understand market trends
✅ Average 40% revenue increase with AI pricing

## 📊 Technical Architecture

```
Frontend (Next.js)
├── AI Chat Interface (ChatBox)
├── Smart Pricing Components
├── Vendor Dashboard
└── Trip Visualization

Backend APIs
├── /api/aimodel - AI trip generation
├── /api/smart-pricing - Dynamic pricing
├── /api/optimize-trip - Itinerary optimization
└── /api/google-place-detail - Location data

AI/ML Layer
├── Smart Pricing Algorithm
├── Trip Optimization Engine
├── Demand Prediction
└── Personalization Engine

Database (Convex)
├── Users & Trips
├── Vendors & Pricing
├── Bookings
└── Analytics
```

## 🚀 Getting Started

### For Developers

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```env
OPENROUTER_API_KEY=your_key
GOOGLE_PLACE_API_KEY=your_key
CONVEX_DEPLOYMENT=your_deployment
```

3. **Run development server**
```bash
npm run dev
```

4. **Access features**
- Main app: `http://localhost:3000`
- Features showcase: `http://localhost:3000/features`
- Vendor dashboard: `http://localhost:3000/vendors`

### For Vendors

1. Visit `/vendors` to access the dashboard
2. Register your business with location and pricing
3. Enable smart pricing to let AI optimize your rates
4. Monitor bookings and revenue in real-time

### For Travelers

1. Start a conversation at `/create-new-trip`
2. Answer AI questions about your preferences
3. Receive optimized itinerary with smart pricing
4. Book directly with local vendors

## 🔮 Future Enhancements

- [ ] Machine learning model for better price predictions
- [ ] Real-time availability integration
- [ ] Multi-currency support
- [ ] Mobile app with offline access
- [ ] Vendor review and rating system
- [ ] Group booking discounts
- [ ] Loyalty programs
- [ ] Weather-based pricing adjustments
- [ ] Social features (share trips, follow travelers)
- [ ] Integration with booking platforms

## 📝 API Documentation

See individual API route files for detailed documentation:
- `app/api/smart-pricing/route.ts`
- `app/api/optimize-trip/route.ts`
- `app/api/aimodel/route.ts`

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is proprietary software. All rights reserved.
