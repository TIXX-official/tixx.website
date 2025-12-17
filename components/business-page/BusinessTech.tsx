"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function BusinessTech() {
    const { language } = useLanguage();
    const t = dictionary[language].businessPage.tech;

    return (
        <section className="py-24 bg-zinc-950 text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex-1 w-full"
                    >
                        {/* Dashboard Mockup Graphic */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-neon-blue" />
                            <div className="flex gap-4 mb-8">
                                <div className="flex-1 bg-black rounded-lg p-4">
                                    <div className="text-xs text-zinc-500 mb-1">Live Guests</div>
                                    <div className="text-2xl font-mono text-neon-green">842</div>
                                </div>
                                <div className="flex-1 bg-black rounded-lg p-4">
                                    <div className="text-xs text-zinc-500 mb-1">Ticket Sales</div>
                                    <div className="text-2xl font-mono text-white">1,240</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/50 p-4 rounded-lg">
                                    <div className="text-xs text-zinc-500 mb-2">Gender Ratio</div>
                                    <div className="flex items-end gap-2 h-20">
                                        <div className="w-1/2 bg-blue-500/50 h-[45%] rounded-t-sm" />
                                        <div className="w-1/2 bg-pink-500/50 h-[55%] rounded-t-sm" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                                        <span>M 45%</span>
                                        <span>F 55%</span>
                                    </div>
                                </div>
                                <div className="bg-black/50 p-4 rounded-lg">
                                    <div className="text-xs text-zinc-500 mb-2">Age Group</div>
                                    <div className="flex items-end gap-1 h-20">
                                        <div className="flex-1 bg-zinc-700 h-[20%] rounded-t-sm" />
                                        <div className="flex-1 bg-neon-lime h-[80%] rounded-t-sm" />
                                        <div className="flex-1 bg-zinc-700 h-[40%] rounded-t-sm" />
                                    </div>
                                    <div className="text-center text-[10px] text-zinc-500 mt-1">20s Dominant</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
                            {t.preTitle}
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-black font-display mb-8 whitespace-pre-line">
                            {t.title}
                        </h3>
                        <p
                            className="text-xl text-zinc-400 font-kr mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: t.description }}
                        />
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-zinc-300 font-kr">
                                <span className="text-neon-lime mt-1">✔</span>
                                {t.list1}
                            </li>
                            <li className="flex items-start gap-3 text-zinc-300 font-kr">
                                <span className="text-neon-lime mt-1">✔</span>
                                {t.list2}
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
