import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SceneGallery from "@/components/SceneGallery";
import PastEventsTeaser from "@/components/PastEventsTeaser";
import BusinessTeaser from "@/components/BusinessTeaser";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-neon-lime/30 selection:text-black vibe-bg">
      <Hero />
      <Features />
      <SceneGallery />
      <PastEventsTeaser />
      <BusinessTeaser />
    </main>
  );
}
