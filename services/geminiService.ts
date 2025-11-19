import { GoogleGenAI } from "@google/genai";
import { Job, LevelData } from '../types';

const getAIClient = () => {
    // In a real scenario, we should handle if API_KEY is missing, but per instructions we assume process.env.API_KEY exists.
    if (!process.env.API_KEY) {
        console.warn("API Key is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getMotivationalQuote = async (
  totalEarnings: number,
  currentLevel: LevelData,
  lastJob?: Job
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "System Offline: API Key required for AI Motivation module.";

  const prompt = `
    Act as a futuristic AI companion in a cyberpunk video game interface. 
    The user is a video editor playing a game where Money equals Points/Score.
    
    User Stats:
    - Current Score (Total Earnings): $${totalEarnings} MXN
    - Current Rank: ${currentLevel.rankTitle} (Level ${currentLevel.level})
    ${lastJob ? `- Just finished a task: "${lastJob.title}" for client ${lastJob.clientName} earning $${lastJob.amount}.` : ''}

    Generate a short, high-energy, video-game style motivational message (max 2 sentences). 
    Use terminology related to video editing (rendering, cutting, frames, export) and gaming (xp, grind, boss fight).
    Be encouraging about making more money.
    
    Tone: Epic, Electronic, Supportive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "System: Keep grinding, editor. The render is almost complete.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection Interrupted. Continue the mission manually.";
  }
};