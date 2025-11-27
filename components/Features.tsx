"use client";

import { motion } from "framer-motion";
import { Search, QrCode, Zap } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: Search,
            title: "DISCOVER",
            desc: "뻔한 정보는 없습니다. <br>전문가가 엄선한 씬의 흐름을 확인하세요.",
        },
        {
            icon: QrCode,
            title: "ACCESS",
            desc: "줄 서지 마세요. <br>QR 티켓 하나로 3초 만에 입장합니다.",
        },
        {
            icon: Zap,
            title: "CONNECT",
            desc: "경험 그 이상의 가치. <br>같은 취향을 가진 사람들과 연결됩니다.",
        },
    ];

    return (
        <section id="app" className="py-24 px-6 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group"
                        >
                            <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-neon-lime transition-colors duration-500 mx-auto md:mx-0">
                                <feature.icon className="w-6 h-6 text-white group-hover:text-neon-lime transition-colors" />
                            </div>
                            <h3 className="text-3xl font-bold mb-2 italic font-display">
                                {feature.title}
                            </h3>
                            <p
                                className="text-zinc-500 leading-relaxed font-kr"
                                dangerouslySetInnerHTML={{ __html: feature.desc }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
