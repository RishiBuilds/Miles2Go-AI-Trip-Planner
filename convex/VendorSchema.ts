import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Vendor Registration
export const RegisterVendor = mutation({
  args: {
    vendorName: v.string(),
    vendorType: v.string(), // hotel, restaurant, transport, guide, activity
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
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { rating, ...vendorData } = args;
    const vendorId = await ctx.db.insert("VendorTable", {
      ...vendorData,
      isActive: true,
      createdAt: Date.now(),
      totalBookings: 0,
      averageRating: rating || 0,
    });
    return vendorId;
  },
});

// Get Vendors by Location and Type
export const GetVendorsByLocation = query({
  args: {
    city: v.string(),
    vendorType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let vendorsQuery = ctx.db
      .query("VendorTable")
      .filter((q) => q.eq(q.field("location.city"), args.city));

    if (args.vendorType) {
      vendorsQuery = vendorsQuery.filter((q) =>
        q.eq(q.field("vendorType"), args.vendorType)
      );
    }

    const vendors = await vendorsQuery.collect();
    return vendors;
  },
});

// Update Vendor Pricing
export const UpdateVendorPricing = mutation({
  args: {
    vendorId: v.id("VendorTable"),
    dynamicPrice: v.number(),
    demandMultiplier: v.number(),
    seasonalMultiplier: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.vendorId, {
      dynamicPrice: args.dynamicPrice,
      demandMultiplier: args.demandMultiplier,
      seasonalMultiplier: args.seasonalMultiplier,
      lastPriceUpdate: Date.now(),
    });
  },
});


// Get Vendor by Email (for vendor login)
export const GetVendorByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const vendor = await ctx.db
      .query("VendorTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    return vendor;
  },
});

// Get All Vendors (for admin)
export const GetAllVendors = query({
  args: {},
  handler: async (ctx) => {
    const vendors = await ctx.db
      .query("VendorTable")
      .order("desc")
      .collect();
    return vendors;
  },
});

// Update Vendor Details
export const UpdateVendorDetails = mutation({
  args: {
    vendorId: v.id("VendorTable"),
    vendorName: v.optional(v.string()),
    description: v.optional(v.string()),
    amenities: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    basePrice: v.optional(v.number()),
    capacity: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { vendorId, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    await ctx.db.patch(vendorId, cleanUpdates);
  },
});

// Get Pricing History
export const GetPricingHistory = query({
  args: {
    vendorId: v.id("VendorTable"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const daysAgo = args.days || 30;
    const cutoffDate = Date.now() - daysAgo * 24 * 60 * 60 * 1000;
    
    const history = await ctx.db
      .query("PricingHistoryTable")
      .filter((q) =>
        q.and(
          q.eq(q.field("vendorId"), args.vendorId),
          q.gte(q.field("date"), cutoffDate)
        )
      )
      .order("desc")
      .collect();
    
    return history;
  },
});

// Record Pricing History
export const RecordPricingHistory = mutation({
  args: {
    vendorId: v.id("VendorTable"),
    basePrice: v.number(),
    dynamicPrice: v.number(),
    demandLevel: v.string(),
    occupancyRate: v.number(),
    seasonalFactor: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("PricingHistoryTable", {
      ...args,
      date: Date.now(),
    });
  },
});
