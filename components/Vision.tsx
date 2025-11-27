"use client";

import { motion } from "framer-motion";

export default function Vision() {
    return (
        <section className="py-32 px-6 bg-[#050505] relative">
            <div className="max-w-5xl mx-auto text-center md:text-left">
                {/* Main Slogan */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-8xl font-bold font-display text-white mb-12 leading-tight"
                >
                    Nightlife, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">
                        Reimagined.
                    </span>
                </motion.h2>

                {/* Narrative Description */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row gap-12 border-t border-zinc-800 pt-12"
                >
                    <div className="md:w-1/3">
                        <span className="text-neon-lime font-bold tracking-widest text-xs uppercase">
                            Who We Are
                        </span>
                    </div>
                    <div className="md:w-2/3">
                        <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light mb-8 break-keep font-kr">
                            <strong className="text-white font-semibold">TIXX</strong>는 단순한
                            티켓팅 플랫폼이 아닙니다. 우리는 낡고 파편화된 밤의 문화를 기술로
                            재정의하는 <span className="text-white">컬처 테크 기업</span>입니다.
                        </p>
                        <p className="text-lg text-zinc-500 leading-relaxed break-keep font-kr">
                            기획자에게는 데이터 기반의 운영 효율을, 브랜드에게는 정확한 타겟팅을,
                            그리고 관객에게는 끊김 없는(Seamless) 경험을 제공합니다. 우리는
                            씬(Scene)을 연결하고, 확장하며, 마침내 완성합니다.
                        </p>
                    </div>
                </motion.div>

                {/* Stats / Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24"
                >
                    <div>
                        <div className="text-4xl font-bold text-white mb-2 font-display">120+</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">
                            Partner Venues
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2 font-display">50k+</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">
                            Active Users
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2 font-display">0%</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">
                            Settlement Errors
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2 font-display">24/7</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">
                            Support
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
