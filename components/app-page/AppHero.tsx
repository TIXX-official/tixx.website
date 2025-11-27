"use client";

import { motion } from "framer-motion";

export default function AppHero() {
    return (
        <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden px-6 py-20 bg-black">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-lime opacity-10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-lime opacity-10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 text-center md:text-left"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        The Guide for TIXX
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white leading-[0.9] mb-8">
                        Your Play, <br />
                        <span className="text-zinc-500">Curated.</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-zinc-400 font-kr font-light leading-relaxed max-w-xl mx-auto md:mx-0">
                        복잡한 검색은 끝. <br />
                        틱스 하나로 발견하고, 예매하고, 입장하세요.
                    </p>
                </motion.div>

                {/* iPhone Mockup Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 50, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 relative"
                >
                    {/* Floating 3D Objects (CSS Shapes) */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-neon-lime to-transparent opacity-20 rounded-full blur-xl z-0"
                    />
                    <motion.div
                        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-neon-lime to-transparent opacity-20 rounded-full blur-xl z-0"
                    />

                    {/* iPhone Frame */}
                    <div className="relative w-[300px] h-[600px] bg-black rounded-[50px] border-[8px] border-zinc-800 shadow-2xl mx-auto overflow-hidden z-10">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

                        {/* Screen Content */}
                        <div className="w-full h-full bg-zinc-900 flex flex-col relative">
                            {/* App Header */}
                            <div className="h-24 bg-gradient-to-b from-black/80 to-transparent p-6 pt-12 flex justify-between items-center">
                                <div className="w-8 h-8 bg-zinc-800 rounded-full" />
                                <div className="text-white font-bold text-sm">TIXX</div>
                                <div className="w-8 h-8 bg-zinc-800 rounded-full" />
                            </div>

                            {/* App Content Placeholder */}
                            <div className="flex-1 p-4 space-y-4 overflow-hidden">
                                <div className="w-full h-48 bg-zinc-800 rounded-2xl animate-pulse" />
                                <div className="flex gap-4">
                                    <div className="w-1/2 h-32 bg-zinc-800 rounded-2xl animate-pulse delay-100" />
                                    <div className="w-1/2 h-32 bg-zinc-800 rounded-2xl animate-pulse delay-200" />
                                </div>
                                <div className="w-full h-24 bg-zinc-800 rounded-2xl animate-pulse delay-300" />
                            </div>

                            {/* Bottom Nav */}
                            <div className="h-20 bg-black/90 backdrop-blur-md flex justify-around items-center px-6 pb-4 border-t border-white/5">
                                <div className="w-6 h-6 bg-neon-lime rounded-full" />
                                <div className="w-6 h-6 bg-zinc-700 rounded-full" />
                                <div className="w-6 h-6 bg-zinc-700 rounded-full" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
