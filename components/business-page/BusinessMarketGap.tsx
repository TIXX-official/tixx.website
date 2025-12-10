"use client";

import { motion } from "framer-motion";

export default function BusinessMarketGap() {
    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl"
                >
                    <h2 className="text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
                        The Market Gap
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black font-display mb-8 leading-tight">
                        Where is your <br />
                        Target Audience?
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                        <div className="border-l border-zinc-800 pl-8">
                            <p className="text-xl text-zinc-400 font-kr leading-relaxed">
                                온라인 광고 효율은 떨어지고, <br />
                                오프라인 팝업은 경쟁이 치열합니다.
                            </p>
                        </div>
                        <div className="border-l-4 border-neon-lime pl-8">
                            <p className="text-2xl text-white font-kr font-medium leading-relaxed">
                                지금 2030 세대는 <br />
                                <span className="text-neon-lime">'물건'</span>이 아닌 <span className="text-neon-lime">'경험'</span>이 있는 곳에 모입니다. <br />
                                그들을 어디서 만나시겠습니까?
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
