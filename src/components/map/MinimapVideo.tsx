"use client";

import { useRef } from "react";

export default function MinimapVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative overflow-hidden mx-auto" style={{ maxWidth: "40%", aspectRatio: "4 / 2.75" }}>
      <video
        ref={ref}
        src="/videos/minimap.mp4"
        muted
        playsInline
        className="w-full block"
        style={{ transform: "scale(1.06) translateY(-5%)", transformOrigin: "center center" }}
        onLoadedMetadata={() => {
          const v = ref.current;
          if (!v) return;
          v.currentTime = v.duration / 2;
        }}
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
