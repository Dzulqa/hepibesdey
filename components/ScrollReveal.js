"use client";

import React from "react";
import { motion } from "framer-motion";

// ─── Single ScrollReveal wrapper ─────────────────────────────────────────────
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  direction = "up", // 'up' | 'down' | 'left' | 'right' | 'none'
  amount = 0.15,
}) {
  const offsets = {
    up:    { y: 48, x: 0 },
    down:  { y: -48, x: 0 },
    left:  { x: 48, y: 0 },
    right: { x: -48, y: 0 },
    none:  { x: 0, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger container – wraps a list so children animate in one-by-one ──────
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  delayStart = 0,
  amount = 0.1,
}) {
  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delayStart,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

// ─── Individual stagger child ─────────────────────────────────────────────────
export function StaggerItem({
  children,
  className = "",
  direction = "up", // 'up' | 'left' | 'right' | 'none'
}) {
  const offsets = {
    up:    { y: 36, x: 0 },
    down:  { y: -36, x: 0 },
    left:  { x: 36, y: 0 },
    right: { x: -36, y: 0 },
    none:  { x: 0, y: 0 },
  };

  const item = {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
