"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function SceneGallery() {
    const { language } = useLanguage();
    const t = dictionary[language].sceneGallery;

    const sceneImages = [
        "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "/images/popup-store.png",
        "https://images.unsplash.com/photo-1570876050997-2fdefb00c004?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ];

    const scenes = t.items.map((item, index) => ({
        ...item,
        image: sceneImages[index]
    }));

    return (
        <section className="py-24 bg-[#0a0a0a] overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="px-6 mb-10 max-w-7xl mx-auto flex items-end justify-between"
            >
                <div>
                    <span className="text-neon-lime text-xs font-bold tracking-widest uppercase mb-2 block">
                        {t.pretitle}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white font-display">
                        {t.title}
                    </h2>
                </div>
                <div className="hidden md:flex items-center text-zinc-500 text-sm">
                    <ArrowRight className="mr-2 w-4 h-4" /> {t.scrollText}
                </div>
            </motion.div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto hide-scrollbar gap-6 px-6 pb-10 snap-x snap-mandatory">
                {scenes.map((scene, index) => (
                    <div
                        key={index}
                        className="snap-center shrink-0 w-[85vw] md:w-[400px] h-[500px] bg-[#111] relative group overflow-hidden border border-zinc-800 hover:border-neon-lime transition-colors"
                    >
                        {/* Image Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        {/* Abstract visual using CSS */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                            style={{ backgroundImage: `url('${scene.image}')` }}
                        />

                        <div className="absolute bottom-8 left-8 z-20">
                            <h3 className="text-3xl font-bold text-white mb-1 font-display">
                                {scene.title}
                            </h3>
                            <p className="text-neon-lime text-sm font-semibold">
                                {scene.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
                {/* Spacer for scroll */}
                <div className="shrink-0 w-6" />
            </div>
        </section>
    );
}
