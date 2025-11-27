"use client";

import AppHero from "@/components/app-page/AppHero";
import DiscoveryFlow from "@/components/app-page/DiscoveryFlow";
import EasyAccess from "@/components/app-page/EasyAccess";
import Benefits from "@/components/app-page/Benefits";

export default function AppPage() {
    return (
        <main className="min-h-screen bg-black text-white vibe-bg">
            <AppHero />
            <DiscoveryFlow />
            <EasyAccess />
            <Benefits />
        </main>
    );
}
