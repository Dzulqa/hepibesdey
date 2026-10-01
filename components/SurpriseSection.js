"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Gift,
  Sparkles,
  Check,
  Heart,
  Gamepad2,
  RotateCcw,
  Trophy,
  Wand2,
  Layers,
  Play,
  Pause,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SurpriseSection() {
  const [activeGameTab, setActiveGameTab] = useState("scratch"); // 'scratch', 'catcher', 'memory', 'wheel', 'coupons'

  return (
    <section id="surprise" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 scroll-mt-20 space-y-10">

      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100/80 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 inline-flex items-center gap-1.5">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Mini Games & Hadiah Spesial</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif-romantic text-zinc-800 dark:text-zinc-100">
          Arena Main Untuk Awlikaa ♡
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Spesial ulang tahun kamu, yuk mayin game di bawah ini yang uda aku siapin dengan hadiah yang ada
        </p>
      </div>

      {/* Mini Games Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/60 max-w-2xl mx-auto backdrop-blur-md shadow-xs">
        {[
          { id: "scratch", label: "✨ Gosok Kartu", icon: Wand2 },
          { id: "catcher", label: "🎮 Tangkap Cinta", icon: Gamepad2 },
          { id: "memory", label: "🃏 Tebak Kartu", icon: Layers },
          { id: "wheel", label: "🎡 Roda Hadiah", icon: Trophy },

        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeGameTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGameTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm scale-102"
                : "text-zinc-600 dark:text-zinc-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/40"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Real Interactive Scratch Card with Canvas */}
      {activeGameTab === "scratch" && <RealScratchCard />}

      {/* Tab 2: Love Catcher Game (Catch hearts, avoid obstacles) */}
      {activeGameTab === "catcher" && <LoveCatcherGame />}

      {/* Tab 3: Couple Memory Match Card Game */}
      {activeGameTab === "memory" && <MemoryMatchGame />}

      {/* Tab 4: Romantic Spin the Wheel */}
      {activeGameTab === "wheel" && <RomanticSpinWheel />}

      {/* Tab 5: Love Coupons & Gift Box */}
      {activeGameTab === "coupons" && <LoveCouponsAndGift />}

    </section>
  );
}

/* =========================================================================
   1. REAL CANVAS SCRATCH CARD (Bisa digosok langsung dengan kursor mouse/touch)
   ========================================================================= */
