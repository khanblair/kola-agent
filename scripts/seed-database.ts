/**
 * Seed script: populates Convex with demo freelancer profiles from data/seed/freelancers.json
 *
 * Usage: bunx convex run scripts/seed-database.ts
 *   or:  bun run scripts/seed-database.ts
 */
import fs from 'fs';
import path from 'path';
import { ConvexHttpClient } from 'convex/browser';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error('NEXT_PUBLIC_CONVEX_URL is not set');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function seed() {
  const seedPath = path.resolve(__dirname, '../data/seed/freelancers.json');
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const freelancers = JSON.parse(raw) as Array<{
    name: string;
    email: string;
    skills: string[];
    yearsOfExperience: number;
    seniority: string;
    notableProjects: string[];
    region: string;
    hourlyRateMin: number;
    hourlyRateMax: number;
  }>;

  console.log(`Seeding ${freelancers.length} freelancer profiles...`);

  for (const f of freelancers) {
    try {
      const id = await client.mutation('functions:freelancers:create' as any, {
        userId: 'seed-user-' + f.name.toLowerCase().replace(/\s+/g, '-'),
        name: f.name,
        email: f.email,
        skills: f.skills,
        yearsOfExperience: f.yearsOfExperience,
        seniority: f.seniority,
        notableProjects: f.notableProjects,
        region: f.region,
        hourlyRateMin: f.hourlyRateMin,
        hourlyRateMax: f.hourlyRateMax,
      });
      console.log(`  ✓ ${f.name} → ${id}`);
    } catch (err) {
      console.error(`  ✗ ${f.name}:`, (err as Error).message);
    }
  }

  console.log('Seed complete.');
}

seed().catch(console.error);
