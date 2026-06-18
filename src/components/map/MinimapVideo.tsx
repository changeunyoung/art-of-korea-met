"use client";

import { useRef, useEffect } from "react";

export default function MinimapVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let rafId: number;
    let lastTime: number | null = null;
    let goingForward = true;

    const playForward = () => {
      goingForward = true;
      v.playbackRate = 1;
      v.play();
    };

    const scrubBackward = (now: number) => {
      const delta = lastTime == null ? 0 : (now - lastTime) / 1000;
      lastTime = now;
      v.currentTime = Math.max(0, v.currentTime - delta);
      if (v.currentTime <= 0) {
        lastTime = null;
        playForward();
      } else {
        rafId = requestAnimationFrame(scrubBackward);
      }
    };

    const onEnded = () => {
      goingForward = false;
      lastTime = null;
      rafId = requestAnimationFrame(scrubBackward);
    };

    v.addEventListener("ended", onEnded);

    const start = () => playForward();
    v.addEventListener("canplay", start, { once: true });
    if (v.readyState >= 3) start();

    return () => {
      cancelAnimationFrame(rafId);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("canplay", start);
      v.pause();
    };
  }, []);

  return (
    <div className="relative overflow-hidden mx-auto" style={{ maxWidth: "40%", aspectRatio: "4 / 2.75" }}>
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
