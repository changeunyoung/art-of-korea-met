"use client";

import { useRef, useEffect } from "react";

export default function MinimapVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let direction = 1;
    let rafId: number;
    let lastTime: number | null = null;
    const speed = 0.5; // seconds of video per real second

    const tick = (now: number) => {
      const delta = lastTime == null ? 0 : (now - lastTime) / 1000;
      lastTime = now;

      if (v.duration && v.readyState >= 2) {
        const next = v.currentTime + direction * speed * delta;
        v.currentTime = Math.max(0, Math.min(v.duration, next));
        if (v.currentTime >= v.duration) direction = -1;
        if (v.currentTime <= 0) direction = 1;
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => { rafId = requestAnimationFrame(tick); };
    v.addEventListener("canplay", start, { once: true });
    if (v.readyState >= 3) start();

    return () => {
      cancelAnimationFrame(rafId);
      v.removeEventListener("canplay", start);
    };
  }, []);

  return (
    <div
      className="relative overflow-hidden mx-auto"
      style={{ maxWidth: "40%", aspectRatio: "4 / 2.75" }}
    >
      <video
        ref={videoRef}
        src="/videos/minimap.mp4"
        muted
        playsInline
        preload="auto"
        className="w-full block"
        style={{ transform: "scale(1.06) translateY(-5%)", transformOrigin: "center center" }}
      />
      {/* bottom */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "20%", background: "linear-gradient(to bottom, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
      {/* top */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "25%", background: "linear-gradient(to top, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
      {/* left */}
      <div className="absolute top-0 left-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to left, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
      {/* right */}
      <div className="absolute top-0 right-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to right, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
    </div>
  );
}
