
import React from 'react';

interface StatButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'success' | 'danger';
    className?: string;
}

const StatButton: React.FC<StatButtonProps> = ({ children, onClick, variant = 'default', className = ''}) => {
    const baseClasses = 'w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
    const variantClasses = {
        default: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    };
    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}

interface StatControlsProps {
  onStatUpdate: (actionText: string, statChanges: Record<string, number>) => void;
}

const ControlSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-3 text-cyan-400">{title}</h3>
        <div className="grid grid-cols-2 gap-3">
            {children}
        </div>
    </div>
);


export const StatControls: React.FC<StatControlsProps> = ({ onStatUpdate }) => {
  return (
    <div className="space-y-4">
        <ControlSection title="Shooting">
            <StatButton variant="success" onClick={() => onStatUpdate('2-Point Shot Made', { FGM: 1, FGA: 1 })}>2PT Made</StatButton>
            <StatButton variant="danger" onClick={() => onStatUpdate('2-Point Shot Missed', { FGA: 1 })}>2PT Miss</StatButton>
            <StatButton variant="success" onClick={() => onStatUpdate('3-Point Shot Made', { FGM: 1, FGA: 1, TPM: 1, TPA: 1 })}>3PT Made</StatButton>
            <StatButton variant="danger" onClick={() => onStatUpdate('3-Point Shot Missed', { FGA: 1, TPA: 1 })}>3PT Miss</StatButton>
            <StatButton variant="success" onClick={() => onStatUpdate('Free Throw Made', { FTM: 1, FTA: 1 })}>FT Made</StatButton>
            <StatButton variant="danger" onClick={() => onStatUpdate('Free Throw Missed', { FTA: 1 })}>FT Miss</StatButton>
        </ControlSection>

        <ControlSection title="Playmaking & Defense">
            <StatButton onClick={() => onStatUpdate('Assist', { AST: 1 })}>Assist</StatButton>
            <StatButton onClick={() => onStatUpdate('Steal', { STL: 1 })}>Steal</StatButton>
            <StatButton onClick={() => onStatUpdate('Block', { BLK: 1 })}>Block</StatButton>
            <StatButton onClick={() => onStatUpdate('Turnover', { TOV: 1 })}>Turnover</StatButton>
        </ControlSection>

        <ControlSection title="Rebounding & Fouls">
            <StatButton onClick={() => onStatUpdate('Offensive Rebound', { OREB: 1 })}>Off. Rebound</StatButton>
            <StatButton onClick={() => onStatUpdate('Defensive Rebound', { DREB: 1 })}>Def. Rebound</StatButton>
            <StatButton onClick={() => onStatUpdate('Personal Foul', { PF: 1 })}>Foul</StatButton>
        </ControlSection>
    </div>
  );
};