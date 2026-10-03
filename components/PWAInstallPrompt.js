"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone, Monitor, Apple, CheckCircle2, HelpCircle } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activePlatformTab, setActivePlatformTab] = useState("android");

  useEffect(() => {
    // 1. Detect if running inside installed standalone app (PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 1b. Check localStorage for previously installed flag
    if (localStorage.getItem("pwa-alika-installed") === "true") {
      setIsAlreadyInstalled(true);
    }

    // 2. Register Service Worker reliably (check document.readyState)
    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("PWA Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("PWA Service Worker registration error:", error);
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }

    // 3. Detect operating system for the default guide tab
    const userAgent = navigator.userAgent || "";
    if (/android/i.test(userAgent)) {
      setActivePlatformTab("android");
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      setActivePlatformTab("ios");
    } else {
      setActivePlatformTab("windows");
    }

    // 4. Capture native install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      window.deferredPWAInstallPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Successful installation listener
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsAlreadyInstalled(true);
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
      localStorage.setItem("pwa-alika-installed", "true");
      console.log("PWA Alika berhasil diinstall!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 6. External event to open install modal or prompt (e.g. from Navbar)
    const handleCustomTrigger = () => {
      if (window.deferredPWAInstallPrompt) {
        window.deferredPWAInstallPrompt.prompt().then((res) => {
          if (res.outcome === "accepted") {
            setIsInstallable(false);
          }
        });
      } else {
        setShowGuideModal(true);
      }
    };

    window.addEventListener("trigger-pwa-install", handleCustomTrigger);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("trigger-pwa-install", handleCustomTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsInstallable(false);
          setDeferredPrompt(null);
          window.deferredPWAInstallPrompt = null;
        }
      } catch (err) {
        console.warn("Install prompt error:", err);
        setShowGuideModal(true);
      }
    } else {
      // If native prompt is not available, show step-by-step interactive guide
      setShowGuideModal(true);
    }
  };

  // If already opened as standalone app OR already installed, don't show the bottom banner
  if (isStandalone || isAlreadyInstalled) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Banner Prompt */}
      {!isDismissed && (
        <aside
          aria-label="Pemberitahuan instalasi aplikasi"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100%-2.5rem)] bg-white/95 backdrop-blur-md border border-pink-200/90 shadow-2xl rounded-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-start gap-3">
            <img
              src="/images/barbie-icon.png"
              alt="Alika App Icon"
              className="w-12 h-12 rounded-xl object-cover shadow-sm border border-pink-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-pink-900 leading-tight">
                  Install Aplikasi Alika
                </h2>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-medium">
                  Offline Ready
                </span>
              </div>
              <p className="text-xs text-pink-700/80 mt-1 leading-relaxed">
                Bisa diinstall di HP Android & Windows/Laptop agar bisa dibuka kapan saja tanpa kuota internet!
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{deferredPrompt ? "Install Sekarang" : "Cara Download"}</span>
                </button>
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="text-xs text-pink-700 hover:text-pink-900 font-medium px-2 py-1.5 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-pink-500" />
                  <span>Panduan</span>
                </button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 font-medium px-2 py-1.5 transition-colors"
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
      )}

      {/* Interactive Step-by-Step Installation Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/barbie-icon.png"
                alt="Alika Icon"
                className="w-12 h-12 rounded-2xl shadow-sm border border-pink-100 object-cover"
              />
              <div>
                <h3 className="font-bold text-pink-900 text-lg">
                  Cara Install Aplikasi Alika
                </h3>
                <p className="text-xs text-pink-600">
                  Nikmati semua foto & musik secara offline di perangkatmu
                </p>
              </div>
            </div>

            {/* Platform Selection Tabs */}
            <div className="flex rounded-xl bg-pink-50 p-1 mb-5">
              <button
                onClick={() => setActivePlatformTab("android")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activePlatformTab === "android"
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-zinc-500 hover:text-pink-600"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setActivePlatformTab("windows")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activePlatformTab === "windows"
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-zinc-500 hover:text-pink-600"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Windows / PC</span>
              </button>
              <button
                onClick={() => setActivePlatformTab("ios")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activePlatformTab === "ios"
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-zinc-500 hover:text-pink-600"
                }`}
              >
                <Apple className="w-4 h-4" />
                <span>iPhone</span>
              </button>
            </div>

            {/* Content for Android */}
            {activePlatformTab === "android" && (
              <div className="space-y-3 text-xs text-zinc-700 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    1
                  </span>
                  <p>
                    Buka website ini di <strong>Google Chrome</strong> atau <strong>Samsung Internet</strong> pada HP Android kamu.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    2
                  </span>
                  <p>
                    Tekan tombol menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    3
                  </span>
                  <p>
                    Pilih <strong>&quot;Tambahkan ke Layar utama&quot;</strong> (Add to Home screen) atau <strong>&quot;Install aplikasi&quot;</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    ✓
                  </span>
                  <p>
                    Selesai! Ikon Alika akan muncul di beranda HP dan siap dibuka kapan saja tanpa koneksi internet.
                  </p>
                </div>
              </div>
            )}

            {/* Content for Windows */}
            {activePlatformTab === "windows" && (
              <div className="space-y-3 text-xs text-zinc-700 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    1
                  </span>
                  <p>
                    Buka website ini di <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong> di laptop/komputer.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    2
                  </span>
                  <p>
                    Lihat ke bilah alamat URL di kanan atas, klik ikon <strong>Install (komputer kecil dengan panah)</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    3
                  </span>
                  <p>
                    Klik tombol <strong>&quot;Install&quot;</strong> pada pop-up konfirmasi.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    ✓
                  </span>
                  <p>
                    Selesai! Aplikasi akan terpasang di Start Menu, Desktop shortcut, dan Taskbar Windows.
                  </p>
                </div>
              </div>
            )}

            {/* Content for iOS */}
            {activePlatformTab === "ios" && (
              <div className="space-y-3 text-xs text-zinc-700 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    1
                  </span>
                  <p>
                    Buka website ini menggunakan browser bawaan <strong>Safari</strong> di iPhone/iPad.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    2
                  </span>
                  <p>
                    Tekan tombol <strong>Bagikan / Share</strong> (ikon kotak dengan panah ke atas di bagian bawah layar).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                    3
                  </span>
                  <p>
                    Gulir ke bawah dan pilih <strong>&quot;Tambah ke Layar Utama&quot; (Add to Home Screen)</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Direct Trigger Button if native prompt is supported */}
            {deferredPrompt && (
              <button
                onClick={() => {
                  setShowGuideModal(false);
                  handleInstallClick();
                }}
                className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-xs shadow-md hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Tekan Disini untuk Install Langsung</span>
              </button>
            )}

            <div className="mt-4 pt-3 border-t border-pink-100 text-center">
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-xs text-pink-600 hover:text-pink-800 font-medium"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
