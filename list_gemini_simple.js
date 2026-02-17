const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[key] = value;
    }
});

async function run() {
    const key = (env.GOOGLE_GENERATIVE_AI_API_KEY || '').trim();
    if (!key) { console.log("NO_KEY"); return; }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("--- START MODELS ---");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(m.name.replace('models/', ''));
                }
            });
            console.log("--- END MODELS ---");
        } else {
            console.error("ERROR", JSON.stringify(data));
        }

    } catch (error) {
        console.error("EXCEPTION", error.message);
    }
}

run();
