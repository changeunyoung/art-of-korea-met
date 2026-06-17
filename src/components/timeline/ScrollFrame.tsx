"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const BREAKPOINT = 1024;

// Image dimensions (all 2030px tall):
//   scroll-left.png:  527px
//   scroll-paper.png: 3295px
//   scroll-right.png: 582px
//   Total width:      4404px

const TOTAL_W = 4404;
const LEFT_W  = 527;
const RIGHT_W = 582;
const IMG_H   = 2030;

const LEFT_PCT_NUM  = (LEFT_W  / TOTAL_W) * 100; // 11.966%
const RIGHT_PCT_NUM = (RIGHT_W / TOTAL_W) * 100; // 13.215%
const LEFT_PCT  = `${LEFT_PCT_NUM.toFixed(3)}%`;
const RIGHT_PCT = `${RIGHT_PCT_NUM.toFixed(3)}%`;
const ASPECT_PB = `${((IMG_H / TOTAL_W) * 100).toFixed(3)}%`; // 46.093%

// Initial: rollers slightly apart with a thin paper sliver visible
const LEFT_INIT_NUM  = 35;
const RIGHT_INIT_NUM = 35;

export default function ScrollFrame({ children }: { children?: ReactNode }) {
  const [wide, setWide] = useState(true);
  const outerRef = useRef<HTMLDivElement>(null);

  // Raw progress MotionValue (0 = closed, 1 = fully open)
  const progress = useMotionValue(0);

  // Derived animation values
  const leftPct      = useTransform(progress, [0, 1], [LEFT_INIT_NUM,  0]);
  const leftPos      = useTransform(leftPct,  v => `${v.toFixed(3)}%`);
  const rightPct     = useTransform(progress, [0, 1], [RIGHT_INIT_NUM, 0]);
  const rightPos     = useTransform(rightPct, v => `${v.toFixed(3)}%`);
  const clipInset    = useTransform(progress, [0, 1], [46, 0]);
  const clipPath     = useTransform(clipInset, v => `inset(0 ${v.toFixed(2)}% 0 ${v.toFixed(2)}%)`);
  const contentOpacity = useTransform(progress, [0.55, 0.9], [0, 1]);
  const contentY       = useTransform(progress, [0.55, 0.9], [14, 0]);

  useEffect(() => {
    const check = () => setWide(window.innerWidth >= BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Manual scroll listener — reliable across all environments
  useEffect(() => {
    const handleScroll = () => {
      if (!outerRef.current) return;
      const el = outerRef.current;
      // progress = 0 when el.top hits viewport top
      // progress = 1 when el.center hits viewport top  (half of outerHeight = 1 viewport)
      const top  = el.getBoundingClientRect().top;
      const half = el.offsetHeight / 2; // = 100vh
      const p = Math.max(0, Math.min(1, -top / half));
      progress.set(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialise on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [progress]);

  if (!wide) {
    return (
      <div className="py-6 text-white [&_*]:text-white [&_.section-rule]:bg-white">
        {children}
      </div>
    );
  }

  return (
    /* 200vh outer — sticky has 100vh of scroll room */
    <div ref={outerRef} style={{ height: "200vh", position: "relative" }}>

      {/* Sticky container */}
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>

        {/* Aspect-ratio shell: 4404 × 2030 */}
        <div style={{ position: "relative", width: "100%", paddingBottom: ASPECT_PB }}>

          {/* ── Paper: reveals from center outward ───────────────────────── */}
          <motion.div style={{
            clipPath,
            position: "absolute", top: 0, bottom: 0,
            left: `calc(${LEFT_PCT} - 4px)`, right: `calc(${RIGHT_PCT} - 4px)`,
            zIndex: 1, overflow: "visible",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/scroll-paper.png" alt="" draggable={false}
              style={{ width: "100%", height: "100%", display: "block", userSelect: "none" }} />
          </motion.div>

          {/* ── Content: fades in after scroll is open ───────────────────── */}
          <motion.div style={{
            opacity: contentOpacity,
            y: contentY,
            position: "absolute", top: 0, bottom: 0,
            left: LEFT_PCT, right: RIGHT_PCT,
            display: "flex", alignItems: "center",
            zIndex: 2, padding: "14% 4%",
            overflow: "hidden",
          }}>
            <div style={{ width: "100%", fontSize: "0.82em" }}>{children}</div>
          </motion.div>

          {/* ── Left roller: center → left edge ──────────────────────────── */}
          <motion.div style={{
            left: leftPos,
            position: "absolute", top: 0, bottom: 0,
            width: LEFT_PCT, zIndex: 3, pointerEvents: "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/scroll-left.png" alt="" draggable={false}
              style={{ width: "100%", height: "100%", display: "block", userSelect: "none" }} />
          </motion.div>

          {/* ── Right roller: center → right edge ────────────────────────── */}
          <motion.div style={{
            right: rightPos,
            position: "absolute", top: 0, bottom: 0,
            width: RIGHT_PCT, zIndex: 3, pointerEvents: "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/scroll-right.png" alt="" draggable={false}
              style={{ width: "100%", height: "100%", display: "block", userSelect: "none" }} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
