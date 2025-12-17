"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function BusinessMarketGap() {
    const { language } = useLanguage();
    const t = dictionary[language].businessPage.marketGap;

    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        {t.preTitle}
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black font-display mb-8 leading-tight whitespace-pre-line">
                        {t.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                        <div className="border-l border-zinc-800 pl-8">
                            <p
                                className="text-xl text-zinc-400 font-kr leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: t.leftBox }}
                            />
                        </div>
                        <div className="border-l-4 border-neon-lime pl-8">
                            <p
                                className="text-2xl text-white font-kr font-medium leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: t.rightBox }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
