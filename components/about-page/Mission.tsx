"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function Mission() {
    const { language } = useLanguage();
    const t = dictionary[language].aboutPage.mission;

    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-16">

                {/* Visual */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 w-full"
                >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <img
                            src="/images/mission-visual-clean.png"
                            alt="Crowd Connection"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        {t.preTitle}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-black font-display text-white mb-8 leading-tight whitespace-pre-line">
                        {t.title}
                    </h1>
                    <p
                        className="text-xl md:text-2xl text-zinc-400 font-kr leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: t.description }}
                    />
                </motion.div>

            </div>
        </section>
    );
}
