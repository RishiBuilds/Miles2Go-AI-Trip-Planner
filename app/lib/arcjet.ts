// app/lib/arcjet.ts
import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5, // 5 tokens per interval
      interval: 864000, // 24 hours (864000 ms)
      capacity: 100, // 100 tokens max
    }),
  ],
});
