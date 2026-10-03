"use client";

import React, { useState, useEffect } from "react";
import { Heart, Music, VolumeX, Menu, X, Download } from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  isMusicPlaying,
  toggleMusic,
  onOpenSpecialModal,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

  useEffect(() => {
    // Deteksi apakah app sudah berjalan sebagai PWA standalone
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    const isInstalledFlag = localStorage.getItem("pwa-alika-installed") === "true";
    setIsPWAInstalled(isStandaloneMode || isInstalledFlag);

    // Listen jika display-mode berubah
    const mq = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e) => {
      if (e.matches) setIsPWAInstalled(true);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "messages", label: "Messages" },
    { id: "memories", label: "Memories" },
    { id: "gallery", label: "Gallery" },
    { id: "surprise", label: "Surprise" },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-pink-100/80 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick("home")} 
          className="cursor-pointer group flex items-center gap-2"
        >
          <img
            src="/images/barbie-icon.png"
            alt="Alika Barbie Icon"
            className="w-8 h-8 rounded-full border border-pink-200 shadow-sm object-cover group-hover:rotate-6 transition-transform duration-300"
          />
          <span className="font-script text-3xl font-bold text-pink-600 group-hover:scale-105 transition-transform duration-200">
            Alika
          </span>
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm tracking-wide transition-all duration-200 relative py-1 ${
                  isActive
                    ? "font-semibold text-pink-600"
                    : "text-zinc-600 hover:text-pink-600"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Background Music Toggle */}
          <button
            onClick={toggleMusic}
            title={isMusicPlaying ? "Jeda Musik" : "Putar Musik Romantis"}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-pink-200 bg-pink-50/70 text-pink-600 hover:bg-pink-100 transition-all duration-200"
          >
            {isMusicPlaying ? (
              <>
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-3 bg-pink-500 animate-[bounce_0.8s_infinite]" />
                  <span className="w-0.5 h-2 bg-pink-500 animate-[bounce_0.6s_infinite_0.2s]" />
                  <span className="w-0.5 h-3.5 bg-pink-500 animate-[bounce_0.9s_infinite_0.1s]" />
                </span>
                <span>Our Song</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span>Play Song</span>
              </>
            )}
          </button>

          {/* PWA Install Button - hanya tampil jika belum diinstall */}
          {!isPWAInstalled && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("trigger-pwa-install"))}
              title="Download / Pasang Aplikasi di HP atau Komputer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-pink-200 bg-pink-50/70 text-pink-700 hover:bg-pink-100 active:scale-95 transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5 text-pink-600" />
              <span className="hidden lg:inline">Install App</span>
            </button>
          )}

          {/* Special "For You ♡" Pill Button */}
          <button
            onClick={onOpenSpecialModal}
            className="px-4 py-2 rounded-full text-xs tracking-wide font-medium bg-gradient-to-r from-pink-400/90 to-rose-400/90 text-white shadow-sm hover:shadow-md hover:from-pink-500 hover:to-rose-500 active:scale-95 transition-all duration-200 border border-pink-200/60 flex items-center gap-1.5"
          >
            <span>For You</span>
            <Heart className="w-3 h-3 fill-white" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {!isPWAInstalled && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("trigger-pwa-install"))}
              className="p-2 rounded-full text-pink-600 hover:bg-pink-50"
              title="Install Aplikasi"
            >
              <Download className="w-4 h-4 text-pink-600" />
            </button>
          )}
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full text-pink-600"
            title="Musik"
          >
            {isMusicPlaying ? <Music className="w-4 h-4 animate-spin text-pink-500" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-pink-700 hover:bg-pink-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-white/95 backdrop-blur-lg border-b border-pink-100 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === link.id
                    ? "bg-pink-100/70 text-pink-700 font-semibold"
                    : "text-zinc-600 hover:bg-pink-50"
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-pink-100 flex flex-col gap-2">
              {!isPWAInstalled && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("trigger-pwa-install"));
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold border border-pink-200 bg-pink-50 text-pink-700 flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-pink-600" />
                  <span>Install Aplikasi (Bisa Offline)</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSpecialModal();
                }}
                className="w-full py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>For You ♡</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
