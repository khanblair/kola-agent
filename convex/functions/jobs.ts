import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    briefText: v.string(),
    region: v.optional(v.string()),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let subject: string;
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      subject = identity.subject;
    } else if (args.clerkId) {
      subject = args.clerkId;
    } else {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', subject))
      .first();

    if (!user) throw new Error('User not found');

    return await ctx.db.insert('jobs', {
      clientId: user._id,
      briefText: args.briefText,
      status: 'draft',
      region: args.region,
    });
  },
});

export const updateScope = mutation({
  args: {
    jobId: v.id('jobs'),
    structuredScope: v.any(),
    marketRateData: v.optional(v.any()),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error('Job not found');

    const updates: Record<string, unknown> = {
      structuredScope: args.structuredScope,
    };
    if (args.marketRateData !== undefined)
      updates.marketRateData = args.marketRateData;
    if (args.embedding !== undefined) updates.embedding = args.embedding;

    await ctx.db.patch(args.jobId, updates);
    return args.jobId;
  },
});

export const publish = mutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error('Job not found');

    await ctx.db.patch(args.jobId, { status: 'published' });
    return args.jobId;
  },
});

export const updateStatus = mutation({
  args: {
    jobId: v.id('jobs'),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('matched'),
      v.literal('closed'),
    ),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error('Job not found');

    await ctx.db.patch(args.jobId, { status: args.status });
    return args.jobId;
  },
});

export const getById = query({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    const client = await ctx.db.get(job.clientId);
    return {
      ...job,
      clientName: client?.name ?? 'Unknown',
      clientEmail: client?.email ?? '',
    };
  },
});

export const listByClient = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let subject: string;
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      subject = identity.subject;
    } else if (args.clerkId) {
      subject = args.clerkId;
    } else {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', subject))
      .first();

    if (!user) return [];

    return await ctx.db
      .query('jobs')
      .withIndex('by_client_id', (q) => q.eq('clientId', user._id))
      .order('desc')
      .collect();
  },
});

export const listByStatus = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('draft'),
        v.literal('published'),
        v.literal('matched'),
        v.literal('closed'),
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query('jobs')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .collect();
    }
    return await ctx.db.query('jobs').order('desc').collect();
  },
});
