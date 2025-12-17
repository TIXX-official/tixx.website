"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function Hero() {
    const { language } = useLanguage();
    const t = dictionary[language].hero;

    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden text-center px-4">
            {/* Abstract Video Placeholder Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(242,248,98,0.08)_0%,rgba(0,0,0,0)_70%)] animate-pulse duration-[4s] pointer-events-none" />

            <div className="z-10 max-w-5xl flex flex-col items-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6"
                >
                    {t.pretitle}
                </motion.h2>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-[10rem] font-black leading-[0.9] tracking-tighter mb-8 text-white"
                >
                    {t.title1}<br />
                    <span className="text-zinc-500">{t.title2}</span><br />
                    {t.title3}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-10 break-keep font-kr"
                    dangerouslySetInnerHTML={{ __html: t.description }}
                />
            </div>

            {/* Scroll Down Hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-600 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest block mb-2">
                    {t.scroll}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </section>
    );
}
