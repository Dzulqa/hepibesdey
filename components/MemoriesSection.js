"use client";

import React from "react";
import { Calendar, Heart, MapPin } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function MemoriesSection() {
  const initialMemories = [
    {
      id: 1,
      title: "Pulang Ekskul",
      location: "SMP AL-AMANAH",
      image: "/images/couple.jpeg",
      description: "Iseng forbar karena gasengaja couple pink, eh pas lagi rangkul, ada abang OB sekola dibelakang sambil nyengir haha",
      tag: "Just Us",
    },
    {
      id: 2,
      title: "Beli Gulali", 
      location: "Jogja HeHa Sky",
      image: "/images/jogja.jpeg",
      description: "Lagi jalan sendiri eh tibatiba ada yang gandeng, untung cakep, yauda terus kita beli gulali dehh",
      tag: "Just Us",
    },
    {
      id: 3,
      title: "Nonton",
      location: "Paradise Walk CGV",
      image: "/images/nonton.jpeg",
      description: "Kita nonton bedua diparadise CGV, nonton apa ya gatau lupa, kayanya horor, eh apa Jumbo ya? gatau lupaa",
      tag: "Just Us",
    },
    {
      id: 4,
      title: "Pulang PKL",
      location: "Home",
      image: "/images/pkl.jpeg",
      description: "Kacian pulang pkl kecapean, mau minta peyukk, terus aku dapet sneckers juga myfav coklat hehee",
      tag: "Just Us",
    },
  ];

  const memories = initialMemories;

  return (
    <section id="memories" className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-4 scroll-mt-20">
      
      {/* Section Header */}
      <ScrollReveal direction="up" className="text-center space-y-2 mb-12">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100/80 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
          Our Journey
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif-romantic text-zinc-800 dark:text-zinc-100">
          Our Story Through Time
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Timeline perjalanan kita dengan foto, cerita, dan momen penting ♡
        </p>
      </ScrollReveal>

      {/* Timeline Container */}
      <div className="relative border-l-2 border-pink-200 dark:border-pink-900/60 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
        
        {memories.map((item, idx) => (
          <ScrollReveal key={item.id} direction={idx % 2 === 0 ? "left" : "right"} delay={0.05} amount={0.1}>
            <div className="relative group">
              
              {/* Timeline Dot with Heart */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md group-hover:scale-125 transition-transform duration-300">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>

              {/* Memory Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/85 dark:bg-pink-950/25 border border-pink-200/80 dark:border-pink-900/60 backdrop-blur-md shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-5">
                
                {/* Photo */}
                <div className="w-full md:w-44 aspect-square shrink-0 rounded-xl overflow-hidden bg-pink-100 dark:bg-pink-900/40 border border-pink-200/60 relative group-hover:scale-102 transition-transform">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/polaroid_flower.svg";
                    }}
                  />
                </div>

                {/* Story Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300">
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

              </div>
            </div>
          </ScrollReveal>
        ))}

      </div>

    </section>
  );
}
