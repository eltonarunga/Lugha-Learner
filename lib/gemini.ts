import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;

/**
 * Initializes and returns a singleton instance of the GoogleGenAI client.
 * @throws {Error} If the API_KEY environment variable is not set.
 * @returns {GoogleGenAI} The initialized GoogleGenAI client.
 */
export const getGeminiAI = (): GoogleGenAI => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("VITE_API_KEY environment variable not set. Please create a .env file with your API key.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};
