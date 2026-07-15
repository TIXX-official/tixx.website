"use client";

import { Instagram, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { dictionary } from "@/lib/dictionary";

export default function Footer() {
    const { language } = useLanguage();
    const t = dictionary[language].footer;
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    const partners = [
        "TIMES", "Jagermeister", "BOLERO", "THE HENZ", "FRAME SEOUL", "Orgasm Valley 2",
        "BUBBLE PLAYLIST", "AMBIENCE SEOUL", "PGMNT", "THE CLIFF JEJU", "BEACH CLIFF",
        "TIMES", "Jagermeister", "BOLERO", "THE HENZ", "FRAME SEOUL", "Orgasm Valley 2",
        "BUBBLE PLAYLIST", "AMBIENCE SEOUL", "PGMNT", "THE CLIFF JEJU", "BEACH CLIFF"
    ];

    return (
        <footer id="about" className="bg-black border-t border-zinc-900 pt-20 pb-10 overflow-hidden">
            {/* Partner Logo Marquee */}
            {isLandingPage && (
                <div className="mb-20 opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <p className="text-center text-xs font-bold text-zinc-600 uppercase tracking-widest mb-8">
                        {t.marquee}
                    </p>
                    <div className="w-full overflow-hidden relative">
                        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
                            {partners.map((partner, index) => (
                                <span key={index} className="mx-8 text-2xl font-black text-zinc-500 font-sans">
                                    {partner}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
                <div>
                    <h2 className="text-3xl font-black text-white mb-4 font-display">{t.companyName}</h2>
                    <p className="text-zinc-600 text-sm max-w-xs mb-4">
                        {t.description1}<br />
                        {t.description2}
                    </p>
                    <div className="flex gap-4 text-zinc-500">
                        <a href="https://www.instagram.com/tixx.official" target="_blank" rel="noopener noreferrer" className="hover:text-neon-lime transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
                <div className="text-right text-zinc-600 text-xs">
                    <div className="flex gap-4 justify-end mb-2">
                        <a href="https://chemical-egg-b86.notion.site/TIXX-1d5af5a3ef1580cd9f26d9f4ed7a75ae" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t.terms}</a>
                        <a href="/business#contact" className="hover:text-white transition-colors">{t.contact}</a>
                    </div>
                    <p>{t.copyright}</p>
                </div>
            </div>

            {/* Company Info */}
            <div className="border-t border-zinc-900 mt-10 pt-10">
                <div className="container mx-auto max-w-7xl px-6">
                    <div
                        className="text-zinc-600 text-[10px] leading-relaxed font-kr"
                        dangerouslySetInnerHTML={{ __html: t.companyInfo }}
                    />
                </div>
            </div>

        </footer>
    );
}
