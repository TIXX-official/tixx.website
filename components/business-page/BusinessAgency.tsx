"use client";

import { motion } from "framer-motion";

export default function BusinessAgency() {
    return (
        <section className="py-32 bg-black overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-16">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1"
                >
                    <h2 className="text-4xl md:text-6xl font-black font-display text-white mb-6">
                        TIXX Agency
                    </h2>
                    <p className="text-xl text-zinc-400 font-kr mb-10 leading-relaxed">
                        기업 브랜드 행사부터 페스티벌까지. <br />
                        가장 트렌디한 파티를 기획하고 운영합니다.
                    </p>

                    <div className="space-y-6">
                        <div className="border-l-4 border-neon-lime pl-6">
                            <h3 className="text-2xl font-bold text-white mb-2 font-display">Party Planning</h3>
                            <p className="text-zinc-500 font-kr">컨셉 도출부터 현장 운영까지 턴키(Turn-key) 진행</p>
                        </div>
                        <div className="border-l-4 border-neon-lime pl-6">
                            <h3 className="text-2xl font-bold text-white mb-2 font-display">Artist Booking</h3>
                            <p className="text-zinc-500 font-kr">국내외 탑티어 DJ 및 아티스트 섭외</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 grid grid-cols-2 gap-4"
                >
                    <div className="space-y-4 mt-8">
                        <div className="h-64 bg-zinc-800 rounded-2xl overflow-hidden">
                            <img src="/images/dj-club.png" alt="Party" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="h-40 bg-zinc-800 rounded-2xl overflow-hidden">
                            <img src="/images/cocktail-bar.png" alt="Party" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-40 bg-zinc-800 rounded-2xl overflow-hidden">
                            <img src="/images/art-exhibition.png" alt="Party" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="h-64 bg-zinc-800 rounded-2xl overflow-hidden">
                            <img src="/images/party-crowd.png" alt="Party" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
