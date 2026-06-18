"use client";

import { useRef, useEffect } from "react";

export default function MinimapVideo() {
  const fwdRef = useRef<HTMLVideoElement>(null);
  const revRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fwd = fwdRef.current;
    const rev = revRef.current;
    if (!fwd || !rev) return;

    const PREBUFFER = 0.08; // seconds before end to start next video

    const onFwdTimeUpdate = () => {
      if (fwd.duration && fwd.currentTime >= fwd.duration - PREBUFFER) {
        rev.currentTime = 0;
        rev.play();
      }
    };

    const onRevTimeUpdate = () => {
      if (rev.duration && rev.currentTime >= rev.duration - PREBUFFER) {
        fwd.currentTime = 0;
        fwd.play();
      }
    };

    const onFwdPlaying = () => {
      fwd.style.opacity = "1";
      rev.style.opacity = "0";
    };

    const onRevPlaying = () => {
      rev.style.opacity = "1";
      fwd.style.opacity = "0";
    };

    fwd.addEventListener("timeupdate", onFwdTimeUpdate);
    rev.addEventListener("timeupdate", onRevTimeUpdate);
    fwd.addEventListener("playing", onFwdPlaying);
    rev.addEventListener("playing", onRevPlaying);

    fwd.play();

    return () => {
      fwd.removeEventListener("timeupdate", onFwdTimeUpdate);
      rev.removeEventListener("timeupdate", onRevTimeUpdate);
      fwd.removeEventListener("playing", onFwdPlaying);
      rev.removeEventListener("playing", onRevPlaying);
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
