"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Layers, PieChart, Ticket, Target, ArrowRight } from "lucide-react";

export default function BentoGrid() {
    return (
        <section className="py-32 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16"
            >
                <span className="text-neon-lime font-bold tracking-widest text-xs uppercase block mb-4">
                    Our Solutions
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
                    Choose Your Access.
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Promoters */}
                <Link href="/promoters" className="block h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.01 }}
                        className="glass-panel rounded-[40px] p-10 md:p-14 flex flex-col justify-between min-h-[500px] relative overflow-hidden group transition-all duration-400 hover:border-neon-lime/40"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white mb-6">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                                For Promoters
                            </h3>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm break-keep font-kr">
                                QR 체크인, 실시간 입장 관리, 자동 정산까지. 운영의 번거로움을
                                덜어내고 기획에만 집중하세요.
                            </p>
                        </div>

                        <div className="relative z-10 mt-10">
                            <span className="inline-flex items-center text-neon-lime font-bold text-lg hover:underline decoration-2 underline-offset-4">
                                Learn More
                                <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </span>
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute bottom-[-50px] right-[-50px] opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                            <Ticket className="w-[250px] h-[250px] text-white" />
                        </div>
                    </motion.div>
                </Link>

                {/* Right: Brands */}
                <Link href="/brands" className="block h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.01 }}
                        className="glass-panel rounded-[40px] p-10 md:p-14 flex flex-col justify-between min-h-[500px] relative overflow-hidden group transition-all duration-400 hover:border-neon-lime/40"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white mb-6">
                                <PieChart className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                                For Brands
                            </h3>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm break-keep font-kr">
                                감(Feel)이 아닌 데이터(Data). 타겟 오디언스 분석과 마케팅 ROI
                                측정 솔루션을 확인하세요.
                            </p>
                        </div>

                        <div className="relative z-10 mt-10">
                            <span className="inline-flex items-center text-neon-lime font-bold text-lg hover:underline decoration-2 underline-offset-4">
                                Learn More
                                <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </span>
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute bottom-[-50px] right-[-50px] opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
                            <Target className="w-[250px] h-[250px] text-white" />
                        </div>
                    </motion.div>
                </Link>

                {/* Bottom: About / Careers (Full Width) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-2 glass-panel rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between"
                >
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-2xl font-bold text-white mb-2 font-display">
                            Join the Movement
                        </h3>
                        <p className="text-zinc-400 font-kr">
                            우리는 밤을 혁신하는 사람들입니다. TIXX 팀에 대해 더 알아보세요.
                        </p>
                    </div>
                    <Link
                        href="/about"
                        className="px-8 py-4 border border-zinc-600 rounded-full text-white font-medium hover:bg-white hover:text-black transition-all"
                    >
                        About TIXX Corp.
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
