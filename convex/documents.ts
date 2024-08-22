import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createDocument = mutation({
  args: {
    username: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("documents", {
      username: args.username,
    });
  },
});
