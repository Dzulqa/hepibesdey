'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,        // durasi scroll (makin tinggi makin lambat & smooth)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing curve
      smoothWheel: true,    // smooth saat pakai mouse wheel
      wheelMultiplier: 1.0, // kecepatan scroll wheel (turunin kalau masih terasa kenceng)
      touchMultiplier: 2,   // kecepatan scroll touch/trackpad
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
}
