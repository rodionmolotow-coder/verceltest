import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables.
// On Vercel, this is set in the Project Settings > Environment Variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please set the API_KEY environment variable in your Vercel project settings.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Directly access the text property as per documentation
    const text = response.text;
    
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};