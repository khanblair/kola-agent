import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

export const log = mutation({
  args: {
    userId: v.id('users'),
    channel: v.union(v.literal('telegram'), v.literal('whatsapp')),
    message: v.string(),
    delivered: v.boolean(),
    relatedJobId: v.optional(v.id('jobs')),
    relatedMatchId: v.optional(v.id('matches')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('notifications', {
      userId: args.userId,
      channel: args.channel,
      message: args.message,
      delivered: args.delivered,
      deliveredAt: args.delivered ? Date.now() : undefined,
      relatedJobId: args.relatedJobId,
      relatedMatchId: args.relatedMatchId,
    });
  },
});

export const markDelivered = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error('Notification not found');

    await ctx.db.patch(args.notificationId, {
      delivered: true,
      deliveredAt: Date.now(),
    });
    return args.notificationId;
  },
});

export const getByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) return [];

    return await ctx.db
      .query('notifications')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});

export const getByJob = query({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, args) => {
    const allNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_id')
      .collect();

    return allNotifications.filter((n) => n.relatedJobId === args.jobId);
  },
});
