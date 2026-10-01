"use client";

import React, { useState, useEffect } from "react";
import { Cake, Heart, Play, Pause, SkipBack, SkipForward, Volume2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import ScrollReveal from "@/components/ScrollReveal";

export default function InteractiveWidgets({ isMusicPlaying, toggleMusic }) {
  // --- Countdown Logic ---
  // Default to today or upcoming birthday
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Target birthday date (can be changed by user)
  const [targetDateStr, setTargetDateStr] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("alika_birthday") || "2026-10-05";
    }
    return "2026-10-05";
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Today is birthday!
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f43f5e", "#ec4899", "#fda4af", "#ffe4e6", "#fbcfe8"],
    });
  };

  // --- Music Player State ---
  const [likedSong, setLikedSong] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState({
    title: "Memuat...",
    artist: "Tunggu sebentar",
  });

  useEffect(() => {
    // Dynamic import to get the singleton audio instance
    import("@/components/audioHelper").then((mod) => {
      const audioInstance = mod.romanticAudio;
      if (audioInstance) {
        setCurrentTrack(audioInstance.getCurrentTrack());
        audioInstance.setTrackChangeListener((track) => {
          setCurrentTrack(track);
        });
      }
    });
  }, []);

  useEffect(() => {
    let timer;
    if (isMusicPlaying) {
      timer = setInterval(() => {
        import("@/components/audioHelper").then((mod) => {
          const audioInstance = mod.romanticAudio;
          if (audioInstance) {
            setSongProgress(audioInstance.getCurrentTime());
            setTotalDuration(audioInstance.getDuration());
          }
        });
      }, 500);
    } else {
      // Fetch once when paused to get initial duration
      import("@/components/audioHelper").then((mod) => {
        const audioInstance = mod.romanticAudio;
        if (audioInstance) {
          setSongProgress(audioInstance.getCurrentTime());
          setTotalDuration(audioInstance.getDuration());
        }
      });
    }
    return () => clearInterval(timer);
  }, [isMusicPlaying]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleScrub = (e) => {
    const newTime = Number(e.target.value);
    setSongProgress(newTime);
    import("@/components/audioHelper").then((mod) => {
      const audioInstance = mod.romanticAudio;
      if (audioInstance) {
        audioInstance.seek(newTime);
      }
    });
  };

  const skipNext = () => {
    import("@/components/audioHelper").then((mod) => {
      const audioInstance = mod.romanticAudio;
      if (audioInstance) {
        audioInstance.nextTrack();
        setCurrentTrack(audioInstance.getCurrentTrack());
        if (!isMusicPlaying) toggleMusic();
      }
    });
  };

  const skipPrev = () => {
    import("@/components/audioHelper").then((mod) => {
      const audioInstance = mod.romanticAudio;
      if (audioInstance) {
        audioInstance.prevTrack();
        setCurrentTrack(audioInstance.getCurrentTrack());
        if (!isMusicPlaying) toggleMusic();
      }
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- Widget 1: Birthday Countdown --- */}
        <ScrollReveal direction="left" amount={0.1}>
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎂</span>
              <h3 className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-100">
                Birthday Countdown
              </h3>
            </div>
            
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="text-xs text-pink-600 dark:text-pink-400 hover:underline"
            >
              {showDatePicker ? "Tutup" : "Atur Tanggal"}
            </button>
          </div>

          {showDatePicker && (
            <div className="mb-4 p-2 bg-pink-50/80 dark:bg-pink-900/40 rounded-xl flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-300">Tanggal Ultah Alika:</span>
              <input
                type="date"
                value={targetDateStr}
                onChange={(e) => {
                  setTargetDateStr(e.target.value);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("alika_birthday", e.target.value);
                  }
                }}
                className="px-2 py-1 bg-white dark:bg-zinc-800 border border-pink-200 dark:border-pink-700 rounded-md text-xs"
              />
            </div>
          )}

          {/* 4 Counter Blocks */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 my-2">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-pink-50/70 dark:bg-pink-900/30 border border-pink-200/60 dark:border-pink-800/40 rounded-xl py-3 px-2 text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Celebration trigger */}
          <div className="mt-4 pt-3 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Hari spesial orang tersayang ✨
            </span>
            <button
              onClick={handleCelebrate}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors flex items-center gap-1 active:scale-95"
            >
              <span>Rayakan 🎉</span>
            </button>
          </div>

          </div>
        </ScrollReveal>

        {/* --- Widget 2: Our Song ♡ Music Player --- */}
        <ScrollReveal direction="right" amount={0.1}>
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Our Song</span>
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            </h3>
            
            <button
              onClick={() => {
                setLikedSong(!likedSong);
                if (!likedSong) {
                  confetti({
                    particleCount: 20,
                    spread: 40,
                    origin: { y: 0.65 },
                    colors: ["#ec4899", "#f43f5e"],
                  });
                }
              }}
              title="Suka lagu ini"
              className="p-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/50 transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  likedSong
                    ? "text-rose-500 fill-rose-500 scale-110"
                    : "text-zinc-400 hover:text-rose-400"
                }`}
              />
            </button>
          </div>

          {/* Song Info Bar */}
          <div className="flex items-center gap-3.5 mb-3">
            {/* Album Cover Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-pink-100 dark:bg-pink-900/40 border border-pink-200/60 shrink-0 relative group">
              <img
                src="/images/album_cover.svg"
                alt="Rembulan - Devano"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Music className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Song Meta */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Scrubber / Progress Bar */}
          <div className="space-y-1 my-1">
            <input
              type="range"
              min={0}
              max={totalDuration}
              value={songProgress}
              onChange={handleScrub}
              className="w-full h-1.5 bg-pink-200 dark:bg-pink-900 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              <span>{formatTime(songProgress)}</span>
              <span>-{formatTime(totalDuration - songProgress)}</span>
            </div>
          </div>

          {/* Media Controls */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={skipPrev}
              className="text-zinc-500 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
              title="Lagu Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMusic}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20 active:scale-95 transition-all"
              title={isMusicPlaying ? "Jeda" : "Putar"}
            >
              {isMusicPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={skipNext}
              className="text-zinc-500 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
              title="Lagu Berikutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

function Music(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
