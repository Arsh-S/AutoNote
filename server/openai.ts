import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const generateSummary = async (inputText: string): Promise<string> => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes texts into markdown provided by the user." },
                { role: "user", content: `Summarize the following text in markdown in heavy detail for studying, and organize into sections:\n\n"${inputText}"` },
            ],
        });

        const summary = completion.choices[0]?.message?.content?.trim();

        if (!summary) {
            throw new Error("Failed to generate a summary.");
        }

        return summary;
    } catch (error) {
        console.error("Error summarizing text:", error);
        throw new Error("Error generating summary.");
    }
};
