import { PromptForgeClient } from './promptforge-sdk/dist/index.mjs';
import fs from 'fs';
import path from 'path';

// Read .env.local manually for test integration
const envPath = path.resolve('.env.local');
let apiKey = 'pf_test_key';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/); // In a real test, we'd use a PromptForge key
    // For now, let's just mock or use placeholders if we don't have a real PF key
} catch (e) { }

const pf = new PromptForgeClient({
    apiKey: process.env.PROMPTFORGE_API_KEY || 'pf_live_test_123',
    baseUrl: 'http://localhost:3000' // Test against local dev server
});

async function runTest() {
    console.log("🚀 Testing PromptForge SDK...");

    try {
        const response = await pf.execute({
            versionId: '00000000-0000-0000-0000-000000000000', // Mock UUID
            variables: {
                user_query: "Hello world"
            }
        });

        console.log("✅ SDK Response Received:", response.success);
        console.log("📊 Meta Info:", JSON.stringify(response.meta, null, 2));
    } catch (error) {
        console.error("❌ SDK Error:", error.name);
        console.error("HTTP Status:", error.statusCode);
        console.error("Error Code:", error.code);
        console.error("Message:", error.message);
    }
}

runTest();
