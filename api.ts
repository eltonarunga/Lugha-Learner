import { GoogleGenerativeAI } from "@google/generative-ai";
import { Lesson } from "./types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env.local file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const getDictionaryDefinition = async (word: string, language: string): Promise<{ definition: string, example: string } | null> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are a helpful language learning assistant.
        Your task is to provide a dictionary entry for a word in a specific language.
        The user wants to know the definition of the word "${word}" in ${language}.

        Please provide the following in a JSON format:
        1. A simple "definition" of the word.
        2. An "example" sentence using the word.

        The response should be a single JSON object with the keys "definition" and "example".
        Do not include any other text or formatting.

        Example response for "karibu" in Swahili:
        {
            "definition": "A common greeting that means 'welcome'.",
            "example": "Karibu Tanzania! Welcome to Tanzania!"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the text to ensure it's valid JSON
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResponse = JSON.parse(cleanedText);

        return {
            definition: jsonResponse.definition,
            example: jsonResponse.example,
        };

    } catch (error) {
        console.error("Error fetching dictionary definition:", error);
        return null;
    }
};

export const generateLesson = async (language: string, lessonTitle: string): Promise<Lesson | null> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are a creative and helpful language curriculum designer.
        Your task is to generate a complete language lesson based on a title and language.
        The lesson should be engaging and suitable for a beginner to intermediate learner.

        Language: ${language}
        Lesson Title: "${lessonTitle}"

        Please generate a JSON object representing the lesson, with the following structure:
        - "id": A unique number for the lesson (you can use a random number).
        - "title": The title of the lesson.
        - "xp": The experience points awarded for completing the lesson (e.g., 20).
        - "questions": An array of 5 quiz questions.

        The "questions" array should contain a mix of two types of questions:
        1. "MCQ" (Multiple Choice Question):
           - "type": "MCQ"
           - "question": The question text (e.g., "What is the word for 'hello'?").
           - "options": An array of 4 strings with possible answers.
           - "answer": The correct string from the options.
           - "translation": A helpful tip or the English translation of the answer.
        2. "FILL_IN_BLANK" (Fill in the Blank Question):
           - "type": "FILL_IN_BLANK"
           - "questionParts": An array of two strings that form the sentence around the blank (e.g., ["Jina langu ni ", "."]).
           - "answer": The word that fills the blank.
           - "translation": The English translation of the complete sentence.

        The final output should be a single, clean JSON object, without any extra text, formatting, or code blocks.

        Example of a single question object in the array:
        {
            "type": "MCQ",
            "question": "Which of these means 'thank you'?",
            "options": ["Habari", "Asante", "Ndiyo", "Tafadhali"],
            "answer": "Asante",
            "translation": "'Asante' is the Swahili word for 'thank you'."
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the text to ensure it's valid JSON
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const lesson: Lesson = JSON.parse(cleanedText);

        // Basic validation
        if (!lesson.id || !lesson.title || !lesson.questions || !Array.isArray(lesson.questions)) {
            throw new Error("Generated lesson has an invalid format.");
        }

        return lesson;

    } catch (error) {
        console.error("Error generating lesson:", error);
        return null;
    }
};
