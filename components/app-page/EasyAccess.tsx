"use client";

import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

export default function EasyAccess() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-16">

                {/* Visual: QR Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-md"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-neon-lime blur-[80px] opacity-20 rounded-full animate-pulse" />

                    {/* Card */}
                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 text-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
                            <QrCode className="w-32 h-32 text-black" />
                        </div>
                        <div className="text-white font-bold text-2xl mb-2 font-display">TIXX PASS</div>
                        <div className="text-zinc-400 text-sm font-mono tracking-widest">NO. 8829-1029</div>

                        {/* Scan Line Animation */}
                        <motion.div
                            animate={{ top: ["10%", "90%", "10%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-neon-lime shadow-[0_0_10px_#f2f862] opacity-80"
                            style={{ top: "10%" }}
                        />
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 text-center md:text-right"
                >
                    <h2 className="text-5xl md:text-7xl font-black font-display text-white mb-6">
                        3 Seconds <br />
                        <span className="text-neon-lime">Entry.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-400 font-kr leading-relaxed">
                        줄 서지 마세요. <br />
                        TIXX 티켓 하나로 프리패스.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
