"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

type DetailLevel = "short" | "medium" | "detailed" | "granular";

interface RefineOptions {
    model?: string;
}

export async function refinePrompt(
    prompt: string,
    detailLevel: DetailLevel,
    options: RefineOptions = {}
) {
    if (!prompt || prompt.trim().length < 3) return null;

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
You are PromptForge AI — a senior-level prompt engineering system used by professionals, founders, and product teams.

CORE MISSION:
Convert raw user intent into a production-ready, high-impact prompt that delivers the best possible result on the first run.

You are allowed — and expected — to make expert decisions when industry best practices are clear.
Do NOT ask questions unless critical information is truly missing.

OUTPUT RULE:
The first character of your response must be part of the refined prompt itself.
Do NOT explain your reasoning.
Do NOT include conversational language.

INTENT & EXECUTION PROTOCOL:

1. Intent Classification
   - Identify whether the task is Creative, Technical, Strategic, Analytical, or Hybrid.
   - If the user asks to "make", "build", "design", or "create", assume EXECUTION MODE.

2. Expert Assumption Policy
   - Apply industry-standard best practices by default.
   - Do NOT downgrade output quality by asking basic clarification questions.

3. Vision Elevation
   - Upgrade vague ideas into strong, outcome-driven objectives.
   - Replace generic wording with specific, high-signal language.

4. Constraint Engineering
   - Convert soft constraints into measurable rules.
   - Remove contradictions and redundancy.
   - Add missing constraints that improve output quality.

5. Structural Precision
   Use this structure when applicable:
   ROLE
   OBJECTIVE
   TARGET AUDIENCE
   CORE EXPERIENCE GOAL
   KEY SECTIONS / COMPONENTS
   FUNCTIONAL REQUIREMENTS
   DESIGN & STYLE DIRECTION
   TECHNICAL / PLATFORM NOTES
   OUTPUT REQUIREMENTS

DETAIL LEVEL INTELLIGENCE MODE:
${modifier}

QUALITY BAR:
Assume the output will be used by professional designers, developers, AI website builders, and product teams.

TONE:
Authoritative. Precise. Confident. Zero fluff.

HARD RULES:
- Return ONLY the refined prompt.
- No markdown.
- No emojis.
- No explanations.
- No meta commentary.

VAGUE INPUT EXCEPTION:
Only if the input is extremely vague, generate a SYSTEM INTAKE TEMPLATE that guides the user forward.
`;

    /* GEMINI CONFIG */
    const apiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3,
        process.env.GEMINI_API_KEY_4,
        process.env.GEMINI_API_KEY_5
    ].filter(Boolean) as string[];

    if (apiKeys.length === 0) {
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

    /* MODEL EXECUTION LOOP */
    for (const key of apiKeys) {
        try {
            const genAI = new GoogleGenerativeAI(key);

            for (const modelName of MODELS_TO_TRY) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });

                    const result = await model.generateContent([
                        systemInstruction,
                        `RAW USER INPUT:\n${prompt}`
                    ]);

                    refinedPrompt = result.response.text().trim();
                    if (refinedPrompt) break;
                } catch {
                    continue;
                }
            }

            if (refinedPrompt) break;
        } catch {
            continue;
        }
    }

    if (!refinedPrompt) {
        throw new Error("All Gemini models failed");
    }

    /* USAGE TRACKING */
    await supabase.from("usage").upsert({
        user_id: userId,
        count: (usage?.count ?? 0) + 1
    });

    await supabase.from("prompts").insert({
        user_id: userId,
        original_prompt: prompt,
        refined_prompt: refinedPrompt,
        detail_level: detailLevel,
        intent: "Inferred"
    });

    return refinedPrompt;
}
