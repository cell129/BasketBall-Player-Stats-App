
import type { Stats } from '../types';

export const calculatePoints = (stats: Stats): number => {
  const twoPointersMade = stats.FGM - stats.TPM;
  return (twoPointersMade * 2) + (stats.TPM * 3) + stats.FTM;
};

export const calculatePercentage = (made: number, attempted: number): string => {
  if (attempted === 0) {
    return '0.0%';
  }
  const percentage = (made / attempted) * 100;
  return `${percentage.toFixed(1)}%`;
};