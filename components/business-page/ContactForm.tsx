"use client";

import { motion } from "framer-motion";

export default function ContactForm() {
    return (
        <section id="contact" className="py-32 bg-zinc-950 border-t border-zinc-900">
            <div className="container mx-auto max-w-3xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-4">
                        Contact Us
                    </h2>
                    <p className="text-zinc-400 font-kr">
                        TIXX와 함께 씬을 만들어갈 파트너를 기다립니다.
                    </p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Company Name</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors" placeholder="업체명" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Contact Person</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors" placeholder="담당자 성함" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Email / Phone</label>
                        <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors" placeholder="연락처" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Inquiry Type</label>
                        <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors appearance-none">
                            <option>입점 문의 (Club/Lounge)</option>
                            <option>기획 대행 문의 (Agency)</option>
                            <option>제작 문의 (Creative)</option>
                            <option>기타 제휴</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Message</label>
                        <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors" placeholder="문의 내용을 자유롭게 적어주세요." />
                    </div>

                    <button className="w-full bg-neon-lime text-black font-bold text-lg py-4 rounded-xl hover:bg-[#eef540] transition-colors mt-8">
                        Send Message
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
