"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface CircleDef {
  id: string;
  color: string;
  size: number; // px
  left: string;
  top: string;
}

const CIRCLES: CircleDef[] = [
  { id: "white", color: "#ffffff", size: 130, left: "27vw", top: "42vh" },
  { id: "gray",  color: "#8a9ab5", size: 130, left: "76vw", top: "42vh" },
];

function ExpandingCircle({ circle }: { circle: CircleDef }) {
  const ref = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const [active, setActive] = useState(false);

  const handleEnter = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setOrigin({ x: `${x}px`, y: `${y}px` });
    }
    setActive(true);
  }, []);

  const radius = circle.size / 2;

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{ backgroundColor: circle.color, zIndex: 40 }}
            initial={{
              clipPath: `circle(${radius}px at ${origin.x} ${origin.y})`,
            }}
            animate={{
              clipPath: `circle(200vmax at ${origin.x} ${origin.y})`,
            }}
            exit={{
              clipPath: `circle(${radius}px at ${origin.x} ${origin.y})`,
            }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      <div
        ref={ref}
        className="absolute rounded-full"
        style={{
          left: circle.left,
          top: circle.top,
          transform: "translate(-50%, -50%)",
          width: circle.size,
          height: circle.size,
          backgroundColor: circle.color,
          zIndex: 50,
          cursor: "pointer",
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setActive(false)}
      />
    </>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full -mt-20 overflow-hidden"
      style={{ height: "100svh" }}
      aria-label="Art of Korea at the Metropolitan Museum of Art"
    >
      {/* Full-screen video background */}
      <motion.video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ scale: videoScale, transformOrigin: "center center" }}
        autoPlay
        muted
        loop
        playsInline
        src="/videos/hero-bg.mp4"
      />

      {/* Title text */}
      <motion.div
        className="absolute inset-x-0 top-0 flex flex-col items-center pointer-events-none select-none"
        style={{ paddingTop: "clamp(72px, 10vh, 120px)", zIndex: 10 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <h1
          className="font-black text-white leading-none tracking-tight uppercase"
          style={{ fontSize: "clamp(60px, 9.5vw, 140px)", fontFamily: "var(--font-hero)", textShadow: "0 2px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)" }}
        >
          Art of Korea
        </h1>
        <motion.p
          className="text-white uppercase tracking-widest mt-4"
          style={{ fontSize: "clamp(10px, 1vw, 13px)", fontFamily: "var(--font-hero)", letterSpacing: "0.22em", opacity: 0.85, textShadow: "0 1px 8px rgba(0,0,0,0.2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          at the Metropolitan Museum of Art
        </motion.p>
      </motion.div>

      {/* Expanding circles */}
      {CIRCLES.map((circle) => (
        <ExpandingCircle key={circle.id} circle={circle} />
      ))}
    </section>
  );
}
