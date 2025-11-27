"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, Zap } from "lucide-react";

export default function BusinessPlatform() {
    const features = [
        {
            icon: Zap,
            title: "Automated",
            desc: "DJ 게스트 관리부터 티켓팅까지. <br>12시 전/후 입장 자동화 시스템.",
        },
        {
            icon: BarChart3,
            title: "Data-Driven",
            desc: "실시간 입장객 데이터 분석으로 <br>더 스마트한 운영 전략 수립.",
        },
        {
            icon: Users,
            title: "Cost-Free",
            desc: "초기 도입 비용 0원. <br>이 모든 솔루션을 무료로 시작하세요.",
        },
    ];

    return (
        <section className="py-32 bg-zinc-950">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-display text-white mb-6"
                    >
                        TIXX Platform
                    </motion.h2>
                    <p className="text-xl text-zinc-400 font-kr">
                        클럽, 라운지 오너, 파티 기획자를 위한 강력한 어드민 솔루션.
                    </p>
                    <div className="mt-8">
                        <a
                            href="https://app.tixx.im/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 border border-zinc-700 text-white font-bold rounded-full hover:border-neon-lime hover:text-neon-lime transition-colors duration-300"
                        >
                            Partner Center
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-neon-lime transition-colors group"
                        >
                            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-neon-lime transition-colors">
                                <feature.icon className="w-7 h-7 text-white group-hover:text-black" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 font-display">{feature.title}</h3>
                            <p
                                className="text-zinc-400 font-kr leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: feature.desc }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
