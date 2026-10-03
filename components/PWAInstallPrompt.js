"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (already installed & opened as app)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Register Service Worker if supported
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("PWA Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("PWA Service Worker registration failed:", error);
          });
      });
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("PWA was installed successfully!");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !isInstallable || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Pemberitahuan instalasi aplikasi"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100%-2.5rem)] bg-white/95 backdrop-blur-md border border-pink-200 shadow-xl rounded-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-3">
        <img
          src="/images/barbie-icon.png"
          alt="Alika App Icon"
          className="w-12 h-12 rounded-xl object-cover shadow-sm border border-pink-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-pink-900 leading-tight">
            Install Aplikasi Alika
          </h2>
          <p className="text-xs text-pink-700/80 mt-1 leading-relaxed">
            Pasang di layar utama HP atau laptop kamu biar bisa dibuka kapan aja!
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Sekarang</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-xs text-pink-600 hover:text-pink-800 font-medium px-2 py-1.5 transition-colors"
            >
              Nanti Saja
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-pink-400 hover:text-pink-600 transition-colors p-1"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
