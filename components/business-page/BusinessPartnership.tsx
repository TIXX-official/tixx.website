"use client";

import { motion } from "framer-motion";

export default function BusinessPartnership() {
    const options = [
        {
            title: "Brand Activation",
            desc: "TIXX가 기획하는 파티/전시에 <br/> 브랜드 부스 및 체험존 운영",
        },
        {
            title: "Traffic Booster",
            desc: "TIXX 앱 내 메인 배너 및 <br/> 푸시 알림으로 브랜드 팝업/행사 모객",
        },
        {
            title: "Sponsored Content",
            desc: "브랜드 이미지를 반영한 <br/> 오리지널 파티/이벤트 기획 (Naming Rights)",
        },
    ];

    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="mb-16">
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
                        Partnership Model
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black font-display">
                        How to Collaborate.
                    </h3>
                </div>

                <div className="space-y-6">
                    {options.map((opt, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neon-lime transition-colors group"
                        >
                            <h4 className="text-3xl font-bold font-display text-zinc-300 group-hover:text-white transition-colors">
                                {index + 1}. {opt.title}
                            </h4>
                            <p
                                className="text-lg text-zinc-500 font-kr md:text-right group-hover:text-zinc-300 transition-colors"
                                dangerouslySetInnerHTML={{ __html: opt.desc }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
