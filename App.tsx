import React, { useState, useCallback, useEffect } from 'react';
import { StatControls } from './components/StatControls';
import PlayerSummary from './components/PlayerSummary';
import GameLog from './components/GameLog';
import { generateGameSummary } from './services/geminiService';
import { generateCsvContent } from './utils/csvExport';
import type { Stats, LogEntry, StatKey } from './types';

const INITIAL_STATS: Stats = {
  FGM: 0, FGA: 0, TPM: 0, TPA: 0, FTM: 0, FTA: 0,
  OREB: 0, DREB: 0, AST: 0, STL: 0, BLK: 0, TOV: 0, PF: 0,
};

const STORAGE_KEY = 'basketball-stat-tracker-state';

const App: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>('Player 1');
  const [opposition, setOpposition] = useState<string>('Opponent');
  const [gameDate, setGameDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');

  // Effect to load state from localStorage on initial component mount
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState) {
          setPlayerName(savedState.playerName || 'Player 1');
          setOpposition(savedState.opposition || 'Opponent');
          setGameDate(savedState.gameDate || new Date().toISOString().split('T')[0]);
          setStats(savedState.stats || INITIAL_STATS);
          setLog(savedState.log || []);
        }
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const gameState = {
        playerName,
        opposition,
        gameDate,
        stats,
        log,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [playerName, opposition, gameDate, stats, log]);


  const handleStatUpdate = useCallback((actionText: string, statChanges: Partial<Stats>) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      for (const key in statChanges) {
        newStats[key as StatKey] += statChanges[key as StatKey]!;
      }
      return newStats;
    });

    const newLogEntry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString(),
      actionText,
      statChanges,
    };

    setLog(prevLog => [newLogEntry, ...prevLog]);
  }, []);

  const handleUndo = useCallback((id: string) => {
    const entryToUndo = log.find(entry => entry.id === id);
    if (!entryToUndo) return;

    setStats(prevStats => {
      const newStats = { ...prevStats };
      for (const key in entryToUndo.statChanges) {
        newStats[key as StatKey] -= entryToUndo.statChanges[key as StatKey]!;
      }
      return newStats;
    });

    setLog(prevLog => prevLog.filter(entry => entry.id !== id));
  }, [log]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all stats and logs?')) {
      setStats(INITIAL_STATS);
      setLog([]);
      setSummary('');
      setPlayerName('Player 1');
      setOpposition('Opponent');
      setGameDate(new Date().toISOString().split('T')[0]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing state from localStorage:", error);
      }
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setSummary('');
    const result = await generateGameSummary(playerName, opposition, gameDate, stats, log);
    setSummary(result);
    setIsGenerating(false);
  };

  const handleExport = () => {
    if (log.length === 0) {
      alert("No stats to export.");
      return;
    }

    const csvContent = generateCsvContent(playerName, opposition, gameDate, stats, log);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Sanitize names for filename
    const sanitizedPlayer = playerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const sanitizedOpponent = opposition.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${sanitizedPlayer}_vs_${sanitizedOpponent}_${gameDate}.csv`;

    const link = document.createElement("a");
    if (link.download !== undefined) { 
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-700">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl font-bold text-white tracking-tight">Basketball Stat Tracker <span className="text-cyan-400">AI</span></h1>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-4">
               <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-lg text-cyan-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Player Name"
                aria-label="Player Name"
              />
               <span className="text-gray-500 hidden sm:inline">vs</span>
               <input
                type="text"
                value={opposition}
                onChange={(e) => setOpposition(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-lg text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Opponent"
                aria-label="Opponent Name"
              />
               <input
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-lg text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                aria-label="Game Date"
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center gap-2">
            <button
                onClick={handleExport}
                disabled={log.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Export CSV
            </button>
            <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Reset Game
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlayerSummary stats={stats} />
            <StatControls onStatUpdate={handleStatUpdate} />
             <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-white">AI Game Summary</h2>
                <button
                    onClick={handleGenerateSummary}
                    disabled={isGenerating || log.length === 0}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    {isGenerating ? 'Generating...' : 'Generate Performance Summary'}
                </button>
                {summary && (
                    <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                        <p className="whitespace-pre-wrap text-gray-300">{summary}</p>
                    </div>
                )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <GameLog log={log} onUndo={handleUndo} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;