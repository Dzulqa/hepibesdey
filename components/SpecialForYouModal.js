"use client";

import React from "react";
import { X, Heart, Sparkles, Gift, BookHeart } from "lucide-react";
import confetti from "canvas-confetti";

export default function SpecialForYouModal({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  const triggerLoveExplosion = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#f472b6", "#fda4af", "#e11d48", "#fff"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-[#1e1022] dark:via-[#28152e] dark:to-[#1a0e1e] p-5 sm:p-8 rounded-3xl border border-pink-200 dark:border-pink-800 shadow-2xl space-y-4 sm:space-y-5 text-center max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-pink-100 dark:hover:bg-pink-900/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Heart Icon */}
        <div 
          onClick={triggerLoveExplosion}
          className="cursor-pointer mx-auto w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/60 border border-pink-200 dark:border-pink-700 flex items-center justify-center text-pink-600 dark:text-pink-300 shadow-md hover:scale-110 active:scale-95 transition-transform"
          title="Klik aku!"
        >
          <Heart className="w-8 h-8 fill-pink-500 animate-pulse" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/60 dark:text-pink-300">
            Khusus Untuk Alika ♡
          </span>
          <h3 className="font-script text-3xl font-bold text-[#d95376] dark:text-[#f472b6] pt-1">
            You Are So Loved!
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-sm mx-auto">
            Website ini dibuat dengan penuh cinta khusus buat merayakan hari spesialmu. 
            Semua halaman ini adalah tentang kamu, kita, dan cerita indah yang sedang kita rajut bareng.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onNavigate("messages");
            }}
            className="p-3 rounded-2xl bg-white dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60 hover:bg-pink-50 text-left transition-colors flex items-center gap-2.5"
          >
            <BookHeart className="w-5 h-5 text-pink-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Surat Cinta</p>
              <p className="text-[10px] text-zinc-400">Buka amplop spesial</p>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate("surprise");
            }}
            className="p-3 rounded-2xl bg-white dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60 hover:bg-pink-50 text-left transition-colors flex items-center gap-2.5"
          >
            <Gift className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Kado & Kupon</p>
              <p className="text-[10px] text-zinc-400">Klaim kupon cinta</p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm hover:from-pink-600 hover:to-rose-500 transition-all"
        >
          Lanjut Jelajahi Website ♡
        </button>

      </div>
    </div>
  );
}
