"use client";

import React, { useState } from "react";
import { Sparkles, Heart, Maximize2, X } from "lucide-react";
import confetti from "canvas-confetti";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function WishesShowcase() {
  const [activePhoto, setActivePhoto] = useState(null);

  const photos = [
    {
      id: 1,
      src: "/images/wisuda1.jpeg",
      fallback: "/images/polaroid_flower.svg",
      caption: "Wisuda SMP",
      angle: "-rotate-2",
      tapeColor: "bg-pink-200/90 dark:bg-pink-700/80",
    },
    {
      id: 2,
      src: "/images/eskul.jpeg",
      fallback: "/images/polaroid_beach.svg",
      caption: "After ekskull",
      angle: "rotate-3",
      tapeColor: "bg-rose-200/90 dark:bg-rose-700/80",
    },
    {
      id: 3,
      src: "/images/fotoberduanari.jpeg",
      fallback: "/images/polaroid_cat.svg",
      caption: "Nemenin lomba nari",
      angle: "-rotate-3",
      tapeColor: "bg-pink-200/90 dark:bg-amber-700/80",
    },
    {
      id: 4,
      src: "/images/daster.jpeg",
      fallback: "/images/polaroid_ribbon.svg",
      caption: "Abis bikin drama film",
      angle: "rotate-2",
      tapeColor: "bg-pink-300/90 dark:bg-pink-800/80",
    },
  ];

  const handlePhotoClick = (item) => {
    setActivePhoto(item);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#fda4af", "#f472b6"],
    });
  };

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Centered Wish Message */}
      <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center space-y-4 mb-12">
        <h2 className="font-script text-3xl sm:text-4xl md:text-5xl font-bold text-[#d95376] dark:text-[#f472b6]">
          Happy Birthday, Alika ♡
        </h2>
        
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Semoga semua yang kamu harapkan di tahun ini bisa tercapai. Semoga kamu 
          selalu sehat, bahagia, dan dikelilingi orang orang baik. Dan semoga aku bisa selalu ada dari bagian cerita indah kamuu.
        </p>

        <div className="flex items-center justify-center gap-1 text-pink-400 text-sm">
          <span>✨</span>
          <span className="font-handwriting text-lg text-pink-600 dark:text-pink-300">
            With all my love & sincerity
          </span>
          <span>✨</span>
        </div>
      </ScrollReveal>

      {/* 4 Tilted Polaroid Gallery - Staggered */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center" staggerDelay={0.12}>
        {photos.map((item) => (
          <StaggerItem key={item.id} direction="up">
            <div
              onClick={() => handlePhotoClick(item)}
              className={`cursor-pointer group relative p-3 pb-8 bg-white dark:bg-[#25152a] rounded-sm shadow-md hover:shadow-xl border border-pink-100/90 dark:border-pink-900/40 transition-all duration-300 ${item.angle} hover:rotate-0 hover:-translate-y-2`}
            >
              {/* Washi Tape Strip */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${item.tapeColor} border-x border-dashed border-white/60 shadow-xs z-10 opacity-90`}
              />

              {/* Photo Container */}
              <div className="w-full aspect-square bg-pink-50 dark:bg-pink-950/40 rounded-xs overflow-hidden relative">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = item.fallback;
                  }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div className="pt-3 text-center">
                <p className="font-handwriting text-sm text-zinc-700 dark:text-zinc-300 line-clamp-1">
                  {item.caption}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white dark:bg-[#221028] p-4 pb-8 rounded-xl shadow-2xl border border-pink-200 dark:border-pink-800">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-pink-100 dark:hover:bg-pink-900/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full aspect-square bg-black/5 dark:bg-black/30 rounded-lg overflow-hidden mt-3">
              <img
                src={activePhoto.src}
                alt={activePhoto.caption}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = activePhoto.fallback;
                }}
              />
            </div>

            <div className="text-center pt-4">
              <p className="font-script text-2xl font-bold text-[#d95376] dark:text-[#f472b6]">
                {activePhoto.caption}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Klik dimana saja untuk menutup ♡
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
