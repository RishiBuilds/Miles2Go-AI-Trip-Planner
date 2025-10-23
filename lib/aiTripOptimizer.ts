// AI-Powered Trip Optimization Engine

export type TripPreferences = {
  budget: 'low' | 'medium' | 'high';
  pace: 'relaxed' | 'moderate' | 'packed';
  interests: string[];
  groupSize: number;
  accessibility?: string[];
  dietaryRestrictions?: string[];
};

export type OptimizedItinerary = {
  day: number;
  activities: Activity[];
  estimatedCost: number;
  travelTime: number;
  optimizationScore: number;
};

export type Activity = {
  name: string;
  type: string;
  duration: number;
  cost: number;
  location: { lat: number; lng: number };
  bestTimeSlot: string;
  priority: number;
};

/**
 * Optimize itinerary based on user preferences and constraints
 */
export function optimizeItinerary(
  activities: Activity[],
  preferences: TripPreferences,
  days: number
): OptimizedItinerary[] {
  // Sort activities by priority and user interests
  const scoredActivities = activities.map((activity) => ({
    ...activity,
    score: calculateActivityScore(activity, preferences),
  }));

  scoredActivities.sort((a, b) => b.score - a.score);

  // Distribute activities across days
  const itinerary: OptimizedItinerary[] = [];
  const activitiesPerDay = getActivitiesPerDay(preferences.pace);
  
  for (let day = 1; day <= days; day++) {
    const dayActivities = scoredActivities.splice(0, activitiesPerDay);
    
    // Optimize route for the day (minimize travel time)
    const optimizedRoute = optimizeRoute(dayActivities);
    
    const estimatedCost = optimizedRoute.reduce((sum, a) => sum + a.cost, 0);
    const travelTime = calculateTotalTravelTime(optimizedRoute);
    
    itinerary.push({
      day,
      activities: optimizedRoute,
      estimatedCost,
      travelTime,
      optimizationScore: calculateDayScore(optimizedRoute, preferences),
    });
  }

  return itinerary;
}

/**
 * Calculate activity score based on user preferences
 */
function calculateActivityScore(
  activity: Activity,
  preferences: TripPreferences
): number {
  let score = activity.priority * 10;

  // Interest matching
  const interestMatch = preferences.interests.some((interest) =>
    activity.type.toLowerCase().includes(interest.toLowerCase())
  );
  if (interestMatch) score += 20;

  // Budget alignment
  const budgetMultipliers = { low: 0.5, medium: 1.0, high: 1.5 };
  const budgetScore = activity.cost <= budgetMultipliers[preferences.budget] * 100 ? 10 : -5;
  score += budgetScore;

  return score;
}

/**
 * Get recommended activities per day based on pace
 */
function getActivitiesPerDay(pace: 'relaxed' | 'moderate' | 'packed'): number {
  const paceMap = {
    relaxed: 2,
    moderate: 3,
    packed: 5,
  };
  return paceMap[pace];
}

/**
 * Optimize route to minimize travel time (simplified TSP)
 */
function optimizeRoute(activities: Activity[]): Activity[] {
  if (activities.length <= 1) return activities;

  const optimized: Activity[] = [activities[0]];
  const remaining = activities.slice(1);

  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    remaining.forEach((activity, index) => {
      const distance = calculateDistance(
        current.location,
        activity.location
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    optimized.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }

  return optimized;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total travel time for a route
 */
function calculateTotalTravelTime(activities: Activity[]): number {
  let totalTime = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    const distance = calculateDistance(
      activities[i].location,
      activities[i + 1].location
    );
    // Assume average speed of 30 km/h in city
    totalTime += (distance / 30) * 60; // Convert to minutes
  }
  return Math.round(totalTime);
}

/**
 * Calculate optimization score for a day
 */
function calculateDayScore(
  activities: Activity[],
  preferences: TripPreferences
): number {
  const travelTime = calculateTotalTravelTime(activities);
  const totalCost = activities.reduce((sum, a) => sum + a.cost, 0);
  
  // Lower travel time = higher score
  const travelScore = Math.max(0, 100 - travelTime);
  
  // Budget alignment score
  const budgetLimits = { low: 100, medium: 300, high: 1000 };
  const budgetScore = totalCost <= budgetLimits[preferences.budget] ? 50 : 0;
  
  return (travelScore + budgetScore) / 2;
}

/**
 * Generate personalized recommendations based on user behavior
 */
export function generatePersonalizedRecommendations(
  userHistory: any[],
  availableOptions: any[]
): any[] {
  // Simple collaborative filtering approach
  const recommendations = availableOptions.map((option) => {
    let score = 0;
    
    // Check similarity with user's past preferences
    userHistory.forEach((past) => {
      if (past.type === option.type) score += 10;
      if (past.priceRange === option.priceRange) score += 5;
      if (past.rating >= 4 && option.rating >= 4) score += 8;
    });
    
    return { ...option, recommendationScore: score };
  });

  return recommendations
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10);
}

/**
 * Predict user satisfaction score
 */
export function predictSatisfactionScore(
  itinerary: OptimizedItinerary[],
  preferences: TripPreferences
): number {
  let totalScore = 0;
  let factors = 0;

  itinerary.forEach((day) => {
    // Budget alignment
    const avgDailyCost = day.estimatedCost;
    const budgetLimits = { low: 100, medium: 300, high: 1000 };
    if (avgDailyCost <= budgetLimits[preferences.budget]) {
      totalScore += 20;
    }
    factors++;

    // Travel time efficiency
    if (day.travelTime < 120) {
      // Less than 2 hours
      totalScore += 15;
    }
    factors++;

    // Activity variety
    const activityTypes = new Set(day.activities.map((a) => a.type));
    totalScore += activityTypes.size * 5;
    factors++;
  });

  return Math.min(100, Math.round(totalScore / factors));
}
