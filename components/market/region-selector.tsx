'use client';

import { Select } from '@/components/ui/select';
import type { Region } from '@/types/market';

interface RegionSelectorProps {
  value?: Region;
  onChange: (region: Region) => void;
}

const regionOptions = [
  { value: 'uganda', label: 'Uganda' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'south-africa', label: 'South Africa' },
];

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
  return (
    <Select
      label="Region"
      options={regionOptions}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value as Region)}
      placeholder="Select a region"
    />
  );
}
