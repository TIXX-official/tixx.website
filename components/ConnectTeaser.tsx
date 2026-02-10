"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function ConnectTeaser() {
    const { language } = useLanguage();
    // @ts-ignore - dictionary entries added in same task
    const t = dictionary[language].connectTeaser;

    return (
        <section id="connect" className="py-24 px-6 border-t border-zinc-900 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 backdrop-blur-sm"
                >
                    <div className="md:w-3/5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 tracking-wider">
                            <Globe className="w-3 h-3" />
                            TIXX AGENCY BRAND
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-white font-display">
                            {t?.title || "TIXX CONNECT: 오프라인의 열기를 온라인의 데이터로."}
                        </h2>

                        <p className="text-lg md:text-xl text-zinc-400 mb-10 font-light font-kr leading-relaxed">
                            {t?.description || "HURRA, 예거마이스터 등 글로벌 브랜드와 협업하는 개발자, 디렉터, 마케터가 제안하는 올인원 에이전시 솔루션."}
                        </p>

                        <a
                            href="https://connect.tixx.im"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
                        >
                            {t?.button || "TIXX CONNECT 바로가기"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="md:w-2/5 flex justify-center">
                        {/* Visual element representing connection/tech */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-dashed border-zinc-700"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 rounded-full border border-zinc-800"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <h3 className="text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                                        TIXX
                                    </h3>
                                    <span className="text-xl font-bold text-white tracking-widest">
                                        CONNECT
                                    </span>
                                </div>
                            </div>

                            {/* Orbiting elements */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
