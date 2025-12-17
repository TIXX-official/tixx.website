"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function Philosophy() {
    const { language } = useLanguage();
    const t = dictionary[language].aboutPage.philosophy;

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />

            <div className="container mx-auto max-w-4xl px-6 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-8 uppercase">
                        {t.preTitle}
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white mb-12 leading-tight whitespace-pre-line">
                        {t.title}
                    </h1>
                    <div className="space-y-6 text-lg md:text-2xl text-zinc-300 font-kr font-light leading-relaxed max-w-2xl mx-auto">
                        <p>
                            {t.description1}
                        </p>
                        <p dangerouslySetInnerHTML={{ __html: t.description2 }} />
                    </div>
                </motion.div>
            </div>
        </section >
    );
}
