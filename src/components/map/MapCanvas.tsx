"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Hotspot } from "@/lib/types";
import HotspotMarker from "./HotspotMarker";

interface MapCanvasProps {
  mapImage: string;
  hotspots: Hotspot[];
  editMode: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddHotspot: (x: number, y: number) => void;
  onMoveHotspot: (id: string, x: number, y: number) => void;
}

export default function MapCanvas({
  mapImage,
  hotspots,
  editMode,
  selectedId,
  onSelect,
  onAddHotspot,
  onMoveHotspot,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const getPercentPosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!editMode || draggingId) return;
    if ((e.target as HTMLElement).closest("button[aria-label^='Hotspot']")) return;
    const { x, y } = getPercentPosition(e.clientX, e.clientY);
    onAddHotspot(x, y);
  };

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    setDraggingId(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;
    const { x, y } = getPercentPosition(e.clientX, e.clientY);
    onMoveHotspot(draggingId, x, y);
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full aspect-[1228/1200] overflow-hidden select-none"
      style={{ backgroundColor: "#DDE1E7", cursor: editMode ? "crosshair" : "default" }}
    >
      <Image
        src={mapImage}
        alt="Korean Gallery floor plan"
        fill
        unoptimized
        className="object-contain pointer-events-none"
      />

      {hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          isSelected={hotspot.id === selectedId}
          isEditing={editMode}
          onSelect={onSelect}
          onPointerDown={handlePointerDown}
        />
      ))}

      {editMode && (
        <div className="absolute bottom-3 left-3 bg-ink/80 text-background text-[10px] uppercase tracking-widest2 px-3 py-1.5 pointer-events-none">
          Click to place a hotspot · Drag to reposition
        </div>
      )}
    </div>
  );
}
