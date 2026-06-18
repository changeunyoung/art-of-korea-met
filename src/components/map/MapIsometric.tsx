"use client";

import { Hotspot } from "@/lib/types";

interface MapIsometricProps {
  hotspots: Hotspot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// SVG canvas: 800 × 780
// Room floor: x=60, y=60, w=680, h=660
// Wall thickness: 36px

const ROOM = { x: 60, y: 60, w: 680, h: 660 };
const W = 36; // wall thickness

// Perimeter button positions — placed just inside the walls
// Top wall: 1–13
const topWallY = ROOM.y + W / 2 + 2;
function topBtn(n: number, totalW = 13): number {
  const inner = ROOM.w - W * 2;
  return ROOM.x + W + (inner / (totalW - 1)) * n;
}

// Right wall: 14–26
const rightWallX = ROOM.x + ROOM.w - W / 2 - 2;
function rightBtn(n: number, totalH = 13): number {
  const inner = ROOM.h - W * 2;
  return ROOM.y + W + (inner / (totalH - 1)) * n;
}

// Bottom wall: 27–33 (right portion only)
const bottomWallY = ROOM.y + ROOM.h - W / 2 - 2;
function bottomBtn(n: number): number {
  // spread from right, 7 buttons
  const total = 7;
  const right = ROOM.x + ROOM.w - W;
  const span = ROOM.w * 0.55;
  return right - (span / (total - 1)) * n;
}

const WALL_BTNS: Array<{ label: string; id: string; x: number; y: number }> = [
  // Top wall 1–13
  ...Array.from({ length: 13 }, (_, i) => ({
    label: String(i + 1),
    id: `gallery233-object-${i + 1}`,
    x: topBtn(i),
    y: topWallY,
  })),
  // Right wall 14–26
  ...Array.from({ length: 13 }, (_, i) => ({
    label: String(i + 14),
    id: `gallery233-object-${i + 14}`,
    x: rightWallX,
    y: rightBtn(i),
  })),
  // Bottom wall 27–33
  ...Array.from({ length: 7 }, (_, i) => ({
    label: String(i + 27),
    id: `gallery233-object-${i + 27}`,
    x: bottomBtn(i),
    y: bottomWallY,
  })),
];

// Interior left cluster: 34–43 (2 columns × 5 rows)
const LC = { x: 145, y: 200 }; // top-left of cluster
const LCS = 44; // column spacing
const LRS = 50; // row spacing
const LEFT_INTERIOR: Array<{ label: string; id: string; x: number; y: number }> = [
  { label: "34", id: "gallery233-object-34", x: LC.x,          y: LC.y },
  { label: "35", id: "gallery233-object-35", x: LC.x + LCS,    y: LC.y },
  { label: "36", id: "gallery233-object-36", x: LC.x,          y: LC.y + LRS },
  { label: "37", id: "gallery233-object-37", x: LC.x + LCS,    y: LC.y + LRS },
  { label: "38", id: "gallery233-object-38", x: LC.x,          y: LC.y + LRS * 2 },
  { label: "39", id: "gallery233-object-39", x: LC.x + LCS,    y: LC.y + LRS * 2 },
  { label: "40", id: "gallery233-object-40", x: LC.x,          y: LC.y + LRS * 3 },
  { label: "41", id: "gallery233-object-41", x: LC.x + LCS,    y: LC.y + LRS * 3 },
  { label: "42", id: "gallery233-object-42", x: LC.x,          y: LC.y + LRS * 4 },
  { label: "43", id: "gallery233-object-43", x: LC.x + LCS,    y: LC.y + LRS * 4 },
];

// Interior right cluster: 44–47 (2 columns × 5 rows — 9 visible, 1 offset)
const RC = { x: 430, y: 160 };
const RCS = 52;
const RRS = 52;
const RIGHT_INTERIOR: Array<{ label: string; id: string; x: number; y: number }> = [
  { label: "44", id: "gallery233-object-44", x: RC.x,          y: RC.y },
  { label: "45", id: "gallery233-object-45", x: RC.x + RCS,    y: RC.y },
  { label: "46", id: "gallery233-object-46", x: RC.x,          y: RC.y + RRS },
  { label: "47", id: "gallery233-object-47", x: RC.x + RCS,    y: RC.y + RRS },
];

// Wall text panels A–E (gray markers)
const WALL_TEXTS: Array<{ label: string; id: string; x: number; y: number }> = [
  { label: "A", id: "gallery233-walltext-A", x: ROOM.x + W / 2, y: ROOM.y + W / 2 },           // top-left corner
  { label: "B", id: "gallery233-walltext-B", x: LC.x - 28,      y: LC.y + LRS * 2 },           // left of left cluster
  { label: "C", id: "gallery233-walltext-C", x: RC.x - 28,      y: RC.y + RRS },               // left of right cluster
  { label: "D", id: "gallery233-walltext-D", x: ROOM.x + W / 2, y: ROOM.y + ROOM.h - W / 2 }, // bottom-left corner
  { label: "E", id: "gallery233-walltext-E", x: ROOM.x + W + 30, y: bottomWallY },             // bottom-left on bottom wall
];

export default function MapIsometric({ hotspots, selectedId, onSelect }: MapIsometricProps) {
  const hotspotById = new Map(hotspots.map((h) => [h.id, h]));

  const renderBtn = (
    pos: { label: string; id: string; x: number; y: number },
    variant: "object" | "wallText"
  ) => {
    const isSelected = selectedId === pos.id;
    const isWall = variant === "wallText";
    const bw = isWall ? 22 : 24;
    const bh = isWall ? 18 : 20;
    const r = isWall ? 3 : 10;
    const fs = pos.label.length > 1 ? 7.5 : 9;

    return (
      <g
        key={pos.id}
        style={{ cursor: "pointer" }}
        onClick={() => onSelect(pos.id)}
      >
        <rect
          x={pos.x - bw / 2}
          y={pos.y - bh / 2}
          width={bw}
          height={bh}
          rx={r}
          fill={isSelected ? "#1D3557" : isWall ? "#7B8FA1" : "#5B7FA6"}
          stroke={isSelected ? "#1D3557" : isWall ? "#5C6E7E" : "#3D5F82"}
          strokeWidth={1}
        />
        <text
          x={pos.x}
          y={pos.y + 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fs}
          fontFamily="Montserrat, sans-serif"
          fontWeight="700"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {pos.label}
        </text>
        <title>{hotspotById.get(pos.id)?.objectName ?? pos.label}</title>
      </g>
    );
  };

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 800 780"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label="Gallery 233 floor plan"
      >
        {/* Floor */}
        <rect
          x={ROOM.x} y={ROOM.y} width={ROOM.w} height={ROOM.h}
          rx={8} fill="#EAE4D9"
        />

        {/* Walls — blue border */}
        {/* Top wall */}
        <rect x={ROOM.x} y={ROOM.y} width={ROOM.w} height={W} rx={6} fill="#7BA3C8" />
        {/* Bottom wall */}
        <rect x={ROOM.x} y={ROOM.y + ROOM.h - W} width={ROOM.w} height={W} rx={6} fill="#7BA3C8" />
        {/* Left wall */}
        <rect x={ROOM.x} y={ROOM.y} width={W} height={ROOM.h} rx={6} fill="#7BA3C8" />
        {/* Right wall */}
        <rect x={ROOM.x + ROOM.w - W} y={ROOM.y} width={W} height={ROOM.h} rx={6} fill="#7BA3C8" />

        {/* Wall corner overlaps (to fix corners) */}
        <rect x={ROOM.x} y={ROOM.y} width={W} height={W} fill="#7BA3C8" />
        <rect x={ROOM.x + ROOM.w - W} y={ROOM.y} width={W} height={W} fill="#7BA3C8" />
        <rect x={ROOM.x} y={ROOM.y + ROOM.h - W} width={W} height={W} fill="#7BA3C8" />
        <rect x={ROOM.x + ROOM.w - W} y={ROOM.y + ROOM.h - W} width={W} height={W} fill="#7BA3C8" />

        {/* Room outline */}
        <rect x={ROOM.x} y={ROOM.y} width={ROOM.w} height={ROOM.h} rx={8} fill="none" stroke="#5A8AB0" strokeWidth={2} />

        {/* Interior left display case block background */}
        <rect
          x={LC.x - 32} y={LC.y - 26}
          width={LCS + 64} height={LRS * 4 + 52}
          rx={8} fill="#D8D0C4" stroke="#BFB6A8" strokeWidth={1.5}
        />

        {/* Interior right display case block background */}
        <rect
          x={RC.x - 32} y={RC.y - 26}
          width={RCS + 64} height={RRS + 52}
          rx={8} fill="#D8D0C4" stroke="#BFB6A8" strokeWidth={1.5}
        />

        {/* Tan pedestal (upper-right interior area) */}
        <rect x={530} y={170} width={110} height={80} rx={6} fill="#C8B98A" stroke="#A89870" strokeWidth={1.5} />

        {/* All buttons */}
        {WALL_BTNS.map((p) => renderBtn(p, "object"))}
        {LEFT_INTERIOR.map((p) => renderBtn(p, "object"))}
        {RIGHT_INTERIOR.map((p) => renderBtn(p, "object"))}
        {WALL_TEXTS.map((p) => renderBtn(p, "wallText"))}
      </svg>
    </div>
  );
}
