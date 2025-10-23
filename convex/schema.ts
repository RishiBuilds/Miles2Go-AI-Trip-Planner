import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable:defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        subscription: v.optional(v.string()),
    }),

    TripDetailTable:defineTable({
        tripId: v.string(),
        tripDetail: v.any(),
        uid: v.id('UserTable')
    }),
    
    ContactMessages:defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        subject: v.string(),
        message: v.string(),
        createdAt: v.number(),    
    }),
    
    NewsletterSubscriptions: defineTable({
        email: v.string(),
        createdAt: v.number(),
    }),

    VendorTable: defineTable({
        vendorName: v.string(),
        vendorType: v.string(),
        email: v.string(),
        phone: v.string(),
        location: v.object({
            city: v.string(),
            country: v.string(),
            latitude: v.number(),
            longitude: v.number(),
        }),
        description: v.string(),
        amenities: v.array(v.string()),
        images: v.array(v.string()),
        basePrice: v.number(),
        currency: v.string(),
        capacity: v.number(),
        isActive: v.boolean(),
        createdAt: v.number(),
        totalBookings: v.number(),
        averageRating: v.number(),
        dynamicPrice: v.optional(v.number()),
        demandMultiplier: v.optional(v.number()),
        seasonalMultiplier: v.optional(v.number()),
        lastPriceUpdate: v.optional(v.number()),
    }),

    BookingTable: defineTable({
        tripId: v.string(),
        userId: v.id('UserTable'),
        vendorId: v.id('VendorTable'),
        bookingDate: v.number(),
        checkInDate: v.number(),
        checkOutDate: v.number(),
        numberOfGuests: v.number(),
        totalPrice: v.number(),
        status: v.string(),
        createdAt: v.number(),
    }),

    PricingHistoryTable: defineTable({
        vendorId: v.id('VendorTable'),
        date: v.number(),
        basePrice: v.number(),
        dynamicPrice: v.number(),
        demandLevel: v.string(),
        occupancyRate: v.number(),
        seasonalFactor: v.number(),
    }),

    AIRecommendationTable: defineTable({
        tripId: v.string(),
        userId: v.id('UserTable'),
        recommendationType: v.string(),
        recommendations: v.any(),
        confidence: v.number(),
        createdAt: v.number(),
    }),

    destinations: defineTable({
        id: v.string(),
        name: v.string(),
        country: v.string(),
        region: v.string(),
        description: v.string(),
        imageUrl: v.string(),
        rating: v.number(),
        bestTimeToVisit: v.string(),
        priceRange: v.string(),
        userId: v.optional(v.string()),
        createdAt: v.string(),
    }),
})