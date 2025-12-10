"use client";

import { motion } from "framer-motion";

export default function BusinessAudience() {
    return (
        <section className="py-24 bg-black text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 blur-[100px] opacity-20" />

            <div className="container mx-auto max-w-7xl px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
                            The Audience
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-black font-display mb-8">
                            Meet the <br />
                            Trend Setters.
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-2xl font-bold font-display mb-2 text-white">Active 2030</h4>
                                <p className="text-lg text-zinc-400 font-kr">
                                    낮에는 전시와 팝업을, <br />
                                    밤에는 라운지와 공연을 즐기는 핵심 소비층
                                </p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold font-display mb-2 text-white">Micro-Influencer</h4>
                                <p className="text-lg text-zinc-400 font-kr">
                                    단순 관람객이 아닌, <br />
                                    경험을 SNS로 주도적으로 확산시키는 파워 유저
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        {/* Abstract Visual Representation of Audience */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-64 bg-zinc-800 rounded-3xl overflow-hidden relative group">
                                <img src="/images/audience-exhibition.png" alt="Audience" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs border border-white/20">#Exhibition</div>
                            </div>
                            <div className="h-64 bg-zinc-800 rounded-3xl overflow-hidden relative group translate-y-8">
                                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Audience" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs border border-white/20">#Party</div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
