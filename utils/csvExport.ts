import type { Stats, LogEntry } from '../types';
import { calculatePoints, calculatePercentage } from './statCalculations';

export const generateCsvContent = (
    playerName: string,
    opposition: string,
    gameDate: string,
    stats: Stats,
    log: LogEntry[]
): string => {
    // 1. Calculate derived stats
    const points = calculatePoints(stats);
    const totalRebounds = stats.OREB + stats.DREB;
    const fgPercent = calculatePercentage(stats.FGM, stats.FGA);
    const tpPercent = calculatePercentage(stats.TPM, stats.TPA);
    const ftPercent = calculatePercentage(stats.FTM, stats.FTA);

    // 2. Create CSV headers and summary row
    const headers = [
        'Player', 'Opponent', 'Date',
        'PTS', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%',
        'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF'
    ];
    const summaryRow = [
        playerName, opposition, gameDate,
        points, stats.FGM, stats.FGA, fgPercent, stats.TPM, stats.TPA, tpPercent, stats.FTM, stats.FTA, ftPercent,
        stats.OREB, stats.DREB, totalRebounds, stats.AST, stats.STL, stats.BLK, stats.TOV, stats.PF
    ];

    // Helper to escape commas in values by wrapping in quotes
    const escapeCsvCell = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;

    let csvContent = headers.map(escapeCsvCell).join(',') + '\n';
    csvContent += summaryRow.map(escapeCsvCell).join(',') + '\n';

    // 3. Add game log section
    csvContent += '\n\n'; // Add some space
    csvContent += 'Game Log\n';
    csvContent += 'Timestamp,Action\n';

    // Reverse log for chronological order in the export
    const reversedLog = [...log].reverse();
    reversedLog.forEach(entry => {
        const logRow = [entry.timestamp, entry.actionText];
        csvContent += logRow.map(escapeCsvCell).join(',') + '\n';
    });

    return csvContent;
}