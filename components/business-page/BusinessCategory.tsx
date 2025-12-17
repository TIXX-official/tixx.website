"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function BusinessCategory() {
    const { language } = useLanguage();
    const t = dictionary[language].businessPage.category;

    return (
        <section className="py-24 bg-zinc-950 text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
                        {t.preTitle}
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black font-display mb-6">
                        {t.title}
                    </h3>
                    <p className="text-xl text-zinc-400 font-kr">
                        {t.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Day Block */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-zinc-100/10 rounded-3xl p-10 flex flex-col items-start border border-white/5 hover:border-yellow-400/50 transition-colors"
                    >
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-6 text-black">
                            <Sun className="w-6 h-6" />
                        </div>
                        <h4 className="text-3xl font-black font-display mb-4">DAY</h4>
                        <div className="flex flex-wrap gap-2">
                            {t.dayTags.map((item: string) => (
                                <span key={item} className="px-4 py-2 bg-white/10 rounded-full text-sm font-kr border border-white/10">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Night Block */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-black rounded-3xl p-10 flex flex-col items-start border border-zinc-800 hover:border-neon-purple/50 transition-colors"
                    >
                        <div className="w-12 h-12 bg-neon-purple rounded-full flex items-center justify-center mb-6 text-white">
                            <Moon className="w-6 h-6" />
                        </div>
                        <h4 className="text-3xl font-black font-display mb-4">NIGHT</h4>
                        <div className="flex flex-wrap gap-2">
                            {t.nightTags.map((item: string) => (
                                <span key={item} className="px-4 py-2 bg-zinc-900 rounded-full text-sm font-kr text-zinc-300 border border-zinc-800">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
