"use client";

import { motion } from "framer-motion";
import { Smartphone, Apple } from "lucide-react";

export default function DownloadPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-black text-white vibe-bg">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-black font-display mb-8 text-white">
                        Get TIXX
                    </h1>
                    <p className="text-xl md:text-2xl font-kr text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-16">
                        지금 바로 다운로드하고<br />
                        도시의 새로운 바이브를 경험하세요.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <a
                            href="#"
                            className="flex items-center justify-center gap-4 px-8 py-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-neon-lime hover:bg-zinc-800 transition-all group w-full md:w-64"
                        >
                            <Apple className="w-8 h-8 text-white group-hover:text-neon-lime transition-colors" />
                            <div className="text-left">
                                <div className="text-xs text-zinc-500">Download on the</div>
                                <div className="text-xl font-bold text-white">App Store</div>
                            </div>
                        </a>

                        <a
                            href="#"
                            className="flex items-center justify-center gap-4 px-8 py-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-neon-lime hover:bg-zinc-800 transition-all group w-full md:w-64"
                        >
                            <Smartphone className="w-8 h-8 text-white group-hover:text-neon-lime transition-colors" />
                            <div className="text-left">
                                <div className="text-xs text-zinc-500">Get it on</div>
                                <div className="text-xl font-bold text-white">Google Play</div>
                            </div>
                        </a>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
