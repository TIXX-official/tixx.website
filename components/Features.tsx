"use client";

import { motion } from "framer-motion";
import { Search, QrCode, Zap } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function Features() {
    const { language } = useLanguage();
    const t = dictionary[language].features;

    const features = [
        {
            icon: Search,
            title: t.items[0].title,
            desc: t.items[0].desc,
        },
        {
            icon: QrCode,
            title: t.items[1].title,
            desc: t.items[1].desc,
        },
        {
            icon: Zap,
            title: t.items[2].title,
            desc: t.items[2].desc,
        },
    ];

    return (
        <section id="app" className="py-24 px-6 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group"
                        >
                            <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-neon-lime transition-colors duration-500 mx-auto md:mx-0">
                                <feature.icon className="w-6 h-6 text-white group-hover:text-neon-lime transition-colors" />
                            </div>
                            <h3 className="text-3xl font-bold mb-2 italic font-display">
                                {feature.title}
                            </h3>
                            <p
                                className="text-zinc-500 leading-relaxed font-kr"
                                dangerouslySetInnerHTML={{ __html: feature.desc }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
