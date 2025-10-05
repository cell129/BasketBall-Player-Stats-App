import { GoogleGenAI } from "@google/genai";
import type { Stats } from '../types';
import type { LogEntry } from '../types';
import { calculatePoints, calculatePercentage } from '../utils/statCalculations';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatStatsForPrompt = (stats: Stats): string => {
  const points = calculatePoints(stats);
  const totalRebounds = stats.OREB + stats.DREB;
  const fgPercent = calculatePercentage(stats.FGM, stats.FGA);
  const tpPercent = calculatePercentage(stats.TPM, stats.TPA);
  const ftPercent = calculatePercentage(stats.FTM, stats.FTA);

  return `
- Points: ${points}
- Rebounds: ${totalRebounds} (${stats.OREB} OREB, ${stats.DREB} DREB)
- Assists: ${stats.AST}
- Steals: ${stats.STL}
- Blocks: ${stats.BLK}
- Turnovers: ${stats.TOV}
- Fouls: ${stats.PF}
- Field Goals: ${stats.FGM}/${stats.FGA} (${fgPercent})
- 3-Pointers: ${stats.TPM}/${stats.TPA} (${tpPercent})
- Free Throws: ${stats.FTM}/${stats.FTA} (${ftPercent})
  `.trim();
};

const formatLogForPrompt = (log: LogEntry[]): string => {
    return log.map(entry => `- ${entry.timestamp}: ${entry.actionText}`).join('\n');
}

export const generateGameSummary = async (playerName: string, opposition: string, gameDate: string, stats: Stats, log: LogEntry[]): Promise<string> => {
  const statsSummary = formatStatsForPrompt(stats);
  const logSummary = formatLogForPrompt(log.slice(-30)); // Use last 30 events to keep prompt size reasonable

  const prompt = `
You are a professional basketball analyst providing a performance report for a player named ${playerName}.
The report is for the game against ${opposition} on ${gameDate}.
Based on the final stats and a partial game log below, write a concise and insightful summary of their performance.
Highlight their key contributions, strengths, and areas for improvement observed during this game. Be realistic and analytical.

**Final Stat Line:**
${statsSummary}

**Game Event Log (Recent Events):**
${logSummary}

**Analysis:**
`.trim();

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.5,
            topP: 0.95,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating game summary:", error);
    return "There was an error generating the game summary. Please check your API key and network connection.";
  }
};