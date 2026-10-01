"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickNavCards from "@/components/QuickNavCards";
import InteractiveWidgets from "@/components/InteractiveWidgets";
import ReasonsSection from "@/components/ReasonsSection";
import WishesShowcase from "@/components/WishesShowcase";
import MessagesSection from "@/components/MessagesSection";
import MemoriesSection from "@/components/MemoriesSection";
import GallerySection from "@/components/GallerySection";
import SurpriseSection from "@/components/SurpriseSection";
import SpecialForYouModal from "@/components/SpecialForYouModal";
import ScrollReveal from "@/components/ScrollReveal";
import { romanticAudio } from "@/components/audioHelper";
import { Heart, ArrowUp, Music } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [specialModalOpen, setSpecialModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Autoplay musik saat ada interaksi pertama user (scroll, klik, sentuh layar, keyboard)
  useEffect(() => {
    if (!romanticAudio) return;

    // Sinkronkan state jika dipause/diplay dari komponen lain
    romanticAudio.setPlayStateListener((playing) => {
      setIsMusicPlaying(playing);
      if (playing) {
        setShowMusicPrompt(false);
      }
    });

    const triggerPlay = () => {
      if (!romanticAudio.isPlaying) {
        romanticAudio.start().then((started) => {
          if (started) {
            setIsMusicPlaying(true);
            setShowMusicPrompt(false);
            removeInteractionListeners();
          } else {
            // Jika browser menolak play otomatis saat scroll mouse wheel tanpa klik
            setShowMusicPrompt(true);
          }
        });
      } else {
        removeInteractionListeners();
      }
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("scroll", triggerPlay);
      window.removeEventListener("wheel", triggerPlay);
      window.removeEventListener("touchmove", triggerPlay);
      window.removeEventListener("touchstart", triggerPlay);
      window.removeEventListener("pointerdown", triggerPlay);
      window.removeEventListener("mousedown", triggerPlay);
      window.removeEventListener("click", triggerPlay);
      window.removeEventListener("keydown", triggerPlay);
    };

    window.addEventListener("scroll", triggerPlay, { passive: true });
    window.addEventListener("wheel", triggerPlay, { passive: true });
    window.addEventListener("touchmove", triggerPlay, { passive: true });
    window.addEventListener("touchstart", triggerPlay, { passive: true });
    window.addEventListener("pointerdown", triggerPlay);
    window.addEventListener("mousedown", triggerPlay);
    window.addEventListener("click", triggerPlay);
    window.addEventListener("keydown", triggerPlay);

    return () => {
      removeInteractionListeners();
    };
  }, []);

  const toggleMusic = () => {
    if (!romanticAudio) return;
    const playing = romanticAudio.toggle();
    setIsMusicPlaying(playing);
    if (playing) {
      setShowMusicPrompt(false);
    }
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fdf2f4] text-[#4a2835] transition-colors duration-300 relative selection:bg-pink-300 selection:text-pink-900">
      
      {/* Background Soft Pattern & Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#f9cbd6_1px,transparent_1px)] [background-size:24px_24px] opacity-25 -z-20" />
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMusicPlaying={isMusicPlaying}
        toggleMusic={toggleMusic}
        onOpenSpecialModal={() => setSpecialModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="space-y-4">
        
        {/* Hero Section */}
        <ScrollReveal direction="up" amount={0.1}>
          <div id="home">
            <HeroSection
              onOpenMessage={() => scrollToSection("messages")}
              onOpenGames={() => scrollToSection("surprise")}
            />
          </div>
        </ScrollReveal>

        {/* 5 Quick Navigation Cards */}
        <ScrollReveal direction="up" delay={0.2} amount={0.1}>
          <QuickNavCards onSelectTab={(tabId) => scrollToSection(tabId)} />
        </ScrollReveal>

        {/* Birthday Countdown & Music Player Widgets */}
        <ScrollReveal direction="left" amount={0.1}>
          <InteractiveWidgets
            isMusicPlaying={isMusicPlaying}
            toggleMusic={toggleMusic}
          />
        </ScrollReveal>

        {/* "A Few Reasons Why I Love You" */}
        <ScrollReveal direction="right" amount={0.1}>
          <ReasonsSection />
        </ScrollReveal>

        {/* Wishes & 4 Polaroid Showcase */}
        <ScrollReveal direction="up" amount={0.1}>
          <WishesShowcase />
        </ScrollReveal>

        {/* --- Dedicated Section Pages Previewed in Reference --- */}
        
        {/* Messages / Special Letter */}
        <ScrollReveal direction="left" amount={0.1}>
          <MessagesSection />
        </ScrollReveal>

        {/* Memories / Timeline */}
        <ScrollReveal direction="right" amount={0.1}>
          <MemoriesSection />
        </ScrollReveal>

        {/* Gallery / Photo Grid */}
        <ScrollReveal direction="up" amount={0.1}>
          <GallerySection />
        </ScrollReveal>

        {/* Surprises & Mini Games */}
        <ScrollReveal direction="up" amount={0.1}>
          <SurpriseSection />
        </ScrollReveal>

      </main>

      {/* Footer */}
      <footer className="border-t border-pink-200/80 bg-white/40 backdrop-blur-xs py-10 mt-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-pink-600">
            <span className="font-script text-2xl font-bold">Syawalika Nur Izzah</span>
            <Heart className="w-4 h-4 fill-pink-500 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-500">
            Web ini aku buwat dengan sepenuh hati untuk mygf terbaik.
          </p>
          <p className="text-[11px] font-mono text-zinc-400 pt-1">
            © 2026 Alika Birthday Special Edition. All memories preserved with love.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-110 active:scale-95 animate-in fade-in"
          title="Kembali ke atas"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Special "For You ♡" Modal */}
      <SpecialForYouModal
        isOpen={specialModalOpen}
        onClose={() => setSpecialModalOpen(false)}
        onNavigate={(tabId) => scrollToSection(tabId)}
      />

      {/* Floating Prompt jika browser membatasi autoplay pada scroll murni */}
      {showMusicPrompt && !isMusicPlaying && (
        <div
          onClick={toggleMusic}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-xs sm:text-sm font-medium shadow-xl shadow-pink-500/30 flex items-center gap-2.5 cursor-pointer animate-bounce hover:scale-105 active:scale-95 transition-all border border-pink-200 backdrop-blur-md"
        >
          <Music className="w-4 h-4 text-white animate-spin" />
          <span>Putar Musik Romantis ♡ (Klik Disini)</span>
        </div>
      )}

    </div>
  );
}
