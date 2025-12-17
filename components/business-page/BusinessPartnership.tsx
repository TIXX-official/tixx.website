"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function BusinessPartnership() {
    const { language } = useLanguage();
    const t = dictionary[language].businessPage.partnership;

    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="mb-16">
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
                        {t.preTitle}
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black font-display">
                        {t.title}
                    </h3>
                </div>

                <div className="space-y-6">
                    {t.options.map((opt: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neon-lime transition-colors group"
                        >
                            <h4 className="text-3xl font-bold font-display text-zinc-300 group-hover:text-white transition-colors">
                                {index + 1}. {opt.title}
                            </h4>
                            <p
                                className="text-lg text-zinc-500 font-kr md:text-right group-hover:text-zinc-300 transition-colors"
                                dangerouslySetInnerHTML={{ __html: opt.desc }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
