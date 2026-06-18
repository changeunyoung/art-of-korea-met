"use client";

import { Hotspot } from "@/lib/types";

interface MapIsometricProps {
  hotspots: Hotspot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// All positions in a 1000x700 SVG coordinate space
// Layout mirrors the 3D isometric floor plan photo of Gallery 233

const WALL_POSITIONS: Array<{ label: string; id: string; x: number; y: number }> = [
  // Top wall: 1-15 (left to right)
  { label: "1",  id: "gallery233-object-1",  x: 108, y: 82 },
  { label: "2",  id: "gallery233-object-2",  x: 168, y: 82 },
  { label: "3",  id: "gallery233-object-3",  x: 228, y: 82 },
  { label: "4",  id: "gallery233-object-4",  x: 288, y: 82 },
  { label: "5",  id: "gallery233-object-5",  x: 348, y: 82 },
  { label: "6",  id: "gallery233-object-6",  x: 408, y: 82 },
  { label: "7",  id: "gallery233-object-7",  x: 468, y: 82 },
  { label: "8",  id: "gallery233-object-8",  x: 528, y: 82 },
  { label: "9",  id: "gallery233-object-9",  x: 588, y: 82 },
  { label: "10", id: "gallery233-object-10", x: 648, y: 82 },
  { label: "11", id: "gallery233-object-11", x: 708, y: 82 },
  { label: "12", id: "gallery233-object-12", x: 768, y: 82 },
  { label: "13", id: "gallery233-object-13", x: 828, y: 82 },
  { label: "14", id: "gallery233-object-14", x: 878, y: 82 },
  { label: "15", id: "gallery233-object-15", x: 928, y: 82 },
  // Right wall: 16-25 (top to bottom)
  { label: "16", id: "gallery233-object-16", x: 960, y: 148 },
  { label: "17", id: "gallery233-object-17", x: 960, y: 205 },
  { label: "18", id: "gallery233-object-18", x: 960, y: 262 },
  { label: "19", id: "gallery233-object-19", x: 960, y: 319 },
  { label: "20", id: "gallery233-object-20", x: 960, y: 376 },
  { label: "21", id: "gallery233-object-21", x: 960, y: 433 },
  { label: "22", id: "gallery233-object-22", x: 960, y: 490 },
  { label: "23", id: "gallery233-object-23", x: 960, y: 547 },
  { label: "24", id: "gallery233-object-24", x: 960, y: 582 },
  { label: "25", id: "gallery233-object-25", x: 960, y: 618 },
  // Bottom wall: 26-33 (right to left)
  { label: "26", id: "gallery233-object-26", x: 878, y: 652 },
  { label: "27", id: "gallery233-object-27", x: 808, y: 652 },
  { label: "28", id: "gallery233-object-28", x: 738, y: 652 },
  { label: "29", id: "gallery233-object-29", x: 668, y: 652 },
  { label: "30", id: "gallery233-object-30", x: 598, y: 652 },
  { label: "31", id: "gallery233-object-31", x: 528, y: 652 },
  { label: "32", id: "gallery233-object-32", x: 408, y: 652 },
  { label: "33", id: "gallery233-object-33", x: 288, y: 652 },
  // Left wall: 47
  { label: "47", id: "gallery233-object-47", x: 48, y: 368 },
];

const INTERIOR_POSITIONS: Array<{ label: string; id: string; x: number; y: number }> = [
  // Right interior column: 34-44
  { label: "34", id: "gallery233-object-34", x: 830, y: 175 },
  { label: "35", id: "gallery233-object-35", x: 830, y: 228 },
  { label: "36", id: "gallery233-object-36", x: 830, y: 281 },
  { label: "37", id: "gallery233-object-37", x: 830, y: 334 },
  { label: "38", id: "gallery233-object-38", x: 830, y: 387 },
  { label: "39", id: "gallery233-object-39", x: 830, y: 440 },
  { label: "40", id: "gallery233-object-40", x: 830, y: 493 },
  { label: "41", id: "gallery233-object-41", x: 830, y: 546 },
  { label: "42", id: "gallery233-object-42", x: 760, y: 175 },
  { label: "43", id: "gallery233-object-43", x: 760, y: 228 },
  { label: "44", id: "gallery233-object-44", x: 760, y: 281 },
  // Center-bottom: 45-46
  { label: "45", id: "gallery233-object-45", x: 468, y: 440 },
  { label: "46", id: "gallery233-object-46", x: 468, y: 540 },
];

const TEXT_POSITIONS: Array<{ label: string; id: string; x: number; y: number }> = [
  { label: "A", id: "gallery233-walltext-A", x: 108, y: 148 },
  { label: "B", id: "gallery233-walltext-B", x: 280, y: 248 },
  { label: "C", id: "gallery233-walltext-C", x: 280, y: 490 },
  { label: "D", id: "gallery233-walltext-D", x: 108, y: 590 },
  { label: "E", id: "gallery233-walltext-E", x: 48, y: 490 },
];

export default function MapIsometric({ hotspots, selectedId, onSelect }: MapIsometricProps) {
  const hotspotById = new Map(hotspots.map((h) => [h.id, h]));

  const renderButton = (
    pos: { label: string; id: string; x: number; y: number },
    variant: "object" | "wallText"
  ) => {
    const isSelected = selectedId === pos.id;
    const isWall = variant === "wallText";
    const size = isWall ? 22 : 24;
    const r = isWall ? 4 : 12;

    return (
      <g key={pos.id} className="cursor-pointer" onClick={() => onSelect(pos.id)}>
        <rect
          x={pos.x - size / 2}
          y={pos.y - size / 2}
          width={size}
          height={size}
          rx={r}
          fill={isSelected ? "#2B2B2B" : isWall ? "#9CA3AF" : "#5B7FA6"}
          stroke={isSelected ? "#2B2B2B" : isWall ? "#6B7280" : "#4A6B8A"}
          strokeWidth={1}
          className="transition-all"
        />
        <text
          x={pos.x}
          y={pos.y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={pos.label.length > 1 ? 8 : 10}
          fontFamily="Montserrat, sans-serif"
          fontWeight="600"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {pos.label}
        </text>
        {/* hover tooltip title */}
        <title>{hotspotById.get(pos.id)?.objectName ?? pos.label}</title>
      </g>
    );
  };

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 1020 740"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label="Gallery 233 floor plan"
      >
        {/* Background */}
        <rect width="1020" height="740" fill="#F8F6F1" />

        {/* Main gallery floor */}
        <rect x="30" y="60" width="960" height="620" rx="4" fill="#EDE8DF" stroke="#C5BBB0" strokeWidth="2" />

        {/* Room walls (thick border) */}
        <rect x="30" y="60" width="960" height="620" rx="4" fill="none" stroke="#9C8F80" strokeWidth="6" />

        {/* Left alcove / entrance notch at top-left */}
        <rect x="30" y="60" width="80" height="130" rx="0" fill="#E0D9CE" stroke="#9C8F80" strokeWidth="2" />
        <text x="70" y="128" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="Montserrat, sans-serif" letterSpacing="1">ENTRANCE</text>

        {/* Left alcove / exit notch at bottom-left */}
        <rect x="30" y="550" width="80" height="130" rx="0" fill="#E0D9CE" stroke="#9C8F80" strokeWidth="2" />
        <text x="70" y="618" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="Montserrat, sans-serif" letterSpacing="1">EXIT</text>

        {/* Interior display case cluster — right column */}
        <rect x="735" y="155" width="115" height="415" rx="6" fill="#DDD6CA" stroke="#B5A99A" strokeWidth="1.5" />
        <text x="792" y="385" textAnchor="middle" fill="#9C8F80" fontSize="9" fontFamily="Montserrat, sans-serif">DISPLAY CASES</text>

        {/* Interior free-standing cases — center area */}
        <rect x="420" y="400" width="90" height="175" rx="6" fill="#DDD6CA" stroke="#B5A99A" strokeWidth="1.5" />

        {/* Wall labels */}
        <text x="500" y="44" textAnchor="middle" fill="#9C8F80" fontSize="10" fontFamily="Montserrat, sans-serif" letterSpacing="2" textDecoration="">NORTH WALL</text>
        <text x="1006" y="375" textAnchor="middle" fill="#9C8F80" fontSize="10" fontFamily="Montserrat, sans-serif" letterSpacing="2" transform="rotate(90, 1006, 375)">EAST WALL</text>
        <text x="500" y="718" textAnchor="middle" fill="#9C8F80" fontSize="10" fontFamily="Montserrat, sans-serif" letterSpacing="2">SOUTH WALL</text>
        <text x="14" y="375" textAnchor="middle" fill="#9C8F80" fontSize="10" fontFamily="Montserrat, sans-serif" letterSpacing="2" transform="rotate(-90, 14, 375)">WEST WALL</text>

        {/* All object positions */}
        {WALL_POSITIONS.map((pos) => renderButton(pos, "object"))}
        {INTERIOR_POSITIONS.map((pos) => renderButton(pos, "object"))}
        {TEXT_POSITIONS.map((pos) => renderButton(pos, "wallText"))}
      </svg>
    </div>
  );
}
