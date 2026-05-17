'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { FreelancerProfile, Seniority } from '@/types/freelancer';
import type { Region } from '@/types/market';

interface ProfileEditorProps {
  initial?: Partial<FreelancerProfile>;
  onSave: (data: FreelancerProfile) => void;
  loading?: boolean;
}

const seniorityOptions = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-level (3-5 years)' },
  { value: 'senior', label: 'Senior (6+ years)' },
];

const regionOptions = [
  { value: 'uganda', label: 'Uganda' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'south-africa', label: 'South Africa' },
];

export function ProfileEditor({ initial, onSave, loading }: ProfileEditorProps) {
  const [skills, setSkills] = useState(initial?.skills?.join(', ') ?? '');
  const [years, setYears] = useState(String(initial?.yearsOfExperience ?? ''));
  const [seniority, setSeniority] = useState<Seniority>(initial?.seniority ?? 'mid');
  const [projects, setProjects] = useState(initial?.notableProjects?.join('\n') ?? '');
  const [region, setRegion] = useState<string>(initial?.region ?? 'uganda');
  const [rateMin, setRateMin] = useState(String(initial?.hourlyRateMin ?? ''));
  const [rateMax, setRateMax] = useState(String(initial?.hourlyRateMax ?? ''));

  const handleSubmit = () => {
    onSave({
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      yearsOfExperience: parseInt(years, 10) || 0,
      seniority,
      notableProjects: projects.split('\n').map((p) => p.trim()).filter(Boolean),
      region,
      cvText: initial?.cvText ?? '',
      hourlyRateMin: rateMin ? parseFloat(rateMin) : undefined,
      hourlyRateMax: rateMax ? parseFloat(rateMax) : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input
            id="skills"
            placeholder="React, Node.js, TypeScript..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="years">Years of Experience</Label>
          <Input
            id="years"
            type="number"
            min={0}
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>

        <Select
          label="Seniority"
          options={seniorityOptions}
          value={seniority}
          onChange={(e) => setSeniority(e.target.value as Seniority)}
        />

        <Select
          label="Region"
          options={regionOptions}
          value={region}
          onChange={(e) => setRegion(e.target.value as Region)}
        />

        <div className="space-y-1.5">
          <Label htmlFor="rateMin">Min Hourly Rate (USD)</Label>
          <Input
            id="rateMin"
            type="number"
            min={0}
            value={rateMin}
            onChange={(e) => setRateMin(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="rateMax">Max Hourly Rate (USD)</Label>
          <Input
            id="rateMax"
            type="number"
            min={0}
            value={rateMax}
            onChange={(e) => setRateMax(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="projects">Notable Projects (one per line)</Label>
        <Textarea
          id="projects"
          rows={3}
          value={projects}
          onChange={(e) => setProjects(e.target.value)}
          placeholder="Built an e-commerce platform for..."
        />
      </div>

      <Button onClick={handleSubmit} loading={loading} className="w-full sm:w-auto">
        Save Profile
      </Button>
    </div>
  );
}
