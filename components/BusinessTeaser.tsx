"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function BusinessTeaser() {
    const { language } = useLanguage();
    const t = dictionary[language].businessTeaser;

    return (
        <section id="business" className="py-32 px-6 border-t border-zinc-900 bg-black relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
            >
                <div className="md:w-1/2">
                    <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight text-white font-display">
                        {t.title1} <br />
                        <span className="text-zinc-600">{t.title2}</span> <br />
                        {t.title3}
                    </h2>
                    <div className="h-1 w-20 bg-neon-lime mb-8" />
                    <p className="text-xl text-zinc-400 mb-8 font-light font-kr">
                        {t.description}
                        <br />
                        <span className="text-white font-semibold">
                            {t.subDescription}
                        </span>
                    </p>
                    <a
                        href="/business#contact"
                        className="inline-flex items-center border-b border-neon-lime pb-1 text-white hover:text-neon-lime transition-colors"
                    >
                        {t.linkText} <ArrowRight className="ml-2 w-3 h-3" />
                    </a>
                </div>
                <div className="md:w-1/2 w-full">
                    {/* Abstract Graphic for Business */}
                    <div className="w-full aspect-square md:aspect-video glass-panel flex items-center justify-center p-8 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-neon-lime/50 transition-colors duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-lime/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-lime opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500" />

                        <div className="text-center relative z-10">
                            <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover:border-neon-lime/30 transition-colors duration-300">
                                <Layers className="w-10 h-10 text-zinc-400 group-hover:text-neon-lime transition-colors duration-300" />
                            </div>
                            <h3 className="text-3xl font-black text-white font-display mb-3 group-hover:text-neon-lime transition-colors duration-300">
                                {t.cardTitle}
                            </h3>
                            <p className="text-zinc-400 text-sm font-kr tracking-wide">
                                {t.cardDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
