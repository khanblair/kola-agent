interface RateLimitEntry {
  timestamp: number;
  count: number;
}

export class RateLimiter {
  private requests: RateLimitEntry[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 20, windowMs: number = 60_000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(
      (entry) => now - entry.timestamp < this.windowMs,
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestInWindow = this.requests[0];
      const waitMs =
        oldestInWindow.timestamp + this.windowMs - now + 100;

      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return this.acquire();
    }

    this.requests.push({ timestamp: now, count: 1 });
  }

  get remaining(): number {
    const now = Date.now();
    const active = this.requests.filter(
      (entry) => now - entry.timestamp < this.windowMs,
    );
    return Math.max(0, this.maxRequests - active.length);
  }
}

export const deepseekRateLimiter = new RateLimiter(20, 60_000);
