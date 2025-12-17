"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function AppHero() {
    const { language } = useLanguage();
    const t = dictionary[language].appPage.hero;

    return (
        <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden px-6 py-20 bg-black">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-lime opacity-10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-lime opacity-10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 text-center md:text-left"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        {t.preTitle}
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white leading-[0.9] mb-8">
                        {t.title1} <br />
                        <span className="text-zinc-500">{t.title2}</span>
                    </h1>
                    <p
                        className="text-lg md:text-2xl text-zinc-400 font-kr font-light leading-relaxed max-w-xl mx-auto md:mx-0"
                        dangerouslySetInnerHTML={{ __html: t.description }}
                    />
                </motion.div>

                {/* iPhone Mockup Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 50, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 relative"
                >
                    {/* Floating 3D Objects (CSS Shapes) */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-neon-lime to-transparent opacity-20 rounded-full blur-xl z-0"
                    />
                    <motion.div
                        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-neon-lime to-transparent opacity-20 rounded-full blur-xl z-0"
                    />

                    {/* iPhone Images */}
                    <div className="relative flex justify-center items-center gap-4 z-10 min-h-[900px]">
                        <motion.img
                            src="/images/archive/tixx-iPhone2.png"
                            alt="TIXX App Interface 2"
                            className="w-[85vw] md:w-[500px] h-auto rounded-[50px] shadow-2xl z-10"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        />
                        <motion.img
                            src="/images/archive/tixx-iPhone.png"
                            alt="TIXX App Interface"
                            className="w-[85vw] md:w-[500px] h-auto rounded-[50px] shadow-2xl -ml-24 md:-ml-40 mt-24 md:mt-48 z-20"
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 20, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
