import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return new Response(JSON.stringify({ error: "No audio file provided" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!process.env.GROQ_API_KEY) {
            return new Response(JSON.stringify({ error: "Groq API key not configured" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log(`🎤 Transcribing audio: ${audioFile.name} (${audioFile.size} bytes)`);

        // Call Groq Whisper API
        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-large-v3-turbo",
            language: "en", // Optional: specify language for faster processing
            response_format: "json",
            temperature: 0.0 // Lower temperature for more accurate transcription
        });

        console.log(`✅ Transcription: "${transcription.text}"`);

        return new Response(JSON.stringify({
            text: transcription.text
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("❌ Transcription Error:", error);
        return new Response(JSON.stringify({
            error: error.message || "Transcription failed"
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
