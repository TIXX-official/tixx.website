"use client";

import { motion } from "framer-motion";

export default function BusinessIntro() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />

            <div className="container mx-auto max-w-7xl px-6 relative z-20 flex flex-col md:flex-row items-center gap-12">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center md:text-left"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        Partner with TIXX
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white leading-[0.9] mb-8">
                        We Make <br />
                        the Scene.
                    </h1>
                    <p className="text-lg md:text-2xl text-zinc-300 font-kr font-light leading-relaxed max-w-xl mx-auto md:mx-0">
                        플랫폼 솔루션부터 파티 기획, 크리에이티브 제작까지. <br />
                        틱스는 씬(Scene)을 위한 올인원 파트너입니다.
                    </p>
                    <div className="mt-10 flex justify-center md:justify-start">
                        <a
                            href="https://www.canva.com/design/DAGklZt3hzo/8DjhUedYPzWNYJY93fdRQg/view?utm_content=DAGklZt3hzo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hdc9de392ef"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-neon-lime text-black font-bold text-lg rounded-full hover:bg-white transition-colors duration-300"
                        >
                            View Brand Deck
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                        </a>
                    </div>
                </motion.div>

                {/* Dashboard UI Overlay Visual */}
                <motion.div
                    initial={{ opacity: 0, x: 50, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="flex-1 relative perspective-1000 hidden md:block"
                >
                    <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
                        {/* Mockup Header */}
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-xs text-zinc-500 font-mono">TIXX PARTNER CENTER</div>
                        </div>

                        {/* Mockup Content */}
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 bg-black/50 rounded-lg p-4">
                                    <div className="text-xs text-zinc-500 mb-1">Total Revenue</div>
                                    <div className="text-2xl font-bold text-white">₩ 124,500,000</div>
                                    <div className="text-xs text-neon-lime mt-1">+12.5%</div>
                                </div>
                                <div className="flex-1 bg-black/50 rounded-lg p-4">
                                    <div className="text-xs text-zinc-500 mb-1">Active Guests</div>
                                    <div className="text-2xl font-bold text-white">1,240</div>
                                    <div className="text-xs text-neon-lime mt-1">+8.2%</div>
                                </div>
                            </div>
                            <div className="h-40 bg-black/50 rounded-lg p-4 flex items-end gap-2">
                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="flex-1 bg-zinc-800 hover:bg-neon-lime transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
