import type { Id } from '../convex/_generated/dataModel';

export type { Id };

export type DocTableName =
  | 'users'
  | 'freelancers'
  | 'jobs'
  | 'matches'
  | 'notifications';

export type ConvexDoc<T extends DocTableName> = Id<T>;
