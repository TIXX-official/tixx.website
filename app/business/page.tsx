"use client";

import BusinessIntro from "@/components/business-page/BusinessIntro";
import BusinessMarketGap from "@/components/business-page/BusinessMarketGap";
import BusinessSolution from "@/components/business-page/BusinessSolution";
import BusinessAudience from "@/components/business-page/BusinessAudience";
import BusinessCategory from "@/components/business-page/BusinessCategory";
import BusinessPartnership from "@/components/business-page/BusinessPartnership";
import BusinessTech from "@/components/business-page/BusinessTech";
import BusinessStrategy from "@/components/business-page/BusinessStrategy";
import ContactForm from "@/components/business-page/ContactForm";

export default function BusinessPage() {
    return (
        <main className="min-h-screen bg-black text-white vibe-bg">
            <BusinessIntro />
            <BusinessMarketGap />
            <BusinessSolution />
            <BusinessAudience />
            <BusinessCategory />
            <BusinessPartnership />
            <BusinessTech />
            <BusinessStrategy />
            <ContactForm />
        </main>
    );
}
