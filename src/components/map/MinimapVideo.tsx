"use client";

import { useRef, useEffect } from "react";

export default function MinimapVideo() {
  const fwdRef = useRef<HTMLVideoElement>(null);
  const revRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fwd = fwdRef.current;
    const rev = revRef.current;
    if (!fwd || !rev) return;

    fwd.pause();
    rev.pause();

    let active: HTMLVideoElement = fwd; // currently visible video
    let pauseTimer: ReturnType<typeof setTimeout>;

    // logical position 0..1 in the forward direction
    const getPos = (): number => {
      if (!active.duration) return 0;
      return active === fwd
        ? active.currentTime / active.duration
        : 1 - active.currentTime / active.duration;
    };

    const handleWheel = (e: WheelEvent) => {
      clearTimeout(pauseTimer);
      const goFwd = e.deltaY > 0;
      const next = goFwd ? fwd : rev;

      if (active !== next) {
        // direction changed: one seek to sync, then play
        const pos = getPos();
        active.pause();
        active.style.opacity = "0";
        if (next.duration) {
          next.currentTime = goFwd ? pos * next.duration : (1 - pos) * next.duration;
        }
        next.style.opacity = "1";
        active = next;
      }

      const nearEnd = next.duration && next.currentTime >= next.duration - 0.05;
      if (!nearEnd) next.play();

      pauseTimer = setTimeout(() => next.pause(), 200);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(pauseTimer);
      fwd.pause();
      rev.pause();
    };
  }, []);

  const videoStyle: React.CSSProperties = {
    position: "absolute",
    top: 0, left: 0,
    width: "100%",
    transform: "scale(1.06) translateY(-5%)",
    transformOrigin: "center center",
  };

  return (
    <div className="relative overflow-hidden mx-auto" style={{ maxWidth: "40%", aspectRatio: "4 / 2.75" }}>
      <video ref={fwdRef} src="/videos/minimap.mp4"         muted playsInline preload="auto" style={{ ...videoStyle, opacity: 1 }} />
      <video ref={revRef} src="/videos/minimap-reverse.mp4" muted playsInline preload="auto" style={{ ...videoStyle, opacity: 0 }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "20%", background: "linear-gradient(to bottom, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: "25%", background: "linear-gradient(to top, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
      <div className="absolute top-0 left-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to left, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
      <div className="absolute top-0 right-0 bottom-0" style={{ width: "18%", background: "linear-gradient(to right, rgba(221,225,231,0) 0%, rgba(221,225,231,0.85) 60%, #DDE1E7 100%)" }} />
    </div>
  );
}
