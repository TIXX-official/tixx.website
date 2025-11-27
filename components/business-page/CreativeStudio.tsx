"use client";

import { motion } from "framer-motion";

export default function CreativeStudio() {
    return (
        <section className="relative py-40 bg-black overflow-hidden">
            {/* Abstract Background Animation */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#f2f862_0%,_transparent_50%)] blur-[100px] animate-pulse duration-[5s]" />
            </div>

            <div className="container mx-auto max-w-7xl px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        Creative Studio
                    </h2>
                    <h1 className="text-6xl md:text-9xl font-black font-display text-white mb-8 tracking-tighter">
                        Visuals <br />
                        that Move.
                    </h1>
                    <p className="text-xl text-zinc-400 font-kr max-w-2xl mx-auto">
                        사람을 움직이는 비주얼. <br />
                        TIXX Creative Studio가 브랜드의 아이덴티티를 감각적인 영상으로 구현합니다.
                    </p>
                </motion.div>

                {/* Placeholder for Reel */}
                <div className="mt-16 w-full aspect-video bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 z-20 group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    </div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-50" />
                </div>
            </div>
        </section>
    );
}
