import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, dataContext, userProfile } = await req.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return new Response(JSON.stringify({ error: "Gemini API key not configured" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Construct the "Hidden System Prompt"
        const systemPrompt = `
You are a Lifestyle Health Companion AI with VISION capabilities.
Your goal is to interpret daily lifestyle data (sleep, water, steps, stress, screen time) for a specific user profile and offer CALM, HABIT-BASED guidance.

CRITICAL RULES:
1. DO NOT give medical advice. If a user describes severe symptoms, suggest seeing a doctor.
2. Keep replies SHORT, conversational, and empathetic (2-3 sentences max usually).
3. If the user's input is broken English or casual (e.g., "bro i feel tire"), reply in CLEAN, POLISHED English but keep the tone friendly.
4. Use the provided USER PROFILE and CONTEXT DATA to personalize your answer. For example, if the user is 90kg, 2L water might be too little.
5. If an IMAGE is provided (food, activity tracker screenshot, etc.), analyze it and provide relevant health insights.

USER PROFILE:
${userProfile ? JSON.stringify(userProfile) : "Unknown profile."}

DAILY STATS (Context):
${dataContext ? JSON.stringify(dataContext) : "No specific daily data provided yet."}

TONE:
- Supportive, not bossy.
- Scientific but simple.
- "We" language (e.g., "Let's try to drink more water").

IMAGE HANDLING:
- If you see a food image, estimate nutritional value and hydration impact.
- If you see an exercise screenshot, acknowledge the achievement.
- Be specific about what you see in the image.
`;

        const result = await streamText({
            model: google('gemini-1.5-pro'),
            system: systemPrompt,
            messages,
        });

        return result.toAIStreamResponse();
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Chat failed" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
