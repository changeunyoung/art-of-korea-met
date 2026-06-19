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
  { id: "white", color: "#ffffff", size: 110, left: "27vw", top: "54vh" },
  { id: "gray",  color: "#8a9ab5", size: 110, left: "76vw", top: "54vh" },
];

function ExpandingCircle({ circle, onHover, onLeave }: { circle: CircleDef; onHover: () => void; onLeave: () => void }) {
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
    onHover();
  }, [onHover]);

  const handleLeave = useCallback(() => {
    setActive(false);
    onLeave();
  }, [onLeave]);

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
        onMouseLeave={handleLeave}
      />
    </>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [circleHovered, setCircleHovered] = useState(false);
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
          style={{ fontSize: "clamp(60px, 9.5vw, 140px)", fontFamily: "var(--font-display)", textShadow: "0 2px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)" }}
        >
          Art of Korea
        </h1>
        <motion.p
          className="text-white uppercase tracking-widest mt-4"
          style={{ fontSize: "clamp(10px, 1vw, 13px)", fontFamily: "var(--font-display)", letterSpacing: "0.22em", opacity: 0.85, textShadow: "0 1px 8px rgba(0,0,0,0.2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 1.2, delay: 0.05 }}
        >
          at the Metropolitan Museum of Art
        </motion.p>
      </motion.div>

      {/* Bird video circle */}
      <motion.div
        className="absolute rounded-full overflow-hidden"
        animate={{ opacity: circleHovered ? 0 : 1 }}
        transition={circleHovered
          ? { duration: 0.2, ease: "easeInOut" }
          : { duration: 0.3, ease: "easeInOut", delay: 0.75 }
        }
        style={{
          left: "27vw",
          top: "50vh",
          transform: "translate(-50%, -50%)",
          width: 352,
          height: 352,
          zIndex: 45,
          WebkitMaskImage: "radial-gradient(circle, black 25%, transparent 65%)",
          maskImage: "radial-gradient(circle, black 25%, transparent 65%)",
        }}
      >
        <video
          src="/videos/bird.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ mixBlendMode: "multiply" }}
        />
      </motion.div>

      {/* Circle arc text — white circle: Overview */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: "27vw", top: "54vh", transform: "translate(-50%, -50%)", width: 160, height: 160, zIndex: 51 }}
        viewBox="0 0 160 160"
      >
        <defs>
          <path id="rightArcWhite" d="M 59,116 A 42,42 0 0,0 116,59" />
        </defs>
        <text fontSize="13" fill="#8a9ab5" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle" letterSpacing="1.5">
          <textPath href="#rightArcWhite" startOffset="50%">Overview</textPath>
        </text>
      </svg>

      {/* Circle arc text — gray circle: So What? */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: "76vw", top: "54vh", transform: "translate(-50%, -50%)", width: 160, height: 160, zIndex: 51 }}
        viewBox="0 0 160 160"
      >
        <defs>
          <path id="rightArcGray" d="M 59,116 A 42,42 0 0,0 116,59" />
        </defs>
        <text fontSize="13" fill="#ffffff" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">
          <textPath href="#rightArcGray" startOffset="50%">So What?</textPath>
        </text>
      </svg>

      {/* Expanding circles */}
      {CIRCLES.map((circle) => (
        <ExpandingCircle
          key={circle.id}
          circle={circle}
          onHover={() => setCircleHovered(true)}
          onLeave={() => setCircleHovered(false)}
        />
      ))}

      {/* Bottom title — arc text, 3 lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 1.4, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <defs>
            <path id="arc1" d="M 0,230 Q 500,280 1000,230">
              <animate
                attributeName="d"
                values="M 0,230 Q 500,280 1000,230; M 0,230 Q 500,268 1000,230; M 0,230 Q 500,280 1000,230"
                dur="8s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                keyTimes="0;0.5;1"
              />
            </path>
            <path id="arc2" d="M 0,268 Q 500,318 1000,268">
              <animate
                attributeName="d"
                values="M 0,268 Q 500,318 1000,268; M 0,268 Q 500,306 1000,268; M 0,268 Q 500,318 1000,268"
                dur="8s"
                begin="0.4s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                keyTimes="0;0.5;1"
              />
            </path>
          </defs>
          <text fill="#fff9c2" fontFamily="var(--font-borel)" fontSize="34" fontWeight="bold" textAnchor="middle" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>
            <textPath href="#arc1" startOffset="50%">Making Curatorial</textPath>
          </text>
          <text fill="#fff9c2" fontFamily="var(--font-borel)" fontSize="34" fontWeight="bold" textAnchor="middle" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>
            <textPath href="#arc2" startOffset="50%">Structures Visible</textPath>
          </text>
        </svg>
      </motion.div>
    </section>
  );
}
