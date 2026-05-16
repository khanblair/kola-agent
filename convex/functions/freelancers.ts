import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    skills: v.array(v.string()),
    yearsOfExperience: v.number(),
    seniority: v.union(
      v.literal('junior'),
      v.literal('mid'),
      v.literal('senior'),
    ),
    notableProjects: v.array(v.string()),
    region: v.string(),
    cvText: v.string(),
    embedding: v.optional(v.array(v.float64())),
    telegramChatId: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    hourlyRateMin: v.optional(v.number()),
    hourlyRateMax: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');

    const existing = await ctx.db
      .query('freelancers')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        skills: args.skills,
        yearsOfExperience: args.yearsOfExperience,
        seniority: args.seniority,
        notableProjects: args.notableProjects,
        region: args.region,
        cvText: args.cvText,
        embedding: args.embedding,
        telegramChatId: args.telegramChatId,
        whatsappNumber: args.whatsappNumber,
        hourlyRateMin: args.hourlyRateMin,
        hourlyRateMax: args.hourlyRateMax,
      });
      return existing._id;
    }

    return await ctx.db.insert('freelancers', {
      userId: user._id,
      skills: args.skills,
      yearsOfExperience: args.yearsOfExperience,
      seniority: args.seniority,
      notableProjects: args.notableProjects,
      region: args.region,
      cvText: args.cvText,
      embedding: args.embedding,
      telegramChatId: args.telegramChatId,
      whatsappNumber: args.whatsappNumber,
      hourlyRateMin: args.hourlyRateMin,
      hourlyRateMax: args.hourlyRateMax,
    });
  },
});

export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) return null;

    return await ctx.db
      .query('freelancers')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .first();
  },
});

export const getById = query({
  args: { id: v.id('freelancers') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('freelancers').collect();
  },
});

export const updateEmbedding = mutation({
  args: {
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');

    const freelancer = await ctx.db
      .query('freelancers')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .first();

    if (!freelancer) throw new Error('Freelancer profile not found');

    await ctx.db.patch(freelancer._id, { embedding: args.embedding });
    return freelancer._id;
  },
});

export const updateProfile = mutation({
  args: {
    skills: v.optional(v.array(v.string())),
    yearsOfExperience: v.optional(v.number()),
    seniority: v.optional(
      v.union(
        v.literal('junior'),
        v.literal('mid'),
        v.literal('senior'),
      )
    ),
    notableProjects: v.optional(v.array(v.string())),
    region: v.optional(v.string()),
    telegramChatId: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    hourlyRateMin: v.optional(v.number()),
    hourlyRateMax: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');

    const freelancer = await ctx.db
      .query('freelancers')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .first();

    if (!freelancer) throw new Error('Freelancer profile not found');

    const updates: Record<string, unknown> = {};
    if (args.skills !== undefined) updates.skills = args.skills;
    if (args.yearsOfExperience !== undefined)
      updates.yearsOfExperience = args.yearsOfExperience;
    if (args.seniority !== undefined) updates.seniority = args.seniority;
    if (args.notableProjects !== undefined)
      updates.notableProjects = args.notableProjects;
    if (args.region !== undefined) updates.region = args.region;
    if (args.telegramChatId !== undefined)
      updates.telegramChatId = args.telegramChatId;
    if (args.whatsappNumber !== undefined)
      updates.whatsappNumber = args.whatsappNumber;
    if (args.hourlyRateMin !== undefined)
      updates.hourlyRateMin = args.hourlyRateMin;
    if (args.hourlyRateMax !== undefined)
      updates.hourlyRateMax = args.hourlyRateMax;

    await ctx.db.patch(freelancer._id, updates);
    return freelancer._id;
  },
});
