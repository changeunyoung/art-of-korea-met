"use client";

import clsx from "clsx";
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
  const isWallText = hotspot.type === "wallText";

  return (
    <button
      type="button"
      aria-label={`Hotspot: ${hotspot.objectName || "Untitled object"}`}
      onClick={() => onSelect(hotspot.id)}
      onPointerDown={(e) => onPointerDown(hotspot.id, e)}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      className={clsx(
        "group absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
        isEditing ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      )}
    >
      <span
        className={clsx(
          "flex items-center justify-center border transition-museum text-[10px] font-medium leading-none",
          isWallText ? "rounded-sm" : "rounded-full",
          isSelected
            ? "w-6 h-6 bg-ink border-ink text-background"
            : isWallText
            ? "w-5 h-5 bg-text-gray/80 border-text-gray text-background group-hover:bg-ink group-hover:scale-110"
            : "w-6 h-6 bg-accent border-text-gray text-ink group-hover:bg-ink group-hover:text-background group-hover:scale-110"
        )}
      >
        {hotspot.label}
      </span>
      {!isSelected && (
        <span className="pointer-events-none absolute -translate-y-full -mt-2 whitespace-nowrap rounded bg-ink/90 px-2 py-1 text-[10px] uppercase tracking-widest2 text-background opacity-0 group-hover:opacity-100 transition-museum">
          {hotspot.objectName || (isWallText ? "Wall text" : "Untitled object")}
        </span>
      )}
    </button>
  );
}
