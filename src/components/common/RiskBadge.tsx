import React from 'react';
import type { RiskLevel } from '../../types/eeris';

interface RiskBadgeProps {
  score?: number;
  level: RiskLevel;
  showScore?: boolean;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  showScore = true,
  size = 'md'
}) => {
  const isHigh = level === 'High';
  const isMedium = level === 'Medium';

  const badgeStyles = isHigh
    ? 'bg-red-50 text-red-700 border-red-200'
    : isMedium
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const dotStyles = isHigh
    ? 'bg-red-500'
    : isMedium
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${badgeStyles} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
      {showScore && score !== undefined && <span>{score}</span>}
      <span>({level})</span>
    </span>
  );
};
