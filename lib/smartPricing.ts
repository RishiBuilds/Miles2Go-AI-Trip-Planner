// Smart Pricing Algorithm for Dynamic Vendor Pricing

export type PricingFactors = {
  basePrice: number;
  demandLevel: 'low' | 'medium' | 'high' | 'peak';
  seasonalFactor: 'off-season' | 'shoulder' | 'peak-season';
  occupancyRate: number; // 0-100
  daysUntilBooking: number;
  competitorPrices?: number[];
  userBudgetLevel?: 'low' | 'medium' | 'high';
};

export type PricingResult = {
  finalPrice: number;
  discount: number;
  demandMultiplier: number;
  seasonalMultiplier: number;
  urgencyMultiplier: number;
  explanation: string;
};

// Demand-based multipliers
const DEMAND_MULTIPLIERS = {
  low: 0.85,      // 15% discount
  medium: 1.0,    // Base price
  high: 1.25,     // 25% increase
  peak: 1.5,      // 50% increase
};

// Seasonal multipliers
const SEASONAL_MULTIPLIERS = {
  'off-season': 0.75,    // 25% discount
  'shoulder': 0.9,       // 10% discount
  'peak-season': 1.3,    // 30% increase
};

/**
 * Calculate smart dynamic pricing based on multiple factors
 */
export function calculateSmartPrice(factors: PricingFactors): PricingResult {
  const {
    basePrice,
    demandLevel,
    seasonalFactor,
    occupancyRate,
    daysUntilBooking,
    competitorPrices,
    userBudgetLevel,
  } = factors;

  // 1. Demand multiplier
  const demandMultiplier = DEMAND_MULTIPLIERS[demandLevel];

  // 2. Seasonal multiplier
  const seasonalMultiplier = SEASONAL_MULTIPLIERS[seasonalFactor];

  // 3. Occupancy-based adjustment (higher occupancy = higher price)
  const occupancyMultiplier = 1 + (occupancyRate / 100) * 0.2; // Max 20% increase

  // 4. Urgency multiplier (last-minute bookings)
  let urgencyMultiplier = 1.0;
  if (daysUntilBooking <= 3) {
    urgencyMultiplier = 0.8; // 20% discount for last-minute
  } else if (daysUntilBooking <= 7) {
    urgencyMultiplier = 0.9; // 10% discount
  } else if (daysUntilBooking >= 60) {
    urgencyMultiplier = 0.85; // 15% discount for early booking
  }

  // 5. Competitor-based adjustment
  let competitorAdjustment = 1.0;
  if (competitorPrices && competitorPrices.length > 0) {
    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const priceRatio = basePrice / avgCompetitorPrice;
    
    // If we're more expensive, reduce price slightly
    if (priceRatio > 1.1) {
      competitorAdjustment = 0.95;
    }
  }

  // 6. User budget alignment
  let budgetAdjustment = 1.0;
  if (userBudgetLevel === 'low') {
    budgetAdjustment = 0.9; // Show more affordable options
  } else if (userBudgetLevel === 'high') {
    budgetAdjustment = 1.1; // Premium options
  }

  // Calculate final price
  const calculatedPrice = 
    basePrice * 
    demandMultiplier * 
    seasonalMultiplier * 
    occupancyMultiplier * 
    urgencyMultiplier * 
    competitorAdjustment * 
    budgetAdjustment;

  const finalPrice = Math.round(calculatedPrice * 100) / 100;
  const discount = Math.round(((basePrice - finalPrice) / basePrice) * 100);

  // Generate explanation
  const explanation = generatePricingExplanation({
    demandLevel,
    seasonalFactor,
    occupancyRate,
    daysUntilBooking,
    discount,
  });

  return {
    finalPrice,
    discount,
    demandMultiplier,
    seasonalMultiplier,
    urgencyMultiplier,
    explanation,
  };
}

/**
 * Determine demand level based on booking patterns
 */
export function calculateDemandLevel(
  currentBookings: number,
  capacity: number,
  historicalAverage: number
): 'low' | 'medium' | 'high' | 'peak' {
  const occupancyRate = (currentBookings / capacity) * 100;
  const demandRatio = currentBookings / historicalAverage;

  if (occupancyRate >= 90 || demandRatio >= 1.5) return 'peak';
  if (occupancyRate >= 70 || demandRatio >= 1.2) return 'high';
  if (occupancyRate >= 40 || demandRatio >= 0.8) return 'medium';
  return 'low';
}

/**
 * Determine seasonal factor based on date
 */
export function calculateSeasonalFactor(
  date: Date,
  destination: string
): 'off-season' | 'shoulder' | 'peak-season' {
  const month = date.getMonth(); // 0-11

  // Simplified seasonal logic (can be enhanced with destination-specific data)
  const peakMonths = [5, 6, 7, 11]; // June, July, August, December
  const shoulderMonths = [3, 4, 8, 9]; // April, May, September, October
  
  if (peakMonths.includes(month)) return 'peak-season';
  if (shoulderMonths.includes(month)) return 'shoulder';
  return 'off-season';
}

/**
 * Generate human-readable pricing explanation
 */
function generatePricingExplanation(params: {
  demandLevel: string;
  seasonalFactor: string;
  occupancyRate: number;
  daysUntilBooking: number;
  discount: number;
}): string {
  const { demandLevel, seasonalFactor, occupancyRate, daysUntilBooking, discount } = params;
  
  const parts: string[] = [];

  if (discount > 0) {
    parts.push(`${discount}% discount applied`);
  } else if (discount < 0) {
    parts.push(`${Math.abs(discount)}% premium due to high demand`);
  }

  if (demandLevel === 'peak' || demandLevel === 'high') {
    parts.push('High demand period');
  }

  if (seasonalFactor === 'peak-season') {
    parts.push('Peak season pricing');
  } else if (seasonalFactor === 'off-season') {
    parts.push('Off-season discount');
  }

  if (daysUntilBooking <= 3) {
    parts.push('Last-minute booking discount');
  } else if (daysUntilBooking >= 60) {
    parts.push('Early bird discount');
  }

  if (occupancyRate > 80) {
    parts.push('Limited availability');
  }

  return parts.join(' • ') || 'Standard pricing';
}

/**
 * Predict optimal pricing for future dates
 */
export function predictOptimalPrice(
  basePrice: number,
  targetDate: Date,
  historicalData: Array<{ date: Date; bookings: number; price: number }>
): number {
  // Simple prediction based on historical patterns
  const targetMonth = targetDate.getMonth();
  const relevantHistory = historicalData.filter(
    (d) => d.date.getMonth() === targetMonth
  );

  if (relevantHistory.length === 0) return basePrice;

  const avgHistoricalPrice =
    relevantHistory.reduce((sum, d) => sum + d.price, 0) / relevantHistory.length;

  return Math.round(avgHistoricalPrice * 100) / 100;
}
