"use client";

import BusinessIntro from "@/components/business-page/BusinessIntro";
import BusinessPlatform from "@/components/business-page/BusinessPlatform";
import BusinessAgency from "@/components/business-page/BusinessAgency";
import CreativeStudio from "@/components/business-page/CreativeStudio";
import ContactForm from "@/components/business-page/ContactForm";

export default function BusinessPage() {
    return (
        <main className="min-h-screen bg-black text-white vibe-bg">
            <BusinessIntro />
            <BusinessPlatform />
            <BusinessAgency />
            <CreativeStudio />
            <ContactForm />
        </main>
    );
}
