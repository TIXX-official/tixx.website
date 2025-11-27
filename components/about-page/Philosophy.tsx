"use client";

import { motion } from "framer-motion";

export default function Philosophy() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />

            <div className="container mx-auto max-w-4xl px-6 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-8 uppercase">
                        The Vibe Curator
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white mb-12 leading-tight">
                        Your Offline <br />
                        Playlist.
                    </h1>
                    <div className="space-y-6 text-lg md:text-2xl text-zinc-300 font-kr font-light leading-relaxed max-w-2xl mx-auto">
                        <p>
                            우리는 도시를 하나의 거대한 앨범으로 봅니다.
                        </p>
                        <p>
                            오늘 밤, 당신이 경험할 공간과 음악, 그리고 사람.<br />
                            틱스는 그 완벽한 순간을 위해 <br />
                            도시의 바이브를 선곡(Curation)합니다.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
