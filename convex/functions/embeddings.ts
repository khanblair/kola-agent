import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const storeJobEmbedding = mutation({
  args: {
    jobId: v.id('jobs'),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error('Job not found');

    await ctx.db.patch(args.jobId, { embedding: args.embedding });
    return args.jobId;
  },
});

export const storeFreelancerEmbedding = mutation({
  args: {
    freelancerId: v.id('freelancers'),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const freelancer = await ctx.db.get(args.freelancerId);
    if (!freelancer) throw new Error('Freelancer not found');

    await ctx.db.patch(args.freelancerId, { embedding: args.embedding });
    return args.freelancerId;
  },
});
