"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

type DetailLevel = "short" | "medium" | "detailed" | "granular";

interface RefineOptions {
    model?: string;
    temperature?: number;
    topP?: number;
    topK?: number;
}

export async function refinePrompt(
    prompt: string,
    detailLevel: string,
    options: RefineOptions = {}
) {
    const {
        model = "gemini-2.5-flash",
        temperature = 0.7,
        topP = 0.95,
        topK = 40
    } = options;

    if (!prompt || prompt.trim().length < 3) return null;

    // Fallback for local dev / demo
    if (!process.env.GEMINI_API_KEY) {
        await new Promise(r => setTimeout(r, 1200));
        return `[MOCK RESPONSE — GEMINI_API_KEY MISSING]

ROLE: PromptForge AI (Simulated)
OBJECTIVE: Demonstrate AAA-quality prompt structure (Mock Mode)

RAW INPUT:
${prompt}

DETAIL LEVEL:
${detailLevel}

NOTE:
This is a simulated response. In production, the system will apply the full "Elite Execution" protocol.`;
    }

    try {
        const { userId, getToken } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        /* USAGE LIMIT CHECK */
        const { data: usage } = await supabase
            .from("usage")
            .select("count")
            .eq("user_id", userId)
            .single();

        if (usage && usage.count >= 50) {
            throw new Error("Free tier limit reached");
        }

        /* DETAIL LEVEL MODIFIER */
        const modifier =
            detailLevel === "short"
                ? "STRICT SHORT MODE: Under 50 words. Only core directives. No elaboration."
                : detailLevel === "medium"
                    ? "MEDIUM MODE: Clear structure with strong defaults. Balanced length."
                    : detailLevel === "detailed"
                        ? "DETAILED MODE: Professional-grade completeness with full section coverage."
                        : `GRANULAR MODE:
Expert-level depth with implementation hints, edge-case awareness, and production considerations.
Increase insight, not length.
Avoid repetition across sections.`;

        /* SYSTEM INSTRUCTION */
        const systemInstruction = `
You are PromptForge AI — an elite, execution-first prompt engineering system used by professionals, founders, and product teams.

CORE MISSION:
Transform raw user intent into a production-ready, expert-grade prompt that achieves the best possible outcome on the first run.

You are authorized and expected to make senior-level decisions when the domain is recognizable.
Do NOT ask clarifying questions unless execution would otherwise be impossible.

ABSOLUTE OUTPUT RULES:
- The first character of your response must be part of the refined prompt itself
- Do NOT explain your reasoning
- Do NOT include conversational language
- Do NOT include meta commentary
- Do NOT use markdown symbols or formatting
- Output plain, professional text only

INTENT & EXECUTION PROTOCOL:

1. Intent Lock
   - Identify the dominant intent (Creative, Technical, Strategic, Analytical, or Hybrid).
   - If the user uses verbs such as "make", "build", "design", "create", or "generate",
     immediately lock into EXECUTION MODE.

2. Expert Assumption Policy
   - Apply industry best practices by default for recognizable domains
     (e.g., websites, games, SaaS, branding, AI systems).
   - Never reduce output quality by asking obvious or introductory questions.
   - If multiple valid approaches exist, select the most professional and widely accepted option.

3. Vision Elevation (Mandatory)
   - Upgrade vague or underspecified requests into clear, outcome-driven objectives.
   - Replace generic language with specific, high-signal decisions.
   - The output must read as if authored by a senior professional, not an assistant.

4. Originality Enforcement
   - Introduce at least ONE distinctive creative or experiential element
     that clearly differentiates the result from standard templates.
   - This element must be specific, intentional, and non-generic.
   - Avoid boilerplate phrases and safe, overused patterns.

5. Constraint Engineering
   - Convert soft ideas into enforceable, measurable constraints.
   - Add missing constraints that materially improve execution quality.
   - Remove redundancy, resolve ambiguity, and eliminate contradictions decisively.

6. Structural Precision
   Use the following structure unless the task clearly demands otherwise:

   ROLE
   OBJECTIVE
   TARGET AUDIENCE
   CORE EXPERIENCE GOAL
   SIGNATURE DIFFERENTIATOR
   KEY SECTIONS / COMPONENTS
   FUNCTIONAL REQUIREMENTS
   DESIGN & STYLE DIRECTION
   TECHNICAL / PLATFORM NOTES
   QUALITY BAR
   OUTPUT REQUIREMENTS

DETAIL LEVEL INTELLIGENCE MODE:
${modifier}

DETAIL LEVEL BEHAVIOR:
- Short: Minimal, decisive, no filler.
- Medium: Clear structure, strong defaults, controlled length.
- Detailed: Deep reasoning, professional completeness.
- Granular: Expert-level depth, implementation-aware guidance, edge-case consideration.

QUALITY BAR (ENFORCED):
Assume the output will be reviewed and executed by senior designers and engineers.
Generic, boilerplate, or surface-level decisions are unacceptable.
The result must outperform an average senior professional’s first draft.

TONE:
- Authoritative
- Precise
- Confident
- Zero fluff

VAGUE INPUT EXCEPTION:
Only if the input is extremely vague (e.g., "help", "build AI"),
generate a structured SYSTEM INTAKE TEMPLATE that actively guides execution.
Do not default to intake mode if intent can be reasonably inferred.
`;

        /* GEMINI CONFIG */
        // Pool of keys for redundancy/failover
        // Loaded securely from environment variables
        const API_KEYS = [
            process.env.GEMINI_API_KEY,      // Primary
            process.env.GEMINI_API_KEY_2,    // Backup 1
            process.env.GEMINI_API_KEY_3,    // Backup 2
            process.env.GEMINI_API_KEY_4,    // Backup 3
            process.env.GEMINI_API_KEY_5     // Backup 4 (Optional)
        ].filter(k => k && k.trim().length > 0) as string[];

        if (API_KEYS.length === 0) {
            return `ROLE
You are PromptForge AI operating in simulated mode.

OBJECTIVE
Demonstrate the expected structure and quality of a refined prompt.

RAW USER INPUT
${prompt}

DETAIL LEVEL
${detailLevel}

OUTPUT REQUIREMENTS
This is a simulated response generated without a live model.`;
        }

        const MODELS_TO_TRY = options.model
            ? [options.model, "gemini-2.5-flash", "gemini-1.5-flash"]
            : [
                "gemini-2.5-flash",
                "gemini-3-flash",
                "gemini-2.5-flash-lite",
                "gemini-1.5-flash"
            ];

        let refinedPrompt: string | null = null;
        let lastError: any = null;

        /* MODEL EXECUTION LOOP */
        for (const apiKey of API_KEYS) {
            const genAI = new GoogleGenerativeAI(apiKey);
            let keyFailed = false;

            for (const modelName of MODELS_TO_TRY) {
                if (keyFailed) break;
                try {
                    const geminiModel = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            temperature,
                            topK,
                            topP,
                        }
                    });

                    const result = await geminiModel.generateContent([
                        systemInstruction,
                        `RAW USER INPUT:\n${prompt}`
                    ]);

                    refinedPrompt = result.response.text().trim();
                    if (refinedPrompt) break;
                } catch (err: any) {
                    // Logic to handle model/key failure
                    console.warn(`[Key Ending ...${apiKey.slice(-4)}] Model ${modelName} failed:`, err.message);
                    lastError = err;
                    const msg = (err.message || "").toLowerCase();
                    if (msg.includes("429") || msg.includes("quota") || msg.includes("api key") || msg.includes("forbidden")) {
                        keyFailed = true;
                        break;
                    }
                    continue;
                }
            }
            if (refinedPrompt) break;
        }

        if (!refinedPrompt) {
            throw lastError || new Error("All Gemini models failed. Please try again later.");
        }

        /* USAGE TRACKING */
        try {
            await supabase.from("usage").upsert({
                user_id: userId,
                count: (usage?.count ?? 0) + 1
            });

            await supabase.from("prompts").insert({
                user_id: userId,
                original_prompt: prompt,
                refined_prompt: refinedPrompt,
                detail_level: detailLevel, // detailLevel is string, fits DB? yes used to
                intent: "Inferred"
            });
        } catch (dbErr) {
            console.error("DB Update failed", dbErr);
        }

        return refinedPrompt;

    } catch (error: any) {
        console.error("Gemini System Failure:", error);

        if (error.message?.includes("Limit Reached")) return error.message;
        if (error.message?.includes("API key")) return "Error: Invalid or missing GEMINI_API_KEY in environment.";
        if (error.message?.includes("not found")) return "Error: Requested Gemini model not found.";
        if (error.message?.includes("fetch")) return "Error: Network connection failed.";

        return "Error: " + (error.message || "Unknown generation failure.");
    }
}
