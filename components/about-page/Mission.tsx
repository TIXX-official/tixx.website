"use client";

import { motion } from "framer-motion";

export default function Mission() {
    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-16">

                {/* Visual */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 w-full"
                >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <img
                            src="/images/connect-scene.png"
                            alt="Crowd Connection"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        Our Mission
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-black font-display text-white mb-8 leading-tight">
                        Connect <br />
                        the Scene.
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-kr leading-relaxed">
                        음지에 머물던 문화를 양지로, <br />
                        아날로그를 디지털로. <br /><br />
                        틱스는 기술을 통해 <br />
                        더 많은 사람이 씬을 즐기게 합니다.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
