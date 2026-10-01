"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Mail, 
  Trash2, 
  Heart, 
  Phone, 
  Clock, 
  Check, 
  MessageCircle,
  RefreshCw,
  Sparkles
} from "lucide-react";

export default function SecretMailboxModal({ isOpen, onClose, onRefreshCount }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [waNumber, setWaNumber] = useState("628123456789");
  const [isEditingWa, setIsEditingWa] = useState(false);
  const [tempWa, setTempWa] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        if (onRefreshCount) {
          onRefreshCount(data.messages?.length || 0);
        }
      }
    } catch (e) {
      console.error("Gagal mengambil pesan:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      if (typeof window !== "undefined") {
        const savedWa = localStorage.getItem("alika_partner_wa");
        if (savedWa) {
          setWaNumber(savedWa);
        }
      }
    }
  }, [isOpen]);

  const handleSaveWa = (e) => {
    e.preventDefault();
    if (!tempWa.trim()) return;
    const cleanNumber = tempWa.replace(/[^0-9]/g, "");
    setWaNumber(cleanNumber);
    if (typeof window !== "undefined") {
      localStorage.setItem("alika_partner_wa", cleanNumber);
    }
    setIsEditingWa(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1f1024] p-6 sm:p-7 rounded-3xl border border-pink-200 dark:border-pink-800 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/60 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                <span>Kotak Masuk Dari Alika</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 font-mono font-bold">
                  {messages.length} Pesan
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pesan balasan & ungkapan hati Alika yang masuk ke kamu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={fetchMessages}
              title="Perbarui pesan"
              className="p-1.5 text-zinc-400 hover:text-pink-600 transition-colors rounded-lg"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Setup Banner */}
        <div className="p-3.5 rounded-2xl bg-pink-50/80 dark:bg-pink-950/40 border border-pink-200/80 dark:border-pink-900/50 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>
                Nomor WA Kamu:{" "}
                <span className="font-mono font-semibold text-pink-700 dark:text-pink-300">
                  +{waNumber}
                </span>
              </span>
            </div>
            <button
              onClick={() => {
                setTempWa(waNumber);
                setIsEditingWa(!isEditingWa);
              }}
              className="text-pink-600 dark:text-pink-400 underline font-medium hover:text-pink-700"
            >
              {isEditingWa ? "Batal" : "Ganti No WA"}
            </button>
          </div>

          {isEditingWa && (
            <form onSubmit={handleSaveWa} className="mt-2.5 flex gap-2">
              <input
                type="text"
                placeholder="628xxxxxxxxxx (Format diawali 62)"
                value={tempWa}
                onChange={(e) => setTempWa(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-pink-200 dark:border-pink-700 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold"
              >
                Simpan
              </button>
            </form>
          )}
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-4xl">💌</span>
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                Belum ada pesan baru dari Alika
              </p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Ketika Alika membalas surat cinta di website, pesannya akan langsung muncul di sini secara otomatis!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-2xl bg-white/90 dark:bg-pink-950/20 border border-pink-200/80 dark:border-pink-900/60 shadow-xs space-y-2.5 transition-all hover:border-pink-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{msg.reaction || "❤️"}</span>
                    <span className="text-xs font-bold text-pink-700 dark:text-pink-300">
                      Alika
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp || `${msg.date} ${msg.time}`}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed bg-pink-50/50 dark:bg-pink-950/40 p-3 rounded-xl border border-pink-100 dark:border-pink-900/40">
                  "{msg.text}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-pink-100 dark:border-pink-900/60 shrink-0 text-center">
          <p className="text-[11px] text-zinc-400">
            Pesan juga otomatis tersimpan di file server: <code className="bg-pink-100 dark:bg-pink-900/60 px-1.5 py-0.5 rounded text-pink-700 dark:text-pink-300">data/messages.json</code>
          </p>
        </div>

      </div>
    </div>
  );
}
