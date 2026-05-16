import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

export const create = mutation({
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

export const getByMatch = query({
  args: { matchId: v.id('matches') },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) return null;

    return {
      proposalText: match.proposalText ?? null,
      proposalTone: match.proposalTone ?? null,
      status: match.status,
      score: match.score,
      explanation: match.explanation,
      skillGaps: match.skillGaps,
      suggestedRateMin: match.suggestedRateMin,
      suggestedRateMax: match.suggestedRateMax,
    };
  },
});

export const update = mutation({
  args: {
    matchId: v.id('matches'),
    proposalText: v.optional(v.string()),
    proposalTone: v.optional(
      v.union(
        v.literal('professional'),
        v.literal('confident'),
        v.literal('friendly'),
      )
    ),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error('Match not found');

    const updates: Record<string, unknown> = {};
    if (args.proposalText !== undefined)
      updates.proposalText = args.proposalText;
    if (args.proposalTone !== undefined)
      updates.proposalTone = args.proposalTone;

    await ctx.db.patch(args.matchId, updates);
    return args.matchId;
  },
});
