import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a selected destination to the database
export const addSelectedDestination = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if destination already exists for this user
    const existingDestination = await ctx.db
      .query("destinations")
      .filter((q) => 
        q.and(
          q.eq(q.field("id"), args.id),
          q.eq(q.field("userId"), args.userId || null)
        )
      )
      .first();

    if (existingDestination) {
      // Update existing destination
      await ctx.db.patch(existingDestination._id, {
        name: args.name,
        country: args.country,
        region: args.region,
        description: args.description,
        imageUrl: args.imageUrl,
        rating: args.rating,
        bestTimeToVisit: args.bestTimeToVisit,
        priceRange: args.priceRange,
        createdAt: new Date().toISOString(),
      });
      return existingDestination._id;
    } else {
      // Create new destination
      const destinationId = await ctx.db.insert("destinations", {
        id: args.id,
        name: args.name,
        country: args.country,
        region: args.region,
        description: args.description,
        imageUrl: args.imageUrl,
        rating: args.rating,
        bestTimeToVisit: args.bestTimeToVisit,
        priceRange: args.priceRange,
        userId: args.userId,
        createdAt: new Date().toISOString(),
      });
      return destinationId;
    }
  },
});

// Get all selected destinations for a user
export const getUserDestinations = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("destinations")
      .filter((q) => q.eq(q.field("userId"), args.userId || null))
      .order("desc")
      .collect();
  },
});

// Get all destinations (for admin or general use)
export const getAllDestinations = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("destinations")
      .order("desc")
      .collect();
  },
});

// Remove a selected destination
export const removeSelectedDestination = mutation({
  args: {
    destinationId: v.id("destinations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.destinationId);
    return { success: true };
  },
});

// Get destination by ID
export const getDestinationById = query({
  args: {
    destinationId: v.id("destinations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.destinationId);
  },
});

// Get popular destinations (most selected)
export const getPopularDestinations = query({
  handler: async (ctx) => {
    const destinations = await ctx.db.query("destinations").collect();
    
    // Group by destination ID and count occurrences
    const destinationCounts = destinations.reduce((acc, dest) => {
      const key = dest.id;
      if (!acc[key]) {
        acc[key] = { ...dest, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by count
    return Object.values(destinationCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10); // Top 10 popular destinations
  },
});