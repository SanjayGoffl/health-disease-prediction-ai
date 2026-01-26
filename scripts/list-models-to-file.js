const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function listModels() {
    try {
        const envPath = path.join(__dirname, '../.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.+)/);
        const apiKey = match[1].trim();

        console.log("Fetching models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        fs.writeFileSync(path.join(__dirname, 'available_models.json'), JSON.stringify(data, null, 2));
        console.log("Models saved to scripts/available_models.json");
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
