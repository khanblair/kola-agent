import { query, mutation, action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';

export const create = mutation({
  args: {
    jobId: v.id('jobs'),
    freelancerId: v.id('freelancers'),
    score: v.number(),
    explanation: v.string(),
    skillGaps: v.array(v.string()),
    suggestedRateMin: v.number(),
    suggestedRateMax: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('matches', {
      jobId: args.jobId,
      freelancerId: args.freelancerId,
      score: args.score,
      explanation: args.explanation,
      skillGaps: args.skillGaps,
      suggestedRateMin: args.suggestedRateMin,
      suggestedRateMax: args.suggestedRateMax,
      status: 'pending',
    });
  },
});

export const updateProposal = mutation({
  args: {
    matchId: v.id('matches'),
    proposalText: v.string(),
    proposalTone: v.union(
      v.literal('professional'),
      v.literal('confident'),
      v.literal('friendly'),
    ),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error('Match not found');

    await ctx.db.patch(args.matchId, {
      proposalText: args.proposalText,
      proposalTone: args.proposalTone,
      status: 'proposed',
    });
    return args.matchId;
  },
});

export const updateStatus = mutation({
  args: {
    matchId: v.id('matches'),
    status: v.union(
      v.literal('pending'),
      v.literal('proposed'),
      v.literal('accepted'),
      v.literal('rejected'),
    ),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error('Match not found');

    await ctx.db.patch(args.matchId, { status: args.status });
    return args.matchId;
  },
});

export const getByJob = query({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query('matches')
      .withIndex('by_job_id', (q) => q.eq('jobId', args.jobId))
      .collect();

    const enriched = await Promise.all(
      matches.map(async (match) => {
        const freelancer = await ctx.db.get(match.freelancerId);
        const user = freelancer
          ? await ctx.db.get(freelancer.userId)
          : null;
        return {
          ...match,
          freelancer,
          freelancerName: user?.name ?? 'Unknown',
          freelancerEmail: user?.email ?? '',
        };
      }),
    );

    return enriched.sort((a, b) => b.score - a.score);
  },
});

export const getByFreelancer = query({
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

    const freelancer = await ctx.db
      .query('freelancers')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .first();

    if (!freelancer) return [];

    const matches = await ctx.db
      .query('matches')
      .withIndex('by_freelancer_id', (q) =>
        q.eq('freelancerId', freelancer._id),
      )
      .collect();

    const enriched = await Promise.all(
      matches.map(async (match) => {
        const job = await ctx.db.get(match.jobId);
        const client = job ? await ctx.db.get(job.clientId) : null;
        return {
          ...match,
          job,
          clientName: client?.name ?? 'Unknown',
        };
      }),
    );

    return enriched.sort((a, b) => b.score - a.score);
  },
});

export const getByClient = query({
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

    const jobs = await ctx.db
      .query('jobs')
      .withIndex('by_client_id', (q) => q.eq('clientId', user._id))
      .collect();

    if (jobs.length === 0) return [];

    const jobIds = new Set(jobs.map((j) => j._id));

    const allMatches = await ctx.db.query('matches').collect();
    const clientMatches = allMatches.filter((m) => jobIds.has(m.jobId));

    const enriched = await Promise.all(
      clientMatches.map(async (match) => {
        const job = jobs.find((j) => j._id === match.jobId);
        const freelancer = await ctx.db.get(match.freelancerId);
        const freelancerUser = freelancer
          ? await ctx.db.get(freelancer.userId)
          : null;

        return {
          ...match,
          job,
          freelancerName: freelancerUser?.name ?? 'Unknown',
          freelancerEmail: freelancerUser?.email ?? '',
          freelancerImage: freelancerUser?.imageUrl ?? '',
          freelancerSkills: freelancer?.skills ?? [],
          freelancerExperience: freelancer?.yearsOfExperience ?? 0,
          freelancerSeniority: freelancer?.seniority ?? 'mid',
        };
      }),
    );

    return enriched.sort((a, b) => b.score - a.score);
  },
});

export const getById = query({
  args: { matchId: v.id('matches') },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) return null;

    const freelancer = await ctx.db.get(match.freelancerId);
    const user = freelancer ? await ctx.db.get(freelancer.userId) : null;
    const job = await ctx.db.get(match.jobId);

    return {
      ...match,
      freelancer,
      freelancerName: user?.name ?? 'Unknown',
      job,
    };
  },
});

export const searchFreelancers = action({
  args: {
    queryEmbedding: v.array(v.float64()),
    region: v.optional(v.string()),
    seniority: v.optional(
      v.union(
        v.literal('junior'),
        v.literal('mid'),
        v.literal('senior'),
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<unknown[]> => {
    const limit = args.limit ?? 3;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchOpts: any = {
      vector: args.queryEmbedding,
      limit,
    };

    if (args.region && args.seniority) {
      searchOpts.filter = (q: any) =>
        q.eq('region', args.region).eq('seniority', args.seniority);
    } else if (args.region) {
      searchOpts.filter = (q: any) => q.eq('region', args.region);
    } else if (args.seniority) {
      searchOpts.filter = (q: any) => q.eq('seniority', args.seniority);
    }

    const results = await ctx.vectorSearch(
      'freelancers',
      'by_embedding',
      searchOpts,
    );

    const freelancers: unknown[] = [];
    for (const result of results) {
      const freelancer = await ctx.runQuery(
        api.functions.freelancers.getById,
        { id: result._id },
      );
      freelancers.push({ ...freelancer, score: result._score });
    }

    return freelancers;
  },
});
