import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

export const getOrCreateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existing) return existing;

    return await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      role: 'client',
      imageUrl: args.imageUrl,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    return user;
  },
});

export const updateRole = mutation({
  args: {
    role: v.union(v.literal('client'), v.literal('freelancer')),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let clerkId: string;
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      clerkId = identity.subject;
    } else if (args.clerkId) {
      clerkId = args.clerkId;
    } else {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, { role: args.role });
    return user._id;
  },
});

export const updateNotificationPreference = mutation({
  args: {
    preference: v.union(
      v.literal('telegram'),
      v.literal('whatsapp'),
      v.literal('both'),
    ),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let clerkId: string;
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      clerkId = identity.subject;
    } else if (args.clerkId) {
      clerkId = args.clerkId;
    } else {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, { notificationPreference: args.preference });
    return user._id;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();
  },
});

// Client-side sync: called from <ClerkSync /> on every sign-in.
// Takes clerkId from the Clerk useUser() hook so it works with the
// plain ConvexProvider (no Clerk JWT needed for the sync path).
// In production, the Clerk webhook handles this authoritatively.
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      role: 'client',
      imageUrl: args.imageUrl,
    });
  },
});

