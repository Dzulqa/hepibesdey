"use client";

import React, { useState } from "react";
import { Sparkles, Heart, Gift, Smile, Star } from "lucide-react";
import confetti from "canvas-confetti";

export default function HeroSection({ onOpenMessage, onOpenGames }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSparkleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y },
      colors: ["#f472b6", "#fda4af", "#ffe4e6", "#f43f5e", "#fb7185"],
    });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Decorative ambient background glows & floating hearts */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 right-10 w-96 h-96 bg-rose-200/30 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating gentle background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <span className="absolute top-8 left-[10%] text-pink-300/40 text-xl animate-float-slow">♥</span>
        <span className="absolute top-24 right-[15%] text-pink-400/40 text-2xl animate-float-slow" style={{ animationDelay: "1.5s" }}>♡</span>
        <span className="absolute bottom-16 left-[20%] text-rose-300/35 text-lg animate-float-slow" style={{ animationDelay: "2.5s" }}>♥</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Greeting & Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* "Happy Birthday" badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-300/80 dark:border-pink-700/60 bg-white/70 dark:bg-pink-950/50 text-pink-600 dark:text-pink-300 text-xs font-medium shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Happy Birthday</span>
            </div>

            {/* Headline: To My Dearest Alika */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif-romantic tracking-tight text-zinc-800 dark:text-zinc-100 font-normal leading-[1.15]">
                To My
                <br className="hidden sm:inline" /> Dearest{" "}
                <span 
                  onClick={handleSparkleClick}
                  className="font-script text-5xl sm:text-6xl md:text-7xl font-bold text-[#d95376] dark:text-[#f472b6] cursor-pointer inline-block hover:scale-105 transition-transform drop-shadow-xs"
                  title="Klik untuk efek cinta!"
                >
                  Alika
                </span>
              </h1>
            </div>

            {/* Subtitle / Romantic Message */}
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Di hari spesial ini, aku cuma mau banyak banyak makasi karena uda selalu ada, 
              jadi diri sendiri, dan bikin hari aku makin berwarna.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenMessage}
                className="px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-[#d95376] to-[#e06b88] hover:from-[#c73e63] hover:to-[#d95376] text-white shadow-md shadow-pink-500/20 active:scale-95 transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Lihat Pesan</span>
                <Heart className="w-4 h-4 fill-white group-hover:scale-125 transition-transform" />
              </button>

              <button
                onClick={onOpenGames}
                className="px-6 py-3 rounded-full text-sm font-semibold bg-white/80 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80 hover:bg-pink-50 dark:hover:bg-pink-900/30 active:scale-95 transition-all duration-200"
              >
                Mayin Dulu
              </button>
            </div>
          </div>

          {/* Right Column: Scrapbook Polaroid Showcase */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-6">
            <div 
              className="relative max-w-sm w-full mx-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              
              {/* Back Layered Polaroid (Offset Behind) */}
              <div className="absolute -top-4 -left-6 w-52 sm:w-60 bg-white dark:bg-pink-950/80 p-3 pb-8 rounded-sm shadow-md -rotate-6 transition-all duration-300 opacity-80 border border-pink-100 dark:border-pink-900/40 hidden sm:block">
                <div className="w-full aspect-square bg-pink-100 dark:bg-pink-900/40 rounded-xs overflow-hidden">
                  <img
                    src="/images/polaroid_sunset.jpg"
                    alt="Memori Indah"
                    className="w-full h-full object-cover grayscale-15 contrast-95"
                    onError={(e) => {
                      e.target.src = "/images/polaroid_beach.svg";
                    }}
                  />
                </div>
                <p className="font-handwriting text-center text-xs text-zinc-500 mt-2">
                  Kenangan kita ♡
                </p>
              </div>

              {/* Main Prominent Polaroid */}
              <div className="relative z-10 bg-white dark:bg-[#25152a] p-3.5 sm:p-4 pb-9 sm:pb-11 rounded-sm shadow-xl border border-pink-100/80 dark:border-pink-900/50 rotate-2 hover:rotate-0 transition-transform duration-300 group">
                
                {/* Washi Tape on Top Center */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-300/80 dark:bg-pink-700/70 backdrop-blur-xs border-x-2 border-dashed border-white/60 shadow-xs z-20 -rotate-1">
                  <span className="block text-[10px] tracking-widest uppercase font-semibold text-center text-pink-950/70 pt-0.5">
                    LOVE YOU
                  </span>
                </div>

                {/* Main Photo Container */}
                <div className="w-full aspect-[4/4.5] sm:aspect-square bg-pink-50 dark:bg-pink-950/40 rounded-xs overflow-hidden relative">
                  <img
                    src="/images/nari.jpeg"
                    alt="To My Dearest Alika"
                    className="w-full h-full object-cover group-hover:scale-124 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/images/polaroid_flower.svg";
                    }}
                  />
                  {/* Subtle sparkle overlay */}
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/60 backdrop-blur-xs text-pink-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {/* Handwritten text caption */}
                <div className="text-center pt-3 sm:pt-4">
                  <p className="font-script text-xl sm:text-2xl font-bold text-zinc-700 dark:text-zinc-200">
                    Happy Birthday ♡
                  </p>
                </div>
              </div>

              {/* Sticky Scrapbook Tape Badges */}
              {/* Badge 1: More Happy */}
              <div className="absolute -right-2 top-8 z-20 px-3 py-1 bg-[#fff0f3] dark:bg-[#3d1a2d] border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold rounded-md shadow-sm -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                More Happy
              </div>

              {/* Badge 2: More Love */}
              <div className="absolute -right-4 top-28 z-20 px-3 py-1 bg-[#ffe4ea] dark:bg-[#481c33] border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold rounded-md shadow-sm rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                More Love
              </div>

              {/* Badge 3: More Alika */}
              <div className="absolute -right-2 bottom-8 z-20 px-3.5 py-1.5 bg-[#fce7ed] dark:bg-[#521e3b] border border-pink-300 dark:border-pink-700 text-pink-800 dark:text-pink-200 text-xs font-bold rounded-md shadow-sm -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                More Alika
              </div>

              {/* Hanging Cute Ribbon / Pin */}
              <div className="absolute -top-3 left-4 z-20 text-rose-400 text-xl select-none">
                🎀
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
