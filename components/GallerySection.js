"use client";

import React, { useState, useEffect } from "react";
import { Heart, Maximize2, X, Plus, Trash2, CheckSquare } from "lucide-react";
import confetti from "canvas-confetti";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function GallerySection() {
  const initialPhotos = [
    {
      id: 1,
      src: "/images/nari.jpeg",
      fallback: "/images/polaroid_flower.svg",
      title: "Senyum MBG",
      category: "favorit",
      likes: 124,
    },
    {
      id: 2,
      src: "/images/pink.jpeg",
      fallback: "/images/polaroid_beach.svg",
      title: "My Pinky Girl",
      category: "kencan",
      likes: 89,
    },
    {
      id: 3,
      src: "/images/melon.jpeg",
      fallback: "/images/polaroid_cat.svg",
      title: "Mam Melonn",
      category: "lucu",
      likes: 95,
    },
    {
      id: 4,
      src: "/images/pramuka.jpeg",
      fallback: "/images/polaroid_ribbon.svg",
      title: "Kaka Pramuka",
      category: "favorit",
      likes: 110,
    },
    {
      id: 5,
      src: "/images/princes.jpeg",
      fallback: "/images/polaroid_cafe.svg",
      title: "My Princess",
      category: "kencan",
      likes: 76,
    },
    {
      id: 6,
      src: "/images/letkes.jpeg",
      fallback: "/images/polaroid_flower.svg",
      title: "Kaka Perawat",
      category: "favorit",
      likes: 142,
    },
  ];

  // Fixed 6 photos always shown on main page
  // Load userPhotos dari localStorage supaya tetap ada setelah refresh
  const [userPhotos, setUserPhotos] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("alika_gallery_photos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeCategory, setActiveCategory] = useState("semua");
  const [lightboxPhoto,  setLightboxPhoto]  = useState(null);
  const [userLikes,      setUserLikes]      = useState({});
  const [showAllModal,   setShowAllModal]   = useState(false);
  const [modalCategory,  setModalCategory]  = useState("semua");

  // Upload form state
  const [pendingUpload,  setPendingUpload]  = useState(null); // { src, fileName }
  const [uploadTitle,    setUploadTitle]    = useState("");
  const [uploadCategory, setUploadCategory] = useState("favorit");

  // Multi-select delete state
  const [selectMode,  setSelectMode]  = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [warnBulk,    setWarnBulk]    = useState(false);

  // Combined list for modal (initial 6 + user uploads)
  const allPhotos = [...initialPhotos, ...userPhotos];

  const categories = [
    { id: "semua", label: "Semua Foto" },
    { id: "favorit", label: "Foto Favorit" },
    { id: "kencan", label: "Kencan Kita" },
    { id: "lucu", label: "Momen Lucu" },
  ];

  // Main page always shows exactly the first 6 initial photos (filtered by category)
  const filteredInitial =
    activeCategory === "semua"
      ? initialPhotos
      : initialPhotos.filter((p) => p.category === activeCategory);
  const previewPhotos = filteredInitial.slice(0, 6);

  // Modal shows all photos (initial + user uploaded)
  const modalFilteredPhotos =
    modalCategory === "semua"
      ? allPhotos
      : allPhotos.filter((p) => p.category === modalCategory);

  const [likeCounts, setLikeCounts] = useState(() => {
    const init = {};
    initialPhotos.forEach((p) => { init[p.id] = p.likes; });
    return init;
  });

  // Sync userPhotos ke localStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem("alika_gallery_photos", JSON.stringify(userPhotos));
    } catch (err) {
      // localStorage penuh (biasanya karena foto base64 terlalu besar)
      console.warn("Gagal menyimpan foto ke localStorage:", err);
    }
  }, [userPhotos]);

  const getLikes = (photo) => likeCounts[photo.id] ?? photo.likes;

  const handleLike = (id, e) => {
    e.stopPropagation();
    const wasLiked = userLikes[id];
    setUserLikes((prev) => ({ ...prev, [id]: !wasLiked }));
    setLikeCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + (wasLiked ? -1 : 1) }));

    if (!wasLiked) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#fda4af", "#ec4899", "#f43f5e"],
      });
    }
  };

  // Step 1 – user picks a file → open form modal with preview
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-selected if needed
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingUpload({ src: ev.target.result, fileName: file.name });
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
      setUploadCategory("favorit");
    };
    reader.readAsDataURL(file);
  };

  // Step 2 – user confirms the form → save to userPhotos (modal only)
  const handleConfirmUpload = () => {
    if (!pendingUpload) return;
    const newPhoto = {
      id: Date.now(),
      src: pendingUpload.src,
      fallback: "/images/polaroid_flower.svg",
      title: uploadTitle.trim() || pendingUpload.fileName,
      category: uploadCategory,
      likes: 0,
      isUserUpload: true,
    };
    setUserPhotos((prev) => [newPhoto, ...prev]);
    setLikeCounts((prev) => ({ ...prev, [newPhoto.id]: 0 }));
    setPendingUpload(null);
    // Auto-open modal so user sees their new photo
    setShowAllModal(true);
    setModalCategory("semua");
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#f472b6", "#fda4af", "#ec4899"],
    });
  };

  // Single delete from lightbox
  const handleSingleDelete = (photo, e) => {
    e?.stopPropagation();
    setSelectedIds(new Set([photo.id]));
    setBulkConfirm(true);
    setWarnBulk(false);
  };

  // Toggle a photo's selection in multi-select mode
  const toggleSelect = (photo, e) => {
    e.stopPropagation();
    if (!photo.isUserUpload) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(photo.id) ? next.delete(photo.id) : next.add(photo.id);
      return next;
    });
  };

  const enterSelectMode = () => { setSelectMode(true); setSelectedIds(new Set()); };
  const exitSelectMode  = () => { setSelectMode(false); setSelectedIds(new Set()); };

  const handleBulkDeleteClick = () => {
    if (selectedIds.size === 0) return;
    if (selectedIds.size > 5) { setWarnBulk(true); }
    else { setWarnBulk(false); setBulkConfirm(true); }
  };

  const confirmBulkDelete = () => {
    setUserPhotos((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    if (lightboxPhoto && selectedIds.has(lightboxPhoto.id)) setLightboxPhoto(null);
    setSelectedIds(new Set());
    setBulkConfirm(false);
    setWarnBulk(false);
    setSelectMode(false);
  };

  // Reusable card — multi-select mode with checkbox overlays
  const PhotoCard = ({ photo, inModal = false }) => {
    const isSelected   = selectedIds.has(photo.id);
    const isSelectable = photo.isUserUpload;

    const handleClick = (e) => {
      if (selectMode && inModal) { toggleSelect(photo, e); }
      else { setLightboxPhoto(photo); }
    };

    return (
      <div
        onClick={handleClick}
        className={`group cursor-pointer bg-white dark:bg-[#25152a] p-3 pb-4 rounded-2xl border transition-all duration-300 h-full relative
          ${isSelected
            ? "border-red-400 shadow-lg shadow-red-200/50 dark:shadow-red-900/30 scale-[0.97]"
            : "border-pink-100/80 dark:border-pink-900/50 shadow-xs hover:shadow-xl hover:-translate-y-1.5"
          }`}
      >
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-pink-50 dark:bg-pink-950/40 relative">
          <img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = photo.fallback; }}
          />

          {/* Normal hover overlay */}
          {!selectMode && (
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          )}

          {/* Select mode overlay */}
          {selectMode && inModal && (
            <div className={`absolute inset-0 transition-all duration-200 flex items-center justify-center
              ${isSelectable
                ? isSelected ? "bg-red-500/30" : "bg-black/10 group-hover:bg-black/25"
                : "bg-black/40 cursor-not-allowed"
              }`}
            >
              {isSelectable ? (
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? "bg-red-500 border-red-500 shadow-lg" : "bg-white/80 border-white group-hover:scale-110"}`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[9px] text-white/80 font-semibold">Terlindungi</span>
                </div>
              )}
            </div>
          )}

          {/* Baru badge */}
          {photo.isUserUpload && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500 text-white shadow">Baru</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 truncate">{photo.title}</span>
          {!selectMode && (
            <button
              onClick={(e) => handleLike(photo.id, e)}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-rose-500 transition-colors"
              title="Beri Cinta"
            >
              <Heart className={`w-4 h-4 ${userLikes[photo.id] ? "text-rose-500 fill-rose-500" : "text-zinc-400"}`} />
              <span className="font-mono text-[11px]">{getLikes(photo)}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="gallery" className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 pt-4 scroll-mt-20">
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center space-y-2 mb-10">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100/80 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
          Memories in Frames
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif-romantic text-zinc-800 dark:text-zinc-100">
          Our Gallery
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Galeri foto kita dengan tampilan yang estetik dan interaktif ♡
        </p>
      </ScrollReveal>

      {/* Category Filter Pills & Upload Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-white/80 dark:bg-pink-950/40 text-zinc-600 dark:text-zinc-300 border border-pink-200/80 dark:border-pink-900/60 hover:bg-pink-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Upload Custom Photo Input */}
        <label className="cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 border border-pink-300 dark:border-pink-800 shadow-xs hover:bg-pink-50 dark:hover:bg-pink-900/40 inline-flex items-center gap-1.5 active:scale-95 transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Foto Baru</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>

      </div>

      {/* Photo Grid - Staggered (max 6 on main page) */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.1}>
        {previewPhotos.map((photo) => (
          <StaggerItem key={photo.id} direction="up">
            <PhotoCard photo={photo} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Lihat semua foto Button */}
      <div className="flex justify-center mt-10">
        <button
          id="btn-lihat-semua-foto"
          onClick={() => { setShowAllModal(true); setModalCategory("semua"); exitSelectMode(); }}
          className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white overflow-hidden shadow-lg hover:shadow-pink-400/40 active:scale-95 transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)" }}
        >
          {/* Shimmer sweep */}
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Lihat semua foto</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold tabular-nums">{allPhotos.length}</span>
        </button>
      </div>

      {/* Lightbox Modal (z-[60] so it renders above the all-photos modal) */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-white dark:bg-[#201024] p-4 rounded-3xl border border-pink-200 dark:border-pink-800 shadow-2xl space-y-3">
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40">
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = lightboxPhoto.fallback; }}
              />
            </div>

            <div className="flex items-center justify-between px-2 pt-1">
              <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-100">{lightboxPhoto.title}</h4>
              <div className="flex items-center gap-2">
                {lightboxPhoto.isUserUpload && (
                  <button
                    onClick={(e) => handleSingleDelete(lightboxPhoto, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
                <button
                  onClick={(e) => handleLike(lightboxPhoto.id, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-900/50 text-rose-500 text-xs font-semibold"
                >
                  <Heart className={`w-4 h-4 ${userLikes[lightboxPhoto.id] ? "fill-rose-500" : ""}`} />
                  <span>{getLikes(lightboxPhoto)} Suka</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form Modal */}
      {pendingUpload && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1a0d22] rounded-3xl border border-pink-200 dark:border-pink-800 shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 dark:border-pink-900/60">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <span>🖼️</span> Detail Foto
              </h3>
              <button
                onClick={() => setPendingUpload(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-pink-50 dark:hover:bg-pink-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="px-6 pt-5">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-pink-50 dark:bg-pink-950/40">
                <img src={pendingUpload.src} alt="preview" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Form */}
            <div className="px-6 pt-4 pb-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">Judul Foto</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Tulis judul foto..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-950/30 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "favorit", label: "Foto Favorit" },
                    { id: "kencan", label: "Kencan Kita" },
                    { id: "lucu", label: "Momen Lucu" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setUploadCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        uploadCategory === cat.id
                          ? "bg-pink-500 text-white shadow-sm"
                          : "bg-pink-50 dark:bg-pink-950/40 text-zinc-600 dark:text-zinc-300 border border-pink-200 dark:border-pink-800 hover:bg-pink-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setPendingUpload(null)}
                  className="flex-1 py-2.5 rounded-xl border border-pink-200 dark:border-pink-800 text-sm font-semibold text-zinc-500 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={!uploadTitle.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #f472b6 0%, #ec4899 60%, #db2777 100%)" }}
                >
                  Simpan Foto ♡
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* All Photos Modal */}
      {showAllModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget && !selectMode) setShowAllModal(false); }}
        >
          <div className="relative w-full max-w-5xl mx-auto my-6 px-4 pb-6">
            <div className="bg-white dark:bg-[#1a0d22] rounded-3xl border border-pink-200 dark:border-pink-900 shadow-2xl overflow-hidden">

              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#1a0d22]/95 backdrop-blur-sm border-b border-pink-100 dark:border-pink-900/60">
                <div>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                    <span>📸</span>
                    {selectMode
                      ? <span className="text-red-500">{selectedIds.size > 0 ? `${selectedIds.size} foto dipilih` : "Pilih foto untuk dihapus"}</span>
                      : "Semua Foto Kita"
                    }
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {selectMode ? "Ketuk foto yang diupload untuk memilih · Foto asli terlindungi 🔒" : `${allPhotos.length} foto tersimpan ♡`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {userPhotos.length > 0 && (
                    selectMode ? (
                      <button onClick={exitSelectMode} className="px-4 py-2 rounded-full text-xs font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                        Batal
                      </button>
                    ) : (
                      <button onClick={enterSelectMode} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/30 text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                        Pilih &amp; Hapus
                      </button>
                    )
                  )}
                  <button onClick={() => { setShowAllModal(false); exitSelectMode(); }} className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-pink-50 dark:hover:bg-pink-900/40 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Category Filter (hidden in select mode) */}
              {!selectMode && (
                <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-pink-100 dark:border-pink-900/40">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setModalCategory(cat.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        modalCategory === cat.id
                          ? "bg-pink-500 text-white shadow-sm"
                          : "bg-pink-50 dark:bg-pink-950/40 text-zinc-600 dark:text-zinc-300 border border-pink-200/80 dark:border-pink-900/60 hover:bg-pink-100"
                      }`}
                    >
                      {cat.label}
                      <span className="ml-1.5 text-[10px] opacity-70">
                        ({cat.id === "semua" ? allPhotos.length : allPhotos.filter((p) => p.category === cat.id).length})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Select mode hint bar */}
              {selectMode && (
                <div className="flex items-center gap-2 px-6 py-3 bg-red-50/60 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30">
                  <CheckSquare className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-500 dark:text-red-400">Hanya foto yang kamu upload yang bisa dipilih. Foto asli dilindungi.</p>
                </div>
              )}

              {/* Modal Photo Grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(selectMode ? allPhotos : modalFilteredPhotos).map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} inModal={true} />
                ))}
                {modalFilteredPhotos.length === 0 && !selectMode && (
                  <div className="col-span-full text-center py-16 text-zinc-400">
                    <span className="text-4xl block mb-3">🌸</span>
                    <p className="text-sm">Belum ada foto di kategori ini</p>
                  </div>
                )}
              </div>

              {/* Floating delete action bar */}
              {selectMode && selectedIds.size > 0 && (
                <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#1a0d22]/95 backdrop-blur-sm border-t border-red-100 dark:border-red-900/40 shadow-lg">
                  <span className="text-sm font-semibold text-red-500">{selectedIds.size} foto dipilih</span>
                  <button
                    onClick={handleBulkDeleteClick}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition shadow-md shadow-red-300/40"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus {selectedIds.size} Foto
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Warning Dialog >5 photos */}
      {warnBulk && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-[#1a0d22] rounded-2xl border border-orange-200 dark:border-orange-800/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-orange-100 dark:bg-orange-900/40 shrink-0">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Hapus Banyak Foto?</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Kamu mau hapus <span className="font-bold text-orange-500">{selectedIds.size} foto</span> sekaligus — ini lumayan banyak ya. Pastikan sudah yakin, foto yang dihapus tidak bisa dikembalikan.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setWarnBulk(false)} className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-500 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">Batalkan</button>
              <button onClick={() => { setWarnBulk(false); setBulkConfirm(true); }} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition active:scale-95">Lanjut Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirm */}
      {bulkConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-[#1a0d22] rounded-2xl border border-red-200 dark:border-red-900/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-900/40">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Konfirmasi Hapus</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {selectedIds.size === 1 ? "1 foto akan dihapus permanen." : `${selectedIds.size} foto akan dihapus permanen.`}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setBulkConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-500 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">Batal</button>
              <button onClick={confirmBulkDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition active:scale-95">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
