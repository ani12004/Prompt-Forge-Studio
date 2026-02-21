import { Metadata } from "next"
import { DocumentationLayout } from "@/components/marketing/DocumentationLayout"
import { APIDocumentationContent } from "@/components/marketing/APIDocumentationContent"

export const metadata: Metadata = {
    title: "API Reference - PromptForge",
    description: "Full REST API reference for the PromptForge Engine.",
}

export default function APIDocsPage() {
    const navItems = [
        { name: "Authentication", href: "#api-auth" },
        { name: "Endpoint Details", href: "#api-endpoint" },
        { name: "Request Schema", href: "#api-request" },
        { name: "Response Format", href: "#api-response" },
    ]

    return (
        <DocumentationLayout activeTab="api" navigationItems={navItems}>
            <APIDocumentationContent />
        </DocumentationLayout>
    )
}
