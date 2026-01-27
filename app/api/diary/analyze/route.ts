import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY is missing");
            return NextResponse.json({ error: "GROQ_API_KEY is not set. Please restart your development server." }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
            You are an expert health data extractor. 
            Extract the following metrics from the user's journal text.
            Return ONLY valid JSON. No markdown block, no comments.
            
            JSON Schema:
            {
              "sleep": number | null (hours, e.g. 7.5),
              "water": number | null (liters, e.g. 2.0),
              "stress": number | null (1-10 scale),
              "steps": number | null (integer),
              "screen": number | null (hours),
              "mood": string | null (one word summary),
              "summary": string (short 10-word summary of the day)
            }

            Rules:
            - If a metric is not mentioned, set it to null.
            - If "tired" is mentioned, set mood to "Tired" and maybe infer stress if applicable (but prefer explicit).
            - Be generous with estimation if implied (e.g. "drank a lot" -> 2.5L).
          `
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No extracted content");
        }

        const data = JSON.parse(content);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Extraction Status:", error);
        return NextResponse.json({ error: error.message || "Failed to extract metrics" }, { status: 500 });
    }
}
