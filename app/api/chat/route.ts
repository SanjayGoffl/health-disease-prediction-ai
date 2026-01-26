import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { message, healthData } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { message: "⚠️ Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file." },
                { status: 500 }
            );
        }

        // Create context from health data
        const context = `
Current Health Metrics:
- Screen Time: ${healthData.screenTime} hours/day
- Steps: ${healthData.steps} steps/day
- Stress Level: ${healthData.stress}/10
- Sleep Duration: ${healthData.sleep} hours
- Water Intake: ${healthData.water} liters/day

You are a professional health consultant AI. Analyze these metrics and provide:
1. Specific, actionable advice
2. Reference the exact numbers from the metrics
3. Be empathetic but direct
4. Keep responses concise (3-5 sentences max)
`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent([
            context,
            `User Question: ${message}`,
        ]);

        const responseText = result.response.text();

        return NextResponse.json({ message: responseText });
    } catch (error: any) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
            {
                message: `Error: ${error.message || "Failed to get AI response. Please check your API key and try again."}`
            },
            { status: 500 }
        );
    }
}