function RealScratchCard() {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawing = useRef(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    // Background silver-pink glitter coating
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#d1d5db");
    grad.addColorStop(0.5, "#fbcfe8");
    grad.addColorStop(1, "#cbd5e1");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle decorative patterns
    ctx.fillStyle = "rgba(219, 39, 119, 0.15)";
    for (let i = 15; i < canvas.width; i += 30) {
      for (let j = 15; j < canvas.height; j += 30) {
        ctx.beginPath();
        ctx.arc(i, j, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Text instructions on top of coating
    ctx.font = "bold 15px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillStyle = "#831843";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ GOSOK DISINI ✨", canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = "11px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillStyle = "#9d174d";
    ctx.fillText("Tahan & usap mouse/jari untuk membuka", canvas.width / 2, canvas.height / 2 + 14);

    setIsRevealed(false);
    setScratchPercent(0);
  };

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage occasionally
    checkPercentage();
  };

  const checkPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Sample 20x20 grid to avoid performance lag
    let transparent = 0;
    const sampleRate = 12;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let totalSamples = 0;

    for (let y = 0; y < height; y += sampleRate) {
      for (let x = 0; x < width; x += sampleRate) {
        totalSamples++;
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha < 128) {
          transparent++;
        }
      }
    }

    const pct = Math.round((transparent / totalSamples) * 100);
    setScratchPercent(pct);

    if (pct > 45 && !isRevealed) {
      setIsRevealed(true);
      // Auto clear remaining
      ctx.clearRect(0, 0, width, height);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#ec4899", "#fda4af", "#ffe4e6"],
      });
    }
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTouchStart = (e) => {
    isDrawing.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDrawing.current || !e.touches[0]) return;
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div className="max-w-lg mx-auto bg-white/80 dark:bg-pink-950/30 p-6 sm:p-8 rounded-3xl border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-lg space-y-5 text-center">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center justify-center gap-2">
          <span>Kartu Gosok MyGirlFriend</span>
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin" style={{ animationDuration: "4s" }} />
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Gosok aja
        </p>
      </div>

      {/* The Scratch Container */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-inner border-2 border-pink-200 dark:border-pink-800 select-none">

        {/* Hidden Message Layer Underneath */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-pink-950 dark:via-[#26132b] dark:to-pink-950 flex flex-col items-center justify-center p-6 text-center space-y-2">
          <span className="text-3xl animate-bounce">💌</span>
          <p className="font-script text-2xl sm:text-3xl font-bold text-[#d95376] dark:text-[#f472b6] leading-tight">
            TERIMAKACI UDA MAU JADI MYGF TERBAIK, TERCANTIK & GEMOY.
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
            Hepi Besdey Awlikaa, Apapun yang terjadi, aku always ada disamping kamu. Ailapyuu muach muachh! ♡
          </p>
          <div className="text-[10px] font-mono tracking-widest text-pink-500 uppercase font-semibold">
            FOREVER & ALWAYS
          </div>
        </div>

        {/* Real Scratch Canvas Layer on Top */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-500 ${isRevealed ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
        />
      </div>

      {/* Status Bar & Reset Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-semibold text-pink-600 dark:text-pink-400">
          {isRevealed ? "🎉 Kartu Berhasil Terbuka!" : `Terbuka: ${scratchPercent}%`}
        </div>

        <button
          onClick={initCanvas}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 hover:bg-pink-200 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Gosok Ulang</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   2. LOVE CATCHER ARCADE GAME (Tangkap Bunga & Hati, Hindari Patah Hati)
   ========================================================================= */
function LoveCatcherGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameOver, setGameOver] = useState(false);
  const [basketX, setBasketX] = useState(50); // percentage 0-100
  const [items, setItems] = useState([]);
  const gameAreaRef = useRef(null);
  const requestRef = useRef();

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(25);
    setGameOver(false);
    setItems([]);
  };

  // Timer countdown
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setGameOver(true);
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#f43f5e", "#fda4af"],
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Spawn falling objects & update positions
  useEffect(() => {
    if (!isPlaying) return;

    let spawnTimer = setInterval(() => {
      const types = [
        { emoji: "💖", pts: 10, type: "heart" },
        { emoji: "💐", pts: 20, type: "flower" },
        { emoji: "🎁", pts: 30, type: "gift" },
        { emoji: "🎀", pts: 15, type: "ribbon" },
        { emoji: "💔", pts: -15, type: "bad" },
      ];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: Math.random(),
        x: Math.random() * 85 + 5,
        y: 0,
        speed: Math.random() * 0.1 + 1.7,
        ...randomType,
      };
      setItems((prev) => [...prev, newItem]);
    }, 400);

    const updateGame = () => {
      setItems((prevItems) => {
        const next = [];
        for (const item of prevItems) {
          const nextY = item.y + item.speed;
          // Check collision with basket at bottom (y ~ 85-95%)
          if (nextY >= 82 && nextY <= 94) {
            const distance = Math.abs(item.x - basketX);
            if (distance < 14) {
              // Caught!
              setScore((s) => Math.max(0, s + item.pts));
              continue; // Don't keep item
            }
          }

          if (nextY < 100) {
            next.push({ ...item, y: nextY });
          }
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, basketX]);

  // Handle basket movement via mouse / touch
  const handleMouseMove = (e) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, x)));
  };

  const handleTouchMove = (e) => {
    if (!gameAreaRef.current || !e.touches[0]) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, x)));
  };

  return (
    <div className="max-w-xl mx-auto bg-white/80 dark:bg-pink-950/30 p-6 rounded-3xl border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-lg space-y-4 text-center">

      <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/50 pb-3">
        <div>
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
            <span>Tangkap Hati & Bunga Cinta</span>
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
          </h3>
          <p className="text-[11px] text-zinc-500">Geser keranjang untuk menangkap hadiah!</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-xs font-bold text-pink-700 dark:text-pink-300">
            Skor: {score}
          </div>
          <div className="px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-xs font-bold text-rose-700 dark:text-rose-300">
            ⏳ {timeLeft}s
          </div>
        </div>
      </div>

      {/* Interactive Game Canvas Box */}
      <div
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-pink-50 to-rose-100/60 dark:from-pink-950/40 dark:to-rose-950/30 border border-pink-200 dark:border-pink-800 overflow-hidden cursor-crosshair select-none touch-none"
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-white/60 dark:bg-[#1f1022]/80 backdrop-blur-xs">
            <span className="text-5xl animate-bounce">🧺💖</span>
            <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Siap Bermain, Alika?
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xs">
              Tangkap hati (💖), bunga (💐), kado (🎁) dan hindari hati patah (💔). Kumpulkan skor sebanyak-banyaknya!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md active:scale-95 transition-all"
            >
              Mulai Main Sekarang 🎮
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-white/85 dark:bg-[#1f1022]/90 backdrop-blur-xs animate-in zoom-in-95">
            <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            <h4 className="font-script text-3xl font-bold text-pink-600 dark:text-pink-400">
              Hebat Banget Alika!
            </h4>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Total Skor Cinta Kamu: <span className="text-pink-600 text-lg font-bold">{score}</span> Poin!
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Hadiah: Pelukan terhangat dan traktiran makanan kesukaanmu! ♡
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-pink-500 text-white shadow-md hover:bg-pink-600 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Main Lagi</span>
            </button>
          </div>
        )}

        {/* Falling Items */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute text-2xl pointer-events-none transition-transform"
          >
            {item.emoji}
          </div>
        ))}

        {/* Player Basket */}
        <div
          style={{
            left: `${basketX}%`,
            bottom: "12px",
            transform: "translateX(-50%)",
          }}
          className="absolute flex flex-col items-center pointer-events-none select-none"
        >
          <span className="text-3xl">🧺</span>
          <span className="text-[10px] font-bold text-pink-700 dark:text-pink-300 bg-white/80 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-pink-300 shadow-xs">
            Alika
          </span>
        </div>
      </div>

    </div>
  );
}

