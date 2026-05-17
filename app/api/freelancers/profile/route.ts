import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as mutations from '@/lib/convex/mutations';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { skills, yearsOfExperience, seniority, notableProjects, region, hourlyRateMin, hourlyRateMax } = body as {
      skills?: string[];
      yearsOfExperience?: number;
      seniority?: string;
      notableProjects?: string[];
      region?: string;
      hourlyRateMin?: number;
      hourlyRateMax?: number;
    };

    await mutations.updateFreelancerProfile(user.convexUser?._id ?? '', {
      skills: skills ?? [],
      yearsOfExperience: yearsOfExperience ?? 0,
      seniority: (seniority as any) ?? 'mid',
      notableProjects: notableProjects ?? [],
      region: region ?? 'uganda',
      hourlyRateMin,
      hourlyRateMax,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
