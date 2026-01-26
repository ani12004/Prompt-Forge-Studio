import { Accordion, AccordionItem } from "@/components/ui/Accordion"

export default function PrivacyPage() {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-gray-400 mb-12 leading-relaxed">
                Your privacy is important to us. It is PromptForge AI's policy to respect your privacy regarding any information we may collect from you across our website.
            </p>

            <Accordion items={[
                {
                    title: "1. Information We Collect",
                    content: "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent."
                },
                {
                    title: "2. How We Use Information",
                    content: "We use the information we collect in various ways, including to provide, operate, and maintain our website, improve, personalize, and expand our website, and understand and analyze how you use our website."
                },
                {
                    title: "3. Log Files",
                    content: "PromptForge AI follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics."
                },
                {
                    title: "4. Data Security",
                    content: "We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security."
                }
            ]} />
        </div>
    )
}
