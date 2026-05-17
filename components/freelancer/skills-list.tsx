'use client';

import { Badge } from '@/components/ui/badge';

interface SkillsListProps {
  skills: string[];
  max?: number;
}

export function SkillsList({ skills, max = 8 }: SkillsListProps) {
  const visible = skills.slice(0, max);
  const remaining = skills.length - max;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((skill) => (
        <Badge key={skill} variant="primary">{skill}</Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="default">+{remaining} more</Badge>
      )}
    </div>
  );
}
