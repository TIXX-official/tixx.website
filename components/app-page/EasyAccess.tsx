"use client";

import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function EasyAccess() {
    const { language } = useLanguage();
    const t = dictionary[language].appPage.easyAccess;

    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-16">

                {/* Visual: QR Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-[280px] md:max-w-[320px]"
                >
                    {/* Replacement Image */}
                    <img
                        src="/images/archive/iphone_qr.png"
                        alt="TIXX PASS QR Entry"
                        className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 text-center md:text-right"
                >
                    <h2 className="text-5xl md:text-7xl font-black font-display text-white mb-6">
                        {t.title1} <br />
                        <span className="text-neon-lime">{t.title2}</span>
                    </h2>
                    <p
                        className="text-xl md:text-2xl text-zinc-400 font-kr leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: t.description }}
                    />
                </motion.div>

            </div>
        </section>
    );
}
