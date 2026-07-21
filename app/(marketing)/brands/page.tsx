"use client";

import { motion } from "framer-motion";

export default function BrandsPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-6 bg-deep-black text-white">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold font-display mb-8 text-white">
                        For Brands
                    </h1>
                    <p className="text-xl md:text-2xl font-kr text-zinc-400 leading-relaxed max-w-2xl">
                        감(Feel)이 아닌 데이터(Data). <br />
                        타겟 오디언스에게 정확히 도달하는 마케팅.
                    </p>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-zinc-900 border border-white/5">
                            <h3 className="text-2xl font-bold mb-4 text-neon-lime">Target Audience</h3>
                            <p className="text-zinc-400 font-kr">
                                나이트라이프를 즐기는 핵심 타겟층에게 직접 도달하세요.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-zinc-900 border border-white/5">
                            <h3 className="text-2xl font-bold mb-4 text-neon-lime">Data Insights</h3>
                            <p className="text-zinc-400 font-kr">
                                직관이 아닌 데이터로 마케팅 성과를 분석하고 최적화하세요.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
