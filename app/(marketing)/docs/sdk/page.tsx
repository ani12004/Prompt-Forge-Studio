import { Metadata } from "next"
import { DocumentationLayout } from "@/components/marketing/DocumentationLayout"
import { SDKDocumentationContent } from "@/components/marketing/SDKDocumentationContent"

export const metadata: Metadata = {
    title: "SDK Documentation - PromptForge",
    description: "Official Node.js SDK documentation for PromptForge Studio.",
}

export default function SDKDocsPage() {
    const navItems = [
        { name: "Installation", href: "#sdk-install" },
        { name: "Initialization", href: "#sdk-usage" },
        { name: "Executing Prompts", href: "#sdk-execute" },
        { name: "Type Definitions", href: "#sdk-types" },
    ]

    return (
        <DocumentationLayout activeTab="sdk" navigationItems={navItems}>
            <SDKDocumentationContent />
        </DocumentationLayout>
    )
}
