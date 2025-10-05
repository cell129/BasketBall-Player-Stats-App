
import React from 'react';
import type { LogEntry } from '../types';

interface GameLogProps {
  log: LogEntry[];
  onUndo: (id: string) => void;
}

const GameLog: React.FC<GameLogProps> = ({ log, onUndo }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg flex flex-col h-full max-h-[calc(100vh-100px)]">
      <h2 className="text-xl font-bold mb-4 text-white flex-shrink-0">Game Log</h2>
      {log.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">No actions recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow pr-2">
            <ul className="space-y-2">
            {log.map((entry) => (
                <li key={entry.id} className="flex justify-between items-center bg-gray-700/50 p-2 rounded-md animate-fade-in">
                <div>
                    <p className="text-sm text-gray-200">{entry.actionText}</p>
                    <p className="text-xs text-gray-400">{entry.timestamp}</p>
                </div>
                <button
                    onClick={() => onUndo(entry.id)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1 rounded-md transition-colors"
                >
                    Undo
                </button>
                </li>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default GameLog;