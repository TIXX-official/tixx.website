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
                    className="relative w-full max-w-[280px] md:max-w-[320px]"
                >
                    {/* Replacement Image */}
                    <img
                        src="/images/archive/iphone_qr.png"
                        alt="TIXX PASS QR Entry"
                        className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
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
