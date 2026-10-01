"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Sparkles,
  Heart,
  Smile,
  Star,
  Home,
  X,
  MessageCircleHeart
} from "lucide-react";
import confetti from "canvas-confetti";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function ReasonsSection() {
  const [selectedReason, setSelectedReason] = useState(null);

  const reasons = [
    {
      id: 1,
      icon: HeartHandshake,
      title: "Udah selalu ada buat aku",
      detail: "Pas aku lagi cape, bingung, atau lagi banyak pikiran, kamu selalu luangin waktu buat dengerin dan nemenin aku. Hadirnya kamu itu obat paling ampuh buat akuu",
      quote: "Hadirmu adalah hadiah terbaik setiap hari",
    },
    {
      id: 2,
      icon: Sparkles,
      title: "Kamu bikin hari aku lebih seru",
      detail: "Hal hal kecil dan biasa aja bisa jadi cerita yang lucu banget kalau dilewatin sama kamu. Obrolan random kita setiap lagi ketemu itu paling aku tunggu.",
      quote: "Dunia gapernah ngebosenin kalo ada kamuu",
    },
    {
      id: 3,
      icon: Heart,
      title: "Kamu always cantik, kapan pun itu",
      detail: "Bukan cuma senyum sama tatapan kamu yang bikin aku jatuh cinta berkali kali, tapi tulusnya kamu, baiknya hati kamu, sama cara kamu memperlakukan orang lain juga luar biasa.",
      quote: "Kecantikan hati kamu yang bikin kamu selalu bersinar.",
    },
    {
      id: 4,
      icon: Smile,
      title: "Kamu selalu ngerti aku",
      detail: "Kadang tanpa aku perlu ngomong panjang lebar, kamu udah paham apa yang lagi aku rasain. Terima kasih udah selalu sabar dan ngertiin aku apa adanya.",
      quote: "Mengerti tanpa menghakimi, itu kamu.",
    },
    {
      id: 5,
      icon: Star,
      title: "Kamu kuat kamu hebat",
      detail: "Aku always kagum sama tekad dan semangat kamu. Walaupun kadang ada hari yang berat, kamu tetep jalanin dengan senyuman. Aku selalu bangga sama kamu.",
      quote: "Perempuan terhebat dan paling inspiratif buat aku.",
    },
    {
      id: 6,
      icon: Home,
      title: "Kamu itu rumah ternyaman",
      detail: "Sejauh mana pun aku pergi dan seberat apa pun hari yang aku lewati, memikirin kamu selalu bikin tenang. Bersamamu, aku selalu ngerasa aman dan pulang.",
      quote: "Wherever you are, that's where I belong.",
    },
  ];

  const handleCardClick = (reason) => {
    setSelectedReason(reason);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ["#fda4af", "#f472b6", "#fb7185"],
    });
  };

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Decorative Tulips & Flower Elements */}
      <div className="absolute top-10 right-4 md:right-10 pointer-events-none opacity-20 dark:opacity-10 text-6xl">
        🌷
      </div>
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-20 dark:opacity-10 text-5xl">
        🌸
      </div>

      {/* Header Container */}
      <ScrollReveal direction="up" className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 text-xs font-semibold">
          <MessageCircleHeart className="w-3.5 h-3.5" />
          <span>A Few Reasons</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-romantic text-zinc-800 dark:text-zinc-100 font-normal">
          Why I Love You
        </h2>

        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto italic">
          Mungkin gacukup 1000 alasan, tapi ini beberapa yang paling aku rasa ...
        </p>
      </ScrollReveal>

      {/* 3x2 Grid of Reason Cards - Staggered */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.1} delayStart={0.1}>
        {reasons.map((item) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={item.id} direction="up">
              <div
                onClick={() => handleCardClick(item)}
                className="cursor-pointer group relative p-5 rounded-2xl bg-white/85 dark:bg-pink-950/25 border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-xs hover:shadow-md hover:border-pink-400 dark:hover:border-pink-600 transition-all duration-300 flex items-center gap-4 hover:-translate-y-1 h-full"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/40 border border-pink-100 dark:border-pink-800/60 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/60 transition-all">
                  <Icon className="w-5 h-5 text-pink-500 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-pink-600 dark:group-hover:text-pink-300 leading-snug transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-pink-500/80 dark:text-pink-400/80 font-medium inline-block mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Baca selengkapnya ✨
                  </span>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Bottom Handwritten Signature */}
      <div className="mt-12 text-center sm:text-right pr-4">
        <p className="font-script text-2xl sm:text-3xl text-zinc-600 dark:text-pink-300/80 inline-block -rotate-3 hover:rotate-0 transition-transform cursor-default">
          Thank you for being you ♡
        </p>
      </div>

      {/* Interactive Modal to Read Full Reason */}
      {selectedReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#201024] p-6 sm:p-7 rounded-3xl border border-pink-200 dark:border-pink-800 shadow-2xl space-y-4">

            <button
              onClick={() => setSelectedReason(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-pink-50 dark:hover:bg-pink-900/40"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-300">
                <selectedReason.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-100">
                {selectedReason.title}
              </h3>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
              {selectedReason.detail}
            </p>

            <div className="p-3.5 bg-pink-50/80 dark:bg-pink-950/50 rounded-2xl border border-pink-100 dark:border-pink-900/50">
              <p className="font-script text-lg text-pink-700 dark:text-pink-300 text-center">
                "{selectedReason.quote}"
              </p>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setSelectedReason(null)}
                className="px-6 py-2 rounded-full text-xs font-semibold bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-all"
              >
                Tutup Pesan ♡
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
