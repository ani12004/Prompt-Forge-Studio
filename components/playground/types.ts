export interface Scenario {
    id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    task: string;
    constraints: string[];
    initialPrompt: string;
}

export interface Metric {
    name: string;
    score: number; // 0-100
    description: string;
}

export interface Evaluation {
    overallScore: number;
    metrics: Metric[];
    strengths: string[];
    weaknesses: string[];
    improvements: string; // The rewritten prompt
    tips: string[];
}

export const SCENARIOS: Scenario[] = [
    {
        id: 'legal-summarizer',
        title: 'The Legal Eagle',
        description: 'Summarize complex legal jargon for a layperson without losing critical details.',
        difficulty: 'Intermediate',
        task: 'You are an AI legal assistant. Summarize the provided Terms of Service snippet for a 5-year-old, but DO NOT omit the liability clause.',
        constraints: [
            'Max 50 words',
            'Must mention "money" and "rules"',
            'No complex words > 3 syllables'
        ],
        initialPrompt: 'Summarize this text: [Legal Text Here]'
    },
    {
        id: 'json-extractor',
        title: 'Data Miner',
        description: 'Extract structured JSON from a messy email thread.',
        difficulty: 'Advanced',
        task: 'Extract the meeting date, time, and participants from the text. Output ONLY valid JSON.',
        constraints: [
            'JSON format only',
            'No markdown blocks',
            'Handle missing year gracefully'
        ],
        initialPrompt: 'Extract data from this email...'
    },
    {
        id: 'creative-story',
        title: 'Flash Fiction',
        description: 'Write a compelling sci-fi story in exactly 2 sentences.',
        difficulty: 'Beginner',
        task: 'Write a story about a robot who discovers it has a soul.',
        constraints: [
            'Exactly 2 sentences',
            'Must evoke "sadness"',
            'No dialogue'
        ],
        initialPrompt: 'Write a story about a robot...'
    }
]
