"use client";

import { motion } from "framer-motion";

export default function StickyArcText() {
  return (
    <div
      className="pointer-events-none select-none"
      style={{ height: "48vh", position: "relative", zIndex: 10 }}
    >
      <div style={{ position: "sticky", top: 0, height: 0, overflow: "visible" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 1000 600"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100vh", display: "block", overflow: "visible" }}
          >
            <defs>
              <path id="sarc1" d="M 0,230 Q 500,280 1000,230">
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
              <path id="sarc2" d="M 0,268 Q 500,318 1000,268">
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
            <text
              fill="#fff9c2"
              fontFamily="var(--font-borel)"
              fontSize="34"
              fontWeight="bold"
              textAnchor="middle"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
            >
              <textPath href="#sarc1" startOffset="50%">Making Curatorial</textPath>
            </text>
            <text
              fill="#fff9c2"
              fontFamily="var(--font-borel)"
              fontSize="34"
              fontWeight="bold"
              textAnchor="middle"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
            >
              <textPath href="#sarc2" startOffset="50%">Structures Visible</textPath>
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
