import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { text, mealType } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: "GROQ_API_KEY is not set." }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a nutritional data extractor. Extract food items from the user's text.
Return ONLY valid JSON. No markdown. No comments.

JSON Schema:
{
  "items": [
    {
      "name": string (food item name, capitalized),
      "calories": number (estimated kcal),
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "fiber": number (grams)
    }
  ],
  "mealType": "${mealType || 'snack'}"
}

Rules:
- Extract EACH food item separately (e.g., "2 eggs and toast" = 2 items).
- Use standard nutritional estimates for common foods.
- If quantity is specified (e.g., "2 eggs"), multiply accordingly.
- If unsure, use a reasonable average estimate.
- Name should be human-readable (e.g., "Scrambled Eggs (2)", "Whole Wheat Toast").
- Round all numbers to nearest integer.`
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
        console.error("Food extraction error:", error);
        return NextResponse.json({ error: error.message || "Failed to extract food data" }, { status: 500 });
    }
}
