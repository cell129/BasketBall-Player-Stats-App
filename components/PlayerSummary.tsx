
import React from 'react';
import type { Stats } from '../types';
import { calculatePoints, calculatePercentage } from '../utils/statCalculations';

interface PlayerSummaryProps {
  stats: Stats;
}

const StatDisplay: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
  <div className={`flex flex-col items-center justify-center bg-gray-700/50 p-3 rounded-lg text-center ${className}`}>
    <span className="text-2xl md:text-3xl font-bold tracking-tighter text-cyan-400">{value}</span>
    <span className="text-xs font-semibold uppercase text-gray-400">{label}</span>
  </div>
);

const PlayerSummary: React.FC<PlayerSummaryProps> = ({ stats }) => {
  const points = calculatePoints(stats);
  const totalRebounds = stats.OREB + stats.DREB;
  const fgPercent = calculatePercentage(stats.FGM, stats.FGA);
  const tpPercent = calculatePercentage(stats.TPM, stats.TPA);
  const ftPercent = calculatePercentage(stats.FTM, stats.FTA);

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Player Stats</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        <StatDisplay label="Points" value={points} className="md:col-span-1" />
        <StatDisplay label="Rebounds" value={totalRebounds} className="md:col-span-1" />
        <StatDisplay label="Assists" value={stats.AST} className="md:col-span-1" />
        <StatDisplay label="Steals" value={stats.STL} className="md:col-span-1" />
        <StatDisplay label="Blocks" value={stats.BLK} className="md:col-span-1" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
         <StatDisplay label="FG%" value={`${stats.FGM}/${stats.FGA} (${fgPercent})`} />
         <StatDisplay label="3P%" value={`${stats.TPM}/${stats.TPA} (${tpPercent})`} />
         <StatDisplay label="FT%" value={`${stats.FTM}/${stats.FTA} (${ftPercent})`} />
      </div>
       <div className="mt-4 grid grid-cols-2 gap-3">
         <StatDisplay label="Turnovers" value={stats.TOV} />
         <StatDisplay label="Fouls" value={stats.PF} />
      </div>
    </div>
  );
};

export default PlayerSummary;