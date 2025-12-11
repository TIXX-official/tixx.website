"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { PAST_EVENTS } from "@/data/past-events";

export default function PastEvents() {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        Archive
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-black font-display text-white mb-6">
                        Past Events
                    </h1>
                    <p className="text-lg text-zinc-400 font-kr max-w-2xl mx-auto">
                        TIXX가 만들어온 뜨거웠던 현장의 기록들. <br />
                        PGMNTIXX, NASTIXX, DIRTIXX, GETIXX ...
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] grid-flow-dense">
                    {PAST_EVENTS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl overflow-hidden group bg-zinc-900 ${item.span || "col-span-1"} ${item.rowSpan || "row-span-1"}`}
                        >
                            {item.type === "image" && (
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${item.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                                />
                            )}

                            {item.type === "video" && (
                                <div className="w-full h-full relative">
                                    <video
                                        src={item.src}
                                        className={`w-full h-full ${item.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                                        muted
                                        loop
                                        playsInline
                                        autoPlay
                                        preload="auto"
                                    />
                                    {/* Play Button Overlay (Optional, removed for autoPlay loop style or keep for explicit feel) */}
                                    {/* <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-all pointer-events-none">
                                        
                                    </div> */}
                                </div>
                            )}

                            {item.type === "youtube" && (
                                <iframe
                                    className="w-full h-full"
                                    src={`${item.src}?controls=0&rel=0`}
                                    title={item.alt}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}

                            {/* Overlay */}
                            {item.type !== "youtube" && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                                    <h3 className="text-neon-lime font-bold text-xl uppercase tracking-wider">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm mt-1">@ {item.location}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
