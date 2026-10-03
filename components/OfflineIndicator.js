"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, CloudUpload } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  useEffect(() => {
    // Check initial status
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const syncPendingMessages = async () => {
      try {
        const pending = JSON.parse(localStorage.getItem("alika_pending_messages") || "[]");
        if (pending.length === 0) return;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) return;

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error } = await supabase.from("messages").insert(pending);
        if (!error) {
          setSyncedCount(pending.length);
          localStorage.removeItem("alika_pending_messages");
          console.log(`Synced ${pending.length} offline messages to Supabase!`);
        }
      } catch (err) {
        console.warn("Could not sync pending messages yet:", err);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      syncPendingMessages();
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <aside
      aria-label="Status koneksi jaringan"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      {isOffline ? (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-pink-900/90 text-white backdrop-blur-md shadow-lg border border-pink-400/40 text-xs font-medium">
          <WifiOff className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Mode Offline Aktif — Semua memori & lagu tersimpan di perangkat</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-600/95 text-white backdrop-blur-md shadow-lg border border-emerald-300/40 text-xs font-medium">
          <Wifi className="w-3.5 h-3.5 text-emerald-200" />
          <span>
            {syncedCount > 0
              ? `Koneksi pulih! ${syncedCount} balasan offline berhasil dikirim ✨`
              : "Terhubung kembali ke internet ✨"}
          </span>
        </div>
      )}
    </aside>
  );
}
