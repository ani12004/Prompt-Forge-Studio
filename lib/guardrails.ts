export interface GuardrailResult {
    passed: boolean;
    reason?: string;
}

export function runGuardrails(input: string): GuardrailResult {
    const profanityRegex = /\b(fuck|shit|bitch|asshole)\b/i;
    if (profanityRegex.test(input)) {
        return { passed: false, reason: "Profanity detected." };
    }

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (emailRegex.test(input)) {
        return { passed: false, reason: "PII detected (Email format)." };
    }

    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    if (phoneRegex.test(input)) {
        return { passed: false, reason: "PII detected (Phone format)." };
    }

    return { passed: true };
}

export function validateSchema(output: string, requiredSchema: any): boolean {
    if (!requiredSchema || Object.keys(requiredSchema).length === 0) return true;
    try {
        const parsed = JSON.parse(output);
        for (const key of Object.keys(requiredSchema)) {
            if (!(key in parsed)) return false;
        }
        return true;
    } catch {
        return false;
    }
}
