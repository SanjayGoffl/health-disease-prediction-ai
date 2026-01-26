const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function checkModels() {
    try {
        // Read .env.local manually to get key
        const envPath = path.join(__dirname, '../.env.local');
        if (!fs.existsSync(envPath)) {
            console.error("❌ .env.local file not found!");
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.+)/);

        if (!match || !match[1]) {
            console.error("❌ GEMINI_API_KEY not found in .env.local");
            return;
        }

        const apiKey = match[1].trim();
        console.log(`🔑 Testing with API Key: ${apiKey.substring(0, 5)}...`);

        const genAI = new GoogleGenerativeAI(apiKey);

        console.log("\n📡 Fetching available models...");
        const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Actually listModels is on the class instance or we need to look at documentation. 
        // The SDK typically exposes a way to list models, but often it's simplest to just try the request.
        // However, the error message itself suggests "Call ListModels to see the list".

        // NOTE: The Node SDK might not expose listModels directly on the main client in older versions, 
        // but commonly it's accessible via the API.
        // Let's try to verify the exact model name by listing if possible.
        // Wait, the SDK doesn't always make listModels easy.

        // Alternative: The error might be because the key is strictly for a different "project" or "region".
        // But let's try to query the model text to see if we get a better error or success with a verified model.

        // Let's actually use the fetch API directly to list models to be 100% sure of what the raw API sees.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error);
        } else if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`   - ${m.name.replace('models/', '')} \t(${m.displayName})`);
                }
            });
        } else {
            console.log("⚠️ No models found or unexpected format:", data);
        }

    } catch (error) {
        console.error("❌ Script Error:", error);
    }
}

checkModels();
