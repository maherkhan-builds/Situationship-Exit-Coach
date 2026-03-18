import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  clarityScore: number; // 0-100
  progressStatus: 'Not Going Anywhere' | 'Unclear' | 'Progressing';
  effortBalance: {
    user: number; // 0-100
    them: number; // 0-100
  };
  consistencyIndex: number; // 0-100
  emotionalAvailability: number; // 0-100
  insights: {
    behaviorSuggests: string;
    overlooking: string;
    realityVsPerception: string;
    explanation: string;
  };
  flags: string[]; // ['Ghosting', 'Breadcrumbing', etc.]
  exitStrategy: {
    advice: string;
    scripts: string[];
    boundaries: string[];
    signalsToWalkAway: string[];
  };
}

export async function analyzeRelationship(chatText: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following chat conversation or relationship description and provide a detailed breakdown for a "Situationship Exit Coach" app. 
    The tone should be empathetic, honest, empowering, and slightly direct but non-judgmental.
    
    Chat/Context:
    ${chatText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          clarityScore: { type: Type.NUMBER },
          progressStatus: { type: Type.STRING, enum: ['Not Going Anywhere', 'Unclear', 'Progressing'] },
          effortBalance: {
            type: Type.OBJECT,
            properties: {
              user: { type: Type.NUMBER },
              them: { type: Type.NUMBER }
            },
            required: ['user', 'them']
          },
          consistencyIndex: { type: Type.NUMBER },
          emotionalAvailability: { type: Type.NUMBER },
          insights: {
            type: Type.OBJECT,
            properties: {
              behaviorSuggests: { type: Type.STRING },
              overlooking: { type: Type.STRING },
              realityVsPerception: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ['behaviorSuggests', 'overlooking', 'realityVsPerception', 'explanation']
          },
          flags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          exitStrategy: {
            type: Type.OBJECT,
            properties: {
              advice: { type: Type.STRING },
              scripts: { type: Type.ARRAY, items: { type: Type.STRING } },
              boundaries: { type: Type.ARRAY, items: { type: Type.STRING } },
              signalsToWalkAway: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['advice', 'scripts', 'boundaries', 'signalsToWalkAway']
          }
        },
        required: ['clarityScore', 'progressStatus', 'effortBalance', 'consistencyIndex', 'emotionalAvailability', 'insights', 'flags', 'exitStrategy']
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
