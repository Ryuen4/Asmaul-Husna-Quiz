import { GoogleGenAI } from "@google/genai";
import { NameOfAllah } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists (handled gracefully in UI if not)
const ai = new GoogleGenAI({ apiKey });

export async function getReflection(names: NameOfAllah[]): Promise<string> {
  if (!apiKey) {
    return "To see AI-generated spiritual reflections, please ensure the API_KEY environment variable is set.";
  }

  try {
    const namesList = names.map(n => `${n.arabic} (${n.transliteration} - ${n.meaning})`).join(', ');
    
    const prompt = `
      I have just finished a quiz on the 99 Names of Allah.
      I would like a brief, spiritual reflection or practical advice based on these specific names: ${namesList}.
      
      Please keep it concise (under 150 words), warm, and encouraging. Focus on how a person can embody these qualities or find comfort in them.
      Format the output in clean paragraphs without markdown headers.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No reflection generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "We could not generate a reflection at this time. Please check your connection.";
  }
}
