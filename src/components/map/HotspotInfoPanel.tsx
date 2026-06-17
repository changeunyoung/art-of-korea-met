"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Hotspot } from "@/lib/types";

interface HotspotInfoPanelProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export default function HotspotInfoPanel({ hotspot, onClose }: HotspotInfoPanelProps) {
  const [errorId, setErrorId] = useState<string | null>(null);
  const imgError = errorId === hotspot?.id;

  if (!hotspot) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16 text-text-gray">
        <p className="text-xs uppercase tracking-widest2 mb-3">Digital Gallery Guide</p>
        <p className="font-sans text-xl leading-relaxed">
          Select a hotspot on the map to view information about the object,
          its placement, and curatorial interpretation.
        </p>
      </div>
    );
  }

  const isWallText = hotspot.type === "wallText";
  const imgSrc = `/images/hotspots/${hotspot.label}.jpeg`;

  return (
    <div className="h-full flex flex-col overflow-y-auto animate-fadeIn">
      {/* Photo */}
      {!imgError && (
        <div className="relative w-full aspect-[4/3] bg-background-soft">
          <Image
            src={imgSrc}
            alt={hotspot.objectName || ""}
            fill
            unoptimized
            className="object-contain"
            onError={() => setErrorId(hotspot.id)}
          />
        </div>
      )}

      <div className="px-8 py-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-widest2 text-text-gray">
            {isWallText ? "Wall Text Panel" : "Object Record"}
          </p>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="text-text-gray hover:text-ink transition-museum text-sm"
          >
            Close ×
          </button>
        </div>

        {hotspot.label && (
          <p className="text-xs uppercase tracking-widest2 text-text-gray mb-2">
            {isWallText ? `Wall Text ${hotspot.label}` : `Object ${hotspot.label}`}
          </p>
        )}
        {hotspot.metUrl ? (
          <a
            href={hotspot.metUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-2xl leading-snug hover:underline text-ink"
          >
            {hotspot.objectName || "Untitled Object"}
          </a>
        ) : (
          <h3 className="font-display text-2xl leading-snug">{hotspot.objectName || "Untitled Object"}</h3>
        )}
        {hotspot.koreanName && (
          <p className="mt-1 text-sm text-text-gray font-sans">{hotspot.koreanName}</p>
        )}

      <dl className="mt-5 space-y-4 text-sm">
        {!isWallText && (
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-text-gray">Object Number</dt>
            <dd className="mt-1 text-ink">{hotspot.objectNumber || "—"}</dd>
          </div>
        )}
        {!isWallText && (
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-text-gray">Period</dt>
            <dd className="mt-1 text-ink">{hotspot.period || "—"}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs uppercase tracking-widest2 text-text-gray">
            {isWallText ? "Label Text" : "Description"}
          </dt>
          <dd className="mt-1 text-ink leading-relaxed">{hotspot.description || "—"}</dd>
        </div>
      </dl>
      </div>
    </div>
  );
}
