import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function logKeyDebug(name: string, key: string | undefined) {
    if (!key) {
        console.log(`🔑 ${name}: MISSING`);
        return;
    }
    const trimmed = key.trim();
    const hex = Buffer.from(trimmed.substring(0, 4)).toString('hex');
    console.log(`🔑 ${name}: Present (Length: ${key.length}, Trimmed: ${trimmed.length}, First 4 Hex: ${hex})`);
}

export async function POST(req: Request) {
    console.log("📨 Chat API Request Received");
    logKeyDebug("GEMINI_KEY", process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    logKeyDebug("GROQ_KEY", process.env.GROQ_API_KEY);

    try {
        const { messages, dataContext } = await req.json();

        // Construct the "Hidden System Prompt"
        const systemPrompt = `
You are a Lifestyle Health Companion AI with VISION capabilities.
Your goal is to interpret daily lifestyle data (sleep, water, steps, stress, screen time) and offer CALM, HABIT-BASED guidance.

CRITICAL RULES:
1. DO NOT give medical advice. If a user describes severe symptoms, suggest seeing a doctor.
2. Keep replies SHORT, conversational, and empathetic (2-3 sentences max usually).
3. If the user's input is broken English or casual (e.g., "bro i feel tire"), reply in CLEAN, POLISHED English but keep the tone friendly.
4. Use the provided context data to personalize your answer.
5. If an IMAGE is provided (food, activity tracker screenshot, etc.), analyze it and provide relevant health insights.

CONTEXT DATA (Current User Stats):
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

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GROQ_API_KEY) {
            return new Response(JSON.stringify({ error: "No API keys configured" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            // Try Gemini First
            const modelName = 'gemini-2.0-flash-exp';
            console.log(`🚀 Attempting Gemini (${modelName})...`);

            if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
                const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
                const model = genAI.getGenerativeModel({ model: modelName });

                // Convert messages to Gemini format
                const chatHistory = messages.slice(0, -1).map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }));

                const lastMessage = messages[messages.length - 1];

                const chat = model.startChat({
                    history: chatHistory,
                    generationConfig: {
                        maxOutputTokens: 1024,
                        temperature: 0.7,
                    },
                });

                // Add system prompt as first message if no history
                const prompt = chatHistory.length === 0
                    ? `${systemPrompt}\n\nUser: ${lastMessage.content}`
                    : lastMessage.content;

                const result = await chat.sendMessageStream(prompt);

                console.log("✅ Gemini stream established successfully");

                // Convert to ReadableStream
                const encoder = new TextEncoder();
                const stream = new ReadableStream({
                    async start(controller) {
                        try {
                            for await (const chunk of result.stream) {
                                const text = chunk.text();
                                if (text) {
                                    controller.enqueue(encoder.encode(text));
                                }
                            }
                            controller.close();
                        } catch (error) {
                            console.error("Stream error:", error);
                            controller.error(error);
                        }
                    },
                });

                return new Response(stream, {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                        'Transfer-Encoding': 'chunked',
                    },
                });
            } else {
                throw new Error("Gemini Key missing.");
            }
        } catch (geminiError: any) {
            console.error("❌ Gemini API Error:", geminiError.message);

            // Fallback to Groq
            if (process.env.GROQ_API_KEY) {
                const groqModel = "llama-3.3-70b-versatile";
                console.log(`⚠️ Falling back to Groq (${groqModel})...`);

                try {
                    const groq = new Groq({
                        apiKey: process.env.GROQ_API_KEY.trim()
                    });

                    const response = await groq.chat.completions.create({
                        model: groqModel,
                        stream: true,
                        messages: [
                            { role: "system", content: systemPrompt },
                            ...messages.map((m: any) => ({
                                role: m.role,
                                content: m.content
                            }))
                        ],
                        temperature: 0.7,
                        max_tokens: 1024,
                    });

                    console.log("✅ Groq stream established successfully");

                    // Convert Groq stream to ReadableStream
                    const encoder = new TextEncoder();
                    const stream = new ReadableStream({
                        async start(controller) {
                            try {
                                for await (const chunk of response) {
                                    const content = chunk.choices[0]?.delta?.content || '';
                                    if (content) {
                                        controller.enqueue(encoder.encode(content));
                                    }
                                }
                                controller.close();
                            } catch (error) {
                                controller.error(error);
                            }
                        },
                    });

                    return new Response(stream, {
                        headers: {
                            'Content-Type': 'text/plain; charset=utf-8',
                            'Transfer-Encoding': 'chunked',
                        },
                    });
                } catch (groqError: any) {
                    console.error("❌ Groq API Error:", groqError.message);
                    throw new Error(`Both APIs failed. Gemini: ${geminiError.message}. Groq: ${groqError.message}`);
                }
            }

            throw geminiError;
        }

    } catch (error: any) {
        console.error("🔥 Chat API Fatal Error:", error);
        return new Response(JSON.stringify({ error: `Chat failed: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
