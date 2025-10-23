// convex/mutations/CreateContactMessage.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const doc = {
      name: args.name,
      email: args.email,
      subject: args.subject,
      message: args.message,
      // leave phone as undefined if not provided (matches v.optional)
      phone: args.phone,
      // store epoch ms to match schema's v.number()
      createdAt: Date.now(),
    };

    const inserted = await ctx.db.insert("ContactMessages", doc);
    return inserted;
  },
});

export const SubscribeNewsletter = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("NewsletterSubscriptions")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (existing.length > 0) return existing[0]._id;
    const id = await ctx.db.insert("NewsletterSubscriptions", {
      email: args.email,
      createdAt: Date.now(),
    });
    return id;
  },
});