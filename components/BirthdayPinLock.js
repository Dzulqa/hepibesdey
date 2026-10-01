"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lock, Unlock, Heart, Sparkles, Delete, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function BirthdayPinLock({ onUnlock }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Kunci scroll sepenuhnya saat PIN lock aktif
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Blokir wheel scroll dan touch scroll
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
    return () => {
      document.body.style.overflow = original || "";
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f472b6", "#fda4af", "#ffe4e6", "#f43f5e", "#fb7185", "#ffd700"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#ec4899", "#f43f5e", "#fda4af"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#ec4899", "#f43f5e", "#fda4af"],
        });
      }, 250);
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  };

  const verifyPin = (currentPinArray) => {
    const fullPin = currentPinArray.join("");
    if (fullPin.length !== 4) return;

    if (fullPin === "0206") {
      setIsSuccess(true);
      setErrorMsg("");
      triggerConfetti();

      // Panggil unlock callback yang langsung memicu musik dari interaksi klik/input ini
      setTimeout(() => {
        if (onUnlock) {
          onUnlock();
        }
      }, 700);
    } else {
      setIsShaking(true);
      setErrorMsg("PIN salah sayang, coba ingat tanggal spesialmu ya ♡");
      setTimeout(() => {
        setIsShaking(false);
        setPin(["", "", "", ""]);
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }, 900);
    }
  };

  const handleInputChange = (index, value) => {
    if (isSuccess) return;
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setErrorMsg("");

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (newPin.every((d) => d !== "")) {
      verifyPin(newPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (isSuccess) return;
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);
        inputRefs[index - 1].current?.focus();
      } else {
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeypadPress = (num) => {
    if (isSuccess) return;
    const nextIndex = pin.findIndex((val) => val === "");
    if (nextIndex === -1) return;

    const newPin = [...pin];
    newPin[nextIndex] = num.toString();
    setPin(newPin);
    setErrorMsg("");

    if (nextIndex < 3) {
      inputRefs[nextIndex + 1].current?.focus();
    }

    if (newPin.every((d) => d !== "")) {
      verifyPin(newPin);
    }
  };

  const handleKeypadDelete = () => {
    if (isSuccess) return;
    const filledIndices = pin.map((v, i) => (v !== "" ? i : -1)).filter((i) => i !== -1);
    if (filledIndices.length === 0) return;
    const lastIndex = filledIndices[filledIndices.length - 1];

    const newPin = [...pin];
    newPin[lastIndex] = "";
    setPin(newPin);
    setErrorMsg("");
    inputRefs[lastIndex].current?.focus();
  };

  const handleClear = () => {
    if (isSuccess) return;
    setPin(["", "", "", ""]);
    setErrorMsg("");
    inputRefs[0].current?.focus();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-pink-100/95 via-rose-50/95 to-pink-200/95 backdrop-blur-md transition-opacity duration-700 ${isSuccess ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      
      {/* Background Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <span className="absolute top-[12%] left-[10%] text-pink-400/40 text-3xl animate-float-slow">♥</span>
        <span className="absolute top-[20%] right-[15%] text-rose-400/30 text-4xl animate-float-slow" style={{ animationDelay: "1s" }}>♡</span>
        <span className="absolute bottom-[18%] left-[20%] text-pink-300/40 text-2xl animate-float-slow" style={{ animationDelay: "2s" }}>♥</span>
        <span className="absolute bottom-[25%] right-[25%] text-rose-300/30 text-3xl animate-float-slow" style={{ animationDelay: "1.5s" }}>♡</span>
      </div>

      <div
        className={`w-full max-w-[280px] bg-white/90 dark:bg-[#1f1024]/90 rounded-2xl p-4 shadow-xl shadow-pink-500/15 border border-pink-200 dark:border-pink-800 text-center space-y-4 relative transition-transform duration-300 ${
          isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >
        {/* Top Icon */}
        <div className="relative mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-md shadow-pink-500/30 text-white">
          {isSuccess ? (
            <Unlock className="w-6 h-6 animate-bounce" />
          ) : (
            <Lock className="w-6 h-6" />
          )}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border border-pink-200 flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 fill-pink-500 animate-pulse" />
          </div>
        </div>

        {/* Badge only */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "5s" }} />
            <span>Special Birthday Access</span>
          </div>
        </div>

        {/* 4-Digit Inputs */}
        <div className="flex items-center justify-center gap-2">
          {pin.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              inputMode="none"
              readOnly
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-11 h-12 text-xl font-bold text-center rounded-xl border-2 transition-all outline-none ${
                isSuccess
                  ? "border-emerald-400 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                  : isShaking
                  ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40"
                  : digit
                  ? "border-pink-500 bg-pink-50/60 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300"
                  : "border-pink-200 dark:border-pink-800/80 bg-white/70 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40"
              }`}
            />
          ))}
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="text-xs text-rose-500 font-medium flex items-center justify-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="text-sm font-semibold text-pink-600 dark:text-pink-400 flex items-center justify-center gap-1.5 animate-in zoom-in-95">
            <Heart className="w-4 h-4 fill-pink-500 animate-ping" />
            <span>PIN Benar! Memutar musik untukmu... ♡</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypadPress(num)}
              className="h-9 rounded-lg bg-pink-50/80 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-zinc-700 dark:text-zinc-200 font-semibold text-base transition-all active:scale-95 border border-pink-100 dark:border-pink-900/40"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-9 rounded-lg bg-pink-50/40 dark:bg-pink-950/20 hover:bg-pink-100/60 text-xs font-medium text-zinc-500 dark:text-zinc-400 transition-all active:scale-95 border border-pink-100/60"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress(0)}
            className="h-9 rounded-lg bg-pink-50/80 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-zinc-700 dark:text-zinc-200 font-semibold text-base transition-all active:scale-95 border border-pink-100 dark:border-pink-900/40"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleKeypadDelete}
            className="h-9 rounded-lg bg-pink-50/40 dark:bg-pink-950/20 hover:bg-pink-100/60 flex items-center justify-center text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 border border-pink-100/60"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
