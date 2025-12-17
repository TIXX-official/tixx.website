"use client";

import { motion } from "framer-motion";
import { Ticket, Star, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function Benefits() {
    const { language } = useLanguage();
    const t = dictionary[language].appPage.benefits;

    return (
        <section className="py-32 bg-zinc-950">
            <div className="container mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-black font-display text-white mb-4">
                        {t.title}
                    </h2>
                    <p className="text-xl text-zinc-400 font-kr">
                        {t.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Benefit Card 1: Free Guest */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        whileHover={{ y: -10 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 bg-neon-lime text-black text-xs font-bold px-4 py-2 rounded-bl-2xl">
                            {t.card1.badge}
                        </div>
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-neon-lime transition-colors duration-300">
                            <Star className="w-8 h-8 text-white group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-display">{t.card1.title}</h3>
                        <p className="text-zinc-400 font-kr">
                            {t.card1.description}
                        </p>
                    </motion.div>

                    {/* Benefit Card 2: Early Bird */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        whileHover={{ y: -10 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 bg-neon-lime text-black text-xs font-bold px-4 py-2 rounded-bl-2xl">
                            {t.card2.badge}
                        </div>
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-neon-lime transition-colors duration-300">
                            <Clock className="w-8 h-8 text-white group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-display">{t.card2.title}</h3>
                        <p className="text-zinc-400 font-kr">
                            {t.card2.description}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