/* =========================================================================
   3. MEMORY MATCH GAME (Tebak Pasangan Kartu Romantis)
   ========================================================================= */
function MemoryMatchGame() {
  const cardItems = [
    { id: 1, name: "cat", icon: "🐱", label: "Kucing Lucu" },
    { id: 2, name: "flower", icon: "💐", label: "Bunga Kasih" },
    { id: 3, name: "ribbon", icon: "🎀", label: "Pita Pink" },
    { id: 4, name: "letter", icon: "💌", label: "Surat Hati" },
    { id: 5, name: "coffee", icon: "☕", label: "Kencan Kopi" },
    { id: 6, name: "icecream", icon: "🍦", label: "Es Krim Manis" },
  ];

  const generateCards = () => {
    const deck = [...cardItems, ...cardItems].map((item, idx) => ({
      uniqueId: idx,
      ...item,
    }));
    return deck.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(generateCards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].name)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].name === cards[secondIdx].name) {
        // Matched!
        setMatched((prev) => [...prev, cards[firstIdx].name]);
        setFlipped([]);
        if (matched.length + 1 === cardItems.length) {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#f43f5e", "#fda4af", "#fbbf24"],
          });
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 850);
      }
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const isWon = matched.length === cardItems.length;

  return (
    <div className="max-w-xl mx-auto bg-white/80 dark:bg-pink-950/30 p-6 rounded-3xl border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-lg space-y-5 text-center">
      <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/50 pb-3">
        <div>
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
            Tebak Pasangan Kartu Cinta
          </h3>
          <p className="text-[11px] text-zinc-500">Cocokkan semua pasangan kartu yang sama!</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/50 px-3 py-1 rounded-xl">
            Langkah: {moves}
          </span>
          <button
            onClick={resetGame}
            className="p-1.5 text-zinc-400 hover:text-pink-600 transition-colors"
            title="Kocok Ulang"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 12 Cards */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map((card, idx) => {
          const isCardFlipped = flipped.includes(idx) || matched.includes(card.name);
          return (
            <div
              key={card.uniqueId}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl cursor-pointer border-2 transition-all duration-300 flex items-center justify-center p-2 text-center select-none ${isCardFlipped
                ? "bg-pink-100/90 dark:bg-pink-900/80 border-pink-400 scale-102 shadow-md"
                : "bg-gradient-to-br from-pink-200 to-rose-200 dark:from-pink-950 dark:to-rose-950 border-pink-300 dark:border-pink-800 hover:scale-105"
                }`}
            >
              {isCardFlipped ? (
                <div className="animate-in zoom-in-50 duration-200">
                  <span className="text-3xl sm:text-4xl">{card.icon}</span>
                </div>
              ) : (
                <span className="font-script text-xl text-pink-600 dark:text-pink-400">
                  ♡
                </span>
              )}
            </div>
          );
        })}
      </div>

      {isWon && (
        <div className="p-4 rounded-2xl bg-pink-100/80 dark:bg-pink-950/60 border border-pink-300 text-center space-y-1 animate-in zoom-in-95">
          <p className="font-script text-2xl font-bold text-pink-600 dark:text-pink-400">
            Luar Biasa, Semua Kartu Cocok! 🎉
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Sama seperti kita yang selalu cocok dan saling melengkapi ♡
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   4. ROMANTIC SPIN THE WHEEL (Roda Keberuntungan Hadiah Romantis)
   ========================================================================= */
function RomanticSpinWheel() {
  const prizes = [
    { title: "Ditraktir Boba / Es Krim", icon: "🍦", color: "#fda4af" },
    { title: "Dipijitin pas cape", icon: "💆‍♀️", color: "#f9a8d4" },
    { title: "Muter muter kemana aja", icon: "🌆", color: "#fbcfe8" },
    { title: "Pelukan unlimited", icon: "🫂", color: "#f472b6" },
    { title: "1 Permintaan Khusus Bebas (Masuk akal)", icon: "👑", color: "#fb7185" },
    { title: "Mabar Heartopia Seharian", icon: "🎮", color: "#f43f5e" },
  ];

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedPrize(null);

    const prizeCount = prizes.length;
    const randomPrizeIdx = Math.floor(Math.random() * prizeCount);
    const sliceAngle = 360 / prizeCount;
    
    // We want final angle % 360 to equal (360 - randomPrizeIdx * sliceAngle)
    const baseTarget = 360 - (randomPrizeIdx * sliceAngle);
    const extraSpins = 360 * 5;
    
    // Calculate degree needed to reach baseTarget from current rotation % 360
    const currentMod = rotation % 360;
    let degreeChange = baseTarget - currentMod;
    if (degreeChange <= 0) {
      degreeChange += 360;
    }
    
    // Add random offset between -20 and 20 to make it look realistic (not perfectly center)
    const randomOffset = Math.floor(Math.random() * 40) - 20;

    const targetDegree = rotation + extraSpins + degreeChange + randomOffset;

    setRotation(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPrize(prizes[randomPrizeIdx]);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#fda4af", "#fbcfe8"],
      });
    }, 4000);
  };

  return (
    <div className="max-w-md mx-auto bg-white/80 dark:bg-pink-950/30 p-6 sm:p-8 rounded-3xl border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-lg space-y-6 text-center">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center justify-center gap-1.5">
          <span>Roda Keberuntungan Romantis</span>
          <Trophy className="w-4 h-4 text-amber-400" />
        </h3>
        <p className="text-xs text-zinc-500">Putar roda dan klaim hadiah apa pun yang terpilih!</p>
      </div>

      {/* The Wheel */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
        {/* Pointer Arrow on Top */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-transparent border-r-[10px] sm:border-r-[12px] border-r-transparent border-t-[18px] sm:border-t-[20px] border-t-pink-600 drop-shadow-md" />

        {/* Outer Wheel Ring */}
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)" : "none",
          }}
          className="w-full h-full rounded-full border-4 border-white dark:border-pink-900 shadow-xl overflow-hidden relative"
        >
          {prizes.map((p, idx) => {
            const angle = (360 / prizes.length) * idx;
            return (
              <div
                key={idx}
                style={{
                  transform: `rotate(${angle}deg)`,
                  backgroundColor: p.color,
                  clipPath: "polygon(50% 50%, 0 0, 100% 0)",
                }}
                className="absolute inset-0 flex items-start justify-center pt-3 text-zinc-800"
              >
                <div className="text-center font-bold text-[10px] transform -rotate-90 origin-bottom mt-2">
                  <span className="text-base block">{p.icon}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Spin Button */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className="absolute z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-zinc-800 border-2 border-pink-400 shadow-md flex flex-col items-center justify-center active:scale-95 transition-transform font-bold text-[11px] sm:text-xs text-pink-600 dark:text-pink-300 disabled:opacity-50"
        >
          <span>{isSpinning ? "..." : "PUTAR"}</span>
          <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
        </button>
      </div>

      {/* Result Display */}
      {selectedPrize && (
        <div className="p-4 rounded-2xl bg-pink-100/80 dark:bg-pink-950/60 border border-pink-200 animate-in zoom-in-95 space-y-1">
          <p className="text-xs text-zinc-500 font-semibold">SELAMAT! KAMU DAPET:</p>
          <h4 className="font-script text-2xl font-bold text-pink-600 dark:text-pink-400 flex items-center justify-center gap-1.5">
            <span>{selectedPrize.icon}</span>
            <span>{selectedPrize.title}</span>
          </h4>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
            Tunjukkan hasil ini ke aku buat klaim hadiahnya sekarang ya! ♡
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   5. LOVE COUPONS & 3D GIFT BOX (Feature Lengkap)
   ========================================================================= */
function LoveCouponsAndGift() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [claimedCoupons, setClaimedCoupons] = useState({});

  const coupons = [
    {
      id: "coupon_date",
      title: "Voucher Kencan Bebas Pilih",
      desc: "Alika bebas tentukan tempat nongkrong, cafe, atau tempat jalan-jalan seharian!",
      icon: "☕",
      color: "from-pink-100 to-rose-100 dark:from-pink-950/60 dark:to-rose-950/40",
    },
    {
      id: "coupon_hug",
      title: "Voucher Peluk Hangat",
      desc: "Bisa ditukar kapan saja pas lagi capek, butuh sandaran, atau lagi kangen.",
      icon: "🫂",
      color: "from-rose-100 to-pink-100 dark:from-rose-950/60 dark:to-pink-950/40",
    },
    {
      id: "coupon_snack",
      title: "Voucher Jajan & Es Krim",
      desc: "Bebas pesen es krim, boba, matcha, atau makanan favorit tanpa limit!",
      icon: "🍦",
      color: "from-amber-100/60 to-pink-100 dark:from-amber-950/40 dark:to-pink-950/40",
    },
    {
      id: "coupon_pardon",
      title: "Voucher Bebas Cemberut 100%",
      desc: "Kartu sakti kalau lagi ngambek, langsung dimaafin dan dibikin ketawa lagi.",
      icon: "🎀",
      color: "from-pink-100 to-purple-100/50 dark:from-pink-950/60 dark:to-purple-950/40",
    },
  ];

  const handleOpenGift = () => {
    setGiftOpened(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#f43f5e", "#ec4899", "#fda4af", "#ffe4e6"],
    });
  };

  const handleClaim = (id) => {
    setClaimedCoupons((prev) => ({ ...prev, [id]: true }));
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#fda4af", "#f43f5e"],
    });
  };

  return (
    <div className="space-y-10">
      {/* 3D Gift Box */}
      <div className="flex flex-col items-center justify-center">
        {!giftOpened ? (
          <div
            onClick={handleOpenGift}
            className="cursor-pointer group flex flex-col items-center p-8 bg-white/70 dark:bg-pink-950/30 rounded-3xl border-2 border-dashed border-pink-300 dark:border-pink-800 hover:border-pink-500 transition-all max-w-md w-full shadow-lg hover:shadow-2xl"
          >
            <div className="text-7xl group-hover:scale-125 transition-transform animate-bounce">
              🎁
            </div>
            <h3 className="font-script text-3xl font-bold text-pink-600 dark:text-pink-400 mt-4">
              Buka Kotak Kado Utama ♡
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Sentuh atau klik kado untuk melihat isinya!</p>
            <span className="mt-4 px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md">
              Buka Sekarang ✨
            </span>
          </div>
        ) : (
          <div className="w-full max-w-xl bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-pink-950/50 dark:via-[#221028] dark:to-pink-950/30 p-8 rounded-3xl border border-pink-200 dark:border-pink-800 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="text-6xl animate-pulse">🎉💖✨</div>
            <h3 className="font-script text-3xl sm:text-4xl font-bold text-[#d95376] dark:text-[#f472b6]">
              Happy Birthday, Alika Sayang!
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed font-sans max-w-md mx-auto">
              Hadiah terbesar buat aku adalah bisa kenal kamu dan ada di sisimu. Kupon di bawah ini adalah milikmu seutuhnya!
            </p>
            <button
              onClick={() => setGiftOpened(false)}
              className="text-xs text-pink-600 dark:text-pink-400 underline"
            >
              Tutup kado kembali
            </button>
          </div>
        )}
      </div>

      {/* Coupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coupons.map((coupon) => {
          const isClaimed = claimedCoupons[coupon.id];
          return (
            <div
              key={coupon.id}
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${coupon.color} border border-pink-200 dark:border-pink-800 shadow-sm flex flex-col justify-between overflow-hidden`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{coupon.icon}</span>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-100">
                    {coupon.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  {coupon.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-pink-300 dark:border-pink-800 flex items-center justify-between">
                <span className="text-[10px] tracking-widest font-mono text-zinc-400 uppercase">
                  NO EXPIRE
                </span>

                {isClaimed ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>TERKLAIM ♡</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(coupon.id)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-pink-500 hover:bg-pink-600 text-white shadow-xs active:scale-95 transition-all"
                  >
                    Klaim Kupon
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
