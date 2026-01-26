import { Accordion, AccordionItem } from "@/components/ui/Accordion"

export default function TermsPage() {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
            <p className="text-gray-400 mb-12 leading-relaxed">
                Last updated: January 23, 2026. Please read these terms carefully before using our service.
            </p>

            <Accordion items={[
                {
                    title: "1. Acceptance of Terms",
                    content: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement."
                },
                {
                    title: "2. Intellectual Property",
                    content: "The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights."
                },
                {
                    title: "3. Use License",
                    content: "Permission is granted to temporarily download one copy of the materials (information or software) on PromptForge AI's website for personal, non-commercial transitory viewing only."
                },
                {
                    title: "4. disclaimer",
                    content: "The materials on PromptForge AI's website are provided on an 'as is' basis. PromptForge AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
                }
            ]} />
        </div>
    )
}
