"use client";

import React, { useState } from "react";
import { Mail, Heart, Send, CheckCircle2, RefreshCw, MessageCircle, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function MessagesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("❤️");
  const [hasReplied, setHasReplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedText, setLastSubmittedText] = useState("");

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ["#fda4af", "#f43f5e", "#fb7185", "#ffe4e6"],
    });
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const content = replyText.trim();
    setLastSubmittedText(content);

    try {
      // 1. Post to Server API
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "Alika",
          text: content,
          reaction: selectedEmoji,
        }),
      });

      // 2. Also keep in localStorage for offline
      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("alika_replies") || "[]");
        existing.unshift({
          text: content,
          reaction: selectedEmoji,
          date: new Date().toLocaleDateString("id-ID"),
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        });
        localStorage.setItem("alika_replies", JSON.stringify(existing));
      }

      setHasReplied(true);
      setReplyText("");
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#ec4899", "#f43f5e", "#fda4af", "#ffe4e6"],
      });
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      // Fallback: still show success locally
      setHasReplied(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsAppReply = () => {
    const waNumber = typeof window !== "undefined"
      ? localStorage.getItem("alika_partner_wa") || "6285697054104"
      : "6285697054104";

    const textToShare = `Hai sayang! Aku udah baca surat spesial ultah di website dari kamu ❤️\n\nBalasan aku:\n"${lastSubmittedText}"`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textToShare)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <section id="messages" className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-4 scroll-mt-20">

      {/* Title */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100/80 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
          Special Letter
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif-romantic text-zinc-800 dark:text-zinc-100">
          A Special Message For You
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Ayow buka amplopnyaa!
        </p>
      </div>

      {/* Interactive Envelope & Letter */}
      <div className="relative max-w-xl mx-auto flex flex-col items-center">

        {!isOpen ? (
          /* Closed Interactive Envelope with Wax Seal */
          <div
            onClick={handleOpenEnvelope}
            className="cursor-pointer group relative w-full aspect-[16/10] bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-950/70 dark:to-rose-950/60 rounded-3xl border-2 border-pink-300 dark:border-pink-800 shadow-xl flex items-center justify-center p-4 sm:p-6 hover:scale-102 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Envelope Flap SVG - Fully Responsive */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <svg className="w-full h-1/2 absolute top-0 text-pink-200/90 dark:text-pink-900/70" viewBox="0 0 100 50" preserveAspectRatio="none">
                <polygon points="0,0 100,0 50,50" fill="currentColor" />
              </svg>
            </div>

            {/* Red Wax Seal Heart */}
            <div className="z-10 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#c73e63] to-[#e06b88] border-2 border-pink-200 shadow-lg flex flex-col items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-white" />
              <span className="text-[8px] sm:text-[9px] font-bold tracking-widest mt-0.5">OPEN</span>
            </div>

            <div className="absolute bottom-3 sm:bottom-5 text-center px-2">
              <p className="text-xs sm:text-sm font-medium text-pink-800 dark:text-pink-300 font-handwriting">
                ✨ Klik amplop untuk membuka surat ✨
              </p>
            </div>
          </div>
        ) : (
          /* Opened Romantic Letter */
          <div className="w-full bg-[#fffcf7] dark:bg-[#201024] p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-pink-200 dark:border-pink-800/80 shadow-2xl space-y-5 sm:space-y-6 relative animate-in zoom-in-95 duration-300">

            {/* Washi Tape at Top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 bg-pink-300/80 dark:bg-pink-700/70 border-x-2 border-dashed border-white/60 shadow-xs z-10" />

            <div className="flex justify-between items-center border-b border-pink-100 dark:border-pink-900/60 pb-4">
              <div>
                <p className="font-handwriting text-xs text-zinc-400">Untuk Alika Tercinta,</p>
                <h3 className="font-script text-xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400">
                  Selamat Ulang Tahun, cayangku cintakuu ♡
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-zinc-400 hover:text-pink-500 flex items-center gap-1"
                title="Lipat kembali surat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Lipat Surat</span>
              </button>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-200 leading-relaxed font-sans">
              <p>Halow cayangku cintaa,</p>
              <p>
                Selamat ulang tahun yaa, Di hari yang spesial ini, aku maw ngucapin
                rasa terimakasii sebanyak banyaknya karena kamu udaa ada dan hadir di hidup akuu.
                Pas kamu dateng, hari hari aku rasanya jadi jauh lebih bermakna, penuh cerita ini itu,
                dan selalu ada alasan buat tersenyum.
              </p>
              <p>
                Maaff yaa kalo aku suka jadi cowo yang nyusahin buat kamu dalam hal apapun itu.. ntah aku dulu super portektif laa, pokonya banyak peraturan gajelas deh. Aku juga ngerasanya suka jadi mokondo pas sama kamu plss, dikit dikit ditraktir dijajanin, giliran aku aja jarang banget gitu ke kamu, mungkin iya tapi jarang, bukan karena aku perhitungan atau pelit, tapi emang beneran gaada.. aku juga sempet sedih pas aku lagi becanda maw ngadoin kamu baju 35 ribuan yang di PS waktu itu terus kamu kaya "ya gitu deh, kaya gatau kamu aja" deymm, padahal aku juga gamau bangett, aku berusaha semaksimal mungkin buat gakeliatan biasa biasa aja pas ulangtahun kamu tapi isokeii ko itu jadi dorongan lagi buat aku kalo aku gabisa kaya gini teruss. Makasi banyak uda mau bertahan sama sifat kekanak kanakan aku, suka keras kepala juga pas dibilangin, suka ngebentak kamu gitu deh.. im so sowwrryy
              </p>
              <p>
                Apapun impian, cita cita, dan harapan kamu di tahun ini, aku always berdoa semoga
                semuanya dimudahkan dan tercapai. Maaff juga aku gabisa kasi sesuatu yang spesial spesial gitu di hari ulangtahun kamu dan beda kaya cowo diluar sana, padahal aku emang pengen banget rasanya ngerayain ulangtahun kamu pake sesuatu yang spesial dimana gitu, tapi ya ini aku apaadanya, dan yapss kamu untungnya uda bisa banget nerima aku di keadaan apapun itu, bukan berarti aku mau disitu situ aja yaa. Dan semoga di setiap langkah kamu yang baru nanti, aku selalu bisa bareng kamu terus sampai kapanpun itu
              </p>
              <p className="pt-2">
                I love you more than words could ever describe, today, tomorrow, and always. ♡
              </p>
            </div>

            {/* Signature */}
            <div className="pt-4 border-t border-pink-100 dark:border-pink-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="font-handwriting text-xs text-zinc-400">
                Ditulis pake cinta bangett,
              </div>
              <div className="font-script text-2xl font-bold text-[#d95376] dark:text-[#f472b6]">
                Your Forever Person ♡
              </div>
            </div>

            {/* Reply / Reaction Box */}
            <div className="mt-6 pt-6 border-t border-dashed border-pink-200 dark:border-pink-800">
              {hasReplied ? (
                <div className="p-5 bg-pink-50 dark:bg-pink-950/60 rounded-2xl border border-pink-200 text-center space-y-3 animate-in zoom-in-95">
                  <CheckCircle2 className="w-7 h-7 text-pink-500 mx-auto animate-bounce" />
                  <div>
                    <p className="text-sm font-bold text-pink-700 dark:text-pink-300">
                      Pesan Balasan Berhasil Terkirim ke Website! ♡
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Pesanmu sudah tersimpan aman dan masuk ke kotak surat rahasia pacarmu.
                    </p>
                  </div>

                  {/* Button to also send to WhatsApp */}
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={openWhatsAppReply}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Kirimkan Juga ke WhatsApp Your BF 📲</span>
                    </button>

                    <button
                      onClick={() => setHasReplied(false)}
                      className="text-xs text-pink-600 dark:text-pink-400 underline px-3 py-1"
                    >
                      Tulis balasan lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      Tulis Balasan / Perasaanmu Untuk Dia:
                    </label>

                    {/* Emoji Reaction Picker */}
                    <div className="flex items-center gap-1">
                      {["❤️", "🥺", "🥰", "💌", "💖"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-transform ${selectedEmoji === emoji ? "scale-125 bg-pink-100 border border-pink-300" : "opacity-60 hover:opacity-100"
                            }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Ketik balasan manismu disini..."
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-pink-200 dark:border-pink-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-semibold hover:from-pink-600 hover:to-rose-500 flex items-center gap-1.5 active:scale-95 transition-all shrink-0 disabled:opacity-50"
                    >
                      <span>{isSubmitting ? "Mengirim..." : "Kirim Balasan"}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
