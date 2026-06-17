"use client";

import { useState } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { ArtifactDef } from "./ArtifactPaths";

interface Props {
  artifact: ArtifactDef;
  index: number;
}

export default function FloatingArtifact({ artifact, index }: Props) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const amp = artifact.floatAmplitude;
  const sa  = artifact.scaleAmplitude;

  const entranceVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: artifact.entranceDelay,
        duration: prefersReduced ? 0.01 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const floatVariants: Variants = prefersReduced
    ? {}
    : {
        animate: {
          y: [0, -amp * 0.55, amp * 0.32, -amp * 0.2, amp * 0.1, 0],
          x: [0, amp * 0.65, -amp * 0.45, amp * 0.35, -amp * 0.2, 0],
          scale: [
            1,
            1 + sa * 0.8,
            1 - sa * 0.5,
            1 + sa * 0.6,
            1 - sa * 0.3,
            1,
          ],
          transition: {
            duration: artifact.floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.22, 0.45, 0.65, 0.82, 1],
            delay: index * 0.55,
          },
        },
      };

  const fadeDur = prefersReduced ? 0 : 0.45;
  const s = artifact.size;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${artifact.initialX}vw`,
        top: `${artifact.initialY}vh`,
        width: s,
        height: s,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        cursor: "default",
      }}
      variants={entranceVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={floatVariants}
        animate="animate"
        style={{ width: "100%", height: "100%", position: "relative" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* ── Circle (default) ────────────────────────── */}
        <svg
          viewBox="0 0 100 100"
          width={s}
          height={s}
          className="absolute inset-0"
          style={{
            opacity: hovered ? 0 : 1,
            transition: `opacity ${fadeDur}s ease-in-out`,
          }}
        >
          <path
            d={artifact.circlePath}
            stroke="#a8b8d8"
            strokeWidth="1.8"
            fill="white"
          />
        </svg>

        {/* ── Silhouette (hover) — SVG path, transparent exterior ── */}
        <svg
          viewBox="0 0 100 100"
          width={s}
          height={s}
          className="absolute inset-0"
          style={{
            opacity: hovered ? 1 : 0,
            transition: `opacity ${fadeDur}s ease-in-out`,
            overflow: "visible",
          }}
        >
          <path
            d={artifact.silhouettePath}
            fill="white"
            fillRule="evenodd"
            stroke="#a8b8d8"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
