import { Metadata } from "next"
import { PlaygroundClient } from "@/components/playground/PlaygroundClient"

export const metadata: Metadata = {
    title: "Prompt Engineering Playground | Interactive Simulator",
    description: "Master prompt engineering with our interactive playground. Solve real-world AI challenges, get instant DNA analysis, and improve your skills.",
    keywords: ["prompt engineering playground", "learn prompt engineering", "AI prompt training", "advanced prompt engineering", "interactive prompt tutorial"],
    openGraph: {
        title: "Prompt Engineering Playground | Interactive Simulator",
        description: "Test your skills in the Prompt Verification Arena. Real-time feedback and analysis.",
    }
}

export default function PlaygroundPage() {
    return <PlaygroundClient />
}
