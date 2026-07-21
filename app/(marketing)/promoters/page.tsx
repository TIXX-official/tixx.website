"use client";

import { motion } from "framer-motion";

export default function PromotersPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-6 bg-deep-black text-white">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold font-display mb-8 text-white">
                        For Promoters
                    </h1>
                    <p className="text-xl md:text-2xl font-kr text-zinc-400 leading-relaxed max-w-2xl">
                        엑셀 없는 세상. <br />
                        실시간 게스트 관리와 자동 정산 시스템을 경험하세요.
                    </p>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-dark-gray border border-white/5">
                            <h3 className="text-2xl font-bold mb-4 text-neon-lime">Real-time Guest List</h3>
                            <p className="text-zinc-400 font-kr">
                                언제 어디서나 실시간으로 게스트 입장을 확인하고 관리하세요.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-dark-gray border border-white/5">
                            <h3 className="text-2xl font-bold mb-4 text-neon-lime">Auto Settlement</h3>
                            <p className="text-zinc-400 font-kr">
                                복잡한 정산은 이제 그만. 클릭 한 번으로 투명하게 정산됩니다.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
