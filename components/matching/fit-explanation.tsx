'use client';

interface FitExplanationProps {
  explanation: string;
}

export function FitExplanation({ explanation }: FitExplanationProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
      <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
        Fit Explanation
      </h4>
      <p className="text-sm leading-relaxed text-neutral-700">{explanation}</p>
    </div>
  );
}
