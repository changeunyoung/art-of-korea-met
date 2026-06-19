"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function FloatingBubble() {
  const [pressed, setPressed] = useState(false);
  const [open, setOpen] = useState(false);
  const [surveyPressed, setSurveyPressed] = useState(false);
  const [closePressed, setClosePressed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/survey") setOpen(false);
  }, [pathname]);

  if (pathname === "/survey") return null;

  return (
    <>
      {/* Popup panel */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 200,
          width: 260,
          height: 320,
          backgroundColor: "#fff9c2",
          borderRadius: 16,
          boxShadow: "0px 8px 32px rgba(28,43,58,0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Text content */}
          <div style={{ padding: "36px 24px 0 24px", textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-display), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              color: "#1C2B3A",
              lineHeight: 1.3,
              marginBottom: "12px",
            }}>I Need Your Help!!!</p>
            <p style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#1C2B3A",
              lineHeight: 1.6,
              opacity: 0.8,
            }}>Take a quick 1-minute survey and help improve this project.</p>
          </div>

          {/* Start Survey button */}
          <div style={{ padding: "16px 24px 0 24px", position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
            <button
              onMouseDown={() => setSurveyPressed(true)}
              onMouseUp={() => { setSurveyPressed(false); router.push("/survey"); }}
              onMouseLeave={() => setSurveyPressed(false)}
              onTouchStart={() => setSurveyPressed(true)}
              onTouchEnd={() => { setSurveyPressed(false); router.push("/survey"); }}
              style={{
                backgroundColor: "#7ec8e3",
                color: "#fff9c2",
                fontFamily: "var(--font-display), Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                borderRadius: "9999px",
                padding: "10px 20px",
                cursor: "pointer",
                letterSpacing: "0.05em",
                position: "relative",
                zIndex: 1,
                transform: surveyPressed ? "scale(0.92)" : "scale(1)",
                transition: "transform 0.1s ease",
              }}>Start Survey</button>
          </div>

          {/* Flying bird video — bottom left */}
          <video
            src="/videos/talkingbird.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              bottom: -80,
              left: 42,
              width: 240,
              opacity: 0.85,
              zIndex: 0,
              maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
            }}
          />
          {/* X button */}
          <button
            onMouseDown={() => setClosePressed(true)}
            onMouseUp={() => { setClosePressed(false); setOpen(false); }}
            onMouseLeave={() => setClosePressed(false)}
            onTouchStart={() => setClosePressed(true)}
            onTouchEnd={() => { setClosePressed(false); setOpen(false); }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 20,
              height: 20,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              transform: closePressed ? "scale(0.8)" : "scale(1)",
              transition: "transform 0.1s ease",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="4" y1="4" x2="16" y2="16" stroke="#c8a800" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="#c8a800" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Moon jar icon */}
      {!open && (
        <div
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 200,
            cursor: "pointer",
            transform: pressed ? "scale(0.88)" : "scale(1)",
            transition: "transform 0.1s ease",
          }}
        >
          <svg
            width="62"
            height="62"
            viewBox="0 0 62 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0px 4px 10px rgba(28,43,58,0.3))" }}
          >
            <rect x="20" y="2" width="22" height="5" rx="2.5" fill="#fff9c2" />
            <path
              d="M20 7 C10 9 3 18 3 31 C3 44 10 52 20 54 L42 54 C52 52 59 44 59 31 C59 18 52 9 42 7 Z"
              fill="#fff9c2"
            />
            <rect x="18" y="54" width="26" height="4" rx="2" fill="#fff9c2" />
          </svg>
          <span style={{
            position: "absolute",
            fontFamily: "var(--font-display), Montserrat, sans-serif",
            fontWeight: 800,
            fontSize: "26px",
            color: "#1C2B3A",
            lineHeight: 1,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}>!</span>
        </div>
      )}
    </>
  );
}
