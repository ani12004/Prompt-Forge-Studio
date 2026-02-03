"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface AboutMeModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AboutMeModal({ isOpen, onClose }: AboutMeModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A0A0C] border border-white/10 rounded-3xl shadow-2xl custom-scrollbar"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="p-8 md:p-12 space-y-8">
                            {/* Header Image (Waving Capsule) */}
                            <div className="w-full rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                                <img
                                    src="https://capsule-render.vercel.app/api?type=waving&height=120&section=header&reversal=false&fontSize=70&fontColor=FFFFFF&fontAlign=50&fontAlignY=50&stroke=-&descSize=20&descAlign=50&descAlignY=50&theme=cobalt"
                                    alt="Header"
                                    className="w-full object-cover"
                                />
                            </div>

                            {/* Bio Section */}
                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <h2 className="text-3xl font-bold text-white mb-2">Hi, Im Anil Suthar 👋</h2>
                                <p>
                                    A passionate <span className="text-brand-purple font-semibold">B.Tech Computer Science student</span> specializing in Cloud Computing. I am an aspiring DevOps & Cloud Engineer with a strong interest in building, automating, and optimizing scalable cloud infrastructure.
                                </p>
                                <p>
                                    Im currently focused on learning and working with modern DevOps tools and cloud technologies such as <span className="text-white">Docker, Kubernetes, Terraform, AWS services, and CI/CD pipelines</span>. I enjoy exploring how automation and cloud-native solutions can improve deployment efficiency, reliability, and system performance.
                                </p>
                                <p>
                                    I have hands-on experience with Linux, Bash scripting, AWS, Jenkins, and programming languages like C, C++, and Java. Im always eager to learn new tools, improve my problem-solving skills, and apply best practices in cloud and DevOps environments.
                                </p>
                                <p>
                                    Im open to learning opportunities, internships, and collaborations related to Cloud Computing and DevOps.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <a href="/anil_suthar_resume_updated_3_2_26.pdf" download target="_blank">
                                        <Button className="bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            Download Resume
                                        </Button>
                                    </a>
                                    <a href="mailto:sutharani738@gmail.com">
                                        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-gray-300 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Contact Me
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                {/* Tech Stack */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-yellow-400" />
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                        {/* Tech Icons */}
                                        {[
                                            { name: "Azure", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
                                            { name: "Blender", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
                                            { name: "C", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
                                            { name: "C++", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
                                            { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
                                            { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
                                            { name: "AWS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-line-wordmark.svg" },
                                            { name: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
                                            { name: "Kubernetes", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
                                        ].map((tech) => (
                                            <div key={tech.name} className="h-10 w-10 p-1.5 bg-white/5 rounded-lg border border-white/5 hover:border-brand-purple/50 transition-colors" title={tech.name}>
                                                <img src={tech.src} alt={tech.name} className="w-full h-full object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Socials */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Github className="h-5 w-5 text-white" />
                                        Connect
                                    </h3>
                                    <div className="flex gap-4 mb-4">
                                        {[
                                            { name: "LinkedIn", url: "https://www.linkedin.com/in/sutharani738", icon: "https://raw.githubusercontent.com/maurodesouza/profile-readme-generator/master/src/assets/icons/social/linkedin/default.svg" },
                                            { name: "Discord", url: "#", icon: "https://raw.githubusercontent.com/maurodesouza/profile-readme-generator/master/src/assets/icons/social/discord/default.svg" },
                                            { name: "Instagram", url: "#", icon: "https://raw.githubusercontent.com/maurodesouza/profile-readme-generator/master/src/assets/icons/social/instagram/default.svg" },
                                            { name: "YouTube", url: "#", icon: "https://raw.githubusercontent.com/maurodesouza/profile-readme-generator/master/src/assets/icons/social/youtube/default.svg" },
                                        ].map((social) => (
                                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                                <img src={social.icon} alt={social.name} className="h-8" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

function Zap({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}
