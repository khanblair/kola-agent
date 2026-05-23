/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as functions_embeddings from "../functions/embeddings.js";
import type * as functions_freelancers from "../functions/freelancers.js";
import type * as functions_jobs from "../functions/jobs.js";
import type * as functions_matches from "../functions/matches.js";
import type * as functions_notifications from "../functions/notifications.js";
import type * as functions_proposals from "../functions/proposals.js";
import type * as functions_users from "../functions/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "functions/embeddings": typeof functions_embeddings;
  "functions/freelancers": typeof functions_freelancers;
  "functions/jobs": typeof functions_jobs;
  "functions/matches": typeof functions_matches;
  "functions/notifications": typeof functions_notifications;
  "functions/proposals": typeof functions_proposals;
  "functions/users": typeof functions_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
