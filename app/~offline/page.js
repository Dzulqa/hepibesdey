"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Home, Heart } from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      window.location.href = "/";
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-rose-50/40 to-pink-100/50 px-4 py-12">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-pink-200/80 shadow-2xl text-center space-y-6">
        
        {/* Barbie Avatar Icon */}
        <div className="relative inline-block mx-auto">
          <img
            src="/images/barbie-icon.png"
            alt="Alika Barbie"
            className="w-24 h-24 rounded-full mx-auto shadow-md border-4 border-white object-cover animate-bounce"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow border-2 border-white">
            <WifiOff className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-700">
            <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            Mode Offline Aktif
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-pink-900 font-serif-romantic">
            Kamu Sedang Offline
          </h1>
          <p className="text-sm text-pink-800/80 leading-relaxed">
            Tidak ada koneksi internet saat ini, tapi tenang saja! Semua foto, memori kenangan, ucapan, dan musik spesial Alika sudah tersimpan di aplikasimu dan bisa dibuka kapan saja.
          </p>
        </div>

        {/* Status indicator */}
        <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-100 text-xs text-pink-700 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>Menunggu koneksi internet kembali pulih...</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-md hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Buka Beranda</span>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-pink-200 bg-white text-pink-700 font-medium text-sm shadow-sm hover:bg-pink-50 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        </div>

      </div>
    </main>
  );
}
