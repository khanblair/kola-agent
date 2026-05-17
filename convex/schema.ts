import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal('client'), v.literal('freelancer')),
    imageUrl: v.optional(v.string()),
    notificationPreference: v.optional(
      v.union(
        v.literal('telegram'),
        v.literal('whatsapp'),
        v.literal('both'),
      )
    ),
    telegramChatId: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
  }).index('by_clerk_id', ['clerkId']),

  freelancers: defineTable({
    userId: v.id('users'),
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
    education: v.optional(v.array(v.string())),
    workHistory: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    volunteerExperience: v.optional(v.array(v.string())),
    referees: v.optional(v.array(v.string())),
    embedding: v.optional(v.array(v.float64())),
    telegramChatId: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    hourlyRateMin: v.optional(v.number()),
    hourlyRateMax: v.optional(v.number()),
  })
    .index('by_user_id', ['userId'])
    .vectorIndex('by_embedding', {
      vectorField: 'embedding',
      dimensions: 1536,
      filterFields: ['seniority', 'region'],
    }),

  jobs: defineTable({
    clientId: v.id('users'),
    briefText: v.string(),
    structuredScope: v.optional(v.any()),
    marketRateData: v.optional(v.any()),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('matched'),
      v.literal('closed'),
    ),
    embedding: v.optional(v.array(v.float64())),
    region: v.optional(v.string()),
  })
    .index('by_client_id', ['clientId'])
    .index('by_status', ['status'])
    .vectorIndex('by_embedding', {
      vectorField: 'embedding',
      dimensions: 1536,
      filterFields: ['status', 'region'],
    }),

  matches: defineTable({
    jobId: v.id('jobs'),
    freelancerId: v.id('freelancers'),
    score: v.number(),
    explanation: v.string(),
    skillGaps: v.array(v.string()),
    suggestedRateMin: v.number(),
    suggestedRateMax: v.number(),
    proposalText: v.optional(v.string()),
    proposalTone: v.optional(
      v.union(
        v.literal('professional'),
        v.literal('confident'),
        v.literal('friendly'),
      )
    ),
    status: v.union(
      v.literal('pending'),
      v.literal('proposed'),
      v.literal('accepted'),
      v.literal('rejected'),
    ),
  })
    .index('by_job_id', ['jobId'])
    .index('by_freelancer_id', ['freelancerId']),

  notifications: defineTable({
    userId: v.id('users'),
    channel: v.union(v.literal('telegram'), v.literal('whatsapp')),
    message: v.string(),
    delivered: v.boolean(),
    deliveredAt: v.optional(v.number()),
    relatedJobId: v.optional(v.id('jobs')),
    relatedMatchId: v.optional(v.id('matches')),
  }).index('by_user_id', ['userId']),
});
