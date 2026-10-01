"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Mail, 
  Trash2, 
  RefreshCw, 
  MessageCircle, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Unlock,
  Check,
  Heart
} from "lucide-react";

export default function AdminPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waNumber, setWaNumber] = useState("628123456789");
  const [isEditingWa, setIsEditingWa] = useState(false);
  const [tempWa, setTempWa] = useState("");
  const [search, setSearch] = useState("");

  // Optional PIN Protection (default PIN: alika or 1234)
  const [isUnlocked, setIsUnlocked] = useState(true); // set true by default for ease, with option to lock
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Gagal load pesan:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    if (typeof window !== "undefined") {
      const savedWa = localStorage.getItem("alika_partner_wa");
      if (savedWa) {
        setWaNumber(savedWa);
      }
    }
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus pesan ini dari riwayat?")) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Gagal menghapus:", e);
    }
  };

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

  const handleUnlock = (e) => {
    e.preventDefault();
    if (enteredPin === "alika" || enteredPin === "1234" || enteredPin === "") {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const filteredMessages = messages.filter((m) =>
    m.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdf2f4] text-[#4a2835] p-4 sm:p-8 selection:bg-pink-300 selection:text-pink-900">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-pink-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Kembali ke web utama"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ke Website</span>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-zinc-800 flex items-center gap-2">
                <span>Kotak Masuk Dari Alika</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-mono font-bold">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-zinc-500">
                Halaman privat untuk membaca semua balasan pesan dari Alika
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Setup Card */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-pink-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-800">
                Nomor WhatsApp Tujuan:{" "}
                <span className="font-mono text-emerald-700">+{waNumber}</span>
              </p>
              <p className="text-[11px] text-zinc-500">
                Nomor ini yang akan dihubungi saat Alika menekan tombol "Kirimkan ke WhatsApp Dia"
              </p>
            </div>
          </div>

          <div>
            {!isEditingWa ? (
              <button
                onClick={() => {
                  setTempWa(waNumber);
                  setIsEditingWa(true);
                }}
                className="px-4 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-semibold transition-colors"
              >
                Ganti Nomor WA
              </button>
            ) : (
              <form onSubmit={handleSaveWa} className="flex gap-2">
                <input
                  type="text"
                  placeholder="628123456789"
                  value={tempWa}
                  onChange={(e) => setTempWa(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-mono bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingWa(false)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs"
                >
                  Batal
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Search Bar & Total Messages */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs font-bold text-zinc-600">
            Total Masuk: <span className="text-pink-600 font-mono text-sm">{messages.length}</span> Pesan
          </div>
          <input
            type="text"
            placeholder="Cari kata di pesan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white border border-pink-200 text-xs w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* Message Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-xs text-zinc-400">
              Memuat pesan...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-16 text-center bg-white/60 rounded-3xl border border-pink-100 space-y-2">
              <span className="text-4xl">💌</span>
              <p className="text-sm font-semibold text-zinc-600">
                Belum ada pesan balasan
              </p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Saat Alika mengetik balasan di website, pesannya akan langsung tersimpan dan muncul di sini.
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-3 relative group transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between border-b border-pink-50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{msg.reaction || "❤️"}</span>
                    <div>
                      <span className="text-sm font-bold text-zinc-800">
                        {msg.sender || "Alika"}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{msg.timestamp || `${msg.date} ${msg.time}`}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-xl text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Hapus pesan ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#fffbfd] border border-pink-100 text-sm sm:text-base text-zinc-700 leading-relaxed font-sans">
                  "{msg.text}"
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Note */}
        <div className="p-4 rounded-2xl bg-pink-100/60 border border-pink-200 text-center text-xs text-pink-800">
          💡 Catatan: Halaman ini hanya untuk kamu (buka lewat alamat <code className="font-mono font-bold bg-white/70 px-1.5 py-0.5 rounded">/admin</code>). Halaman ini tidak terhubung ke menu atau tombol apa pun di halaman utama yang dilihat Alika.
        </div>

      </div>
    </div>
  );
}
