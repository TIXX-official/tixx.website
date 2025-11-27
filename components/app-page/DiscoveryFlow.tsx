"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export default function DiscoveryFlow() {
    const scrollRef = useRef(null);

    const posters = [
        {
            src: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            label: "Techno / House / EDM",
            title: "CLUB"
        },
        {
            src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            label: "Lounge / Social / Pub",
            title: "PARTY"
        },
        {
            src: "/images/popup-store.png",
            label: "Brand / Store / Limited",
            title: "POP-UP"
        },
        {
            src: "https://images.unsplash.com/photo-1570876050997-2fdefb00c004?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            label: "Art / Culture / Gallery",
            title: "EXHIBITION"
        },
        {
            src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            label: "Live / Concert / Stage",
            title: "PERFORMANCE"
        }
    ];

    return (
        <section className="py-24 bg-zinc-950 overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 mb-12 text-center md:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black font-display text-white mb-4">
                        Digging the Vibe.
                    </h2>
                    <p className="text-xl text-zinc-400 font-kr">
                        클럽부터 팝업까지. 뻔한 곳 말고, 진짜 힙한 곳만 담았습니다.
                    </p>
                </motion.div>
            </div>

            {/* Cover Flow Effect */}
            <div className="relative w-full overflow-x-auto hide-scrollbar pb-10 px-6">
                <div className="flex gap-6 md:gap-10 w-max mx-auto md:mx-0 md:pl-20">
                    {posters.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                            className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url('${item.src}')` }}
                            />
                            <div className="absolute bottom-6 left-6 z-20">
                                <div className="text-xs font-bold text-neon-lime mb-1 uppercase tracking-wider">
                                    {item.label}
                                </div>
                                <h3 className="text-2xl font-bold text-white font-display">
                                    {item.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
