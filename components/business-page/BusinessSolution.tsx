"use client";

import { motion } from "framer-motion";
import { Search, Ticket, DoorOpen, Share2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function BusinessSolution() {
    const { language } = useLanguage();
    const t = dictionary[language].businessPage.solution;

    const steps = [
        { icon: Search, label: t.steps.trend },
        { icon: Ticket, label: t.steps.ticket },
        { icon: DoorOpen, label: t.steps.entry },
        { icon: Share2, label: t.steps.community },
    ];

    return (
        <section className="py-24 bg-zinc-950 text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
                        {t.preTitle}
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black font-display mb-6">
                        {t.title}
                    </h3>
                    <p className="text-xl text-zinc-400 font-kr">
                        {t.description}
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center aspect-square hover:border-neon-lime transition-colors group"
                            >
                                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-neon-lime group-hover:text-black transition-all">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <span className="text-lg font-bold font-kr">{step.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
