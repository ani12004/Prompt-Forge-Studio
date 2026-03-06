
import { GeminiProvider } from './lib/ai/providers/gemini.js';
import { GroqProvider } from './lib/ai/providers/groq.js';

// Mock process.env for testing beautify logic
process.env.GEMINI_API_KEY = 'mock-key';
process.env.GROQ_API_KEY = 'mock-key';

async function testBeautify() {
    console.log("--- Testing Beautification Logic ---\n");

    const gemini = new GeminiProvider();
    const groq = new GroqProvider();

    const testCases = [
        {
            name: "Plain Text",
            input: "This is a simple refined prompt.",
            expected: "This is a simple refined prompt."
        },
        {
            name: "Markdown JSON Block",
            input: "```json\n{\n  \"refined_prompt\": \"This is the actual prompt.\"\n}\n```",
            expected: "This is the actual prompt."
        },
        {
            name: "Markdown Block No Language",
            input: "```\n{\n  \"content\": \"Clean this up.\"\n}\n```",
            expected: "Clean this up."
        },
        {
            name: "Raw JSON Object",
            input: "{\"output\": \"Extracted from output field.\"}",
            expected: "Extracted from output field."
        },
        {
            name: "Mixed Markdown and Text",
            input: "Here is your prompt:\n```json\n{\"prompt\": \"The Prompt\"}\n```",
            expected: "The Prompt"
        }
    ];

    for (const test of testCases) {
        // Accessing protected/private method for testing
        const resultGemini = gemini.beautify(test.input);
        const resultGroq = groq.beautify(test.input);

        const success = resultGemini === test.expected && resultGroq === test.expected;

        console.log(`[${test.name}]`);
        console.log(`  Input: ${test.input.replace(/\n/g, '\\n')}`);
        console.log(`  Output: ${resultGemini}`);
        console.log(`  Result: ${success ? '✅ PASS' : '❌ FAIL (Expected: ' + test.expected + ')'}\n`);
    }
}

testBeautify().catch(console.error);
