import { convex, api } from './client';

export async function getCurrentUser(clerkId: string) {
  return convex.query(api.functions.users.getUserByClerkId, { clerkId });
}

export async function getFreelancerByUserId() {
  return convex.query(api.functions.freelancers.getByUserId, {});
}

export async function getJobById(jobId: string) {
  return convex.query(api.functions.jobs.getById, { jobId: jobId as any });
}

export async function getJobsByClient() {
  return convex.query(api.functions.jobs.listByClient, {});
}

export async function getMatchesByJob(jobId: string) {
  return convex.query(api.functions.matches.getByJob, { jobId: jobId as any });
}

export async function getMatchesByFreelancer() {
  return convex.query(api.functions.matches.getByFreelancer, {});
}

export async function getNotificationsByUser() {
  return convex.query(api.functions.notifications.getByUser, {});
}
