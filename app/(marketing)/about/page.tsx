"use client";

import Philosophy from "@/components/about-page/Philosophy";
import Mission from "@/components/about-page/Mission";
import PastEvents from "@/components/about-page/PastEvents";
import Partners from "@/components/about-page/Partners";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white vibe-bg">
            <Philosophy />
            <Mission />
            <PastEvents />
            <Partners />
        </main>
    );
}
