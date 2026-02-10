"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function Partners() {
    const { language } = useLanguage();
    const t = dictionary[language].aboutPage.partners;

    const partners = [
        "HURRA", "TIMES", "Jagermeister", "BOLERO", "THE HENZ", "FRAME SEOUL", "Orgasm Valley 2",
        "BUBBLE PLAYLIST", "AMBIENCE SEOUL", "PGMNT", "THE CLIFF JEJU", "BEACH CLIFF"
    ];

    return (
        <section className="py-32 bg-black border-t border-zinc-900">
            <div className="container mx-auto max-w-7xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4">
                        {t.title}
                    </h2>
                    <p className="text-zinc-500 font-kr">
                        {t.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-center p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-colors group"
                        >
                            <span className="text-xl md:text-2xl font-bold text-zinc-600 group-hover:text-white transition-colors font-display uppercase tracking-wider">
                                {partner}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
