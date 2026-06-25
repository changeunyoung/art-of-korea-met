"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GAME_URL = "https://itch.io/embed-upload/18072543?color=333333";

export default function GamePage() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#2E4A6B", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px" }}>
      <div className="mx-auto max-w-content px-6 md:px-10 py-16 md:py-20 flex flex-col items-center text-center" style={{ overflow: "visible" }}>
        <p className="text-xs uppercase tracking-widest2 text-text-gray [font-family:var(--font-display)] mb-3">
          Mini Game
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 [font-family:var(--font-display)]">
          Be the Curator
        </h1>
        <div className="w-8 h-px bg-white opacity-30 mb-8" />
        <p className="text-white opacity-70 text-base max-w-lg mb-6 [font-family:var(--font-display)] font-light">
          Step into the role of a museum curator. Choose a theme, place objects, and design your own exhibition of Korean art.
        </p>
        <p className="text-xs mb-6 [font-family:var(--font-sans)]" style={{ color: "#fff9c2", opacity: 0.5 }}>
          * This game is designed for desktop web browsers. Mobile devices are not supported.
        </p>
        <div className="mb-10" style={{ width: "360px", maxWidth: "100%" }}>
          <div style={{ width: 32, height: 32, margin: "0 auto 10px", position: "relative" }}>
            <img src="/images/logo/control.png" alt="Controls" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(0.9) opacity(0.85)" }} />
          </div>
          <p className="text-xs uppercase tracking-widest mb-3 [font-family:var(--font-sans)]" style={{ color: "#fff9c2" }}>Controls</p>
          <p className="text-xs mb-2 [font-family:var(--font-sans)] font-light" style={{ color: "#fff9c2", opacity: 0.85 }}>
            <span className="font-medium">Arrow Keys</span> — Navigate
          </p>
          <p className="text-xs [font-family:var(--font-sans)] font-light" style={{ color: "#fff9c2", opacity: 0.85 }}>
            <span className="font-medium">Spacebar or Left Click</span> — Interact
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="uppercase tracking-widest font-bold text-sm px-8 py-4 [font-family:var(--font-display)]"
          style={{ backgroundColor: "#fff9c2", color: "#2E4A6B" }}
        >
          PLAY GAME
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setOpen(false)}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-5xl mx-6 rounded-lg overflow-hidden"
              style={{ aspectRatio: "16/9", backgroundColor: "#000" }}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-4 z-10 text-white/70 hover:text-white text-sm uppercase tracking-widest [font-family:var(--font-display)]"
              >
                Close ×
              </button>

              {GAME_URL ? (
                <iframe
                  src={GAME_URL}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen *; pointer-lock *;"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 [font-family:var(--font-display)] text-sm uppercase tracking-widest">
                  Game coming soon
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
