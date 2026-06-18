"use client";

import { useState } from "react";
import { Hotspot } from "@/lib/types";

interface HotspotMarkerProps {
  hotspot: Hotspot;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (id: string) => void;
  onPointerDown: (id: string, e: React.PointerEvent) => void;
}

export default function HotspotMarker({
  hotspot,
  isSelected,
  isEditing,
  onSelect,
  onPointerDown,
}: HotspotMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isSelected;

  const w = hotspot.w ?? 4;
  const h = hotspot.h ?? 2;

  const isWallText = hotspot.type === "wallText";
  // Match the badge colors from the PNG
  const badgeColor = isWallText ? "115,115,115" : "105,150,209";
  const bgOpacity = active ? 0.55 : 0;
  const glowShadow = isSelected
    ? `0 0 12px 5px rgba(${badgeColor},0.95)`
    : `0 0 8px 3px rgba(${badgeColor},0.75)`;

  return (
    <button
      type="button"
      aria-label={`Hotspot: ${hotspot.objectName || "Untitled object"}`}
      onClick={() => onSelect(hotspot.id)}
      onPointerDown={(e) => onPointerDown(hotspot.id, e)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${w}%`,
        height: `${h}%`,
        transform: "translate(-50%, -50%)",
        background: `rgba(${badgeColor},${bgOpacity})`,
        border: "none",
        borderRadius: "25%",
        padding: 0,
        cursor: isEditing ? "grab" : "pointer",
        boxShadow: active ? glowShadow : "none",
        transition: "background 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      {hovered && (
        <span
          style={{
            position: "absolute",
            ...(hotspot.y < 20
              ? { top: "calc(100% + 5px)" }
              : { bottom: "calc(100% + 5px)" }),
            ...(hotspot.x < 15
              ? { left: "0%", transform: "none" }
              : hotspot.x > 85
              ? { right: "0%", left: "auto", transform: "none" }
              : { left: "50%", transform: "translateX(-50%)" }),
            whiteSpace: "nowrap",
            background: "rgba(30,45,61,0.9)",
            color: "#fff",
            fontSize: "9px",
            fontFamily: "'Noto Sans KR', sans-serif",
            padding: "3px 7px",
            borderRadius: "3px",
            pointerEvents: "none",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {hotspot.objectName || "Untitled"}
        </span>
      )}
    </button>
  );
}
