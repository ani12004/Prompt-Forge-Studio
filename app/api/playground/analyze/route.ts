import { NextResponse } from "next/server"
import { SCENARIOS } from "@/components/playground/types"

// This would typically involve a call to an LLM like Gemini or GPT-4.
// For this standalone "Playground" capability without burning user tokens immediately,
// we will implement a deterministic heuristic engine for demonstration,
// or a mock that represents the "AI Feedback Engine".

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { prompt, scenarioId } = body

        if (!prompt || !scenarioId) {
            return new Response("Missing prompt or scenarioId", { status: 400 })
        }

        const scenario = SCENARIOS.find(s => s.id === scenarioId)
        if (!scenario) {
            return new Response("Invalid scenario", { status: 400 })
        }

        // --- HEURISTIC ANALYSIS SIMULATION ---
        // In a real production app, this would be a prompt to an LLM:
        // "Analyze this user prompt based on the following task... Return JSON..."

        const lengthScore = Math.min(100, Math.max(0, (prompt.length / 50) * 100))
        const hasConstraints = scenario.constraints.some(c => prompt.toLowerCase().includes(c.split(' ')[0].toLowerCase())) // Naive check

        // Mock Evaluation Data based on simple heuristics
        const evaluation = {
            overallScore: hasConstraints ? 85 : 45,
            metrics: [
                {
                    name: "Intent Precision",
                    score: prompt.length > 20 ? 90 : 40,
                    description: "How clearly the goal is defined."
                },
                {
                    name: "Context Quality",
                    score: prompt.includes("context") || prompt.length > 50 ? 80 : 30,
                    description: "Sufficient background information provided."
                },
                {
                    name: "Constraint Adherence",
                    score: hasConstraints ? 95 : 20,
                    description: "Follows specific negative or format constraints."
                }
            ],
            strengths: [
                "Clear active voice used.",
                hasConstraints ? "Good adherence to length constraints." : "Attempted to define the task."
            ],
            weaknesses: [
                !hasConstraints ? "Failed to explicitly mention constraints." : "Could be more concise.",
                "Lacks 'Chain of Thought' instructions."
            ],
            improvements: `[Improved] ${scenario.task}\n\nReview: \n${prompt}\n\nRefined: \n"Act as an expert. ${prompt}. Ensure you follow these rules: ${scenario.constraints.join(', ')}."`,
            tips: [
                "Always assign a Persona (e.g., 'Act as a lawyer').",
                "Use delimiters like quotes or XML tags for data."
            ]
        }

        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500))

        return NextResponse.json({
            success: true,
            evaluation
        })

    } catch (error) {
        console.error("Playground API Error:", error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
