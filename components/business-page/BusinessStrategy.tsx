"use client";

import { motion } from "framer-motion";

export default function BusinessStrategy() {
    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
                        Success Strategy
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black font-display mb-6">
                        We Make <br className="md:hidden" /> the Queue.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-96 rounded-3xl overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                            <h4 className="text-3xl font-black font-display mb-4 text-white">Curated Vibe</h4>
                            <p className="text-zinc-300 font-kr leading-relaxed">
                                아무거나 올리지 않습니다. <br />
                                TIXX의 '힙한' 필터를 거친 행사는 반드시 뜹니다.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-96 rounded-3xl overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540039155733-5c30b472bf1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                            <h4 className="text-3xl font-black font-display mb-4 text-white">Community Effect</h4>
                            <p className="text-zinc-300 font-kr leading-relaxed">
                                <span className="text-neon-lime font-bold">"누구랑 가지?"</span> <br />
                                혼자 망설이던 잠재 고객을 현장으로 이끕니다.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
