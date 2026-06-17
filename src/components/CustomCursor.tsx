"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// 배경 밝기 감지를 throttle해서 성능 최적화
function getEffectiveBrightness(el: Element): number {
  let current: Element | null = el;
  while (current && current.tagName !== "BODY") {
    const bg = getComputedStyle(current).backgroundColor;
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
      if (a > 0.1) {
        return (r * 299 + g * 587 + b * 114) / 1000;
      }
    }
    current = current.parentElement;
  }
  return 0;
}

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [color, setColor] = useState("#ffffff");
  const [visible, setVisible] = useState(false);
  const lastColorCheck = useRef(0);

  const springX = useSpring(cursorX, { stiffness: 600, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 600, damping: 35 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);

      // 배경 감지는 100ms마다만 실행 (성능 최적화)
      const now = Date.now();
      if (now - lastColorCheck.current < 100) return;
      lastColorCheck.current = now;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const brightness = getEffectiveBrightness(el);
        setColor(brightness > 200 ? "#a8b8d8" : "#ffffff");
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [visible, cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: 10,
        height: 10,
        backgroundColor: color,
        opacity: visible ? 1 : 0,
        zIndex: 99999,
        transition: "background-color 0.25s ease, opacity 0.2s ease",
      }}
    />
  );
}
