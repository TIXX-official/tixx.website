"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden text-center px-4">
            {/* Abstract Video Placeholder Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(242,248,98,0.08)_0%,rgba(0,0,0,0)_70%)] animate-pulse duration-[4s] pointer-events-none" />

            <div className="z-10 max-w-5xl flex flex-col items-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6"
                >
                    THE VIBE CURATOR
                </motion.h2>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-[10rem] font-black leading-[0.9] tracking-tighter mb-8 text-white"
                >
                    Your<br />
                    <span className="text-zinc-500">Offline</span><br />
                    Playlist.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-10 break-keep font-kr"
                >
                    클럽, 파티, 라운지부터 전시까지.<br />
                    도시의 가장 트렌디한 경험을 큐레이션합니다.
                </motion.p>
            </div>

            {/* Scroll Down Hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-600 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest block mb-2">
                    Scroll
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </section>
    );
}
