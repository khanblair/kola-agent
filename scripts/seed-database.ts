/**
 * Seed script: populates Convex with demo freelancer profiles from data/seed/freelancers.json
 *
 * Usage: bunx convex run scripts/seed-database.ts
 *   or:  bun run scripts/seed-database.ts
 */
import fs from 'fs';
import path from 'path';
import { ConvexHttpClient } from 'convex/browser';

import { api } from '../convex/_generated/api';

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
      const cvText = `Freelancer Profile: ${f.name}
Seniority Level: ${f.seniority}
Years of Experience: ${f.yearsOfExperience} years
Target Region: ${f.region}
Skills: ${f.skills.join(', ')}

Notable Projects:
${f.notableProjects.map((p) => `- ${p}`).join('\n')}`;

      const id = await client.mutation(api.functions.freelancers.create, {
        userId: 'seed-user-' + f.name.toLowerCase().replace(/\s+/g, '-'),
        skills: f.skills,
        yearsOfExperience: f.yearsOfExperience,
        seniority: f.seniority as 'junior' | 'mid' | 'senior',
        notableProjects: f.notableProjects,
        region: f.region,
        hourlyRateMin: f.hourlyRateMin,
        hourlyRateMax: f.hourlyRateMax,
        cvText,
      });
      console.log(`  ✓ ${f.name} → ${id}`);
    } catch (err) {
      console.error(`  ✗ ${f.name}:`, (err as Error).message);
    }
  }

  console.log('Seed complete.');
}

seed().catch(console.error);
