"use client";

import React from "react";
import { Gift, Mail, Clock, Image as ImageIcon, Gamepad2 } from "lucide-react";

export default function QuickNavCards({ onSelectTab }) {
  const cards = [
    {
      id: "surprise",
      title: "Surprise",
      icon: Gift,
      color: "from-pink-100 to-rose-100 dark:from-pink-950/60 dark:to-rose-950/40",
      iconColor: "text-rose-500",
      description: "Hadiah & kupon cinta",
    },
    {
      id: "messages",
      title: "Messages",
      icon: Mail,
      color: "from-rose-100 to-pink-100 dark:from-rose-950/60 dark:to-pink-950/40",
      iconColor: "text-pink-500",
      description: "Surat cinta & ucapan",
    },
    {
      id: "memories",
      title: "Memories",
      icon: Clock,
      color: "from-pink-100 to-amber-100/40 dark:from-pink-950/60 dark:to-amber-950/30",
      iconColor: "text-rose-500",
      description: "Timeline kisah kita",
    },
    {
      id: "gallery",
      title: "Gallery",
      icon: ImageIcon,
      color: "from-pink-100 to-purple-100/40 dark:from-pink-950/60 dark:to-purple-950/30",
      iconColor: "text-pink-500",
      badge: "🎀",
      description: "Galeri foto estetik",
    },
    {
      id: "surprise",
      title: "Mini Games",
      icon: Gamepad2,
      color: "from-rose-100 to-pink-100 dark:from-rose-950/60 dark:to-pink-950/40",
      iconColor: "text-rose-500",
      description: "Kuis & gosok hadiah",
    },
  ];

  const handleClick = (id) => {
    onSelectTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((item, index) => {
          const Icon = item.icon;
          const isLastOnMobile = index === 4;
          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => handleClick(item.id)}
              className={`group relative p-3.5 sm:p-5 rounded-2xl bg-white/70 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-xs hover:border-pink-400 dark:hover:border-pink-600 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 text-center ${
                isLastOnMobile ? "col-span-2 sm:col-span-1 md:col-span-1 max-w-[200px] sm:max-w-none mx-auto w-full" : ""
              }`}
            >
              {/* Optional ribbon badge for gallery */}
              {item.badge && (
                <span className="absolute -top-2 -right-1 text-base select-none pointer-events-none">
                  {item.badge}
                </span>
              )}

              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/40 border border-pink-100 dark:border-pink-800/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/60 transition-all duration-300">
                <Icon className={`w-6 h-6 ${item.iconColor} transition-transform`} />
              </div>

              {/* Title */}
              <span className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
