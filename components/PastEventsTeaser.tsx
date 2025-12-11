"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { PAST_EVENTS } from "@/data/past-events";

export default function PastEventsTeaser() {
    return (
        <section className="py-24 bg-black border-t border-zinc-900 overflow-hidden">
            <div className="container mx-auto px-6 mb-10 flex items-end justify-between">
                <div>
                    <span className="text-neon-lime text-xs font-bold tracking-widest uppercase mb-2 block">
                        Archive
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white font-display">
                        MOMENTS.
                    </h2>
                </div>

                <Link
                    href="/about"
                    className="hidden md:flex items-center text-white hover:text-neon-lime transition-colors text-sm font-bold uppercase tracking-wider group"
                >
                    View All Archive
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto hide-scrollbar gap-4 px-6 pb-12 snap-x snap-mandatory">
                {PAST_EVENTS.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="snap-center shrink-0 w-[300px] md:w-[350px] aspect-[4/5] bg-zinc-900 relative rounded-xl overflow-hidden group border border-zinc-800 hover:border-zinc-600 transition-colors"
                    >
                        {item.type === "image" && (
                            <img
                                src={item.src}
                                alt={item.alt}
                                className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${item.objectFit === 'contain' ? 'object-contain p-2 bg-black' : 'object-cover'}`}
                            />
                        )}

                        {item.type === "video" && (
                            <div className="w-full h-full relative bg-black">
                                <video
                                    src={item.src}
                                    className={`w-full h-full ${item.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    preload="auto"
                                />
                            </div>
                        )}

                        {item.type === "youtube" && (
                            <div className="w-full h-full relative bg-black">
                                {/* 
                                    YouTube iframe in a moving carousel is often buggy/heavy. 
                                    For a teaser, maybe just a cover or pointer events none? 
                                    Let's allow it but simple. 
                                 */}
                                <iframe
                                    className="w-full h-full pointer-events-none" // Disable interaction for smoother scroll
                                    src={`${item.src}?controls=0&rel=0&autoplay=0&mute=1&playlist=${item.src.split('/').pop()}&loop=1`}
                                    title={item.alt}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                                {/* Click Overlay to go to About page? Or just non-interactive visual */}
                                <div className="absolute inset-0 bg-transparent" />
                            </div>
                        )}

                        {/* Overlay Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                            {item.title && (
                                <>
                                    <h3 className="text-neon-lime font-bold text-lg uppercase tracking-wider">{item.title}</h3>
                                    <p className="text-zinc-400 text-xs mt-1">@ {item.location}</p>
                                </>
                            )}
                            {!item.title && <p className="text-white font-bold">{item.alt}</p>}
                        </div>
                    </motion.div>
                ))}

                {/* View All Card */}
                <Link
                    href="/about"
                    className="snap-center shrink-0 w-[200px] flex flex-col items-center justify-center bg-zinc-950 rounded-xl border border-zinc-800 hover:border-neon-lime transition-all group cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center mb-4 group-hover:bg-neon-lime group-hover:border-neon-lime group-hover:text-black transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="text-white font-bold text-sm uppercase tracking-widest">View All</span>
                </Link>
            </div>
        </section>
    );
}
